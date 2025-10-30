import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { UserPlus, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CONTRACT_ADDRESS, EARTH_CLICK_ABI, COUNTRIES } from '../config/constants';

export const Registration: React.FC = memo(() => {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const queryClient = useQueryClient();
  
  const { writeContract, data: hash } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });
  
  // Check if already registered
  const { data: userData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EARTH_CLICK_ABI,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && isConnected,
      staleTime: 5000, // Reduce stale time for faster updates
      refetchInterval: 30000, // Refetch every 30s
    },
  });

  // Refetch when address changes (wallet connect/disconnect)
  useEffect(() => {
    if (address && isConnected) {
      refetch();
      // Invalidate all contract queries
      queryClient.invalidateQueries({
        queryKey: ['readContract'],
      });
    }
  }, [address, isConnected, refetch, queryClient]);

  // Refetch after successful registration
  useEffect(() => {
    if (isConfirmed) {
      refetch();
      queryClient.invalidateQueries({
        queryKey: ['readContract'],
      });
      setIsRegistering(false);
    }
  }, [isConfirmed, refetch, queryClient]);

  // Check if user is registered by checking if username is not empty
  const isRegistered = useMemo(() => 
    userData && userData[0] && userData[0].length > 0,
    [userData]
  );

  const handleRegister = useCallback(async () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    if (!selectedCountry) {
      toast.error('Please select a country');
      return;
    }

    setIsRegistering(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: EARTH_CLICK_ABI,
        functionName: 'register',
        args: [username.trim(), selectedCountry],
      });
      toast.success('Transaction sent! Waiting for confirmation...');
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error?.shortMessage || 'Registration failed. Please try again.');
      setIsRegistering(false);
    }
  }, [username, selectedCountry, writeContract]);

  if (isRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
          <UserPlus className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Welcome back!</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Username: <span className="font-medium">{userData?.[0]}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Country: <span className="font-medium">{userData?.[1]}</span>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-md mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
          <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Register to Play
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose your country and username
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username <span className="text-gray-500">(Discord recommended)</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          onClick={handleRegister}
          disabled={isRegistering || isConfirming || !username.trim() || !selectedCountry}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: (isRegistering || isConfirming) ? 1 : 1.02 }}
          whileTap={{ scale: (isRegistering || isConfirming) ? 1 : 0.98 }}
        >
          <UserPlus className="w-5 h-5" />
          {isConfirming ? 'Confirming...' : isRegistering ? 'Registering...' : 'Register'}
        </motion.button>
      </div>
    </motion.div>
  );
});

Registration.displayName = 'Registration';

