import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyzeTextRisk } from '../utils/riskAnalyzer';

const AppContext = createContext();

const INITIAL_POSTS = [
  {
    id: 'post-1',
    tag: 'Anxiety',
    timeAgo: '2h ago',
    title: 'Panic attacks before every exam — is this normal?',
    content: "I've been having what I think are panic attacks right before big tests. Heart racing, can't breathe, hands shaking. I'm starting to dread exam season entirely and it's affecting my studying.",
    author: 'Anon#4821',
    supportCount: 38,
    isSupported: false,
    reactions: { resilient: 12, star: 18, hug: 8 },
    replyCount: 2,
    replies: [
      {
        id: 'r-101',
        author: 'Counselor Sarah, LCSW',
        isCounselor: true,
        time: '1h ago',
        text: 'Hi Anon#4821. Exam anxiety is very common, but when physical symptoms like racing heart and shaking interfere with your life, campus counseling can help with quick grounding techniques (like 4-7-8 breathing). Feel free to drop by the wellness center!'
      },
      {
        id: 'r-102',
        author: 'Anon#2940',
        isCounselor: false,
        time: '45m ago',
        text: 'I used to get this every midterms. Trying box breathing and avoiding caffeine 3 hours before exams helped me a lot. You are not alone!'
      }
    ]
  },
  {
    id: 'post-2',
    tag: 'Burnout',
    timeAgo: '1d ago',
    title: "I haven't felt anything in weeks. Just numb.",
    content: "I used to love drawing and hanging out with my roommate. Now I just do the minimum to get by. Nothing feels interesting or worth doing. I'm not sure what's happening to me.",
    author: 'Anon#7741',
    supportCount: 94,
    isSupported: false,
    reactions: { hug: 34, coffee: 19 },
    replyCount: 2,
    replies: [
      {
        id: 'r-201',
        author: 'Counselor Mark, PsyD',
        isCounselor: true,
        time: '18h ago',
        text: "Emotional numbness and loss of interest (anhedonia) are core signs of burnout and emotional fatigue. Please take things one day at a time, and consider booking a 1-on-1 check-in with our student support team."
      },
      {
        id: 'r-202',
        author: 'Anon#5512',
        isCounselor: false,
        time: '12h ago',
        text: "Sending you so much support. I went through the same thing last semester. Don't be afraid to take a rest day."
      }
    ]
  },
  {
    id: 'post-3',
    tag: 'Academic pressure',
    timeAgo: '2d ago',
    title: "Parents expect straight A's but I'm drowning",
    content: "My parents sacrificed so much for me to be here. I can't tell them I'm failing two courses. The guilt is crushing me and I don't know what to do.",
    author: 'Anon#9002',
    supportCount: 45,
    isSupported: false,
    reactions: { star: 15, resilient: 9 },
    replyCount: 1,
    replies: [
      {
        id: 'r-301',
        author: 'Anon#8819',
        isCounselor: false,
        time: '1d ago',
        text: "Academic stress is real, but your worth isn't tied to grades. Academic advising can help you withdraw or retake classes without destroying your GPA. Talk to an advisor first!"
      }
    ]
  },
  {
    id: 'post-4',
    tag: 'Loneliness',
    timeAgo: '3d ago',
    title: 'Hard to make genuine friends as a 2nd year transfer',
    content: 'Everyone seems to already have established friend groups from freshman dorms. I spend most weekends alone in my room studying or watching movies.',
    author: 'Anon#3109',
    supportCount: 62,
    isSupported: false,
    reactions: { hug: 22 },
    replyCount: 1,
    replies: [
      {
        id: 'r-401',
        author: 'Anon#1142',
        isCounselor: false,
        time: '2d ago',
        text: 'Join student clubs! I was a transfer too and joining the campus board game club saved my social life.'
      }
    ]
  },
  {
    id: 'post-5',
    tag: 'Sleep',
    timeAgo: '4d ago',
    title: 'Sleeping 4 hours a night due to relentless deadlines',
    content: 'My brain literally will not shut off at night. Even when I lie down early, my eyes stay open thinking about assignments due next week.',
    author: 'Anon#6620',
    supportCount: 51,
    isSupported: false,
    reactions: { coffee: 14 },
    replyCount: 0,
    replies: []
  }
];

