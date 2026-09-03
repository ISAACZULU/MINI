import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getToken, setToken, authMe, authLogin, authRegister, authGuest, fetchPosts, createPost, editPost as apiEditPost,
  toggleSupport, addReaction as apiAddReaction, addReply as apiAddReply, revealIdentity as apiRevealIdentity,
  fetchMoods, addMoodLog as apiAddMoodLog, fetchAppointments, bookAppointment as apiBookAppointment,
  fetchMessages, sendMessage as apiSendMessage, fetchArticles, publishArticle as apiPublishArticle,
  fetchGoodwill, publishGoodwill as apiPublishGoodwill, fetchSafetyPlan, saveSafetyPlan as apiSaveSafetyPlan } from '../services/api';

const AppContext = createContext();

function timeAgo(isoString) {
  if (!isoString) return 'Recently';
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

async function anonAliasFor(userId) {
  if (!userId) return 'Anon#0000000000';
  try {
    const msgBuffer = new TextEncoder().encode(userId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    return `Anon#${hashHex.slice(0, 10)}`;
  } catch {
    return 'Anon#0000000000';
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ms_theme') || 'light');
  const [activeTab, setRawActiveTab] = useState('articles');
  const setActiveTab = (tab) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => setRawActiveTab(tab));
    } else {
      setRawActiveTab(tab);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Real auth state: a JWT from our backend, and the account it resolves to.
  const [userAuth, setUserAuth] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionHash, setSessionHash] = useState('Anon#0000000000');

  const isAuthenticated = !!userAuth;
  const role = userAuth?.userType || 'student';

  useEffect(() => {
    anonAliasFor(userAuth?.id).then(setSessionHash);
  }, [userAuth?.id]);

  const rotateSessionHash = () => {
    showToast('Your anonymous alias is tied to your secure account and stays consistent across posts.', 'info');
  };

  // Toast notifications
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Data
  const [posts, setPosts] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [goodwillMessages, setGoodwillMessages] = useState([]);
  const [directChats, setDirectChats] = useState([]);
  const [safetyPlan, setSafetyPlan] = useState(null);
  const [selectedChatCounselor, setSelectedChatCounselor] = useState(null);

  const myPostIds = useMemo(
    () => posts.filter(p => p.authorId === userAuth?.id).map(p => p.id),
    [posts, userAuth?.id]
  );

  const formatPosts = (rawPosts) => rawPosts.map(p => ({ ...p, timeAgo: timeAgo(p.createdAt) }));

  const refreshPosts = useCallback(async () => {
    try {
      const { posts: data } = await fetchPosts();
      setPosts(formatPosts(data));
    } catch (err) {
      console.warn('Could not load posts:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    const results = await Promise.allSettled([
      fetchPosts(),
      fetchMoods(),
      fetchAppointments(),
      fetchMessages(),
      fetchArticles(),
      fetchGoodwill(),
      fetchSafetyPlan()
    ]);

    const [postsRes, moodsRes, apptsRes, msgsRes, articlesRes, goodwillRes, planRes] = results;

    if (postsRes.status === 'fulfilled') setPosts(formatPosts(postsRes.value.posts));
    if (moodsRes.status === 'fulfilled') {
      setMoodLogs(moodsRes.value.moodLogs);
      setStreakCount(moodsRes.value.moodLogs.length);
    }
    if (apptsRes.status === 'fulfilled') setAppointments(apptsRes.value.appointments);
    if (msgsRes.status === 'fulfilled') setDirectChats(msgsRes.value.chats);
    if (articlesRes.status === 'fulfilled') setArticles(articlesRes.value.articles);
    if (goodwillRes.status === 'fulfilled') setGoodwillMessages(goodwillRes.value.goodwillMessages);
    if (planRes.status === 'fulfilled') setSafetyPlan(planRes.value.safetyPlan);
  }, []);

  // Restore session on load if a token is already saved
  useEffect(() => {
    async function restore() {
      const token = getToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const { user } = await authMe();
        setUserAuth(user);
        await refreshAll();
      } catch (err) {
        setToken(null);
      } finally {
        setAuthLoading(false);
      }
    }
    restore();
  }, [refreshAll]);

  useEffect(() => {
    localStorage.setItem('ms_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark-mode');
    else document.documentElement.classList.remove('dark-mode');
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToast(`Switched to ${next} mode`, 'info');
  };

  // --- Auth actions -------------------------------------------------
  const afterLogin = async (user, welcomeMessage) => {
    setUserAuth(user);
    setActiveTab(user.userType === 'counselor' || user.role === 'counselor' ? 'counselor_triage' : 'articles');
    await refreshAll();
    if (welcomeMessage) showToast(welcomeMessage, 'success');
  };

  const loginAsGuest = async () => {
    const { token, user } = await authGuest();
    setToken(token);
    await afterLogin({ ...user, userType: 'student' }, `Welcome! Entered Haven KNUST as Anonymous Visitor (${user.displayName})`);
  };

  const loginWithCredentials = async (email, password, expectedRole) => {
    const { token, user } = await authLogin(email, password);
    if (expectedRole && user.role !== expectedRole) {
      throw new Error(`This account is registered as a ${user.role}. Please use the ${user.role} portal to sign in.`);
    }
    setToken(token);
    await afterLogin({ ...user, userType: user.role }, `Welcome back, ${user.displayName}!`);
    return user;
  };

  const registerStudent = async (email, password, displayName) => {
    const { token, user } = await authRegister(email, password, displayName);
    setToken(token);
    await afterLogin({ ...user, userType: user.role }, `Account created! Welcome, ${user.displayName}.`);
    return user;
  };

  const logout = () => {
    setToken(null);
    setUserAuth(null);
    setPosts([]);
    setMoodLogs([]);
    setAppointments([]);
    setArticles([]);
    setGoodwillMessages([]);
    setDirectChats([]);
    setSafetyPlan(null);
    setActiveTab('articles');
    showToast('Logged out. Returning to landing page.', 'info');
  };

  // Modal state
  const [activeReplyPost, setActiveReplyPostRaw] = useState(null);
  const [activeTelehealthRoom, setActiveTelehealthRoom] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isFerpaModalOpen, setIsFerpaModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isSafetyPlanModalOpen, setIsSafetyPlanModalOpen] = useState(false);

  const setActiveReplyPost = (post) => {
    if (!post) return setActiveReplyPostRaw(null);
    const fresh = posts.find(p => p.id === post.id) || post;
    setActiveReplyPostRaw(fresh);
  };

  // Keep the open thread modal's post in sync whenever posts refresh
  useEffect(() => {
    if (!activeReplyPost) return;
    const fresh = posts.find(p => p.id === activeReplyPost.id);
    if (fresh && fresh !== activeReplyPost) setActiveReplyPostRaw(fresh);
  }, [posts]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Post actions ---------------------------------------------------
  const handleToggleSupport = async (postId, e) => {
    if (e) e.stopPropagation();
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, isSupported: !p.isSupported, supportCount: p.isSupported ? p.supportCount - 1 : p.supportCount + 1 }
      : p));
    try {
      await toggleSupport(postId);
    } catch (err) {
      showToast(err.message, 'warning');
      refreshPosts();
    }
  };

  const handleAddReaction = async (postId, badgeId) => {
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, reactions: { ...p.reactions, [badgeId]: (p.reactions?.[badgeId] || 0) + 1 } }
      : p));
    showToast('Sent empathy encouragement reaction!', 'success');
    try {
      await apiAddReaction(postId, badgeId);
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleCreatePost = async (title, content, tag, isAnonymous = false) => {
    try {
      const { post, riskAnalysis } = await createPost(title, content, tag, isAnonymous);
      setPosts(prev => [{ ...post, timeAgo: 'Just now' }, ...prev]);
      setSelectedCategory('All');
      setActiveTab('peer_threads');
      setIsCreateModalOpen(false);
      showToast(isAnonymous ? 'Thread posted anonymously!' : 'Thread posted!', 'success');
      if (riskAnalysis?.isCrisis) setIsCrisisModalOpen(true);
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleEditPost = async (postId, title, content) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      showToast('Your note needs both a title and message before saving.', 'info');
      return;
    }
    try {
      await apiEditPost(postId, trimmedTitle, trimmedContent);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, title: trimmedTitle, content: trimmedContent } : p));
      showToast('Your note was updated.', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleAddReply = async (postId, text) => {
    try {
      const { reply } = await apiAddReply(postId, text);
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, replyCount: p.replyCount + 1, replies: [...p.replies, reply] }
        : p));
      showToast(reply.isCounselor ? 'Verified counselor response posted!' : 'Support reply posted anonymously!', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleRevealIdentity = async (postId) => {
    try {
      await apiRevealIdentity(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, author: userAuth.displayName, isAnonymous: false } : p));
      showToast('Your identity has been successfully revealed on this thread!', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // --- Mood, appointments, safety plan, articles, goodwill -----------
  const handleAddMoodLog = async (moodLevel, triggers, note) => {
    try {
      const { moodLog, streakCount: newStreak } = await apiAddMoodLog(moodLevel, triggers, note);
      setMoodLogs(prev => [moodLog, ...prev]);
      setStreakCount(newStreak);
      setIsMoodModalOpen(false);
      showToast('Daily mood check-in saved! Streak increased', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleBookAppointment = async (counselorId, date, timeSlot, topic, mode, isAnonymous) => {
    try {
      const { appointment } = await apiBookAppointment(counselorId, date, timeSlot, topic, mode, isAnonymous);
      setAppointments(prev => [appointment, ...prev]);
      setIsAppointmentModalOpen(false);
      showToast('Appointment successfully booked & confirmed!', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handleSaveSafetyPlan = async (newPlan) => {
    try {
      await apiSaveSafetyPlan(newPlan);
      setSafetyPlan(newPlan);
      setIsSafetyPlanModalOpen(false);
      showToast('Personal Emergency Safety Plan saved!', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handlePublishArticle = async (articleData) => {
    try {
      const { article } = await apiPublishArticle(articleData);
      setArticles(prev => [article, ...prev]);
      showToast('New article published successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const handlePublishGoodwill = async (goodwillData) => {
    try {
      const { goodwill } = await apiPublishGoodwill(goodwillData);
      setGoodwillMessages(prev => [goodwill, ...prev]);
      showToast('New goodwill message published successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  // --- Direct messages --------------------------------------------------
  const handleSendDirectMessage = async (counselorName, text, isAnonymous = false, targetStudentId = null) => {
    try {
      if (role === 'counselor') {
        await apiSendMessage(counselorName, text, targetStudentId, null);
      } else {
        const alias = isAnonymous ? sessionHash : undefined;
        await apiSendMessage(counselorName, text, undefined, alias);
      }
      const { chats } = await fetchMessages();
      setDirectChats(chats);
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const value = {
    isAuthenticated,
    authLoading,
    role,
    userAuth,
    sessionHash,
    rotateSessionHash,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    posts,
    myPostIds,
    moodLogs,
    streakCount,
    safetyPlan,
    appointments,
    articles,
    goodwillMessages,
    directChats,
    selectedChatCounselor,
    setSelectedChatCounselor,
    activeReplyPost,
    setActiveReplyPost,
    activeTelehealthRoom,
    setActiveTelehealthRoom,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isCrisisModalOpen,
    setIsCrisisModalOpen,
    isFerpaModalOpen,
    setIsFerpaModalOpen,
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    isBreathingModalOpen,
    setIsBreathingModalOpen,
    isMoodModalOpen,
    setIsMoodModalOpen,
    isResourceModalOpen,
    setIsResourceModalOpen,
    isSafetyPlanModalOpen,
    setIsSafetyPlanModalOpen,
    toast,
    showToast,
    loginAsGuest,
    loginWithCredentials,
    registerStudent,
    logout,
    resetDemoData: logout,
    handleToggleSupport,
    handleAddReaction,
    handleSaveSafetyPlan,
    handleCreatePost,
    handleEditPost,
    handleAddReply,
    handleAddMoodLog,
    handleBookAppointment,
    handleRevealIdentity,
    handlePublishArticle,
    handlePublishGoodwill,
    handleSendDirectMessage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
