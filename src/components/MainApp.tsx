import React from 'react';
import { useAccount } from 'wagmi';
import { Wallet, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { WalletConnection } from './WalletConnection';
import { Registration } from './Registration';
import { ClickGame } from './ClickGame';
import { Leaderboards } from './Leaderboards';
import { MetaMaskWarning } from './MetaMaskWarning';

export const MainApp: React.FC = () => {
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen">
      <MetaMaskWarning />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <img 
              src="/earth.webp" 
              alt="EARTH" 
              className="w-10 h-10 object-contain earth-header-icon" 
            />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Earth Click Game
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tap to earn EARTH tokens • Compete with your country
          </p>
        </motion.div>

        {/* Wallet Connection */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="card text-center">
              <Wallet className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
              <WalletConnection />
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Registration & Game */}
            <div className="lg:col-span-2 space-y-6">
              <Registration />
              <ClickGame />
            </div>

            {/* Right Column - Leaderboards */}
            <div>
              <Leaderboards />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

