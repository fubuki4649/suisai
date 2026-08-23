/* eslint-disable react-refresh/only-export-components */
import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {checkBackendHealth} from "../api/health.ts";
import {client} from "../api/client.ts";

type ServerHealthState = {
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  isChecking: boolean;
  retryConnection: () => Promise<boolean>;
};

const ServerHealthContext = createContext<ServerHealthState | undefined>(undefined);

export const ServerHealthProvider = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const isHealthy = await checkBackendHealth();
      setIsOffline(!isHealthy);
      return isHealthy;
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Check health on initial mount
  useEffect(() => {
    retryConnection();
  }, [retryConnection]);

  // When offline, periodically ping /meow every 3 seconds to auto-recover once backend is up
  useEffect(() => {
    if (!isOffline) return;

    const interval = setInterval(async () => {
      const isHealthy = await checkBackendHealth();
      if (isHealthy) {
        setIsOffline(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOffline]);

  // Intercept any network/connection failure across API calls
  useEffect(() => {
    const interceptor = client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response && error.code !== "ERR_CANCELED") {
          setIsOffline(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      client.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = React.useMemo<ServerHealthState>(
    () => ({ isOffline, setIsOffline, isChecking, retryConnection }),
    [isOffline, isChecking, retryConnection]
  );

  return (
    <ServerHealthContext.Provider value={value}>
      {children}
    </ServerHealthContext.Provider>
  );
};

export const useServerHealth = (): ServerHealthState => {
  const context = useContext(ServerHealthContext);
  if (!context) {
    throw new Error("useServerHealth must be used within a ServerHealthProvider");
  }
  return context;
};
