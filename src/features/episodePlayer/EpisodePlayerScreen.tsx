import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../shared/navigation/AppNavigator';
import { demoCategories } from '../../shared/constants/mockData';
import { VerticalReelPlayer } from '../../shared/components/VerticalReelPlayer';
import { Episode } from '../../shared/types/domain';

const findEpisode = (episodeId?: string): Episode | undefined => {
  for (const category of demoCategories) {
    for (const series of category.series) {
      const candidate = series.episodes.find((episode) => episode.id === episodeId);
      if (candidate) return candidate;
    }
  }
  return demoCategories[0]?.series[0]?.episodes[0];
};

export const EpisodePlayerScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RootStackParamList['EpisodePlayer'];
  const episode = findEpisode(params?.episodeId);

  if (!episode) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Episode not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.link}>Return Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VerticalReelPlayer episode={episode} onToggleControls={() => navigation.navigate('Home')} />
      <View style={styles.overlayBar}>
        <TouchableOpacity style={styles.pill} onPress={() => navigation.goBack()}>
          <Text style={styles.pillText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.pillText}>Episodes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050507'
  },
  fallbackText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12
  },
  link: {
    color: '#7b8cff'
  },
  overlayBar: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  pill: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  pillText: {
    color: '#fff'
  }
});
