'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, ThumbsUp, MessageSquare, ExternalLink, RefreshCw, Search, Filter, Play, Clock } from 'lucide-react';
import { getTrendingVideos, searchYouTube, formatNumber, formatDuration, calculateEngagementRate } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TrendingVideos() {
  const [region, setRegion] = useState('ID');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'comments' | 'engagement'>('views');
  const [searchQuery, setSearchQuery] = useState('');
  const [minViews, setMinViews] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const categories = [
    { id: 'all', name: 'All Categories', emoji: '🎬' },
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'gaming', name: 'Gaming', emoji: '🎮' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎭' },
    { id: 'news', name: 'News', emoji: '📰' },
    { id: 'education', name: 'Education', emoji: '📚' },
    { id: 'tech', name: 'Technology', emoji: '💻' },
    { id: 'comedy', name: 'Comedy', emoji: '😂' },
  ];

  const viewRanges = [
    { min: 0, label: 'All Views' },
    { min: 100000, label: '100K+ Views' },
    { min: 500000, label: '500K+ Views' },
    { min: 1000000, label: '1M+ Views' },
    { min: 5000000, label: '5M+ Views' },
    { min: 10000000, label: '10M+ Views' },
  ];

  const loadTrending = async () => {
    setLoading(true);
    try {
      const data = await getTrendingVideos(region, 50);
      setVideos(data);
      setFilteredVideos(data);
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

  useEffect(() => {
    filterVideos();
  }, [searchQuery, minViews, selectedCategory, videos]);

  const filterVideos = () => {
    let filtered = [...videos];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(v =>
        v.snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.snippet.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by views
    if (minViews > 0) {
      filtered = filtered.filter(v => parseInt(v.statistics.viewCount) >= minViews);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v =>
        v.snippet.title.toLowerCase().includes(selectedCategory) ||
        v.snippet.channelTitle.toLowerCase().includes(selectedCategory) ||
        (v.snippet.tags && v.snippet.tags.some((tag: string) => tag.toLowerCase().includes(selectedCategory)))
      );
    }

    setFilteredVideos(filtered);
  };

  const getSortedVideos = () => {
    return [...filteredVideos].sort((a, b) => {
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <span>Trending Videos Discovery</span>
            </h2>
            <p className="text-gray-300 mt-1">
              Discover viral videos from {regions.length} countries with advanced filters
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

        {/* Search & Filters Toggle */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos by title or channel..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all ${
                showFilters
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white/5 rounded-lg p-4 space-y-4 animate-slide-in-top">
              {/* View Range Filter */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                  👁️ View Count Filter
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {viewRanges.map((range) => (
                    <button
                      key={range.min}
                      onClick={() => setMinViews(range.min)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        minViews === range.min
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">
                  🎬 Category Filter
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-gray-300">
            Showing <span className="text-white font-bold">{sortedVideos.length}</span> of{' '}
            <span className="text-white font-bold">{videos.length}</span> trending videos
          </div>
          {(searchQuery || minViews > 0 || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setMinViews(0);
                setSelectedCategory('all');
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
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
      ) : sortedVideos.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Videos Found</h3>
          <p className="text-gray-400">Try adjusting your filters or search query</p>
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
