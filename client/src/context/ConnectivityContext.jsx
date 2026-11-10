import React, { createContext, useContext, useState, useEffect } from 'react';

const ConnectivityContext = createContext(null);

export const ConnectivityProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineNoticeDismissed, setOfflineNoticeDismissed] = useState(false);
  const [cachedSchemesCount, setCachedSchemesCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineNoticeDismissed(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineNoticeDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check cached schemes count
    const cached = localStorage.getItem('bolo_cached_schemes');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedSchemesCount(parsed.schemes?.length || parsed.total || 0);
      } catch {
        // ignore
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ConnectivityContext.Provider
      value={{
        isOnline,
        isOffline: !isOnline,
        offlineNoticeDismissed,
        dismissOfflineNotice: () => setOfflineNoticeDismissed(true),
        cachedSchemesCount,
      }}
    >
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => useContext(ConnectivityContext);
