'use client';

import { useState, useEffect } from 'react';
import { UserData, CravingLog, Achievement } from '../types';

const DEFAULT_USER_DATA: UserData = {
  startDate: new Date().toISOString(),
  cigarettesPerDay: 0,
  costPerPack: 0,
  cigarettesPerPack: 20,
  currency: 'INR',
  cravingCount: 0,
  cravingManaged: 0,
  lastCraving: null,
  goals: [],
  triggers: [],
  name: '',
  motivations: [],
  lastLogin: new Date().toISOString(),
  streakCount: 0,
  longestStreak: 0,
};

const STORAGE_KEYS = {
  USER_DATA: 'smokingData',
  CRAVING_LOGS: 'cravingLogs',
  ACHIEVEMENTS: 'achievements',
};

export const useSmokingData = () => {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cravingLogs, setCravingLogs] = useState<CravingLog[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const storedLogs = localStorage.getItem(STORAGE_KEYS.CRAVING_LOGS);
      const storedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setIsInitialized(true);
        updateLoginStreak(parsedUser);
      }
      
      if (storedLogs) {
        setCravingLogs(JSON.parse(storedLogs));
      }
      
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }
    };

    loadData();
  }, []);

  // Update login streak
  const updateLoginStreak = (currentData: UserData) => {
    const lastLogin = new Date(currentData.lastLogin);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    const updatedData = {
      ...currentData,
      lastLogin: today.toISOString(),
    };

    if (diffDays === 1) {
      // Consecutive day login
      updatedData.streakCount += 1;
      updatedData.longestStreak = Math.max(updatedData.streakCount, updatedData.longestStreak);
    } else if (diffDays > 1) {
      // Streak broken
      updatedData.streakCount = 0;
    }

    saveUserData(updatedData);
  };

  // Save user data
  const saveUserData = (data: UserData) => {
    // If it's today's date and there's no existing data, use current time
    const existingData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (!existingData) {
      const startDate = new Date(data.startDate);
      const today = new Date();
      
      if (startDate.toDateString() === today.toDateString()) {
        data.startDate = today.toISOString(); // Use exact current time for new users
      } else {
        // For past dates, use midnight of that day
        startDate.setHours(0, 0, 0, 0);
        data.startDate = startDate.toISOString();
      }
    } else {
      // If data exists, preserve the original start time
      const existingUserData = JSON.parse(existingData);
      data.startDate = existingUserData.startDate;
    }

    setUserData(data);
    setIsInitialized(true);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
    checkAchievements(data);
  };

  // Log a craving
  const logCraving = (log: CravingLog) => {
    const newLogs = [...cravingLogs, log];
    setCravingLogs(newLogs);
    localStorage.setItem(STORAGE_KEYS.CRAVING_LOGS, JSON.stringify(newLogs));
    
    // Update user data with craving information
    const updatedData = {
      ...userData,
      cravingCount: userData.cravingCount + 1,
      cravingManaged: log.managed ? userData.cravingManaged + 1 : userData.cravingManaged,
      lastCraving: log.timestamp
    };
    
    saveUserData(updatedData);
  };

  // Calculate savings
  const calculateSavings = () => {
    if (!userData.startDate) return 0;
    
    const now = new Date();
    const startDate = new Date(userData.startDate);
    const timeDiff = now.getTime() - startDate.getTime();
    
    // For the first day, calculate hourly savings
    if (timeDiff < 24 * 60 * 60 * 1000) {
      const hoursElapsed = Math.max(0, timeDiff / (1000 * 60 * 60));
      const cigarettesPerHour = userData.cigarettesPerDay / 24;
      const cigarettesNotSmoked = cigarettesPerHour * hoursElapsed;
      return (cigarettesNotSmoked / userData.cigarettesPerPack) * userData.costPerPack;
    }
    
    // For subsequent days
    const days = Math.max(0, timeDiff / (1000 * 60 * 60 * 24));
    const cigarettesNotSmoked = days * userData.cigarettesPerDay;
    const packsNotBought = cigarettesNotSmoked / userData.cigarettesPerPack;
    return packsNotBought * userData.costPerPack;
  };

  // Check and update achievements
  const checkAchievements = (data: UserData) => {
    const newAchievements: Achievement[] = [];
    const daysSince = Math.floor(
      (Date.now() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Example achievement checks
    if (daysSince >= 1 && !achievements.find(a => a.id === '24hours')) {
      newAchievements.push({
        id: '24hours',
        title: '24 Hours Free',
        description: 'Complete your first day smoke-free',
        unlockedAt: new Date().toISOString(),
        type: 'milestone'
      });
    }

    if (data.streakCount >= 7 && !achievements.find(a => a.id === 'week_streak')) {
      newAchievements.push({
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        unlockedAt: new Date().toISOString(),
        type: 'streak'
      });
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updatedAchievements));
    }
  };

  const resetAllData = () => {
    // Clear local storage
    localStorage.removeItem('smokingData');
    localStorage.removeItem('cravingLogs');
    localStorage.removeItem('achievements');
    
    // Reset all state
    setUserData(DEFAULT_USER_DATA);
    setCravingLogs([]);
    setAchievements([]);
    
    // Important: Reset the initialization flag
    setIsInitialized(false);
  };

  const calculateTimeMetrics = () => {
    if (!userData.startDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const now = new Date();
    const startDate = new Date(userData.startDate);
    const timeDiffMs = now.getTime() - startDate.getTime();
    
    // Calculate all units from milliseconds
    const totalSeconds = Math.floor(timeDiffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    
    return { 
      days, 
      hours, 
      minutes, 
      seconds,
      totalSeconds,
      totalMinutes,
      totalHours
    };
  };

  const calculateDetailedMetrics = () => {
    if (!userData.startDate) return { cigarettesAvoided: 0, moneySaved: 0 };
    
    const now = new Date();
    const startDate = new Date(userData.startDate);
    const timeDiffHours = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    // Calculate expected cigarettes based on initial daily rate
    const cigarettesPerHour = userData.cigarettesPerDay / 24;
    const expectedCigarettes = cigarettesPerHour * timeDiffHours;
    
    // Calculate actual cigarettes smoked during cravings
    const cigarettesSmoked = cravingLogs.reduce((total, log) => 
      total + (log.gaveIn ? log.cigarettesSmoked : 0), 0);
    
    // Calculate actual cigarettes avoided
    const cigarettesAvoided = expectedCigarettes - cigarettesSmoked;
    
    // Calculate money saved based on avoided cigarettes
    const costPerCigarette = userData.costPerPack / userData.cigarettesPerPack;
    const moneySaved = cigarettesAvoided * costPerCigarette;
    
    return { 
      cigarettesAvoided, 
      moneySaved,
      cigarettesSmoked,
      expectedCigarettes,
      timeDiffHours 
    };
  };

  const calculateTimeSince = () => {
    if (!userData.startDate) return 0;
    const now = new Date();
    const startDate = new Date(userData.startDate);
    return (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24); // returns days
  };

  const calculateSuccessRate = () => {
    if (cravingLogs.length === 0) return 0;
    
    const managedCravings = cravingLogs.filter(log => !log.gaveIn).length;
    return (managedCravings / cravingLogs.length) * 100;
  };

  const getStrongestDay = () => {
    if (cravingLogs.length === 0) return { day: 0, count: 0 };

    const dayMap = new Map<string, { managed: number, total: number }>();
    
    cravingLogs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      const current = dayMap.get(date) || { managed: 0, total: 0 };
      current.total += 1;
      if (!log.gaveIn) current.managed += 1;
      dayMap.set(date, current);
    });

    let maxDay = '';
    let maxManaged = 0;
    
    for (const [date, stats] of dayMap.entries()) {
      if (stats.managed > maxManaged) {
        maxManaged = stats.managed;
        maxDay = date;
      }
    }

    const daysDiff = maxDay ? 
      Math.floor((new Date().getTime() - new Date(maxDay).getTime()) / (1000 * 60 * 60 * 24)) + 1 
      : 0;

    return { day: daysDiff, count: maxManaged };
  };

  return {
    userData,
    isInitialized,
    cravingLogs,
    achievements,
    saveUserData,
    logCraving,
    calculateSavings,
    resetAllData,
    calculateTimeMetrics,
    calculateDetailedMetrics,
    calculateTimeSince,
    calculateSuccessRate,
    getStrongestDay,
  };
}; 