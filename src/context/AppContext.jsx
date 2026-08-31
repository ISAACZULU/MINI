import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyzeTextRisk } from '../utils/riskAnalyzer';
import { supabase } from '../services/supabase';

const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    title: "Navigating Academic Burnout at KNUST",
    author: "Dr. Sarah Jenkins, LCSW",
    category: "Burnout",
    readTime: "4 min read",
    summary: "Recognize the subtle difference between high stress and clinical burnout, and learn how to implement boundary systems to protect your energy.",
    content: `Academic burnout is more than just feeling tired after a long week. It is a state of physical, emotional, and mental exhaustion caused by prolonged stress. For students at KNUST, the pressure of maintaining academic excellence can make burnout feel inevitable—but it doesn't have to be.

Signs of Academic Burnout:
- Anhedonia: Loss of interest in subjects or hobbies you once enjoyed.
- Cognitive fatigue: Difficulty focusing, studying, or remembering facts.
- Physical symptoms: Persistent headaches, body tension, or sleep disturbances.

Actionable Recovery Steps:
1. Establish Strict Study Curfews: Designate a specific hour (e.g., 8:00 PM) after which all academic tasks cease.
2. Micro-breaks (The 50/10 Rule): Study intensely for 50 minutes, then stand up, walk, and stretch for 10 minutes without looking at a screen.
3. Separate Identity from GPA: Remind yourself daily that your value as a person is not bound to a grade sheet.`
  },
  {
    id: 'art-2',
    title: "Exam Anxiety Survival Protocol",
    author: "Counselor Mark, PsyD",
    category: "Anxiety",
    readTime: "3 min read",
    summary: "A practical guide to handling panic attacks, racing heart, and mind-blanking during midterm season.",
    content: `Exam anxiety is a physiological response to stress. Your sympathetic nervous system prepares you for a threat, causing a racing heart, shallow breathing, and racing thoughts. Here is a professional protocol to calm your nervous system right before or during an exam.

The Grounding Protocol:
- Double Inhales (The Physiological Sigh): Take two quick deep breaths through your nose, then blow it out slowly through your mouth. Repeat 3 times to quickly lower heart rate.
- Acknowledge and Reframe: Tell yourself, "My racing heart is not panic; it is my body generating energy and oxygen to help me focus."
- Physical Grounding: Feel your feet flat on the floor and your back against the chair. Notice the weight of the pen in your hand to pull yourself out of spiraling thoughts.`
  },
  {
    id: 'art-3',
    title: "Insomnia & Sleep Circadian Resets",
    author: "Dr. Elizabeth Owusu, PhD",
    category: "Sleep",
    readTime: "5 min read",
    summary: "Proven circadian rhythm optimization strategies for students dealing with late-night study pressures.",
    content: `A healthy sleep pattern is the single most powerful cognitive enhancer available. Yet, university schedules often lead to chronic sleep deprivation, which dramatically worsens anxiety and depression. Let's explore how to optimize your circadian clock.

Sleep Hygiene Best Practices:
- Blue Light Blocking: Avoid smartphone and laptop screens at least 45 minutes before trying to sleep, or use strong blue-light filters.
- The 20-Minute Rule: If you cannot fall asleep after 20 minutes in bed, get out of bed. Sit in a dim room and read a physical book until you feel drowsy. Do not associate your bed with frustration.
- Morning Sunlight: Get 10 minutes of direct outdoor light into your eyes as soon as possible after waking up to set your melatonin release timer for the night.`
  }
];

