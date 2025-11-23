import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { labStreams } from '../../shared/constants/mockData';
import { StreamConfig } from '../../shared/types/domain';
import { useVideoDiagnostics } from '../../shared/hooks/useVideoDiagnostics';

export const PlayerLabScreen: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<StreamConfig>(labStreams[0]);
  const { diagnostics, handleError, handleStatusUpdate, resetDiagnostics } = useVideoDiagnostics();

  useEffect(() => {
    resetDiagnostics();
  }, [selectedStream.id, resetDiagnostics]);

  return (
    <View style={styles.container}>
      <View style={styles.leftPane}>
        <Text style={styles.heading}>Streams</Text>
        <FlatList
          data={labStreams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.streamRow, item.id === selectedStream.id && styles.streamRowActive]}
              onPress={() => setSelectedStream(item)}
            >
              <Text style={styles.streamTitle}>{item.title}</Text>
              <Text style={styles.streamSubtitle}>{item.manifestUrl}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.rightPane}>
        <Text style={styles.heading}>Playback & Debug</Text>
        <View style={styles.playerCard}>
          <Video
            key={selectedStream.id}
            style={styles.video}
            source={{ uri: selectedStream.manifestUrl }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            onPlaybackStatusUpdate={handleStatusUpdate}
            onError={handleError}
          />
          <View style={styles.playerOverlay}>
            <View>
              <Text style={styles.streamTitle}>{selectedStream.title}</Text>
              <Text style={styles.streamSubtitle}>{selectedStream.manifestUrl}</Text>
            </View>
            <View style={styles.statusPills}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{diagnostics.isBuffering ? 'Buffering' : 'Playing'}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>DRM: {selectedStream.drmStatus ?? 'unknown'}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.debugCard}>
          <Text style={styles.label}>Playback position</Text>
          <Text style={styles.value}>{diagnostics.positionSeconds.toFixed(1)}s / {diagnostics.durationSeconds.toFixed(1)}s</Text>
          <Text style={styles.label}>Buffer ahead</Text>
          <Text style={styles.value}>{Math.max(diagnostics.playableSeconds - diagnostics.positionSeconds, 0).toFixed(1)}s</Text>
          <Text style={styles.label}>Buffering</Text>
          <Text style={styles.value}>{diagnostics.isBuffering ? 'Yes' : 'No'}</Text>
          <Text style={styles.label}>Last error</Text>
          <Text style={[styles.value, !diagnostics.lastError && styles.muted]}>{diagnostics.lastError ?? 'None'}</Text>
        </View>
        <View style={styles.debugCard}>
          <Text style={styles.label}>Manifest URL</Text>
          <ScrollView style={styles.urlScroller}>
            <Text style={styles.value}>{selectedStream.manifestUrl}</Text>
          </ScrollView>
          <Text style={styles.label}>DRM</Text>
          <Text style={styles.value}>{selectedStream.drmStatus ?? 'unknown'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#050507'
  },
  leftPane: {
    flex: 0.55,
    padding: 16,
    gap: 12
  },
  rightPane: {
    flex: 0.45,
    padding: 16,
    gap: 12,
    backgroundColor: '#0b0b12'
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  },
  streamRow: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#0f0f16',
    gap: 4,
    marginBottom: 8
  },
  streamRowActive: {
    borderWidth: 1,
    borderColor: '#5b6dff'
  },
  streamTitle: {
    color: '#fff',
    fontWeight: '600'
  },
  streamSubtitle: {
    color: '#9da3b4',
    fontSize: 12
  },
  playerCard: {
    backgroundColor: '#11111a',
    borderRadius: 12,
    overflow: 'hidden',
    height: 280,
    position: 'relative'
  },
  video: {
    ...StyleSheet.absoluteFillObject
  },
  playerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    gap: 6
  },
  statusPills: {
    flexDirection: 'row',
    gap: 8
  },
  pill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)'
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  debugCard: {
    backgroundColor: '#11111a',
    borderRadius: 12,
    padding: 12,
    gap: 6
  },
  label: {
    color: '#9da3b4',
    fontSize: 12
  },
  value: {
    color: '#fff',
    fontWeight: '600'
  },
  muted: {
    color: '#6b6b78'
  },
  urlScroller: {
    maxHeight: 80
  }
});
