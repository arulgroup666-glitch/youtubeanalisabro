'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, ThumbsUp, MessageSquare, ExternalLink, RefreshCw } from 'lucide-react';
import { getTrendingVideos, formatNumber, formatDuration, calculateEngagementRate } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TrendingVideos() {
  const [region, setRegion] = useState('ID');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'comments'>('views');

  const regions = [
    { code: 'ID', name: 'Indonesia' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
  ];

  const loadTrending = async () => {
    setLoading(true);
    try {
      const data = await getTrendingVideos(region, 24);
      setVideos(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, [region]);

  const getSortedVideos = () => {
    return [...videos].sort((a, b) => {
      const aValue = parseInt(a.statistics[sortBy === 'views' ? 'viewCount' : sortBy === 'likes' ? 'likeCount' : 'commentCount'] || '0');
      const bValue = parseInt(b.statistics[sortBy === 'views' ? 'viewCount' : sortBy === 'likes' ? 'likeCount' : 'commentCount'] || '0');
      return bValue - aValue;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-8 h-8" />
              <span>Trending Videos</span>
            </h2>
            <p className="text-gray-300 mt-1">
              Video yang sedang trending di berbagai negara
            </p>
          </div>
          <button
            onClick={loadTrending}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Region Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {regions.map((r) => (
            <button
              key={r.code}
              onClick={() => setRegion(r.code)}
              className={`px-4 py-2 rounded-lg transition-all ${
                region === r.code
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-gray-300 text-sm">Urutkan:</span>
          <button
            onClick={() => setSortBy('views')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              sortBy === 'views'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Views
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              sortBy === 'likes'
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Likes
          </button>
          <button
            onClick={() => setSortBy('comments')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              sortBy === 'comments'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Comments
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-300 mt-4">Memuat trending videos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getSortedVideos().map((video, index) => (
            <div
              key={video.id}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 card-hover"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  #{index + 1}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(video.contentDetails.duration)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-white font-semibold line-clamp-2 hover:text-red-400 transition-colors">
                  <a
                    href={`https://youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video.snippet.title}
                  </a>
                </h3>

                <p className="text-gray-400 text-sm">{video.snippet.channelTitle}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-500/20 rounded p-2 text-center">
                    <Eye className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">{formatNumber(video.statistics.viewCount)}</p>
                    <p className="text-gray-400">Views</p>
                  </div>
                  <div className="bg-green-500/20 rounded p-2 text-center">
                    <ThumbsUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">{formatNumber(video.statistics.likeCount || '0')}</p>
                    <p className="text-gray-400">Likes</p>
                  </div>
                  <div className="bg-purple-500/20 rounded p-2 text-center">
                    <MessageSquare className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">{formatNumber(video.statistics.commentCount || '0')}</p>
                    <p className="text-gray-400">Comments</p>
                  </div>
                </div>

                {/* Engagement Rate */}
                <div className="bg-white/5 rounded p-2">
                  <p className="text-gray-400 text-xs">Engagement Rate</p>
                  <p className="text-orange-400 font-bold">
                    {calculateEngagementRate(
                      video.statistics.likeCount || '0',
                      video.statistics.commentCount || '0',
                      video.statistics.viewCount
                    )}%
                  </p>
                </div>

                {/* Published Date */}
                <p className="text-gray-400 text-xs">
                  {format(new Date(video.snippet.publishedAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                </p>

                {/* View Button */}
                <a
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat Video</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
