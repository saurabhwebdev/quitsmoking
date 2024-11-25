'use client';

import { motion } from 'framer-motion';
import { TrophyIcon, SparklesIcon, HeartIcon, FireIcon } from '@heroicons/react/24/outline';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  target: number;
  unlocked: boolean;
};

type Props = {
  daysSince: number;
  cigarettesAvoided: number;
  cravingsManaged: number;
};

export default function Achievements({ daysSince, cigarettesAvoided, cravingsManaged }: Props) {
  const achievements: Achievement[] = [
    {
      id: '24hours',
      title: '24 Hours Free',
      description: 'Complete your first day smoke-free',
      icon: <TrophyIcon className="w-6 h-6" />,
      progress: daysSince,
      target: 1,
      unlocked: daysSince >= 1
    },
    {
      id: 'week',
      title: 'One Week Warrior',
      description: '7 days of freedom',
      icon: <FireIcon className="w-6 h-6" />,
      progress: daysSince,
      target: 7,
      unlocked: daysSince >= 7
    },
    {
      id: 'craving_master',
      title: 'Craving Master',
      description: 'Successfully manage 10 cravings',
      icon: <SparklesIcon className="w-6 h-6" />,
      progress: cravingsManaged,
      target: 10,
      unlocked: cravingsManaged >= 10
    },
    {
      id: 'hundred_cigs',
      title: 'Century Saver',
      description: 'Avoid 100 cigarettes',
      icon: <HeartIcon className="w-6 h-6" />,
      progress: cigarettesAvoided,
      target: 100,
      unlocked: cigarettesAvoided >= 100
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text text-center">Your Achievements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className={`achievement-card ${
              achievement.unlocked 
                ? 'border-success/30 bg-success/5' 
                : 'border-neutral-200 dark:border-neutral-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                achievement.unlocked 
                  ? 'bg-success/20 text-success' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`}>
                {achievement.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium mb-1">{achievement.title}</h3>
                <p className="text-sm text-neutral-500 mb-3">{achievement.description}</p>
                
                <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute h-full rounded-full ${
                      achievement.unlocked ? 'bg-success' : 'bg-primary'
                    }`}
                  />
                </div>
                
                <p className="text-xs text-neutral-500 mt-2">
                  {achievement.progress} / {achievement.target}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 