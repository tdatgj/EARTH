import React, { useState, useMemo, memo, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { Trophy, Medal, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONTRACT_ADDRESS, EARTH_CLICK_ABI } from '../config/constants';

export const Leaderboards: React.FC = memo(() => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showCountry, setShowCountry] = useState(true);

  // Get country leaderboard
  const { data: countryData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EARTH_CLICK_ABI,
    functionName: 'getCountryLeaderboard',
    args: [BigInt(100)],
    query: {
      staleTime: 30000,
      refetchInterval: 60000, // Refetch every 60s
    },
  });

  // Get all countries for selection
  const { data: allCountriesData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EARTH_CLICK_ABI,
    functionName: 'getAllCountries',
    query: {
      staleTime: 60000,
    },
  });

  // Get top players in selected country
  const { data: playerData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: EARTH_CLICK_ABI,
    functionName: 'getTopPlayersInCountry',
    args: selectedCountry ? [selectedCountry, BigInt(100)] : undefined,
    query: { 
      enabled: !!selectedCountry && !showCountry,
      staleTime: 30000,
    },
  });

  const countryNames = useMemo(() => countryData?.[0] || [], [countryData]);
  const countryPoints = useMemo(() => countryData?.[1] || [], [countryData]);

  const handleShowCountry = useCallback(() => {
    setShowCountry(true);
    setSelectedCountry(null);
  }, []);

  const handleShowPlayers = useCallback(() => {
    setShowCountry(false);
  }, []);

  const handleCountryClick = useCallback((country: string) => {
    setShowCountry(false);
    setSelectedCountry(country);
  }, []);

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex gap-2">
        <motion.button
          onClick={handleShowCountry}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            showCountry
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Countries
        </motion.button>
        <motion.button
          onClick={handleShowPlayers}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            !showCountry
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Players
        </motion.button>
      </div>

      {/* Country Leaderboard */}
      {showCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Country Leaderboard
            </h2>
          </div>

          {countryNames.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No countries yet</p>
          ) : (
            <div className="space-y-3">
              {countryNames.map((country, index) => {
                const points = Number(countryPoints[index] || 0);
                const rank = index + 1;
                
                return (
                  <motion.div
                    key={country}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCountryClick(country)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      rank === 1
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                        : rank === 2
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        : rank === 3
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {rank <= 3 && (
                          <Medal
                            className={`w-8 h-8 ${
                              rank === 1
                                ? 'text-yellow-500'
                                : rank === 2
                                ? 'text-gray-400'
                                : 'text-orange-500'
                            }`}
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            #{rank} {country}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Click to view players →
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {points.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">EARTH</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Player Leaderboard for Selected Country */}
      {!showCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Top Players
              </h2>
            </div>
            {selectedCountry && (
              <button
                onClick={() => {
                  setShowCountry(true);
                  setSelectedCountry(null);
                }}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                ← Back to Countries
              </button>
            )}
          </div>

          {!selectedCountry ? (
            <div className="space-y-2">
              <p className="text-gray-500 text-center py-4">
                Select a country from the leaderboard to view players
              </p>
              {allCountriesData?.[0] && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allCountriesData[0].slice(0, 20).map((country: string) => (
                    <motion.button
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {country}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="font-medium text-emerald-800 dark:text-emerald-300">
                  {selectedCountry}
                </div>
              </div>
              {!playerData || playerData[0].length === 0 ? (
                <p className="text-gray-500 text-center py-8">No players in this country yet</p>
              ) : (
                <div className="space-y-2">
                  {playerData[0].map((address: `0x${string}`, index: number) => {
                    const username = playerData[1][index];
                    const points = Number(playerData[2][index] || 0);
                    const rank = index + 1;
                    
                    return (
                      <motion.div
                        key={address}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`p-3 rounded-lg border ${
                          rank === 1
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-400 w-8">#{rank}</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {username || 'Anonymous'}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {address.slice(0, 6)}...{address.slice(-4)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400">
                              {points.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">EARTH</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
});

Leaderboards.displayName = 'Leaderboards';

