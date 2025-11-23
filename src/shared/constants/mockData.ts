import { Category, StreamConfig, User } from '../types/domain';

export const demoUser: User = {
  id: 'user-1',
  email: 'demo@reelsdrama.app',
  name: 'Demo User',
  subscriptionStatus: 'trial'
};

export const demoCategories: Category[] = [
  {
    id: 'cat-1',
    title: 'New Episodes',
    series: [
      {
        id: 'series-1',
        title: 'Shadow City',
        heroImage: undefined,
        episodes: [
          {
            id: 'ep-1',
            title: 'Pilot',
            description: 'A detective steps into a world of vertical mysteries.',
            durationSeconds: 840,
            streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8'
          },
          {
            id: 'ep-2',
            title: 'Second Wind',
            description: 'Allies surface as the case widens.',
            durationSeconds: 860,
            streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
            isLocked: true
          },
          {
            id: 'ep-3',
            title: 'Crossed Lines',
            description: 'The investigation pushes into the underground scene.',
            durationSeconds: 910,
            streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8'
          },
          {
            id: 'ep-4',
            title: 'Break in the Case',
            description: 'A reveal changes what everyone thought they knew.',
            durationSeconds: 940,
            streamUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
            isLocked: true
          }
        ]
      }
    ]
  }
];

export const labStreams: StreamConfig[] = [
  {
    id: 'lab-1',
    title: 'Angel One HLS',
    manifestUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8',
    drmStatus: 'none'
  },
  {
    id: 'lab-2',
    title: 'Tears of Steel DASH',
    manifestUrl: 'https://storage.googleapis.com/shaka-demo-assets/tearsofsteel/tearsofsteel.mpd',
    drmStatus: 'none'
  }
];
