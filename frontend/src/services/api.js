const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'ms_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

// Auth
export const authRegister = (email, password, displayName) =>
  request('/auth/register', { method: 'POST', body: { email, password, displayName }, auth: false });
export const authGuest = () => request('/auth/guest', { method: 'POST', auth: false });
export const authLogin = (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false });
export const authMe = () => request('/auth/me');

// Posts
export const fetchPosts = () => request('/posts');
export const createPost = (title, content, tag, isAnonymous) =>
  request('/posts', { method: 'POST', body: { title, content, tag, isAnonymous } });
export const editPost = (postId, title, content) => request(`/posts/${postId}`, { method: 'PATCH', body: { title, content } });
export const toggleSupport = (postId) => request(`/posts/${postId}/support`, { method: 'POST' });
export const addReaction = (postId, reactionType) => request(`/posts/${postId}/reactions`, { method: 'POST', body: { reactionType } });
export const addReply = (postId, text) => request(`/posts/${postId}/replies`, { method: 'POST', body: { text } });
export const revealIdentity = (postId) => request(`/posts/${postId}/reveal`, { method: 'POST' });

// Moods
export const fetchMoods = () => request('/moods');
export const addMoodLog = (moodLevel, triggers, note) => request('/moods', { method: 'POST', body: { moodLevel, triggers, note } });

// Appointments
export const fetchAppointments = () => request('/appointments');
export const bookAppointment = (counselorId, date, timeSlot, topic, mode, isAnonymous) =>
  request('/appointments', { method: 'POST', body: { counselorId, date, timeSlot, topic, mode, isAnonymous } });

// Counselors
export const fetchCounselors = () => request('/counselors');

// Messages
export const fetchMessages = () => request('/messages');
export const sendMessage = (counselorName, text, studentId, studentAlias) =>
  request('/messages', { method: 'POST', body: { counselorName, text, studentId, studentAlias } });

// Articles
export const fetchArticles = () => request('/articles');
export const publishArticle = (articleData) => request('/articles', { method: 'POST', body: articleData });

// Goodwill
export const fetchGoodwill = () => request('/goodwill');
export const publishGoodwill = (goodwillData) => request('/goodwill', { method: 'POST', body: goodwillData });

// Safety plan
export const fetchSafetyPlan = () => request('/safety-plan');
export const saveSafetyPlan = (plan) => request('/safety-plan', { method: 'PUT', body: plan });

// Feedback (public, pre-login)
export const fetchFeedback = () => request('/feedback', { auth: false });
export const submitFeedback = (rating, text, authorName) =>
  request('/feedback', { method: 'POST', body: { rating, text, authorName }, auth: false });

// Bookmarks
export const fetchBookmarks = () => request('/bookmarks');
export const addBookmark = (resourceId) => request('/bookmarks', { method: 'POST', body: { resourceId } });
export const removeBookmark = (resourceId) => request(`/bookmarks/${resourceId}`, { method: 'DELETE' });

// Analytics & moderation (counselor only)
export const fetchAnalyticsOverview = () => request('/analytics/overview');
export const fetchFlaggedPosts = () => request('/moderation/flagged');
export const clearFlag = (postId) => request(`/moderation/${postId}/clear`, { method: 'POST' });

// AI companion
export const aiChat = (message, history) => request('/ai/chat', { method: 'POST', body: { message, history } });