function enrichPostWithRisk(post) {
  const analysis = analyzeTextRisk(post.title, post.content);
  return {
    ...post,
    riskAnalysis: analysis
  };
}

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('ms_role') || 'student');
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('ms_theme') || 'light');

  // Authentication & Session Lock State (Default to false so Sign In page is shown first)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('ms_is_authenticated');
    return saved ? saved === 'true' : false;
  });

  // User Auth Identity State
  const [userAuth, setUserAuth] = useState(() => {
    const saved = localStorage.getItem('ms_user_auth');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      isGuest: true,
      userType: 'student',
      displayName: 'Anon#4821',
      email: 'visitor@campus.edu'
    };
  });
  
  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Session Hash
  const [sessionHash, setSessionHash] = useState(() => {
    return localStorage.getItem('ms_session_hash') || `Anon#${Math.floor(1000 + Math.random() * 9000)}`;
  });

  const rotateSessionHash = () => {
    const newHash = `Anon#${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionHash(newHash);
    localStorage.setItem('ms_session_hash', newHash);
    if (userAuth.isGuest) {
      setUserAuth(prev => ({ ...prev, displayName: newHash }));
    }
    showToast(`Session identity hash rotated: ${newHash}`, 'success');
  };

  // Navigation State
  const [activeTab, setRawActiveTab] = useState('articles');
  const setActiveTab = (tab) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setRawActiveTab(tab);
      });
    } else {
      setRawActiveTab(tab);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Persisted Posts
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('ms_posts_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(enrichPostWithRisk);
      } catch (e) {
        console.error('Failed to parse saved posts:', e);
      }
    }
    return INITIAL_POSTS.map(enrichPostWithRisk);
  });

  const [myPostIds, setMyPostIds] = useState(() => {
    const saved = localStorage.getItem('ms_my_posts');
    return saved ? JSON.parse(saved) : [];
  });

  // Persisted Personal Safety Plan
  const [safetyPlan, setSafetyPlan] = useState(() => {
    const saved = localStorage.getItem('ms_safety_plan');
    return saved ? JSON.parse(saved) : {
      trustedContact: 'Campus Wellness Advisor (Room 302)',
      copingStrategy: '4-7-8 Box Breathing & 5-minute walk',
      safePlace: 'Library 3rd Floor Quiet Corner',
      affirmation: 'I am resilient, and this exam stress is temporary.'
    };
  });

  // Persisted Mood Logs & Streak
  const [moodLogs, setMoodLogs] = useState(() => {
    const saved = localStorage.getItem('ms_mood_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'm-1',
        moodLevel: 4,
        triggers: ['Exams', 'Sleep Deprivation'],
        note: 'Completed midterm study session and tried 4-7-8 breathing.',
        date: 'Today'
      }
    ];
  });

  const [streakCount, setStreakCount] = useState(() => {
    const saved = localStorage.getItem('ms_streak');
    return saved ? parseInt(saved, 10) : 4;
  });

  // Persisted Appointments
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('ms_appointments');
    return saved ? JSON.parse(saved) : [
      {
        id: 'apt-101',
        counselorName: 'Dr. Sarah Jenkins, LCSW',
        studentAlias: 'Anon#4821',
        date: '2026-07-26',
        timeSlot: '10:00 AM - 10:45 AM',
        mode: 'Telehealth Video',
        status: 'Confirmed',
        topic: 'Exam Anxiety & Panic Attacks',
        meetingUrl: 'https://haven.knust.edu.gh/join/telehealth-4821'
      }
    ];
  });

  // Modal States
  const [activeReplyPost, setActiveReplyPost] = useState(null);
  const [activeTelehealthRoom, setActiveTelehealthRoom] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isFerpaModalOpen, setIsFerpaModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isSafetyPlanModalOpen, setIsSafetyPlanModalOpen] = useState(false);

  // Sync effects for local storage
  useEffect(() => {
    localStorage.setItem('ms_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ms_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ms_user_auth', JSON.stringify(userAuth));
  }, [userAuth]);

  // Login & Logout Handlers
  const login = (authData, userRole = 'student') => {
    setUserAuth(authData);
    setRole(userRole);
    setIsAuthenticated(true);
    if (userRole === 'counselor') {
      setActiveTab('counselor_triage');
    } else {
      setActiveTab('articles');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out. Returning to Sign In portal.', 'info');
  };

  useEffect(() => {
    localStorage.setItem('ms_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ms_posts_v3', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('ms_safety_plan', JSON.stringify(safetyPlan));
  }, [safetyPlan]);

  useEffect(() => {
    localStorage.setItem('ms_my_posts', JSON.stringify(myPostIds));
  }, [myPostIds]);

  useEffect(() => {
    localStorage.setItem('ms_mood_logs', JSON.stringify(moodLogs));
  }, [moodLogs]);

  useEffect(() => {
    localStorage.setItem('ms_streak', streakCount.toString());
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem('ms_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Actions
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  };

  const handleToggleSupport = (postId, e) => {
    if (e) e.stopPropagation();
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isSupported = !post.isSupported;
        return {
          ...post,
          isSupported,
          supportCount: isSupported ? post.supportCount + 1 : post.supportCount - 1
        };
      }
      return post;
    }));
  };

  const handleAddReaction = (postId, badgeId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const currentReactions = p.reactions || {};
        const count = currentReactions[badgeId] || 0;
        return {
          ...p,
          reactions: {
            ...currentReactions,
            [badgeId]: count + 1
          }
        };
      }
      return p;
    }));
    showToast('Sent empathy encouragement reaction!', 'success');
  };

  const handleSaveSafetyPlan = (newPlan) => {
    setSafetyPlan(newPlan);
    setIsSafetyPlanModalOpen(false);
    showToast('Personal Emergency Safety Net Plan saved!', 'success');
  };

  const handleCreatePost = (title, content, tag) => {
    const newPostRaw = {
      id: `post-${Date.now()}`,
      tag,
      timeAgo: 'Just now',
      title: title.trim(),
      content: content.trim(),
      author: sessionHash,
      supportCount: 0,
      isSupported: false,
      reactions: {},
      replyCount: 0,
      replies: []
    };

    const newPost = enrichPostWithRisk(newPostRaw);

    setPosts([newPost, ...posts]);
    setMyPostIds(prev => [...prev, newPost.id]);
    setSelectedCategory('All');
    setActiveTab('peer_threads');
    setIsCreateModalOpen(false);

    showToast('Thread posted anonymously!', 'success');

    if (newPost.riskAnalysis.isCrisis) {
      setIsCrisisModalOpen(true);
    }
  };

  const handleAddReply = (postId, text) => {
    const isCounselor = role === 'counselor';
    const newReply = {
      id: `r-${Date.now()}`,
      author: isCounselor ? 'Counselor Alex, LCSW' : sessionHash,
      isCounselor,
      time: 'Just now',
      text: text.trim()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replyCount: p.replyCount + 1,
          replies: [...p.replies, newReply]
        };
      }
      return p;
    }));

    if (activeReplyPost && activeReplyPost.id === postId) {
      setActiveReplyPost(prev => ({
        ...prev,
        replyCount: prev.replyCount + 1,
        replies: [...prev.replies, newReply]
      }));
    }

    showToast(isCounselor ? 'Verified counselor response posted!' : 'Support reply posted anonymously!', 'success');
  };

  const handleAddMoodLog = (moodLevel, triggers, note) => {
    const newLog = {
      id: `m-${Date.now()}`,
      moodLevel,
      triggers,
      note,
      date: 'Today'
    };

    setMoodLogs([newLog, ...moodLogs]);
    setStreakCount(prev => prev + 1);
    setIsMoodModalOpen(false);
    showToast('Daily mood check-in saved! Streak increased', 'success');
  };

  const handleBookAppointment = (counselorName, date, timeSlot, topic, mode) => {
    const newAppt = {
      id: `apt-${Date.now()}`,
      counselorName,
      studentAlias: sessionHash,
      date,
      timeSlot,
      mode,
      status: 'Confirmed',
      topic,
      meetingUrl: `https://haven.knust.edu.gh/join/telehealth-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setAppointments(prev => [newAppt, ...prev]);
    setIsAppointmentModalOpen(false);
    showToast('Telehealth counseling session confirmed!', 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem('ms_posts_v3');
    localStorage.removeItem('ms_my_posts');
    localStorage.removeItem('ms_appointments');
    localStorage.removeItem('ms_mood_logs');
    localStorage.removeItem('ms_streak');
    localStorage.removeItem('ms_safety_plan');
    localStorage.removeItem('ms_user_auth');
    localStorage.removeItem('ms_is_authenticated');
    setIsAuthenticated(false);
    setPosts(INITIAL_POSTS.map(enrichPostWithRisk));
    setMyPostIds([]);
    setStreakCount(4);
    setUserAuth({
      isGuest: true,
      userType: 'student',
      displayName: 'Anon#4821',
      email: 'visitor@campus.edu'
    });
    setMoodLogs([
      {
        id: 'm-1',
        moodLevel: 4,
        triggers: ['Exams', 'Sleep Deprivation'],
        note: 'Completed midterm study session and tried 4-7-8 breathing.',
        date: 'Today'
      }
    ]);
    setAppointments([
      {
        id: 'apt-101',
        counselorName: 'Dr. Sarah Jenkins, LCSW',
        studentAlias: 'Anon#4821',
        date: '2026-07-26',
        timeSlot: '10:00 AM - 10:45 AM',
        mode: 'Telehealth Video',
        status: 'Confirmed',
        topic: 'Exam Anxiety & Panic Attacks',
        meetingUrl: 'https://haven.knust.edu.gh/join/telehealth-4821'
      }
    ]);
    showToast('Demo data reset to clean initial state', 'info');
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    role,
    setRole,
    anonymousMode,
    setAnonymousMode,
    theme,
    toggleTheme,
    sessionHash,
    rotateSessionHash,
    userAuth,
    setUserAuth,
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
    activeReplyPost,
    setActiveReplyPost,
    activeTelehealthRoom,
    setActiveTelehealthRoom,
    isAuthModalOpen,
    setIsAuthModalOpen,
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
    resetDemoData,
    handleToggleSupport,
    handleAddReaction,
    handleSaveSafetyPlan,
    handleCreatePost,
    handleAddReply,
    handleAddMoodLog,
    handleBookAppointment
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
