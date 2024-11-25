'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserData } from '../types';
import { HeartIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/outline';

type OnboardingProps = {
  onComplete: (data: UserData) => void;
};

const COMMON_TRIGGERS = [
  'Stress', 'After meals', 'Social situations', 'Morning coffee',
  'Work breaks', 'Driving', 'Alcohol', 'Boredom'
];

const COMMON_MOTIVATIONS = [
  'Health improvement', 'Family', 'Financial savings',
  'Better breathing', 'More energy', 'Freedom from addiction',
  'Setting an example', 'Quality of life'
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserData>>({
    cigarettesPerDay: 0,
    costPerPack: 0,
    cigarettesPerPack: 20,
    currency: 'INR',
    name: '',
    goals: [],
    triggers: [],
    motivations: [],
    cravingCount: 0,
    cravingManaged: 0,
    lastCraving: null,
    streakCount: 0,
    longestStreak: 0,
  });

  const handleComplete = () => {
    // Add current timestamp as startDate
    const completeData: UserData = {
      ...formData as UserData,
      startDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    onComplete(completeData);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.name.trim().length > 0;
      case 2:
        return formData.cigarettesPerDay > 0 && 
               formData.costPerPack > 0 && 
               formData.cigarettesPerPack > 0;
      case 3:
        return formData.triggers && formData.triggers.length > 0;
      case 4:
        return formData.motivations && formData.motivations.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep(step + 1);
    } else if (step === 5) {
      handleComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Welcome to Your Quit Journey</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Let's start with your name
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Your Current Habits</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                This helps us track your progress
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  How many cigarettes do you smoke daily?
                </label>
                <input
                  type="number"
                  value={formData.cigarettesPerDay}
                  onChange={(e) => setFormData({...formData, cigarettesPerDay: Number(e.target.value)})}
                  className="input-field"
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Cost per pack (₹)
                </label>
                <input
                  type="number"
                  value={formData.costPerPack}
                  onChange={(e) => setFormData({...formData, costPerPack: Number(e.target.value)})}
                  className="input-field"
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Cigarettes per pack
                </label>
                <input
                  type="number"
                  value={formData.cigarettesPerPack}
                  onChange={(e) => setFormData({...formData, cigarettesPerPack: Number(e.target.value)})}
                  className="input-field"
                  required
                  min="1"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">What Triggers You?</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Select situations that make you want to smoke
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_TRIGGERS.map((trigger) => (
                <button
                  key={trigger}
                  type="button"
                  onClick={() => {
                    const newTriggers = formData.triggers.includes(trigger)
                      ? formData.triggers.filter(t => t !== trigger)
                      : [...formData.triggers, trigger];
                    setFormData({...formData, triggers: newTriggers});
                  }}
                  className={`p-3 rounded-xl text-left transition-all ${
                    formData.triggers.includes(trigger)
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Your Motivations</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Why do you want to quit? Select all that apply
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_MOTIVATIONS.map((motivation) => (
                <button
                  key={motivation}
                  type="button"
                  onClick={() => {
                    const newMotivations = formData.motivations.includes(motivation)
                      ? formData.motivations.filter(m => m !== motivation)
                      : [...formData.motivations, motivation];
                    setFormData({...formData, motivations: newMotivations});
                  }}
                  className={`p-3 rounded-xl text-left transition-all ${
                    formData.motivations.includes(motivation)
                      ? 'bg-success text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {motivation}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Ready to Begin</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Your quit journey starts the moment you click the button below
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleComplete}
                className="btn-primary"
              >
                Start My Quit Journey
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-8 my-4">
        <div className="bg-white/50 dark:bg-neutral-900/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-1/5 h-1 rounded-full mx-1 transition-colors ${
                    stepNumber <= step ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-neutral-500">
              Step {step} of 5
            </p>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            {renderStep()}
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className={`btn-secondary py-3 text-lg w-full ${
                  step === 1 ? 'invisible' : ''
                }`}
              >
                Back
              </button>
              <button
                type="submit"
                className={`btn-primary py-3 text-lg w-full ${
                  !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!canProceed()}
              >
                {step === 5 ? 'Start Your Journey' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 