import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useBalance } from 'wagmi';
import { Rocket, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CONTRACT_ADDRESS, EARTH_CLICK_ABI, SUBMIT_FEE } from '../config/constants';
import { formatEther } from 'viem';
import { Earth } from './Earth';

export const ClickGame: React.FC = memo(() => {
  const { address } = useAccount();
  const [clickCount, setClickCount] = useState(0);
  const [pendingPoints, setPendingPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { writeContract } = useWriteContract();
  const { data: hash } = useWriteContract();
  const { data: ethBalance } = useBalance({ address });
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Get user info
  const { data: userData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EARTH_CLICK_ABI,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30000, // Refetch every 30s instead of on focus
      staleTime: 15000,
    },
  });

  const [isClicking, setIsClicking] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    setClickCount((prev) => prev + 1);
    setPendingPoints((prev) => prev + 1);
    
    // Click animation feedback
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    setIsClicking(true);
    clickTimeoutRef.current = setTimeout(() => setIsClicking(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (pendingPoints === 0) {
      toast.error('No points to submit');
      return;
    }

    if (!ethBalance || ethBalance.value < SUBMIT_FEE) {
      toast.error(`Insufficient ETH. Need ${formatEther(SUBMIT_FEE)} ETH`);
      return;
    }

    setIsSubmitting(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: EARTH_CLICK_ABI,
        functionName: 'submitPoints',
        args: [BigInt(pendingPoints)],
        value: SUBMIT_FEE,
      });
      toast.success(`Submitting ${pendingPoints.toLocaleString()} EARTH tokens...`);
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error('Submit failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Points submitted successfully!');
      setPendingPoints(0);
      setClickCount(0);
      refetch();
      setIsSubmitting(false);
    }
  }, [isConfirmed, refetch]);

  const totalPoints = useMemo(() => userData?.[2] ? Number(userData[2]) : 0, [userData]);
  const hasPending = useMemo(() => pendingPoints > 0, [pendingPoints]);
  
  const submitDisabled = useMemo(() => 
    isSubmitting || isConfirming || !ethBalance || ethBalance.value < SUBMIT_FEE,
    [isSubmitting, isConfirming, ethBalance]
  );

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {pendingPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {clickCount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Clicks</div>
          </div>
        </div>
      </motion.div>

      {/* Earth Click */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <Earth onClick={handleClick} isClicking={isClicking} />
      </motion.div>

      {/* Submit Button */}
      {hasPending && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={submitDisabled}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting || isConfirming ? (
              <>
                <Rocket className="w-5 h-5 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Submit {pendingPoints.toLocaleString()} EARTH
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start gap-3">
          <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
              <li>Click to earn 1 EARTH token per tap</li>
              <li>Points accumulate until you submit</li>
              <li>Submitted points count toward leaderboards</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

ClickGame.displayName = 'ClickGame';

