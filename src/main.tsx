import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { config } from './config/wagmi';
import { MainApp } from './components/MainApp';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      refetchOnWindowFocus: false, // Disable auto-refetch on focus for better performance
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Don't retry on CORS errors
        if (error?.message?.includes('CORS') || error?.message?.includes('Failed to fetch')) {
          return false;
        }
        return failureCount < 2; // Reduce retry attempts
      },
      gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MainApp />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);

