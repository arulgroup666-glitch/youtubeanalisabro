import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyA59zx2HIq7AfnpKJ87vfQoTuZm2b9uUdw';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface ChannelStats {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  country?: string;
}

export interface VideoStats {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  tags?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  channelTitle: string;
  publishedAt: string;
  type: 'video' | 'channel';
}

// Get Channel Statistics
export async function getChannelStats(channelId: string): Promise<ChannelStats | null> {
  try {
    const response = await axios.get(`${BASE_URL}/channels`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: channelId,
        key: API_KEY,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl || '',
        publishedAt: channel.snippet.publishedAt,
        thumbnails: {
          default: channel.snippet.thumbnails.default.url,
          medium: channel.snippet.thumbnails.medium.url,
          high: channel.snippet.thumbnails.high.url,
        },
        subscriberCount: channel.statistics.subscriberCount,
        viewCount: channel.statistics.viewCount,
        videoCount: channel.statistics.videoCount,
        country: channel.snippet.country,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching channel stats:', error);
    return null;
  }
}

// Get Video Statistics
export async function getVideoStats(videoId: string): Promise<VideoStats | null> {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: API_KEY,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: {
          default: video.snippet.thumbnails.default.url,
          medium: video.snippet.thumbnails.medium.url,
          high: video.snippet.thumbnails.high.url,
        },
        channelTitle: video.snippet.channelTitle,
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        commentCount: video.statistics.commentCount || '0',
        duration: video.contentDetails.duration,
        tags: video.snippet.tags || [],
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching video stats:', error);
    return null;
  }
}

// Get Channel Videos
export async function getChannelVideos(channelId: string, maxResults: number = 10) {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        channelId: channelId,
        maxResults: maxResults,
        order: 'date',
        type: 'video',
        key: API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
}

// Get Trending Videos by Region
export async function getTrendingVideos(regionCode: string = 'ID', maxResults: number = 20) {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        regionCode: regionCode,
        maxResults: maxResults,
        key: API_KEY,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
}

// Search Videos/Channels
export async function searchYouTube(query: string, type: 'video' | 'channel' = 'video', maxResults: number = 10): Promise<SearchResult[]> {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: type,
        maxResults: maxResults,
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: type === 'video' ? item.id.videoId : item.id.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: {
        default: item.snippet.thumbnails.default.url,
        medium: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      },
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      type: type,
    }));
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}

// Extract Video/Channel ID from URL
export function extractIdFromUrl(url: string): { type: 'video' | 'channel' | null, id: string | null } {
  // Video patterns
  const videoPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  // Channel patterns
  const channelPatterns = [
    /youtube\.com\/channel\/(UC[a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of videoPatterns) {
    const match = url.match(pattern);
    if (match) return { type: 'video', id: match[1] };
  }

  for (const pattern of channelPatterns) {
    const match = url.match(pattern);
    if (match) return { type: 'channel', id: match[1] };
  }

  return { type: null, id: null };
}

// Format duration from ISO 8601 to readable format
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}

// Format number with K, M, B suffixes
export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// Calculate engagement rate
export function calculateEngagementRate(likes: string, comments: string, views: string): string {
  const l = parseInt(likes);
  const c = parseInt(comments);
  const v = parseInt(views);

  if (v === 0) return '0';
  const rate = ((l + c) / v) * 100;
  return rate.toFixed(2);
}
