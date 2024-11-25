'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';

const BREATHING_PHASES = {
  inhale: { 
    duration: 4, 
    instruction: "Breathe In",
    subText: "Slowly fill your lungs with air",
    color: "from-blue-400/20 via-cyan-300/20 to-teal-300/20", 
    scale: 2.2,
    opacity: 0.8,
    ringScale: 1.5
  },
  hold: { 
    duration: 7, 
    instruction: "Hold",
    subText: "Keep your breath steady",
    color: "from-teal-300/20 via-cyan-300/20 to-blue-400/20", 
    scale: 2.2,
    opacity: 1,
    ringScale: 1.5
  },
  exhale: { 
    duration: 8, 
    instruction: "Breathe Out",
    subText: "Let go of all tension",
    color: "from-blue-400/20 via-teal-300/20 to-cyan-300/20", 
    scale: 1,
    opacity: 0.3,
    ringScale: 1
  }
};

export default function BreathingExercise({ onClose }: { onClose?: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(BREATHING_PHASES[phase].duration);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev === 0) {
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              return BREATHING_PHASES.hold.duration;
            case 'hold':
              setPhase('exhale');
              return BREATHING_PHASES.exhale.duration;
            case 'exhale':
              setPhase('inhale');
              setCycles(c => c + 1);
              return BREATHING_PHASES.inhale.duration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  return (
    <div className="card bg-neutral-900/95 text-white overflow-hidden">
      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Breathing Exercise</h3>
            <p className="text-sm text-white/60">Find your inner peace</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-white/70" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center min-h-[450px] relative">
          {!isActive ? (
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-32 h-32 rounded-full bg-primary/5"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                <motion.button
                  onClick={() => setIsActive(true)}
                  className="relative z-10 w-32 h-32 rounded-full bg-primary/10 hover:bg-primary/20
                           flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayIcon className="w-12 h-12 text-primary" />
                </motion.button>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-medium">Ready to begin?</p>
                <p className="text-sm text-white/60">Follow the breathing rhythm</p>
              </div>
            </div>
          ) : (
            <>
              {/* Animated Background */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <motion.div
                  className={`absolute w-96 h-96 rounded-full bg-gradient-to-br ${BREATHING_PHASES[phase].color}`}
                  animate={{
                    scale: BREATHING_PHASES[phase].scale,
                    opacity: BREATHING_PHASES[phase].opacity
                  }}
                  transition={{
                    duration: BREATHING_PHASES[phase].duration,
                    ease: "easeInOut"
                  }}
                />
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-96 h-96 rounded-full bg-gradient-to-br ${BREATHING_PHASES[phase].color}`}
                    animate={{
                      scale: [1, BREATHING_PHASES[phase].ringScale],
                      opacity: [0.2, 0]
                    }}
                    transition={{
                      duration: BREATHING_PHASES[phase].duration / 2,
                      delay: i * (BREATHING_PHASES[phase].duration / 6),
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* Timer and Instructions */}
              <div className="relative z-10 flex flex-col items-center space-y-8">
                <div className="relative">
                  <svg className="w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="76"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-white/10"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="76"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-white"
                      strokeDasharray={477}
                      strokeDashoffset={477 * (counter / BREATHING_PHASES[phase].duration)}
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{counter}</span>
                    <span className="text-sm text-white/60">seconds</span>
                  </div>
                </div>

                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center space-y-2"
                >
                  <h3 className="text-2xl font-medium text-white">
                    {BREATHING_PHASES[phase].instruction}
                  </h3>
                  <p className="text-sm text-white/60">
                    {BREATHING_PHASES[phase].subText}
                  </p>
                  <p className="text-sm text-white/40">
                    Cycle {cycles + 1}
                  </p>
                </motion.div>
              </div>
            </>
          )}
        </div>

        {cycles > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 left-0 right-0 text-center"
          >
            <p className="text-sm text-success flex items-center justify-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              <span>{cycles} breathing cycles completed</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 