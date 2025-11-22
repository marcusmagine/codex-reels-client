import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../shared/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { demoCategories } from '../../shared/constants/mockData';
import { Episode } from '../../shared/types/domain';
import { formatSeconds } from '../../shared/utils/time';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const firstEpisode: Episode | undefined = demoCategories[0]?.series[0]?.episodes[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to ReelsDrama</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PlayerLab')}>
            <Text style={styles.actionText}>Player Lab</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={demoCategories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EpisodePlayer', {
                    episodeId: item.series[0]?.episodes[0]?.id
                  })
                }
              >
                <Text style={styles.link}>Play first</Text>
              </TouchableOpacity>
            </View>
            {item.series.map((series) => (
              <View key={series.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{series.title}</Text>
                  <Text style={styles.cardSubtitle}>{series.episodes.length} episodes</Text>
                </View>
                {series.episodes.map((episode) => (
                  <TouchableOpacity
                    key={episode.id}
                    style={styles.episodeRow}
                    onPress={() =>
                      navigation.navigate('EpisodePlayer', {
                        episodeId: episode.id
                      })
                    }
                  >
                    <View>
                      <Text style={styles.episodeTitle}>{episode.title}</Text>
                      <Text style={styles.episodeMeta}>{formatSeconds(episode.durationSeconds)}</Text>
                    </View>
                    {episode.isLocked && <Text style={styles.locked}>Locked</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      />
      {firstEpisode && (
        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() =>
            navigation.navigate('EpisodePlayer', {
              episodeId: firstEpisode.id
            })
          }
        >
          <Text style={styles.primaryCtaText}>Resume Pilot</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050507'
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#0b0b12'
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700'
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1a1a22'
  },
  actionText: {
    color: '#d7ddff'
  },
  listContent: {
    padding: 16,
    gap: 16
  },
  section: {
    gap: 10
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  link: {
    color: '#7b8cff'
  },
  card: {
    backgroundColor: '#0f0f16',
    borderRadius: 12,
    padding: 12,
    gap: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600'
  },
  cardSubtitle: {
    color: '#9da3b4'
  },
  episodeRow: {
    backgroundColor: '#13131d',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  episodeTitle: {
    color: '#fff'
  },
  episodeMeta: {
    color: '#9da3b4',
    marginTop: 4
  },
  locked: {
    color: '#ffb347',
    fontWeight: '600'
  },
  primaryCta: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#5b6dff',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  primaryCtaText: {
    color: '#fff',
    fontWeight: '700'
  }
});
