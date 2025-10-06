'use client';

import { useState } from 'react';
import { Search, TrendingUp, Users, Eye, Video, Calendar, Award, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { getChannelStats, getChannelVideos, extractIdFromUrl, formatNumber } from '@/lib/youtube';
import type { ChannelStats } from '@/lib/youtube';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsDashboard() {
  const [channelInput, setChannelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState<ChannelStats | null>(null);
  const [videos, setVideos] = useState<any[]>([]);

  const handleAnalyze = async () => {
    if (!channelInput.trim()) return;

    setLoading(true);
    try {
      const { type, id } = extractIdFromUrl(channelInput);
      let channelId = channelInput;

      if (type === 'channel' && id) {
        channelId = id;
      }

      const stats = await getChannelStats(channelId);
      if (stats) {
        setChannelData(stats);
        const vids = await getChannelVideos(stats.id, 10);
        setVideos(vids);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceScore = () => {
    if (!channelData) return 0;

    const subs = parseInt(channelData.subscriberCount);
    const views = parseInt(channelData.viewCount);
    const videoCount = parseInt(channelData.videoCount);
    const avgViews = views / videoCount;
    const engagementRate = (subs / views) * 100;

    let score = 0;

    // Subscribers scoring
    if (subs > 1000000) score += 30;
    else if (subs > 100000) score += 25;
    else if (subs > 10000) score += 20;
    else if (subs > 1000) score += 15;
    else score += 10;

    // Avg views scoring
    if (avgViews > 1000000) score += 30;
    else if (avgViews > 100000) score += 25;
    else if (avgViews > 10000) score += 20;
    else if (avgViews > 1000) score += 15;
    else score += 10;

    // Engagement scoring
    if (engagementRate > 10) score += 20;
    else if (engagementRate > 5) score += 15;
    else if (engagementRate > 2) score += 10;
    else score += 5;

    // Consistency scoring
    if (videoCount > 1000) score += 20;
    else if (videoCount > 500) score += 15;
    else if (videoCount > 100) score += 10;
    else score += 5;

    return Math.min(score, 100);
  };

  const getGrowthPrediction = () => {
    if (!channelData) return { daily: 0, weekly: 0, monthly: 0 };

    const subs = parseInt(channelData.subscriberCount);
    const views = parseInt(channelData.viewCount);
    const videoCount = parseInt(channelData.videoCount);
    const avgViews = views / videoCount;

    // Simplified growth calculation based on performance
    const growthRate = (avgViews / subs) * 100;
    const dailyGrowth = Math.round(subs * (growthRate / 100) * 0.01);

    return {
      daily: dailyGrowth,
      weekly: dailyGrowth * 7,
      monthly: dailyGrowth * 30,
    };
  };

  const getChannelHealthData = () => {
    if (!channelData) return [];

    const subs = parseInt(channelData.subscriberCount);
    const views = parseInt(channelData.viewCount);
    const videoCount = parseInt(channelData.videoCount);
    const avgViews = views / videoCount;

    return [
      {
        category: 'Subscribers',
        value: Math.min((subs / 1000000) * 100, 100),
        color: '#3b82f6',
      },
      {
        category: 'Avg Views',
        value: Math.min((avgViews / 100000) * 100, 100),
        color: '#10b981',
      },
      {
        category: 'Content Volume',
        value: Math.min((videoCount / 1000) * 100, 100),
        color: '#f59e0b',
      },
      {
        category: 'Engagement',
        value: Math.min(((subs / views) * 100) * 10, 100),
        color: '#8b5cf6',
      },
    ];
  };

  const getContentStrategyScore = () => {
    if (!channelData) return [];

    const videoCount = parseInt(channelData.videoCount);
    const views = parseInt(channelData.viewCount);
    const avgViews = views / videoCount;

    return [
      { name: 'Quality', value: Math.min((avgViews / 10000) * 10, 100) },
      { name: 'Quantity', value: Math.min((videoCount / 10) * 10, 100) },
      { name: 'Consistency', value: Math.min((videoCount / 500) * 100, 100) },
      { name: 'Reach', value: Math.min((views / 10000000) * 100, 100) },
    ];
  };

  const performanceScore = channelData ? getPerformanceScore() : 0;
  const growth = channelData ? getGrowthPrediction() : { daily: 0, weekly: 0, monthly: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-8 h-8" />
          <span>Analytics Dashboard</span>
        </h2>
        <p className="text-gray-300 mb-4">
          Dashboard lengkap untuk analisa mendalam performa channel YouTube
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Channel ID atau URL"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 flex items-center space-x-2 transition-all"
          >
            <Search className="w-5 h-5" />
            <span>{loading ? 'Loading...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      {channelData && (
        <div className="space-y-6">
          {/* Performance Score */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{channelData.title}</h3>
                <p className="text-gray-300">@{channelData.customUrl}</p>
              </div>
              <img
                src={channelData.thumbnails.high}
                alt={channelData.title}
                className="w-20 h-20 rounded-full border-4 border-white/20"
              />
            </div>

            {/* Performance Score Meter */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="16"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    strokeDasharray={`${(performanceScore / 100) * 502.4} 502.4`}
                    strokeLinecap="round"
                    transform="rotate(-90 96 96)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute">
                  <div className="text-5xl font-bold text-white">{performanceScore}</div>
                  <div className="text-gray-300 text-sm">Performance Score</div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xl font-bold text-white">
                  {performanceScore >= 80 ? '🔥 Excellent' :
                   performanceScore >= 60 ? '👍 Good' :
                   performanceScore >= 40 ? '📈 Average' : '🚀 Growing'}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-400" />
                <div className="text-right">
                  <p className="text-sm text-gray-300">Total Subscribers</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(channelData.subscriberCount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-green-400" />
                <div className="text-right">
                  <p className="text-sm text-gray-300">Total Views</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(channelData.viewCount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl p-6 border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <Video className="w-8 h-8 text-orange-400" />
                <div className="text-right">
                  <p className="text-sm text-gray-300">Total Videos</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(channelData.videoCount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div className="text-right">
                  <p className="text-sm text-gray-300">Avg Views</p>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(parseInt(channelData.viewCount) / parseInt(channelData.videoCount))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Prediction */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span>📈 Growth Prediction</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm mb-2">Daily Growth</p>
                <p className="text-3xl font-bold text-white">+{formatNumber(growth.daily)}</p>
                <p className="text-green-400 text-sm mt-1">subscribers/day</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm mb-2">Weekly Growth</p>
                <p className="text-3xl font-bold text-white">+{formatNumber(growth.weekly)}</p>
                <p className="text-green-400 text-sm mt-1">subscribers/week</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-gray-300 text-sm mb-2">Monthly Growth</p>
                <p className="text-3xl font-bold text-white">+{formatNumber(growth.monthly)}</p>
                <p className="text-green-400 text-sm mt-1">subscribers/month</p>
              </div>
            </div>
          </div>

          {/* Channel Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">💪 Channel Health</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getChannelHealthData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.value.toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getChannelHealthData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Content Strategy Score</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getContentStrategyScore()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="url(#colorValue)"
                  />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">💡 AI Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
                <h4 className="text-white font-semibold mb-2">🎯 Strengths</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>✓ {parseInt(channelData.subscriberCount) > 100000 ? 'Strong subscriber base' : 'Growing subscriber base'}</li>
                  <li>✓ {parseInt(channelData.videoCount) > 100 ? 'Consistent content creator' : 'Active content creator'}</li>
                  <li>✓ {(parseInt(channelData.viewCount) / parseInt(channelData.videoCount)) > 10000 ? 'High engagement per video' : 'Good video performance'}</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
                <h4 className="text-white font-semibold mb-2">📈 Growth Opportunities</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Upload lebih konsisten untuk boost algorithm</li>
                  <li>• Fokus pada topik dengan high engagement</li>
                  <li>• Optimize SEO tags dan thumbnails</li>
                  <li>• Collaborate dengan channel serupa</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!channelData && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-12 border border-white/10 text-center">
          <LineChartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics Dashboard</h3>
          <p className="text-gray-400">
            Masukkan Channel ID untuk melihat analisa mendalam dengan AI-powered insights
          </p>
        </div>
      )}
    </div>
  );
}
