
export interface Video {
  id: string;
  thumbnailUrl: string;
  title: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  channelId: string;
}

export interface User {
  name: string;
  avatarUrl: string;
  isPro: boolean;
}