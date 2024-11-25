'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  onClose: () => void;
  onReset: () => void;
};

export default function Settings({ onClose, onReset }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    // Clear all local storage data
    localStorage.removeItem('smokingData');
    localStorage.removeItem('cravingLogs');
    localStorage.removeItem('achievements');
    
    // Call the onReset prop to update parent state
    onReset();
    
    // Close the modal
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
            Reset Progress
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure? This will delete all your progress data and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 