'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import type { CravingLog } from '../types';

type Props = {
  onClose: () => void;
  onCravingLogged: (log: CravingLog) => void;
  triggers: string[];
};

export default function CravingManager({ onClose, onCravingLogged, triggers }: Props) {
  const [intensity, setIntensity] = useState<1 | 2 | 3>(2);
  const [selectedTrigger, setSelectedTrigger] = useState<string>('');
  const [gaveIn, setGaveIn] = useState<boolean | null>(null);
  const [cigarettesSmoked, setCigarettesSmoked] = useState<number>(0);
  const [step, setStep] = useState<1 | 2>(1);

  const handleSubmit = () => {
    if (!selectedTrigger || gaveIn === null) return;

    const log: CravingLog = {
      timestamp: new Date().toISOString(),
      trigger: selectedTrigger,
      intensity,
      managed: !gaveIn,
      copingStrategy: gaveIn ? 'Gave in to craving' : 'Resisted craving',
      duration: 0,
      gaveIn,
      cigarettesSmoked: gaveIn ? cigarettesSmoked : 0
    };

    onCravingLogged(log);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-md bg-neutral-900/95 rounded-2xl p-6 shadow-xl border border-white/10"
      >
        {step === 1 ? (
          <>
            {/* Step 1: Initial Craving Log */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">What triggered this craving?</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-neutral-400" />
              </button>
            </div>

            {/* Intensity Selection */}
            <div className="mb-6">
              <p className="text-neutral-300 mb-3">How strong is the urge?</p>
              <div className="flex gap-2">
                {[
                  { value: 1, label: 'Mild' },
                  { value: 2, label: 'Moderate' },
                  { value: 3, label: 'Strong' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setIntensity(option.value as 1 | 2 | 3)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all
                      ${intensity === option.value
                        ? 'bg-primary text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Selection */}
            <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
              {triggers.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => setSelectedTrigger(trigger)}
                  className={`w-full p-4 text-left rounded-xl transition-all
                    ${selectedTrigger === trigger
                      ? 'bg-primary text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                >
                  {trigger}
                </button>
              ))}
            </div>

            {/* Next Step Button */}
            <div className="mt-6">
              <button
                onClick={() => selectedTrigger && setStep(2)}
                disabled={!selectedTrigger}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all
                  ${selectedTrigger
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Outcome Log */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Did you give in to the craving?</h2>
              <button
                onClick={() => setStep(1)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-neutral-400" />
              </button>
            </div>

            {/* Gave In Selection */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setGaveIn(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all
                    ${gaveIn === false
                      ? 'bg-success text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                >
                  No, I Resisted
                </button>
                <button
                  onClick={() => setGaveIn(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all
                    ${gaveIn === true
                      ? 'bg-warning text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                >
                  Yes, I Gave In
                </button>
              </div>

              {/* Cigarettes Smoked Input (if gave in) */}
              {gaveIn && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-sm text-neutral-300">
                    How many cigarettes did you smoke?
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cigarettesSmoked}
                    onChange={(e) => setCigarettesSmoked(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg
                             text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={gaveIn === null || (gaveIn && cigarettesSmoked === 0)}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all
                ${gaveIn !== null && (!gaveIn || cigarettesSmoked > 0)
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
            >
              Log Craving
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
} 