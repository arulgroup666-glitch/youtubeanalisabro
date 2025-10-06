'use client';

import { useState } from 'react';
import { Search, Users, Eye, Video, Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import { getChannelStats, getChannelVideos, extractIdFromUrl, formatNumber } from '@/lib/youtube';
import type { ChannelStats } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ChannelAnalytics() {
  const [channelInput, setChannelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState<ChannelStats | null>(null);
  const [channelVideos, setChannelVideos] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!channelInput.trim()) return;

    setLoading(true);
    try {
      const { type, id } = extractIdFromUrl(channelInput);
      let channelId = channelInput;

      if (type === 'channel' && id) {
        channelId = id;
      }

      const stats = await getChannelStats(channelId);
      setChannelData(stats);

      if (stats) {
        const videos = await getChannelVideos(stats.id, 12);
        setChannelVideos(videos);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat data channel. Pastikan Channel ID atau URL valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Analisa Channel YouTube</h2>
        <p className="text-gray-300 mb-4">
          Masukkan Channel ID atau URL channel untuk melihat statistik lengkap
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Channel ID atau URL (contoh: UCxxxxxxx atau youtube.com/@channelname)"
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

      {/* Channel Statistics */}
      {channelData && (
        <div className="space-y-6">
          {/* Channel Info */}
          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30">
            <div className="flex items-start space-x-4">
              <img
                src={channelData.thumbnails.high}
                alt={channelData.title}
                className="w-24 h-24 rounded-full border-4 border-white/20"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{channelData.title}</h3>
                {channelData.customUrl && (
                  <p className="text-gray-300">@{channelData.customUrl}</p>
                )}
                <p className="text-gray-300 mt-2 line-clamp-2">{channelData.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {format(new Date(channelData.publishedAt), 'dd MMM yyyy', { locale: id })}</span>
                  </div>
                  {channelData.country && (
                    <span>📍 {channelData.country}</span>
                  )}
                </div>
              </div>
              <a
                href={`https://youtube.com/channel/${channelData.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 transition-colors"
              >
                <ExternalLink className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Subscribers</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatNumber(channelData.subscriberCount)}
                  </p>
                </div>
                <Users className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Views</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatNumber(channelData.viewCount)}
                  </p>
                </div>
                <Eye className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Videos</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatNumber(channelData.videoCount)}
                  </p>
                </div>
                <Video className="w-12 h-12 text-red-400" />
              </div>
            </div>
          </div>

          {/* Channel Insights */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Channel Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 text-sm">Rata-rata Views per Video</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatNumber(parseInt(channelData.viewCount) / parseInt(channelData.videoCount))}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 text-sm">Subscriber to View Ratio</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {((parseInt(channelData.subscriberCount) / parseInt(channelData.viewCount)) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Recent Videos */}
          {channelVideos.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Video Terbaru</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {channelVideos.map((video) => (
                  <a
                    key={video.id.videoId}
                    href={`https://youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all card-hover"
                  >
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="text-white font-medium line-clamp-2 text-sm">
                        {video.snippet.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-2">
                        {format(new Date(video.snippet.publishedAt), 'dd MMM yyyy', { locale: id })}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
