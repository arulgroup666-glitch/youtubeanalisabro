'use client';

import { useState } from 'react';
import { Youtube, Search, TrendingUp, Tag, Target, Sparkles } from 'lucide-react';
import TrendingVideos from '@/components/TrendingVideos';
import KeywordAnalysis from '@/components/KeywordAnalysis';
import CompetitorAnalysis from '@/components/CompetitorAnalysis';
import TagGenerator from '@/components/TagGenerator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'trending' | 'keyword' | 'competitor' | 'tags'>('trending');

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
                <p className="text-sm text-gray-300">Exclusive Tools NOT Available in YouTube Studio</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">100% FREE</span>
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
              onClick={() => setActiveTab('trending')}
              className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-lg transition-all ${
                activeTab === 'trending'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="font-medium">Trending Videos</span>
            </button>

            <button
              onClick={() => setActiveTab('keyword')}
              className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-lg transition-all ${
                activeTab === 'keyword'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Search className="w-6 h-6" />
              <span className="font-medium">Keyword Research</span>
            </button>

            <button
              onClick={() => setActiveTab('competitor')}
              className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-lg transition-all ${
                activeTab === 'competitor'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Target className="w-6 h-6" />
              <span className="font-medium">Competitor Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('tags')}
              className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-lg transition-all ${
                activeTab === 'tags'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Tag className="w-6 h-6" />
              <span className="font-medium">Tag Generator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {activeTab === 'trending' && <TrendingVideos />}
        {activeTab === 'keyword' && <KeywordAnalysis />}
        {activeTab === 'competitor' && <CompetitorAnalysis />}
        {activeTab === 'tags' && <TagGenerator />}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>© 2025 YouTube Analytics Pro - 100% FREE Forever</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </p>
            <p className="mt-2 text-gray-500">Exclusive tools NOT available in YouTube Studio</p>
            <p className="mt-2 text-xs text-gray-600">Powered by YouTube Data API v3</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
