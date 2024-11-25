'use client';

import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon, SparklesIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { CravingLog } from '../types';

type Props = {
  startDate: string;
  cravingLogs: CravingLog[];
};

const HEALTH_MILESTONES = [
  {
    time: '20 minutes',
    benefit: 'Heart rate normalizes',
    description: 'Your heart rate and blood pressure begin to drop.',
    timeInMinutes: 20,
    action: 'Try deep breathing exercises to help your body relax'
  },
  {
    time: '2 hours',
    benefit: 'Blood nicotine drops',
    description: 'Nicotine levels in your bloodstream drop significantly.',
    timeInMinutes: 120,
    action: 'Stay hydrated to help flush out toxins'
  },
  {
    time: '8 hours',
    benefit: 'Carbon monoxide drops',
    description: 'Carbon monoxide levels in your blood drop by half.',
    timeInMinutes: 8 * 60,
    action: 'Take a walk outside to get fresh oxygen'
  },
  {
    time: '12 hours',
    benefit: 'Oxygen levels improve',
    description: 'Your blood oxygen levels return to normal.',
    timeInMinutes: 12 * 60,
    action: 'Notice how your breathing feels easier'
  },
  {
    time: '24 hours',
    benefit: 'Heart attack risk begins dropping',
    description: 'Your risk of heart attack has already started to drop.',
    timeInMinutes: 24 * 60,
    action: 'Monitor your heart rate to see the improvement'
  },
  {
    time: '48 hours',
    benefit: 'Nerve endings regenerate',
    description: 'Your sense of taste and smell begin to improve.',
    timeInMinutes: 48 * 60,
    action: 'Try tasting different foods to notice the difference'
  },
  {
    time: '72 hours',
    benefit: 'Breathing gets easier',
    description: 'Your bronchial tubes begin to relax.',
    timeInMinutes: 72 * 60,
    action: 'Practice deep breathing exercises'
  },
  {
    time: '5 days',
    benefit: 'Most nicotine expelled',
    description: 'Most nicotine is out of your body.',
    timeInMinutes: 5 * 24 * 60,
    action: 'Celebrate this milestone with a healthy reward'
  },
  {
    time: '1 week',
    benefit: 'Taste buds recover',
    description: 'Your sense of taste has significantly improved.',
    timeInMinutes: 7 * 24 * 60,
    action: 'Try foods you used to enjoy before smoking'
  },
  {
    time: '2 weeks',
    benefit: 'Circulation improves',
    description: 'Blood circulation improves throughout your body.',
    timeInMinutes: 14 * 24 * 60,
    action: 'Notice improved energy during physical activities'
  },
  {
    time: '1 month',
    benefit: 'Lung function increases',
    description: 'Your lung function has significantly improved.',
    timeInMinutes: 30 * 24 * 60,
    action: 'Try some moderate exercise to test your lungs'
  },
  {
    time: '2 months',
    benefit: 'Insulin levels normalize',
    description: 'Your risk of diabetes starts to decrease.',
    timeInMinutes: 60 * 24 * 60,
    action: 'Get your blood sugar checked'
  },
  {
    time: '3 months',
    benefit: 'Heart health improves',
    description: 'Your circulation and heart function have improved significantly.',
    timeInMinutes: 90 * 24 * 60,
    action: 'Consider starting a regular exercise routine'
  },
  {
    time: '6 months',
    benefit: 'Stress levels reduce',
    description: "You're handling stress better without smoking.",
    timeInMinutes: 180 * 24 * 60,
    action: 'Practice stress management techniques'
  },
  {
    time: '9 months',
    benefit: 'Lungs heal significantly',
    description: 'Your lungs have healed themselves significantly.',
    timeInMinutes: 270 * 24 * 60,
    action: 'Try cardiovascular exercises to test your progress'
  },
  {
    time: '1 year',
    benefit: 'Heart disease risk halves',
    description: 'Your risk of heart disease is now half that of a smoker.',
    timeInMinutes: 365 * 24 * 60,
    action: 'Get a health checkup to celebrate your progress'
  },
  {
    time: '2 years',
    benefit: 'Stroke risk reduces',
    description: 'Your risk of stroke is now similar to that of a non-smoker.',
    timeInMinutes: 2 * 365 * 24 * 60,
    action: 'Share your success story with others'
  },
  {
    time: '5 years',
    benefit: 'Cancer risk drops',
    description: 'Your risk of mouth, throat, and bladder cancer has halved.',
    timeInMinutes: 5 * 365 * 24 * 60,
    action: 'Get regular health screenings'
  },
  {
    time: '10 years',
    benefit: 'Lung cancer risk halves',
    description: 'Your risk of lung cancer is now half that of a smoker.',
    timeInMinutes: 10 * 365 * 24 * 60,
    action: 'Celebrate your decade of being smoke-free'
  },
  {
    time: '15 years',
    benefit: 'Health fully recovers',
    description: 'Your risk of heart disease is now the same as a non-smoker.',
    timeInMinutes: 15 * 365 * 24 * 60,
    action: "You're a true inspiration to others!"
  }
];