const INITIAL_GOODWILL = [
  {
    id: 'gw-1',
    text: "You are doing your absolute best, and that is enough. Take a deep breath and take things one step at a time today.",
    author: "Counselor Sarah, LCSW",
    role: "Lead Campus Therapist",
    color: "rgba(20, 184, 166, 0.08)",
    textColor: "#0d9488"
  },
  {
    id: 'gw-2',
    text: "Your academic results do not define your human worth. Rest is not a reward; it is a fundamental need.",
    author: "Dr. Sarah Jenkins",
    role: "Mental Health Director",
    color: "rgba(99, 102, 241, 0.08)",
    textColor: "#4f46e5"
  },
  {
    id: 'gw-3',
    text: "Sending strength and calm to everyone studying late tonight. Your health and peace are what matter most.",
    author: "Campus Peer Care Team",
    role: "Wellness Volunteers",
    color: "rgba(245, 158, 11, 0.08)",
    textColor: "#d97706"
  }
];

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

  // Genuine SHA-256 Session Hash Generator (Web Cryptography API)
  const generateSha256Token = async (seed) => {
    try {
      const rawData = seed || `${Date.now()}-${crypto.randomUUID ? crypto.randomUUID() : Math.random()}-${navigator.userAgent}`;
      const msgBuffer = new TextEncoder().encode(rawData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      // Format as cryptographic token: Anon#<10-char SHA-256 hex>
      return `Anon#${hashHex.slice(0, 10)}`;
    } catch (e) {
      const arr = new Uint8Array(5);
      crypto.getRandomValues(arr);
      const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      return `Anon#${hex}`;
    }
  };

  const generateSyncHexToken = () => {
    try {
      const arr = new Uint8Array(5);
      crypto.getRandomValues(arr);
      const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      return `Anon#${hex}`;
    } catch {
      return `Anon#${Math.floor(1000000000 + Math.random() * 9000000000).toString(16).toUpperCase()}`;
    }
  };

  // Session Hash (Cryptographically Protected via SHA-256)
  const [sessionHash, setSessionHash] = useState(() => {
    const saved = localStorage.getItem('ms_session_hash');
    // If it's the old 4-digit token or missing, upgrade to cryptographic hex token
    if (saved && saved.startsWith('Anon#') && saved.length >= 15) return saved;
    const initial = generateSyncHexToken();
    localStorage.setItem('ms_session_hash', initial);
    return initial;
  });

  const rotateSessionHash = async () => {
    const newHash = await generateSha256Token();
    setSessionHash(newHash);
    localStorage.setItem('ms_session_hash', newHash);
    if (userAuth.isGuest) {
      setUserAuth(prev => ({ ...prev, displayName: newHash }));
    }
    showToast(`Session identity rotated via SHA-256: ${newHash}`, 'success');
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

  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('ms_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [goodwillMessages, setGoodwillMessages] = useState(() => {
    const saved = localStorage.getItem('ms_goodwill');
    return saved ? JSON.parse(saved) : INITIAL_GOODWILL;
  });

  const [directChats, setDirectChats] = useState(() => {
    const saved = localStorage.getItem('ms_direct_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(c => {
          if (c.id === 'chat-jenkins' && !c.studentAlias) {
            return { ...c, studentAlias: 'jordan.rivera@st.knust.edu.gh' };
          }
          return c;
        });
      } catch (e) {
        console.error('Failed to parse saved direct chats:', e);
      }
    }
    return [
      {
        id: 'chat-jenkins',
        counselorName: 'Dr. Sarah Jenkins, LCSW (Anxiety & Trauma)',
        studentAlias: 'jordan.rivera@st.knust.edu.gh',
        messages: [
          {
            id: 'msg-j1',
            sender: 'counselor',
            text: 'Hello Jordan! Feel free to reach out here if you have any questions or concern. We are here to support you.',
            timestamp: Date.now() - 3600000 * 24
          }
        ]
      }
    ];
  });

  const [selectedChatCounselor, setSelectedChatCounselor] = useState('Dr. Sarah Jenkins, LCSW (Anxiety & Trauma)');

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

  useEffect(() => {
    localStorage.setItem('ms_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('ms_goodwill', JSON.stringify(goodwillMessages));
  }, [goodwillMessages]);

  useEffect(() => {
    localStorage.setItem('ms_direct_chats', JSON.stringify(directChats));
  }, [directChats]);

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
    localStorage.setItem('ms_is_authenticated', 'false');
    localStorage.removeItem('ms_user_auth');
    localStorage.removeItem('ms_role');
    setIsAuthenticated(false);
    setRole('student');
    setUserAuth({
      isGuest: true,
      userType: 'student',
      displayName: 'Anon#4821',
      email: 'visitor@campus.edu'
    });
    showToast('Logged out. Returning to landing page.', 'info');
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
    async function loadFromSupabase() {
      console.log('Supabase URL configured:', import.meta.env.VITE_SUPABASE_URL);
      try {
        const [
          { data: dbPosts, error: postsErr },
          { data: dbReplies, error: repliesErr },
          { data: dbSupports, error: supportsErr },
          { data: dbReactions, error: reactionsErr },
          { data: dbMoods, error: moodsErr },
          { data: dbAppts, error: apptsErr },
          { data: dbDMs, error: dmsErr },
          { data: dbArticles, error: articlesErr },
          { data: dbGoodwill, error: goodwillErr }
        ] = await Promise.all([
          supabase.from('posts').select('*').order('created_at', { ascending: false }),
          supabase.from('replies').select('*').order('timestamp', { ascending: true }),
          supabase.from('post_supports').select('*'),
          supabase.from('post_reactions').select('*'),
          supabase.from('mood_logs').select('*').order('created_at', { ascending: false }),
          supabase.from('appointments').select('*').order('created_at', { ascending: false }),
          supabase.from('direct_messages').select('*').order('timestamp', { ascending: true }),
          supabase.from('articles').select('*'),
          supabase.from('goodwill_messages').select('*')
        ]);

        if (postsErr) console.error('Supabase posts fetch error:', postsErr);

        if (!postsErr && dbPosts && dbPosts.length > 0) {
          const formattedPosts = dbPosts.map(p => {
            const postReplies = (dbReplies || [])
              .filter(r => r.post_id === p.id)
              .map(r => ({
                id: r.id,
                author: r.author || 'Anon',
                isCounselor: r.is_counselor || false,
                time: 'Recently',
                text: r.text || ''
              }));

            const postSupports = (dbSupports || []).filter(s => s.post_id === p.id);
            const isSupported = postSupports.some(s => s.session_hash === sessionHash);
            const supportCount = postSupports.length > 0 ? postSupports.length : (p.likes_count || 0);

            const reactionsMap = {};
            (dbReactions || [])
              .filter(re => re.post_id === p.id)
              .forEach(re => {
                const rType = re.reaction_type;
                reactionsMap[rType] = (reactionsMap[rType] || 0) + 1;
              });

            return enrichPostWithRisk({
              id: p.id,
              tag: p.tag || 'General',
              timeAgo: 'Recently',
              title: p.title || 'Untitled Thread',
              content: p.content || '',
              author: p.author_name || 'Anon',
              supportCount,
              isSupported,
              reactions: reactionsMap,
              replyCount: postReplies.length > 0 ? postReplies.length : (p.replies_count || 0),
              replies: postReplies
            });
          });
          setPosts(formattedPosts);
        }

        if (!moodsErr && dbMoods && dbMoods.length > 0) {
          const formattedMoods = dbMoods.map(m => ({
            id: m.id,
            moodLevel: m.mood_score,
            triggers: [m.mood_label],
            note: m.note || '',
            date: new Date(m.created_at).toLocaleDateString()
          }));
          setMoodLogs(formattedMoods);
        }

        if (!apptsErr && dbAppts && dbAppts.length > 0) {
          const formattedAppts = dbAppts.map(a => ({
            id: a.id,
            counselorName: a.counselor_name || 'Counselor',
            studentAlias: a.student_alias || 'Anon Student',
            date: a.appointment_date || 'Upcoming',
            timeSlot: a.time_slot || '10:00 AM',
            mode: a.mode || 'Telehealth Video',
            status: a.status || 'Confirmed',
            topic: a.topic || 'General Consultation',
            meetingUrl: a.meeting_url || '#'
          }));
          setAppointments(formattedAppts);
        }

        if (!dmsErr && dbDMs && dbDMs.length > 0) {
          const chatsMap = {};
          dbDMs.forEach(dm => {
            const cName = dm.counselor_name;
            const sAlias = dm.student_alias;
            const key = `${cName}||${sAlias}`;
            if (!chatsMap[key]) {
              chatsMap[key] = {
                id: `chat-${dm.id || Date.now()}-${Math.random().toString(36).substring(2,7)}`,
                counselorName: cName,
                studentAlias: sAlias,
                messages: []
              };
            }
            chatsMap[key].messages.push({
              id: dm.id,
              sender: dm.sender_type || 'student',
              text: dm.message_text || '',
              timestamp: dm.timestamp || Date.now()
            });
          });
          setDirectChats(Object.values(chatsMap));
        }

        if (!articlesErr && dbArticles && dbArticles.length > 0) {
          setArticles(dbArticles);
        }

        if (!goodwillErr && dbGoodwill && dbGoodwill.length > 0) {
          setGoodwillMessages(dbGoodwill);
        }
      } catch (e) {
        console.warn('Supabase fetch bypassed, using local state:', e);
      }
    }

    loadFromSupabase();
  }, []);


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

  const handleToggleSupport = async (postId, e) => {
    if (e) e.stopPropagation();
    let isSupportedNow = false;
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        isSupportedNow = !post.isSupported;
        return {
          ...post,
          isSupported: isSupportedNow,
          supportCount: isSupportedNow ? post.supportCount + 1 : post.supportCount - 1
        };
      }
      return post;
    }));

    try {
      if (isSupportedNow) {
        await supabase.from('post_supports').insert([
          {
            post_id: postId,
            session_hash: sessionHash,
            timestamp: Date.now()
          }
        ]);
      } else {
        await supabase.from('post_supports')
          .delete()
          .match({ post_id: postId, session_hash: sessionHash });
      }
    } catch (err) {
      console.warn('Supabase support sync warning:', err);
    }
  };

  const handleAddReaction = async (postId, badgeId) => {
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

    try {
      await supabase.from('post_reactions').insert([
        {
          post_id: postId,
          reaction_type: badgeId,
          session_hash: sessionHash,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.warn('Supabase reaction sync warning:', err);
    }
  };

  const handleSaveSafetyPlan = async (newPlan) => {
    setSafetyPlan(newPlan);
    setIsSafetyPlanModalOpen(false);
    showToast('Personal Emergency Safety Plan saved!', 'success');

    try {
      await supabase.from('safety_plans').insert([
        {
          author: userAuth?.email || sessionHash,
          plan_data: newPlan,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.warn('Supabase safety plan sync warning:', err);
    }
  };

  const handleCreatePost = async (title, content, tag, isAnonymous = false) => {
    const createdAt = Date.now();
    const author = isAnonymous ? sessionHash : userAuth.displayName;
    const newPostRaw = {
      id: `post-${createdAt}`,
      tag,
      timeAgo: 'Just now',
      title: title.trim(),
      content: content.trim(),
      author: author,
      isAnonymous,
      supportCount: 0,
      isSupported: false,
      reactions: {},
      replyCount: 0,
      replies: [],
      createdAt
    };

    const newPost = enrichPostWithRisk(newPostRaw);

    setPosts([newPost, ...posts]);
    setMyPostIds(prev => [...prev, newPost.id]);
    setSelectedCategory('All');
    setActiveTab('peer_threads');
    setIsCreateModalOpen(false);

    showToast(isAnonymous ? 'Thread posted anonymously!' : 'Thread posted!', 'success');

    if (newPost.riskAnalysis.isCrisis) {
      setIsCrisisModalOpen(true);
    }

    // Save to Supabase Cloud Database asynchronously
    try {
      await supabase.from('posts').insert([
        {
          author_name: author,
          content: `${title.trim()}\n\n${content.trim()}`,
          tag: tag || 'General',
          risk_level: newPost.riskAnalysis?.riskLevel || 'LOW',
          risk_score: newPost.riskAnalysis?.score || 0
        }
      ]);
    } catch (err) {
      console.warn('Supabase post sync warning:', err);
    }

    // Save clinical analytics record asynchronously
    try {
      await supabase.from('clinical_analytics').insert([
        {
          event_type: 'POST_TRIAGE',
          post_id: newPost.id,
          risk_level: newPost.riskAnalysis?.riskLevel || 'LOW',
          risk_score: newPost.riskAnalysis?.score || 0,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.warn('Supabase clinical analytics sync warning:', err);
    }
  };

  const handleRevealIdentity = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedReplies = p.replies ? p.replies.map(r => {
          if (r.author === sessionHash) {
            return { ...r, author: userAuth.displayName };
          }
          return r;
        }) : [];
        return {
          ...p,
          author: userAuth.displayName,
          isAnonymous: false,
          replies: updatedReplies
        };
      }
      return p;
    }));

    if (activeReplyPost && activeReplyPost.id === postId) {
      setActiveReplyPost(prev => {
        const updatedReplies = prev.replies ? prev.replies.map(r => {
          if (r.author === sessionHash) {
            return { ...r, author: userAuth.displayName };
          }
          return r;
        }) : [];
        return {
          ...prev,
          author: userAuth.displayName,
          isAnonymous: false,
          replies: updatedReplies
        };
      });
    }

    showToast('Your identity has been successfully revealed on this thread!', 'success');
  };

  const handlePublishArticle = async (articleData) => {
    const newArticle = {
      id: `art-${Date.now()}`,
      ...articleData
    };
    setArticles(prev => [newArticle, ...prev]);
    showToast('New article published successfully!', 'success');

    // Save to Supabase Cloud Database asynchronously
    try {
      await supabase.from('articles').insert([newArticle]);
    } catch (err) {
      console.warn('Supabase article sync warning:', err);
    }

    // Save publish content analytics event
    try {
      await supabase.from('counselor_actions').insert([
        {
          action_type: 'PUBLISH_ARTICLE',
          content_id: newArticle.id,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.warn('Supabase analytics action sync warning:', err);
    }
  };

  const handlePublishGoodwill = async (goodwillData) => {
    const randomColors = [
      { color: "rgba(20, 184, 166, 0.08)", textColor: "#0d9488" },
      { color: "rgba(99, 102, 241, 0.08)", textColor: "#4f46e5" },
      { color: "rgba(245, 158, 11, 0.08)", textColor: "#d97706" }
    ];
    const pickedColors = randomColors[Math.floor(Math.random() * randomColors.length)];

    const newGoodwill = {
      id: `gw-${Date.now()}`,
      ...goodwillData,
      ...pickedColors
    };
    setGoodwillMessages(prev => [newGoodwill, ...prev]);
    showToast('New goodwill message published successfully!', 'success');

    // Save to Supabase Cloud Database asynchronously
    try {
      await supabase.from('goodwill_messages').insert([newGoodwill]);
    } catch (err) {
      console.warn('Supabase goodwill sync warning:', err);
    }

    // Save publish content analytics event
    try {
      await supabase.from('counselor_actions').insert([
        {
          action_type: 'PUBLISH_GOODWILL',
          content_id: newGoodwill.id,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.warn('Supabase analytics action sync warning:', err);
    }
  };

  const handleSendDirectMessage = async (counselorName, text, isAnon = false, studentAlias = null) => {
    const isCounselor = role === 'counselor';
    const activeStudentAlias = studentAlias || (isAnon ? sessionHash : (userAuth?.email || sessionHash));

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: isCounselor ? 'counselor' : 'student',
      text: text.trim(),
      timestamp: Date.now()
    };

    setDirectChats(prev => {
      const exists = prev.find(c => c.counselorName === counselorName && c.studentAlias === activeStudentAlias);
      if (exists) {
        return prev.map(c => {
          if (c.counselorName === counselorName && c.studentAlias === activeStudentAlias) {
            return {
              ...c,
              messages: [...c.messages, newMessage]
            };
          }
          return c;
        });
      } else {
        return [
          {
            id: `chat-${Date.now()}`,
            counselorName,
            studentAlias: activeStudentAlias,
            messages: [
              {
                id: `msg-init`,
                sender: 'counselor',
                text: 'Hello! How can I help you today?',
                timestamp: Date.now() - 5000
              },
              newMessage
            ]
          },
          ...prev
        ];
      }
    });

    // Save to Supabase Cloud Database asynchronously
    try {
      await supabase.from('direct_messages').insert([
        {
          counselor_name: counselorName,
          student_alias: activeStudentAlias,
          message_text: text.trim(),
          sender_type: isCounselor ? 'counselor' : 'student',
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.warn('Supabase direct message send warning:', err);
    }

    // ONLY simulate counselor auto-reply if the student is sending a message
    if (!isCounselor) {
      setTimeout(async () => {
        const counselorReplies = [
          "Thank you for sharing that with me. What are some of the coping strategies you've tried so far?",
          "I hear you, and your feelings are completely valid. Remember to take deep breaths.",
          "The KNUST campus counselling resource centre is always available. Shall we discuss this in an in-person session?",
          "Your mental well-being is our priority. I will review this and get back to you shortly. Take care."
        ];
        const randomReply = counselorReplies[Math.floor(Math.random() * counselorReplies.length)];

        const counselorMessage = {
          id: `msg-reply-${Date.now()}`,
          sender: 'counselor',
          text: randomReply,
          timestamp: Date.now()
        };

        setDirectChats(prev => prev.map(c => {
          if (c.counselorName === counselorName && c.studentAlias === activeStudentAlias) {
            return {
              ...c,
              messages: [...c.messages, counselorMessage]
            };
          }
          return c;
        }));

        try {
          await supabase.from('direct_messages').insert([
            {
              counselor_name: counselorName,
              student_alias: activeStudentAlias,
              message_text: randomReply,
              sender_type: 'counselor',
              timestamp: Date.now()
            }
          ]);
        } catch (err) {
          console.warn('Supabase counselor reply sync warning:', err);
        }
      }, 1500);
    }
  };

  const handleEditPost = (postId, title, content) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      showToast('Your note needs both a title and message before saving.', 'info');
      return;
    }

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        title: trimmedTitle,
        content: trimmedContent,
        editedAt: Date.now()
      };
    }));

    showToast('Your note was updated.', 'success');
  };

  const handleAddReply = async (postId, text) => {
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

    try {
      await supabase.from('replies').insert([
        {
          post_id: postId,
          author: newReply.author,
          text: text.trim(),
          is_counselor: isCounselor
        }
      ]);
    } catch (err) {
      console.warn('Supabase reply sync warning:', err);
    }
  };

  const handleAddMoodLog = async (moodLevel, triggers, note) => {
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

    // Save to Supabase Cloud Database asynchronously
    try {
      await supabase.from('mood_logs').insert([
        {
          mood_score: moodLevel,
          mood_label: (triggers && triggers.length > 0) ? triggers.join(', ') : 'Daily Check-in',
          note: note || ''
        }
      ]);
    } catch (err) {
      console.warn('Supabase mood log sync warning:', err);
    }
  };


  const handleBookAppointment = async (counselorName, date, timeSlot, topic, mode) => {
    const roomId = `mini-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const meetingUrl = `https://demo.daily.co/${roomId}`;
    const newAppt = {
      id: `apt-${Date.now()}`,
      counselorName,
      studentAlias: sessionHash,
      date,
      timeSlot,
      mode,
      status: 'Confirmed',
      topic,
      meetingUrl
    };

    setAppointments(prev => [newAppt, ...prev]);
    setIsAppointmentModalOpen(false);
    showToast('Appointment successfully booked & confirmed!', 'success');

    // Save to Supabase Cloud Database asynchronously
    try {
      await supabase.from('appointments').insert([
        {
          counselor_name: counselorName,
          student_alias: sessionHash,
          appointment_date: date,
          time_slot: timeSlot,
          topic: topic,
          mode: mode,
          status: 'Confirmed',
          meeting_url: meetingUrl
        }
      ]);
    } catch (err) {
      console.warn('Supabase appointment sync warning:', err);
    }
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
    articles,
    setArticles,
    goodwillMessages,
    setGoodwillMessages,
    directChats,
    setDirectChats,
    selectedChatCounselor,
    setSelectedChatCounselor,
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
