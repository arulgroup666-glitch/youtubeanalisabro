'use client';

import { useState } from 'react';
import { Youtube, Search, TrendingUp, BarChart3, Users, Eye, ThumbsUp, MessageSquare, Calendar, Video } from 'lucide-react';
import ChannelAnalytics from '@/components/ChannelAnalytics';
import VideoAnalytics from '@/components/VideoAnalytics';
import TrendingVideos from '@/components/TrendingVideos';
import KeywordAnalysis from '@/components/KeywordAnalysis';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'channel' | 'video' | 'trending' | 'keyword'>('channel');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Youtube className="w-10 h-10 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">YouTube Analytics Pro</h1>
                <p className="text-sm text-gray-300">Platform Analitik YouTube Lengkap</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
                <Eye className="w-4 h-4" />
                <span>Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('channel')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'channel'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Channel Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="font-medium">Video Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'trending'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('keyword')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'keyword'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Keyword & SEO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {activeTab === 'channel' && <ChannelAnalytics />}
        {activeTab === 'video' && <VideoAnalytics />}
        {activeTab === 'trending' && <TrendingVideos />}
        {activeTab === 'keyword' && <KeywordAnalysis />}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 YouTube Analytics Pro. Dibuat dengan ❤️ untuk YouTubers Indonesia</p>
            <p className="mt-2">Powered by YouTube Data API v3</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
