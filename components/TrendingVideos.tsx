'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, ThumbsUp, MessageSquare, ExternalLink, RefreshCw, Play, Clock } from 'lucide-react';
import { getTrendingVideos, formatNumber, formatDuration, calculateEngagementRate } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TrendingVideos() {
  const [region, setRegion] = useState('ID');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'comments' | 'engagement'>('views');

  const regions = [
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  ];

  const loadTrending = async () => {
    setLoading(true);
    try {
      const data = await getTrendingVideos(region, 50);
      setVideos(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat trending videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, [region]);

  const getSortedVideos = () => {
    return [...videos].sort((a, b) => {
      if (sortBy === 'engagement') {
        const aEngagement = parseFloat(calculateEngagementRate(
          a.statistics.likeCount || '0',
          a.statistics.commentCount || '0',
          a.statistics.viewCount
        ));
        const bEngagement = parseFloat(calculateEngagementRate(
          b.statistics.likeCount || '0',
          b.statistics.commentCount || '0',
          b.statistics.viewCount
        ));
        return bEngagement - aEngagement;
      }
      const aValue = parseInt(a.statistics[sortBy === 'views' ? 'viewCount' : sortBy === 'likes' ? 'likeCount' : 'commentCount'] || '0');
      const bValue = parseInt(b.statistics[sortBy === 'views' ? 'viewCount' : sortBy === 'likes' ? 'likeCount' : 'commentCount'] || '0');
      return bValue - aValue;
    });
  };

  const sortedVideos = getSortedVideos();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <span>Trending Videos</span>
            </h2>
            <p className="text-gray-300 mt-1">
              Discover viral videos from {regions.length} countries • {sortedVideos.length} videos loaded
            </p>
          </div>
          <button
            onClick={loadTrending}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 flex items-center space-x-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Region Selector */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {regions.map((r) => (
            <button
              key={r.code}
              onClick={() => setRegion(r.code)}
              className={`px-3 py-2 rounded-lg transition-all text-center ${
                region === r.code
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105 shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="text-2xl mb-1">{r.flag}</div>
              <div className="text-xs font-medium">{r.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-gray-300 text-sm font-semibold whitespace-nowrap">Sort by:</span>
          <button
            onClick={() => setSortBy('views')}
            className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
              sortBy === 'views'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            👁️ Most Views
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
              sortBy === 'likes'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            👍 Most Likes
          </button>
          <button
            onClick={() => setSortBy('comments')}
            className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
              sortBy === 'comments'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            💬 Most Comments
          </button>
          <button
            onClick={() => setSortBy('engagement')}
            className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
              sortBy === 'engagement'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            🔥 Best Engagement
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-300 mt-4">Loading trending videos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video, index) => (
            <div
              key={video.id}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 card-hover"
            >
              {/* Thumbnail */}
              <div className="relative group">
                <img
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  #{index + 1}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(video.contentDetails?.duration || 'PT0S')}</span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
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

                {/* Stats Grid */}
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
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded p-3 border border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Engagement</span>
                    <span className="text-orange-400 font-bold text-sm">
                      {calculateEngagementRate(
                        video.statistics.likeCount || '0',
                        video.statistics.commentCount || '0',
                        video.statistics.viewCount
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(parseFloat(calculateEngagementRate(
                          video.statistics.likeCount || '0',
                          video.statistics.commentCount || '0',
                          video.statistics.viewCount
                        )) * 10, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Published Date */}
                <p className="text-gray-400 text-xs">
                  Published: {format(new Date(video.snippet.publishedAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                </p>

                {/* View Button */}
                <a
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
