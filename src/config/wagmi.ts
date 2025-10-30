import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { metaMask } from 'wagmi/connectors';
import { SOVA_CHAIN } from './constants';

export const sovaChain = defineChain(SOVA_CHAIN);

export const config = createConfig({
  chains: [sovaChain],
  connectors: [metaMask()],
  transports: {
    [sovaChain.id]: http(
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? '/api/rpc' // Use Vite proxy in dev
        : '/api/rpc' // Use Vercel serverless function in production
    ),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

