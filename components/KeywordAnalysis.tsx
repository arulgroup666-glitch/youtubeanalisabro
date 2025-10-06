'use client';

import { useState } from 'react';
import { Search, TrendingUp, Eye, Video, Clock, ExternalLink, Award } from 'lucide-react';
import { searchYouTube, formatNumber } from '@/lib/youtube';
import type { SearchResult } from '@/lib/youtube';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function KeywordAnalysis() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchType, setSearchType] = useState<'video' | 'channel'>('video');

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const data = await searchYouTube(keyword, searchType, 20);
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal melakukan pencarian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const popularKeywords = [
    'tutorial programming',
    'belajar coding',
    'web development',
    'javascript tutorial',
    'react js',
    'python programming',
    'machine learning',
    'data science',
  ];

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Keyword & SEO Analysis</h2>
        <p className="text-gray-300 mb-4">
          Cari dan analisa keyword untuk menemukan peluang konten dan strategi SEO YouTube
        </p>

        {/* Search Type Toggle */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSearchType('video')}
            className={`px-4 py-2 rounded-lg transition-all ${
              searchType === 'video'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Cari Video
          </button>
          <button
            onClick={() => setSearchType('channel')}
            className={`px-4 py-2 rounded-lg transition-all ${
              searchType === 'channel'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Cari Channel
          </button>
        </div>

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
                onClick={() => setKeyword(kw)}
                className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm hover:bg-white/10 transition-all"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-300 mt-4">Mencari {searchType === 'video' ? 'video' : 'channel'}...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white">
              Ditemukan {results.length} {searchType === 'video' ? 'video' : 'channel'} untuk keyword "{keyword}"
            </h3>
            <p className="text-gray-300 mt-2">
              Analisa hasil pencarian untuk mendapatkan insight tentang kompetisi dan peluang konten
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <div
                key={result.id}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 card-hover"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={result.thumbnails.medium}
                    alt={result.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                    #{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-white font-semibold line-clamp-2">
                    {result.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {result.description}
                  </p>

                  {/* Channel Info */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{result.channelTitle}</span>
                  </div>

                  {/* Published Date */}
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(result.publishedAt), 'dd MMM yyyy', { locale: id })}</span>
                  </div>

                  {/* Type Badge */}
                  <div className="flex items-center space-x-2">
                    {result.type === 'video' ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs border border-red-500/30">
                        Video
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">
                        Channel
                      </span>
                    )}
                  </div>

                  {/* View Button */}
                  <a
                    href={
                      result.type === 'video'
                        ? `https://youtube.com/watch?v=${result.id}`
                        : `https://youtube.com/channel/${result.id}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat di YouTube</span>
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
