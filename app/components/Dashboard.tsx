'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmokingData } from '../hooks/useSmokingData';
import Achievements from './Achievements';
import BreathingExercise from './BreathingExercise';
import CravingManager from './CravingManager';
import HealthTimeline from './HealthTimeline';
import ProgressCharts from './ProgressCharts';
import { 
  BoltIcon, 
  ChartBarIcon, 
  TrophyIcon, 
  HeartIcon,
  ClockIcon,
  BanknotesIcon,
  FireIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Settings from './Settings';

export default function Dashboard() {
  const { userData, cravingLogs, logCraving, calculateTimeMetrics, calculateDetailedMetrics, resetAllData } = useSmokingData();
  const [showCravingManager, setShowCravingManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [metrics, setMetrics] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    cigarettesAvoided: 0,
    moneySaved: 0,
    isFirstDay: false,
    exactDays: 0
  });
  const startTime = new Date(userData.startDate).getTime();
  const now = new Date().getTime();
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Calculate time elapsed in various units
  const seconds = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Update metrics every second
  useEffect(() => {
    const updateMetrics = () => {
      const timeMetrics = calculateTimeMetrics();
      const detailedMetrics = calculateDetailedMetrics();
      
      // Get precise time difference
      const now = new Date();
      const start = new Date(userData.startDate);
      const timeDiffMs = now.getTime() - start.getTime();
      
      // Calculate days with decimal precision for the first day
      const exactDays = timeDiffMs / (1000 * 60 * 60 * 24);
      const fullDays = Math.floor(exactDays);
      
      // If we're in the first 24 hours, show more granular time
      const isFirstDay = fullDays === 0;
      
      setMetrics({
        ...timeMetrics,
        ...detailedMetrics,
        isFirstDay,
        exactDays
      });
    };

    // Update more frequently in the first day
    const interval = setInterval(updateMetrics, metrics.isFirstDay ? 100 : 1000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [userData.startDate]);

  // Add useEffect for initial animation
  useEffect(() => {
    // Only show the nudge animation if user hasn't interacted with the button
    if (!hasInteracted) {
      const timer = setTimeout(() => {
        const element = document.getElementById('fab-button');
        if (element) {
          element.classList.add('animate-nudge');
        }
      }, 3000); // Start animation after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  // Calculate fill percentage for money saved
  const calculateFillPercentage = (amount: number) => {
    const hundredthMark = Math.ceil(amount / 100) * 100; // Next ₹100 mark
    const percentage = ((amount % 100) / 100) * 100; // Progress to next ₹100
    return {
      percentage,
      currentHundred: hundredthMark - 100,
      nextHundred: hundredthMark
    };
  };

  // Quick Stats Cards with real-time values
  const stats = [
    {
      title: "Smoke-Free Time",
      value: metrics.isFirstDay
        ? metrics.hours > 0
          ? `${metrics.hours}h ${metrics.minutes}m ${metrics.seconds}s`
          : metrics.minutes > 0
          ? `${metrics.minutes}m ${metrics.seconds}s`
          : `${metrics.seconds}s`
        : `${Math.floor(metrics.exactDays)}d ${metrics.hours}h ${metrics.minutes}m`,
      icon: ClockIcon,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Money Saved",
      value: metrics.isFirstDay
        ? `₹${metrics.moneySaved.toFixed(3)}`
        : `₹${metrics.moneySaved.toFixed(2)}`,
      icon: BanknotesIcon,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      fill: calculateFillPercentage(metrics.moneySaved)
    },
    {
      title: "Cigarettes Avoided",
      value: metrics.isFirstDay
        ? metrics.cigarettesAvoided.toFixed(2)
        : metrics.cigarettesAvoided.toFixed(1),
      icon: FireIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const handleReset = () => {
    // Use the resetAllData function from the hook
    resetAllData();
    // Close the settings modal
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Section - More Compact */}
        <section className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success"
          >
            <span className="text-sm font-medium">
              {metrics.days === 0 ? "Your Journey Begins Today!" : "You're Doing Great!"}
            </span>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            {metrics.days === 0 ? "Start Your Freedom" : `${metrics.days} Days of Freedom`}
          </h1>
        </section>

        {/* Quick Stats - Now in a card for better grouping */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card hover:shadow-lg transition-shadow relative overflow-hidden
                          ${stat.title === "Money Saved" ? 'money-card' : ''}
                          ${stat.title === "Cigarettes Avoided" ? 'cigarette-card' : ''}
                          ${stat.title === "Smoke-Free Time" ? 'time-card' : ''}`}
              >
                {/* Time card animation */}
                {stat.title === "Smoke-Free Time" && (
                  <>
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      />
                      {/* Floating clock symbols */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-primary/20 text-xl"
                          initial={{ 
                            x: `${25 * i + 20}%`,
                            y: "120%",
                            scale: 1
                          }}
                          animate={{ 
                            y: "-20%",
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.7, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 1,
                            ease: "easeOut"
                          }}
                        >
                          ⏱️
                        </motion.div>
                      ))}
                    </div>
                    {/* Pulsing border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-primary/20"
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                )}

                {/* Background fill animation for money saved */}
                {stat.title === "Money Saved" && stat.fill && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-green-100/30 to-transparent 
                               dark:from-green-900/30 dark:to-transparent"
                      initial={{ y: "100%" }}
                      animate={{ y: `${100 - stat.fill.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-full">
                      <div className="h-full w-full flex flex-col justify-between py-2 px-3">
                        <div className="text-xs font-medium text-green-600/40 dark:text-green-400/40">
                          Next: ₹{stat.fill.nextHundred}
                        </div>
                        <motion.div 
                          className="text-xs font-medium text-green-600/40 dark:text-green-400/40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          Last: ₹{stat.fill.currentHundred}
                        </motion.div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Cigarettes avoided animation */}
                {stat.title === "Cigarettes Avoided" && (
                  <>
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-orange-100/30 to-transparent 
                                 dark:from-orange-900/30 dark:to-transparent"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      />
                      {/* Floating cigarette cross-out symbols */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-orange-600/20 dark:text-orange-400/20 text-2xl font-bold"
                          initial={{ 
                            x: `${30 * i}%`,
                            y: "120%",
                            rotate: 0,
                            opacity: 0.3
                          }}
                          animate={{ 
                            y: "-20%",
                            rotate: 360,
                            opacity: 0
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeOut"
                          }}
                        >
                          ⊘
                        </motion.div>
                      ))}
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <motion.div
                        className="text-xs text-orange-600/40 dark:text-orange-400/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {Math.floor(metrics.cigarettesAvoided)} avoided
                      </motion.div>
                    </div>
                  </>
                )}
                
                {/* Card content */}
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                      {stat.value}
                    </p>
                    {stat.title === "Money Saved" && stat.fill && (
                      <p className="text-xs text-green-600/60 dark:text-green-400/60 mt-1">
                        {stat.fill.percentage.toFixed(0)}% to next ₹100
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content in Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Progress & Achievements (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <ProgressCharts
              cravingLogs={cravingLogs || []}
              daysSince={metrics.days}
            />
            <Achievements
              daysSince={metrics.days}
              cigarettesAvoided={metrics.cigarettesAvoided}
              cravingsManaged={userData.cravingManaged || 0}
            />
          </div>

          {/* Right Column - Health & Support (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Actions Card */}
            <div className="card space-y-3">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowCravingManager(true)}
                  className="btn-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <BoltIcon className="w-5 h-5" />
                  <span>Need Help</span>
                </button>
                <button
                  onClick={() => setShowBreathingExercise(true)}
                  className="btn-secondary py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span>Breathe</span>
                </button>
              </div>
            </div>

            <BreathingExercise />
            <HealthTimeline 
              startDate={userData.startDate} 
              cravingLogs={cravingLogs} 
            />
          </div>
        </div>
      </main>

      {/* Floating Action Button - Now single button with menu */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Quick Actions Menu */}
          <AnimatePresence>
            {showFabMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-16 right-0 mb-2 space-y-2"
              >
                <button
                  onClick={() => {
                    setShowCravingManager(true);
                    setShowFabMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
                           bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <BoltIcon className="w-5 h-5" />
                  <span>I Need Help Now</span>
                </button>

                <button
                  onClick={() => {
                    setShowBreathingExercise(true);
                    setShowFabMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
                           bg-success text-white hover:bg-success/90 transition-colors"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span>Breathing Exercise</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowFabMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
                           bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <button
            id="fab-button"
            onClick={() => {
              setShowFabMenu(!showFabMenu);
              setHasInteracted(true);
              const element = document.getElementById('fab-button');
              if (element) {
                element.classList.remove('animate-nudge');
              }
            }}
            className="btn-primary w-12 h-12 rounded-full flex items-center justify-center
                     shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: showFabMenu ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Craving Manager Modal */}
      <AnimatePresence>
        {showCravingManager && (
          <CravingManager
            onClose={() => setShowCravingManager(false)}
            onCravingLogged={logCraving}
            triggers={userData.triggers || []}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBreathingExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowBreathingExercise(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-lg"
            >
              <BreathingExercise onClose={() => setShowBreathingExercise(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <Settings
            onClose={() => setShowSettings(false)}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 