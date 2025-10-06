'use client';

import { useState } from 'react';
import { Tag, Search, Copy, Check, Sparkles, TrendingUp, Hash } from 'lucide-react';
import { searchYouTube } from '@/lib/youtube';

export default function TagGenerator() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const generateTags = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      // Search videos untuk ambil tags
      const videos = await searchYouTube(keyword, 'video', 20);

      // Generate tags berdasarkan keyword
      const generatedTags = [
        keyword,
        `${keyword} tutorial`,
        `${keyword} indonesia`,
        `${keyword} 2025`,
        `cara ${keyword}`,
        `belajar ${keyword}`,
        `${keyword} untuk pemula`,
        `${keyword} lengkap`,
        `${keyword} bahasa indonesia`,
        `${keyword} terbaru`,
        `tips ${keyword}`,
        `panduan ${keyword}`,
        `${keyword} mudah`,
        `${keyword} gratis`,
        `${keyword} step by step`,
        `${keyword} dasar`,
        `${keyword} advanced`,
        `${keyword} tips dan trik`,
        `${keyword} update`,
        `${keyword} live`,
      ];

      // Tambah variasi
      const variations = [
        keyword.toLowerCase(),
        keyword.toUpperCase(),
        keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      ];

      const allTags = [...new Set([...generatedTags, ...variations])];
      setTags(allTags);
      setSelectedTags([]);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal generate tags');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 30) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        alert('Maksimal 30 tags (YouTube limit)');
      }
    }
  };

  const copyTags = () => {
    const tagString = selectedTags.length > 0 ? selectedTags.join(', ') : tags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectAll = () => {
    setSelectedTags(tags.slice(0, 30));
  };

  const clearSelection = () => {
    setSelectedTags([]);
  };

  const popularCategories = [
    { name: 'Tutorial', emoji: '📚', keywords: ['tutorial', 'belajar', 'cara', 'panduan', 'guide'] },
    { name: 'Review', emoji: '⭐', keywords: ['review', 'unboxing', 'hands-on', 'first impression'] },
    { name: 'Gaming', emoji: '🎮', keywords: ['gameplay', 'walkthrough', 'tips', 'guide', 'gaming'] },
    { name: 'Vlog', emoji: '📹', keywords: ['vlog', 'daily', 'life', 'story', 'behind the scenes'] },
    { name: 'Tech', emoji: '💻', keywords: ['technology', 'gadget', 'smartphone', 'laptop', 'tech'] },
    { name: 'Food', emoji: '🍔', keywords: ['recipe', 'cooking', 'food', 'kuliner', 'masak'] },
  ];

  const addCategoryTags = (keywords: string[]) => {
    const newTags = keywords.filter(k => !tags.includes(k));
    setTags([...tags, ...newTags]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Tag className="w-8 h-8" />
          <span>Smart Tag Generator</span>
        </h2>
        <p className="text-gray-300 mb-4">
          Generate tags optimal untuk meningkatkan SEO dan discoverability video YouTube
        </p>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateTags()}
            placeholder="Masukkan topik video atau keyword utama..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={generateTags}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            <span>{loading ? 'Generating...' : 'Generate Tags'}</span>
          </button>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">📂 Kategori Populer</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => addCategoryTags(cat.keywords)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-center"
            >
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="text-white text-sm font-medium">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Tags */}
      {tags.length > 0 && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">
                  {selectedTags.length > 0 ? selectedTags.length : tags.length} tags
                </span>
                <span className="text-gray-400 text-sm">
                  {selectedTags.length > 0 && `(${selectedTags.length}/30 selected)`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={selectAll}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                >
                  Select 30
                </button>
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={copyTags}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm transition-all flex items-center space-x-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy All'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tags Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">🏷️ Generated Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white/50 scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/20'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Tags Output */}
          {selectedTags.length > 0 && (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-bold text-white mb-4">✅ Tags Terpilih ({selectedTags.length}/30)</h3>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-white">
                {selectedTags.join(', ')}
              </div>
              <p className="text-gray-300 text-sm mt-3">
                💡 Copy tags ini dan paste di bagian "Tags" saat upload video YouTube
              </p>
            </div>
          )}

          {/* SEO Tips */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span>💡 Tips Optimasi Tags</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">✅ Yang Harus Dilakukan</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Gunakan keyword utama di tag pertama</li>
                  <li>• Maksimal 30 tags (YouTube limit)</li>
                  <li>• Mix broad & specific tags</li>
                  <li>• Gunakan tags yang relevan dengan konten</li>
                  <li>• Include variasi keyword (singular/plural)</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">❌ Yang Harus Dihindari</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Jangan pakai tags tidak relevan (misleading)</li>
                  <li>• Hindari spam tags atau repetitive</li>
                  <li>• Jangan copy tags kompetitor mentah-mentah</li>
                  <li>• Hindari tags terlalu umum saja</li>
                  <li>• Jangan lebih dari 30 tags</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tag Strategy */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-lg font-bold text-white mb-4">🎯 Strategi Tags Optimal</h3>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">1. Broad Tags (5-7 tags)</h4>
                <p className="text-gray-300 text-sm">
                  Gunakan tags umum untuk reach lebih luas. Contoh: "tutorial", "indonesia", "2025"
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">2. Specific Tags (15-20 tags)</h4>
                <p className="text-gray-300 text-sm">
                  Tags spesifik sesuai konten video. Contoh: "{keyword} lengkap", "cara {keyword}"
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-pink-300 font-semibold mb-2">3. Long-tail Tags (5-8 tags)</h4>
                <p className="text-gray-300 text-sm">
                  Tags panjang dengan kompetisi rendah. Contoh: "{keyword} untuk pemula bahasa indonesia"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tags.length === 0 && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-12 border border-white/10 text-center">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Generate Tags Otomatis</h3>
          <p className="text-gray-400">
            Masukkan keyword atau topik video, dan kami akan generate tags optimal untuk SEO
          </p>
        </div>
      )}
    </div>
  );
}
