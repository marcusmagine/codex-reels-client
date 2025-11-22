import { useCallback, useMemo, useState } from 'react';
import { AVPlaybackError, AVPlaybackStatusSuccess } from 'expo-av';

export type PlaybackDiagnostics = {
  positionSeconds: number;
  durationSeconds: number;
  playableSeconds: number;
  isBuffering: boolean;
  lastError: string | null;
  updatedAt: number;
};

const baseDiagnostics: PlaybackDiagnostics = {
  positionSeconds: 0,
  durationSeconds: 0,
  playableSeconds: 0,
  isBuffering: false,
  lastError: null,
  updatedAt: 0
};

export const useVideoDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<PlaybackDiagnostics>(baseDiagnostics);

  const resetDiagnostics = useCallback(() => {
    setDiagnostics({ ...baseDiagnostics, updatedAt: Date.now() });
  }, []);

  const handleStatusUpdate = useCallback((status: AVPlaybackStatusSuccess | any) => {
    if (!status?.isLoaded) return;
    setDiagnostics((prev) => ({
      positionSeconds: (status.positionMillis ?? 0) / 1000,
      durationSeconds: (status.durationMillis ?? 0) / 1000,
      playableSeconds: (status.playableDurationMillis ?? 0) / 1000,
      isBuffering: Boolean(status.isBuffering),
      lastError: prev.lastError,
      updatedAt: Date.now()
    }));
  }, []);

  const handleError = useCallback((error: AVPlaybackError) => {
    setDiagnostics((prev) => ({
      ...prev,
      lastError: error?.error?.message ?? 'Unknown error',
      updatedAt: Date.now()
    }));
  }, []);

  const derived = useMemo(() => diagnostics, [diagnostics]);

  return {
    diagnostics: derived,
    handleStatusUpdate,
    handleError,
    resetDiagnostics
  };
};
