
import { User, System, ReviewItem, ReviewStatus } from '../types';
import { EBBINGHAUS_INTERVALS } from '../constants';

// Keys
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

// --- Auth ---
export const register = async (email: string, password: string): Promise<User> => {
  const users = getStorage<User & { password: string }>(USERS_KEY);
  if (users.find(u => u.email === email)) throw new Error('User already exists');
  
  const newUser: User & { password: string } = { 
      id: crypto.randomUUID(), 
      email, 
      name: email.split('@')[0], 
      password, // In real app, hash this
      address: '',
      gender: 'secret',
      birthDate: ''
  };
  users.push(newUser);
  setStorage(USERS_KEY, users);
  
  // Create default systems
  const systems = getStorage<System>(SYSTEMS_KEY);
  systems.push(
    { id: crypto.randomUUID(), userId: newUser.id, type: 'vocab', name: '单词纠错', theme: 'amber', icon: 'book' },
    { id: crypto.randomUUID(), userId: newUser.id, type: 'algo', name: '算法错题', theme: 'sky', icon: 'code' }
  );
  setStorage(SYSTEMS_KEY, systems);

  return newUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  const users = getStorage<User & { password: string }>(USERS_KEY);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  
  // Ensure default fields exist for older data
  if (!user.name) user.name = 'Asig'; 
  
  return user;
};

// Update User Profile
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    const users = getStorage<User & { password: string }>(USERS_KEY);
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) throw new Error('User not found');
    
    // Merge updates
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    
    setStorage(USERS_KEY, users);
    return updatedUser;
};

// --- Systems ---
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

// --- Items ---
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