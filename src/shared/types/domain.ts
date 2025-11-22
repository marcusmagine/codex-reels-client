export type User = {
  id: string;
  email: string;
  name?: string;
  subscriptionStatus: 'none' | 'trial' | 'active' | 'expired';
};

export type Episode = {
  id: string;
  title: string;
  description?: string;
  durationSeconds: number;
  streamUrl: string;
  isLocked?: boolean;
};

export type Series = {
  id: string;
  title: string;
  heroImage?: string;
  episodes: Episode[];
};

export type Category = {
  id: string;
  title: string;
  series: Series[];
};

export type Subscription = {
  status: User['subscriptionStatus'];
  renewalDate?: string;
};

export type StreamConfig = {
  id: string;
  title: string;
  manifestUrl: string;
  drmStatus?: 'none' | 'ready' | 'failed';
};
