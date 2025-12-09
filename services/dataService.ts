import { User, System, ReviewItem, ReviewStatus } from '../types';
import { EBBINGHAUS_INTERVALS } from '../constants';

// Backend API Config
// Set this to true ONLY if you have the backend server running at API_BASE_URL
const USE_REAL_API = false;
const API_BASE_URL = 'http://localhost:8080'; 

// Local Persistence Keys
const USERS_KEY = 'cl_users';
const SYSTEMS_KEY = 'cl_systems';
const ITEMS_KEY = 'cl_items';

// Helpers
const getStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Auth (Mock + Real API Hybrid) ---

export const register = async (email: string, password: string): Promise<User> => {
  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (result.code !== 200) throw new Error(result.message || 'Registration failed');

      const backendUser = result.data;
      const newUser: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: backendUser.email.split('@')[0],
        password: password,
        avatar: undefined,
        address: '',
        gender: 'secret',
        birthDate: ''
      };

      syncUserToLocal(newUser, password);
      initDefaultSystems(newUser.id);
      return newUser;
    } catch (error) {
      console.error("API Register Error, falling back to local:", error);
      // Fallback is dangerous for register if ID generation differs, but handled below for demo stability
      throw error; 
    }
  }

  // Mock Implementation
  await new Promise(r => setTimeout(r, 600)); // Simulate delay
  const users = getStorage<User & { password: string }>(USERS_KEY);
  
  if (users.some(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name: email.split('@')[0],
    password, 
    avatar: undefined,
    address: '',
    gender: 'secret',
    birthDate: ''
  };

  users.push(newUser as any);
  setStorage(USERS_KEY, users);
  initDefaultSystems(newUser.id);
  
  return newUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (result.code !== 200) throw new Error(result.message || 'Login failed');

      const backendUser = result.data;
      // Merge with local profile data
      const localUsers = getStorage<User & { password: string }>(USERS_KEY);
      const localUser = localUsers.find(u => u.id === backendUser.id);

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: localUser?.name || backendUser.email.split('@')[0],
        password: password,
        avatar: localUser?.avatar,
        address: localUser?.address,
        birthDate: localUser?.birthDate,
        gender: localUser?.gender || 'secret',
      };

      syncUserToLocal(user, password);
      return user;
    } catch (error) {
      console.error("API Login Error:", error);
      throw error;
    }
  }

  // Mock Implementation
  await new Promise(r => setTimeout(r, 600));
  const users = getStorage<User & { password: string }>(USERS_KEY);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  return user;
};

// 辅助函数：将 API 用户同步到本地 LocalStorage 以便兼容旧逻辑
const syncUserToLocal = (user: User, password?: string) => {
    const users = getStorage<User & { password: string }>(USERS_KEY);
    const index = users.findIndex(u => u.id === user.id);
    const userToSave = { ...user, password: password || user.password || '' };

    if (index >= 0) {
        users[index] = { ...users[index], ...userToSave };
    } else {
        users.push(userToSave);
    }
    setStorage(USERS_KEY, users);
};

// 辅助函数：初始化默认系统
const initDefaultSystems = (userId: string) => {
    const systems = getStorage<System>(SYSTEMS_KEY);
    const hasSystems = systems.some(s => s.userId === userId);
    
    if (!hasSystems) {
        systems.push(
            { id: crypto.randomUUID(), userId: userId, type: 'vocab', name: '单词纠错', theme: 'amber', icon: 'book' },
            { id: crypto.randomUUID(), userId: userId, type: 'algo', name: '算法错题', theme: 'sky', icon: 'code' }
        );
        setStorage(SYSTEMS_KEY, systems);
    }
}

// Update User Profile (Local Only for now, preserving Hybrid mode)
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    const users = getStorage<User & { password: string }>(USERS_KEY);
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) throw new Error('User not found in local cache');
    
    // Merge updates
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    
    setStorage(USERS_KEY, users);
    return updatedUser;
};

