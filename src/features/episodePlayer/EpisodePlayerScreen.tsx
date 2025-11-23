import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../shared/navigation/AppNavigator';
import { demoCategories } from '../../shared/constants/mockData';
import { VerticalReelPlayer } from '../../shared/components/VerticalReelPlayer';
import { Episode, Series } from '../../shared/types/domain';
import { formatSeconds } from '../../shared/utils/time';

const screenHeight = Dimensions.get('window').height;

type EpisodeContext = {
  series: Series;
  episodes: Episode[];
};

const findEpisodeContext = (episodeId?: string): EpisodeContext | undefined => {
  for (const category of demoCategories) {
    for (const series of category.series) {
      if (!series.episodes.length) continue;
      const hasTarget = series.episodes.some((episode) => episode.id === episodeId);
      if (hasTarget) {
        return { series, episodes: series.episodes };
      }
    }
  }

  const fallbackSeries = demoCategories[0]?.series[0];
  if (!fallbackSeries || !fallbackSeries.episodes.length) return undefined;
  return { series: fallbackSeries, episodes: fallbackSeries.episodes };
};

export const EpisodePlayerScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RootStackParamList['EpisodePlayer'];
  const flatListRef = useRef<FlatList<Episode>>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const context = useMemo(() => findEpisodeContext(params?.episodeId), [params?.episodeId]);
  const episodes = context?.episodes ?? [];

  const initialIndex = useMemo(() => {
    if (!params?.episodeId) return 0;
    const foundIndex = episodes.findIndex((episode) => episode.id === params.episodeId);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [episodes, params?.episodeId]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index?: number }> }) => {
    if (viewableItems[0]?.index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const handleSelectEpisode = useCallback(
    (episodeId: string) => {
      const targetIndex = episodes.findIndex((episode) => episode.id === episodeId);
      if (targetIndex >= 0) {
        flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
      }
    },
    [episodes]
  );

  if (!context) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Episode not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.link}>Return Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentEpisode = episodes[currentIndex] ?? episodes[0];

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={episodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <VerticalReelPlayer episode={item} onToggleControls={() => setDrawerOpen((prev) => !prev)} />
            {item.isLocked && <Text style={styles.lockedBadge}>Locked</Text>}
          </View>
        )}
        pagingEnabled
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({ length: screenHeight, offset: screenHeight * index, index })}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.overlayBar}>
        <TouchableOpacity style={styles.pill} onPress={() => navigation.goBack()}>
          <Text style={styles.pillText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.seriesMeta}>
          <Text style={styles.seriesTitle}>{context.series.title}</Text>
          <Text style={styles.seriesSubtitle}>Swipe to move between episodes</Text>
        </View>
        <TouchableOpacity style={styles.pill} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.pillText}>Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.episodeMetaBar}>
        <Text style={styles.episodeTitle}>{currentEpisode?.title}</Text>
        {currentEpisode?.description && <Text style={styles.episodeDescription}>{currentEpisode.description}</Text>}
        {currentEpisode?.durationSeconds ? (
          <Text style={styles.episodeDuration}>Duration • {formatSeconds(currentEpisode.durationSeconds)}</Text>
        ) : null}
      </View>

      <View style={styles.drawerContainer}>
        <TouchableOpacity style={styles.drawerHeader} onPress={() => setDrawerOpen((prev) => !prev)}>
          <Text style={styles.drawerTitle}>Episodes</Text>
          <Text style={styles.drawerAction}>{drawerOpen ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
        {drawerOpen && (
          <ScrollView style={styles.drawerList} contentContainerStyle={styles.drawerListContent}>
            {episodes.map((episode, index) => {
              const isActive = index === currentIndex;
              return (
                <TouchableOpacity
                  key={episode.id}
                  style={[styles.drawerRow, isActive && styles.drawerRowActive]}
                  onPress={() => handleSelectEpisode(episode.id)}
                >
                  <View style={styles.drawerRowText}>
                    <Text style={[styles.drawerEpisodeTitle, isActive && styles.drawerEpisodeTitleActive]}>
                      {episode.title}
                    </Text>
                    <Text style={styles.drawerEpisodeMeta}>{formatSeconds(episode.durationSeconds)}</Text>
                  </View>
                  {episode.isLocked && <Text style={styles.drawerLocked}>Locked</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
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
  page: {
    height: screenHeight
  },
  overlayBar: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  },
  seriesMeta: {
    alignItems: 'center'
  },
  seriesTitle: {
    color: '#fff',
    fontWeight: '700'
  },
  seriesSubtitle: {
    color: '#b0b7c9',
    fontSize: 12
  },
  episodeMetaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 160,
    paddingHorizontal: 16
  },
  episodeTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },
  episodeDescription: {
    color: '#d6d9e8',
    marginTop: 6
  },
  episodeDuration: {
    color: '#9da3b4',
    marginTop: 6
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8,8,12,0.9)',
    paddingTop: 8,
    paddingBottom: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  drawerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  drawerAction: {
    color: '#7b8cff'
  },
  drawerList: {
    maxHeight: 220
  },
  drawerListContent: {
    paddingHorizontal: 16,
    gap: 10
  },
  drawerRow: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#11111a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  drawerRowActive: {
    borderWidth: 1,
    borderColor: '#5b6dff'
  },
  drawerRowText: {
    maxWidth: '80%'
  },
  drawerEpisodeTitle: {
    color: '#f3f4ff',
    fontWeight: '600'
  },
  drawerEpisodeTitleActive: {
    color: '#ffffff'
  },
  drawerEpisodeMeta: {
    color: '#9da3b4',
    marginTop: 4
  },
  drawerLocked: {
    color: '#ffb347',
    fontWeight: '700'
  },
  lockedBadge: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: '#ffb347',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  }
});
