import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MetaMaskWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check for MetaMask conflicts
    const checkMetaMaskConflict = () => {
      try {
        // If there are multiple providers, this might cause issues
        if (typeof window !== 'undefined' && window.ethereum) {
          const providers = (window.ethereum as any).providers;
          if (providers && providers.length > 1) {
            setShowWarning(true);
          }
        }
      } catch (error) {
        // Silent fail
      }
    };

    checkMetaMaskConflict();
  }, []);

  if (!showWarning) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 left-4 md:left-auto md:max-w-md z-50"
      >
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                Multiple Wallet Detected
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You have multiple wallet extensions installed. This may cause connection issues. 
                Try disabling other wallet extensions if you encounter problems.
              </p>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