// --- Systems (LocalStorage) ---
export const getSystems = (userId: string): System[] => {
  return getStorage<System>(SYSTEMS_KEY).filter(s => s.userId === userId);
};

export const createSystem = (system: Omit<System, 'id'>): System => {
  const systems = getStorage<System>(SYSTEMS_KEY);
  const newSystem = { ...system, id: crypto.randomUUID() };
  systems.push(newSystem);
  setStorage(SYSTEMS_KEY, systems);
  return newSystem;
};

export const deleteSystem = (id: string) => {
  const systems = getStorage<System>(SYSTEMS_KEY).filter(s => s.id !== id);
  setStorage(SYSTEMS_KEY, systems);
  // Also delete items
  const items = getStorage<ReviewItem>(ITEMS_KEY).filter(i => i.systemId !== id);
  setStorage(ITEMS_KEY, items);
};

// --- Items (LocalStorage) ---
export const getItems = (systemId: string): ReviewItem[] => {
  return getStorage<ReviewItem>(ITEMS_KEY).filter(i => i.systemId === systemId);
};

// New: Get All Items for Dashboard stats (e.g. heatmap)
export const getAllReviewItems = (userId: string): ReviewItem[] => {
    const systems = getSystems(userId);
    const systemIds = new Set(systems.map(s => s.id));
    return getStorage<ReviewItem>(ITEMS_KEY).filter(i => systemIds.has(i.systemId));
};

export const createItem = (item: Omit<ReviewItem, 'id' | 'createdAt' | 'status' | 'reviewCount' | 'nextReviewAt'>): ReviewItem => {
  const items = getStorage<ReviewItem>(ITEMS_KEY);
  const newItem: ReviewItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    status: 'new',
    reviewCount: 0,
    nextReviewAt: Date.now(),
  };
  items.push(newItem);
  setStorage(ITEMS_KEY, items);
  return newItem;
};

export const batchCreateItems = (items: Omit<ReviewItem, 'id' | 'createdAt' | 'status' | 'reviewCount' | 'nextReviewAt'>[]): ReviewItem[] => {
  const existingItems = getStorage<ReviewItem>(ITEMS_KEY);
  const newItems = items.map(item => ({
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    status: 'new' as ReviewStatus,
    reviewCount: 0,
    nextReviewAt: Date.now(),
  }));
  setStorage(ITEMS_KEY, [...existingItems, ...newItems]);
  return newItems;
};

export const updateItem = (id: string, updates: Partial<ReviewItem>): ReviewItem | null => {
  const items = getStorage<ReviewItem>(ITEMS_KEY);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  
  items[idx] = { ...items[idx], ...updates };
  setStorage(ITEMS_KEY, items);
  return items[idx];
};

// --- Spaced Repetition Logic ---
export const performReview = (itemId: string, success: boolean): ReviewItem | null => {
  const items = getStorage<ReviewItem>(ITEMS_KEY);
  const idx = items.findIndex(i => i.id === itemId);
  if (idx === -1) return null;

  const item = items[idx];
  let nextReviewAt = item.nextReviewAt;
  let status = item.status;
  let reviewCount = item.reviewCount;

  if (success) {
    // Ebbinghaus Algorithm
    const intervalDays = EBBINGHAUS_INTERVALS[Math.min(reviewCount, EBBINGHAUS_INTERVALS.length - 1)];
    nextReviewAt = Date.now() + (intervalDays * 24 * 60 * 60 * 1000);
    reviewCount++;
    
    if (reviewCount >= 3) status = 'mastered';
    else status = 'learning';
    
  } else {
    // Reset if failed
    reviewCount = 0;
    status = 'learning';
    nextReviewAt = Date.now(); 
  }

  items[idx] = {
    ...item,
    status,
    reviewCount,
    nextReviewAt,
    lastReviewedAt: Date.now()
  };
  
  setStorage(ITEMS_KEY, items);
  return items[idx];
};