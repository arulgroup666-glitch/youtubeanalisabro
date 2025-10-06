'use client';

import { useState } from 'react';
import { Search, TrendingUp, Eye, Video, Clock, ExternalLink, Award, ThumbsUp, MessageSquare, Play } from 'lucide-react';
import { searchVideosWithStats, formatNumber, formatDuration, calculateEngagementRate } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function KeywordAnalysis() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'views' | 'likes' | 'date'>('relevance');

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const data = await searchVideosWithStats(keyword, 50);
      setVideos(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal melakukan pencarian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getSortedVideos = () => {
    if (sortBy === 'relevance') return videos;

    return [...videos].sort((a, b) => {
      if (sortBy === 'views') {
        return parseInt(b.statistics.viewCount || '0') - parseInt(a.statistics.viewCount || '0');
      }
      if (sortBy === 'likes') {
        return parseInt(b.statistics.likeCount || '0') - parseInt(a.statistics.likeCount || '0');
      }
      if (sortBy === 'date') {
        return new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime();
      }
      return 0;
    });
  };

  const sortedVideos = getSortedVideos();

  const popularKeywords = [
    'tutorial',
    'review',
    'gaming',
    'vlog',
    'musik',
    'olahraga',
    'teknologi',
    'kuliner',
  ];

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Search className="w-8 h-8 text-red-500" />
          <span>Video Search by Keyword</span>
        </h2>
        <p className="text-gray-300 mb-4">
          Cari video berdasarkan keyword dan urutkan berdasarkan views, likes, atau tanggal upload
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Masukkan keyword atau topik yang ingin dicari..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
          >
            <Search className="w-5 h-5" />
            <span>{loading ? 'Searching...' : 'Cari'}</span>
          </button>
        </div>

        {/* Popular Keywords */}
        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-2">Keyword populer:</p>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((kw, index) => (
              <button
                key={index}
                onClick={() => {
                  setKeyword(kw);
                  handleSearch();
                }}
                className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm hover:bg-white/10 transition-all"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      {videos.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-gray-300 text-sm font-semibold whitespace-nowrap">Sort by:</span>
            <button
              onClick={() => setSortBy('relevance')}
              className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                sortBy === 'relevance'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              🎯 Relevance
            </button>
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
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                sortBy === 'date'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              📅 Latest
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-300 mt-4">Mencari video...</p>
        </div>
      ) : sortedVideos.length > 0 ? (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white">
              Ditemukan {sortedVideos.length} video untuk keyword "{keyword}"
            </h3>
            <p className="text-gray-300 mt-2">
              Analisa hasil pencarian untuk mendapatkan insight tentang kompetisi dan peluang konten
            </p>
          </div>

          {/* Videos Grid */}
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
                  <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-sm font-bold">
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

          {/* SEO Tips */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6" />
              <span>Tips SEO untuk Keyword "{keyword}"</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">📊 Analisa Kompetisi</h4>
                <p className="text-gray-300 text-sm">
                  Total {results.length} konten ditemukan. Semakin banyak hasil, semakin tinggi kompetisi untuk keyword ini.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">🎯 Optimasi Judul</h4>
                <p className="text-gray-300 text-sm">
                  Gunakan keyword "{keyword}" di awal judul video untuk meningkatkan ranking di search results.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">📝 Deskripsi Video</h4>
                <p className="text-gray-300 text-sm">
                  Masukkan keyword dan variasi keyword di 100 karakter pertama deskripsi video.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">🏷️ Tags Strategis</h4>
                <p className="text-gray-300 text-sm">
                  Gunakan mix antara broad tags dan specific tags yang relevan dengan keyword "{keyword}".
                </p>
              </div>
            </div>
          </div>

          {/* Related Keywords */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">💡 Saran Keyword Terkait</h3>
            <div className="flex flex-wrap gap-2">
              {[
                `${keyword} tutorial`,
                `${keyword} untuk pemula`,
                `${keyword} indonesia`,
                `${keyword} 2025`,
                `${keyword} tips`,
                `${keyword} lengkap`,
                `belajar ${keyword}`,
                `cara ${keyword}`,
              ].map((kw, index) => (
                <button
                  key={index}
                  onClick={() => setKeyword(kw)}
                  className="px-3 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 rounded-lg text-sm hover:from-orange-500/30 hover:to-red-500/30 transition-all border border-orange-500/30"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