export default function HealthTimeline({ startDate, cravingLogs }: Props) {
  const [currentProgress, setCurrentProgress] = useState<{
    completed: typeof HEALTH_MILESTONES;
    next: (typeof HEALTH_MILESTONES)[0] | null;
    setbackMinutes: number;
  }>({ 
    completed: [], 
    next: null,
    setbackMinutes: 0
  });

  const calculateSetback = () => {
    const cigarettesSmoked = cravingLogs.reduce((total, log) => 
      total + (log.gaveIn ? log.cigarettesSmoked : 0), 0);
    
    return cigarettesSmoked * 30;
  };

  const calculateProgress = (timeInMinutes: number) => {
    const now = new Date();
    const start = new Date(startDate);
    const elapsedMinutes = (now.getTime() - start.getTime()) / (1000 * 60);
    
    const adjustedElapsedMinutes = Math.max(0, elapsedMinutes - currentProgress.setbackMinutes);
    
    return Math.min(100, (adjustedElapsedMinutes / timeInMinutes) * 100);
  };

  const getRelevantMilestones = () => {
    const setbackMinutes = calculateSetback();
    const completed: typeof HEALTH_MILESTONES = [];
    let nextMilestone = null;
    
    for (const milestone of HEALTH_MILESTONES) {
      const progress = calculateProgress(milestone.timeInMinutes);
      if (progress >= 100) {
        completed.push(milestone);
      } else if (!nextMilestone) {
        nextMilestone = milestone;
        break;
      }
    }
    
    return {
      completed,
      next: nextMilestone,
      setbackMinutes
    };
  };

  useEffect(() => {
    const updateProgress = () => {
      setCurrentProgress(getRelevantMilestones());
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [startDate, cravingLogs]);

  const { completed, next, setbackMinutes } = currentProgress;

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Health Recovery Timeline</h2>
        <motion.span 
          key={completed.length}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          className="text-sm text-success"
        >
          {completed.length} milestones achieved
        </motion.span>
      </div>

      {setbackMinutes > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning/10 border border-warning/20 rounded-lg p-3 flex items-start gap-2"
        >
          <ExclamationCircleIcon className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-warning font-medium">Recovery Setback</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Recent smoking has delayed your recovery by {Math.round(setbackMinutes / 60)} hours and {setbackMinutes % 60} minutes.
              Stay strong and keep going!
            </p>
          </div>
        </motion.div>
      )}

      {next && (
        <motion.div
          key={next.time}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-primary/5 rounded-xl p-4 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="p-2 rounded-full bg-primary/20">
                <SparklesIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-lg text-primary">{next.benefit}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {next.description}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress(next.timeInMinutes)}%` }}
                    className="h-full bg-primary transition-all duration-1000"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-primary">
                    {Math.round(calculateProgress(next.timeInMinutes))}% complete
                  </span>
                  <span className="text-neutral-500">
                    {setbackMinutes > 0 ? `${next.time} (delayed)` : next.time}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">
                  Suggested Action:
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {next.action}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {completed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-500">Completed Milestones</h3>
          <div className="space-y-2">
            {completed.map((milestone) => (
              <motion.div
                key={milestone.time}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-success/5"
              >
                <CheckCircleIcon className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">{milestone.benefit}</span>
                <span className="text-xs text-neutral-500 ml-auto">{milestone.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 