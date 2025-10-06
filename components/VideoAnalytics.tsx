'use client';

import { useState } from 'react';
import { Search, Eye, ThumbsUp, MessageSquare, Clock, TrendingUp, ExternalLink, Share2 } from 'lucide-react';
import { getVideoStats, extractIdFromUrl, formatNumber, formatDuration, calculateEngagementRate } from '@/lib/youtube';
import type { VideoStats } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function VideoAnalytics() {
  const [videoInput, setVideoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoStats | null>(null);

  const handleSearch = async () => {
    if (!videoInput.trim()) return;

    setLoading(true);
    try {
      const { type, id } = extractIdFromUrl(videoInput);
      let videoId = videoInput;

      if (type === 'video' && id) {
        videoId = id;
      }

      const stats = await getVideoStats(videoId);
      setVideoData(stats);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat data video. Pastikan Video ID atau URL valid.');
    } finally {
      setLoading(false);
    }
  };

  const getEngagementData = () => {
    if (!videoData) return [];

    const likes = parseInt(videoData.likeCount);
    const comments = parseInt(videoData.commentCount);
    const views = parseInt(videoData.viewCount);
    const nonEngaged = views - (likes + comments);

    return [
      { name: 'Likes', value: likes, color: '#3b82f6' },
      { name: 'Comments', value: comments, color: '#8b5cf6' },
      { name: 'Views Only', value: nonEngaged > 0 ? nonEngaged : 0, color: '#6b7280' },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Analisa Performa Video</h2>
        <p className="text-gray-300 mb-4">
          Masukkan Video ID atau URL video untuk melihat detail performa dan engagement
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Video ID atau URL (contoh: youtube.com/watch?v=xxxxx)"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
          >
            <Search className="w-5 h-5" />
            <span>{loading ? 'Loading...' : 'Analisa'}</span>
          </button>
        </div>
      </div>

      {/* Video Statistics */}
      {videoData && (
        <div className="space-y-6">
          {/* Video Info */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img
                  src={videoData.thumbnails.high}
                  alt={videoData.title}
                  className="w-full rounded-lg border-2 border-white/20"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{videoData.title}</h3>
                  <p className="text-gray-300 mt-2">Channel: {videoData.channelTitle}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Durasi: {formatDuration(videoData.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{format(new Date(videoData.publishedAt), 'dd MMM yyyy', { locale: id })}</span>
                  </div>
                </div>
                <a
                  href={`https://youtube.com/watch?v=${videoData.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat di YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Views</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatNumber(videoData.viewCount)}
                  </p>
                </div>
                <Eye className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Likes</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatNumber(videoData.likeCount)}
                  </p>
                </div>
                <ThumbsUp className="w-12 h-12 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Comments</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatNumber(videoData.commentCount)}
                  </p>
                </div>
                <MessageSquare className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl p-6 border border-orange-500/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Engagement Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {calculateEngagementRate(videoData.likeCount, videoData.commentCount, videoData.viewCount)}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Engagement Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Engagement Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getEngagementData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getEngagementData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Video Metrics</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">Like to View Ratio</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {((parseInt(videoData.likeCount) / parseInt(videoData.viewCount)) * 100).toFixed(2)}%
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(((parseInt(videoData.likeCount) / parseInt(videoData.viewCount)) * 100) * 10, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">Comment to View Ratio</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {((parseInt(videoData.commentCount) / parseInt(videoData.viewCount)) * 100).toFixed(2)}%
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(((parseInt(videoData.commentCount) / parseInt(videoData.viewCount)) * 100) * 10, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">Estimated Watch Time</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatNumber(parseInt(videoData.viewCount) * (formatDuration(videoData.duration).split(':').reduce((acc, time) => (60 * acc) + +time, 0) / 60))} menit
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {videoData.tags && videoData.tags.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Tags & Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {videoData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Deskripsi Video</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{videoData.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
