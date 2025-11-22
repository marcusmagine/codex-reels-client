import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Episode } from '../types/domain';
import { formatSeconds } from '../utils/time';

type Props = {
  episode: Episode;
  onToggleControls?: () => void;
};

export const VerticalReelPlayer: React.FC<Props> = ({ episode, onToggleControls }) => {
  const playerRef = useRef<Video | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Video
        ref={(ref) => {
          playerRef.current = ref;
        }}
        source={{ uri: episode.streamUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        onError={(error) => setLastError(error?.error?.message ?? 'Unknown error')}
        onPlaybackStatusUpdate={(status) => {
          if (!status.isLoaded) return;
          setIsBuffering(status.isBuffering);
        }}
      />
      <TouchableOpacity style={styles.overlay} activeOpacity={0.8} onPress={onToggleControls}>
        <View style={styles.metaContainer}>
          <Text style={styles.title}>{episode.title}</Text>
          <Text style={styles.subtitle}>Duration: {formatSeconds(episode.durationSeconds)}</Text>
          {isBuffering && <Text style={styles.debugText}>Buffering...</Text>}
          {lastError && <Text style={[styles.debugText, styles.errorText]}>Last error: {lastError}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  video: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  metaContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  subtitle: {
    color: '#ddd',
    marginTop: 4
  },
  debugText: {
    marginTop: 6,
    color: '#cce1ff'
  },
  errorText: {
    color: '#ffb3b3'
  }
});
