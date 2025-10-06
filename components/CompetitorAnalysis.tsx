'use client';

import { useState } from 'react';
import { Search, Users, Eye, Video, TrendingUp, X, Plus, BarChart3, Target } from 'lucide-react';
import { getChannelStats, extractIdFromUrl, formatNumber } from '@/lib/youtube';
import type { ChannelStats } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CompetitorData extends ChannelStats {
  color: string;
}

export default function CompetitorAnalysis() {
  const [channelInput, setChannelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);

  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const handleAddChannel = async () => {
    if (!channelInput.trim()) return;
    if (competitors.length >= 5) {
      alert('Maksimal 5 channel untuk perbandingan');
      return;
    }

    setLoading(true);
    try {
      const { type, id } = extractIdFromUrl(channelInput);
      let channelId = channelInput;

      if (type === 'channel' && id) {
        channelId = id;
      }

      const stats = await getChannelStats(channelId);
      if (stats) {
        const competitorData: CompetitorData = {
          ...stats,
          color: colors[competitors.length],
        };
        setCompetitors([...competitors, competitorData]);
        setChannelInput('');
      } else {
        alert('Channel tidak ditemukan');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat data channel');
    } finally {
      setLoading(false);
    }
  };

  const removeChannel = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const getComparisonData = () => {
    return [
      {
        metric: 'Subscribers',
        ...competitors.reduce((acc, comp, idx) => ({
          ...acc,
          [comp.title.substring(0, 15)]: parseInt(comp.subscriberCount),
        }), {}),
      },
      {
        metric: 'Total Views',
        ...competitors.reduce((acc, comp, idx) => ({
          ...acc,
          [comp.title.substring(0, 15)]: parseInt(comp.viewCount) / 1000000, // in millions
        }), {}),
      },
      {
        metric: 'Videos',
        ...competitors.reduce((acc, comp, idx) => ({
          ...acc,
          [comp.title.substring(0, 15)]: parseInt(comp.videoCount),
        }), {}),
      },
    ];
  };

  const getRadarData = () => {
    if (competitors.length === 0) return [];

    const maxSubs = Math.max(...competitors.map(c => parseInt(c.subscriberCount)));
    const maxViews = Math.max(...competitors.map(c => parseInt(c.viewCount)));
    const maxVideos = Math.max(...competitors.map(c => parseInt(c.videoCount)));

    return competitors.map(comp => ({
      channel: comp.title.substring(0, 15),
      Subscribers: (parseInt(comp.subscriberCount) / maxSubs) * 100,
      Views: (parseInt(comp.viewCount) / maxViews) * 100,
      Videos: (parseInt(comp.videoCount) / maxVideos) * 100,
      AvgViews: ((parseInt(comp.viewCount) / parseInt(comp.videoCount)) / (maxViews / maxVideos)) * 100,
      Engagement: ((parseInt(comp.subscriberCount) / parseInt(comp.viewCount)) * 100) * 10,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="w-8 h-8" />
          <span>Competitor Analysis</span>
        </h2>
        <p className="text-gray-300 mb-4">
          Bandingkan hingga 5 channel sekaligus untuk analisa kompetitor
        </p>

        {/* Add Channel Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddChannel()}
            placeholder="Channel ID atau URL"
            disabled={competitors.length >= 5}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          />
          <button
            onClick={handleAddChannel}
            disabled={loading || competitors.length >= 5}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>{loading ? 'Loading...' : 'Add Channel'}</span>
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-2">
          {competitors.length}/5 channel ditambahkan
        </p>
      </div>

      {/* Channel Cards */}
      {competitors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((comp, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 card-hover relative"
              style={{ borderLeftColor: comp.color, borderLeftWidth: '4px' }}
            >
              <button
                onClick={() => removeChannel(index)}
                className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500 rounded-full transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-start space-x-3">
                <img
                  src={comp.thumbnails.medium}
                  alt={comp.title}
                  className="w-16 h-16 rounded-full border-2"
                  style={{ borderColor: comp.color }}
                />
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm line-clamp-1">{comp.title}</h3>
                  {comp.customUrl && (
                    <p className="text-gray-400 text-xs">@{comp.customUrl}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-white/5 rounded p-2">
                  <p className="text-gray-400 text-xs">Subs</p>
                  <p className="text-white font-bold text-sm">{formatNumber(comp.subscriberCount)}</p>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <p className="text-gray-400 text-xs">Views</p>
                  <p className="text-white font-bold text-sm">{formatNumber(comp.viewCount)}</p>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <p className="text-gray-400 text-xs">Videos</p>
                  <p className="text-white font-bold text-sm">{formatNumber(comp.videoCount)}</p>
                </div>
              </div>

              <div className="mt-3 bg-white/5 rounded p-2">
                <p className="text-gray-400 text-xs">Avg Views/Video</p>
                <p className="text-white font-bold text-sm">
                  {formatNumber(parseInt(comp.viewCount) / parseInt(comp.videoCount))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Charts */}
      {competitors.length >= 2 && (
        <div className="space-y-6">
          {/* Bar Chart Comparison */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Perbandingan Statistik</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="metric" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {competitors.map((comp, idx) => (
                  <Bar
                    key={idx}
                    dataKey={comp.title.substring(0, 15)}
                    fill={comp.color}
                    radius={[8, 8, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Radar Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={getRadarData()}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis dataKey="channel" stroke="#fff" />
                <PolarRadiusAxis stroke="#fff" />
                {competitors.map((comp, idx) => (
                  <Radar
                    key={idx}
                    name={comp.title.substring(0, 15)}
                    dataKey="Subscribers"
                    stroke={comp.color}
                    fill={comp.color}
                    fillOpacity={0.3}
                  />
                ))}
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Winner Analysis */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <span>Top Performer Analysis</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">🏆 Most Subscribers</p>
                <p className="text-white font-bold">
                  {competitors.reduce((prev, current) =>
                    parseInt(prev.subscriberCount) > parseInt(current.subscriberCount) ? prev : current
                  ).title}
                </p>
                <p className="text-yellow-400 text-sm mt-1">
                  {formatNumber(
                    Math.max(...competitors.map(c => parseInt(c.subscriberCount)))
                  )} subscribers
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">👁️ Most Views</p>
                <p className="text-white font-bold">
                  {competitors.reduce((prev, current) =>
                    parseInt(prev.viewCount) > parseInt(current.viewCount) ? prev : current
                  ).title}
                </p>
                <p className="text-blue-400 text-sm mt-1">
                  {formatNumber(
                    Math.max(...competitors.map(c => parseInt(c.viewCount)))
                  )} views
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">📊 Best Avg Views</p>
                <p className="text-white font-bold">
                  {competitors.reduce((prev, current) => {
                    const prevAvg = parseInt(prev.viewCount) / parseInt(prev.videoCount);
                    const currentAvg = parseInt(current.viewCount) / parseInt(current.videoCount);
                    return prevAvg > currentAvg ? prev : current;
                  }).title}
                </p>
                <p className="text-green-400 text-sm mt-1">
                  {formatNumber(
                    Math.max(...competitors.map(c =>
                      parseInt(c.viewCount) / parseInt(c.videoCount)
                    ))
                  )} avg views
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">💡 Key Insights</h3>
            <div className="space-y-3">
              {competitors.map((comp, idx) => {
                const avgViews = parseInt(comp.viewCount) / parseInt(comp.videoCount);
                const subToViewRatio = (parseInt(comp.subscriberCount) / parseInt(comp.viewCount)) * 100;

                return (
                  <div key={idx} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: comp.color }}
                      ></div>
                      <h4 className="text-white font-semibold">{comp.title}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Upload Frequency</p>
                        <p className="text-white">
                          ~{Math.round(parseInt(comp.videoCount) / 365)} videos/hari
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Content Performance</p>
                        <p className="text-white">
                          {avgViews > 1000000 ? '🔥 Excellent' : avgViews > 100000 ? '👍 Good' : '📈 Growing'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Subscriber Loyalty</p>
                        <p className="text-white">
                          {subToViewRatio > 10 ? '💎 High' : subToViewRatio > 5 ? '⭐ Medium' : '📊 Low'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {competitors.length === 0 && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-12 border border-white/10 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Belum Ada Channel</h3>
          <p className="text-gray-400">
            Tambahkan minimal 2 channel untuk memulai analisa kompetitor
          </p>
        </div>
      )}
    </div>
  );
}
