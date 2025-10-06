'use client';

import { useState } from 'react';
import { Award, Target, FileText, Tag as TagIcon, AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function SEOStudio() {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoTags, setVideoTags] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');

  const calculateTitleScore = () => {
    let score = 0;
    const issues = [];
    const tips = [];

    // Length check (optimal 60-70 chars)
    if (videoTitle.length >= 60 && videoTitle.length <= 70) {
      score += 30;
      tips.push('✅ Panjang judul optimal (60-70 karakter)');
    } else if (videoTitle.length > 0) {
      if (videoTitle.length < 60) {
        issues.push('⚠️ Judul terlalu pendek. Optimal: 60-70 karakter');
        score += 15;
      } else {
        issues.push('⚠️ Judul terlalu panjang. Optimal: 60-70 karakter');
        score += 15;
      }
    }

    // Keyword placement
    if (targetKeyword && videoTitle.toLowerCase().includes(targetKeyword.toLowerCase())) {
      const keywordPosition = videoTitle.toLowerCase().indexOf(targetKeyword.toLowerCase());
      if (keywordPosition <= 10) {
        score += 30;
        tips.push('✅ Keyword ditemukan di awal judul');
      } else {
        score += 20;
        tips.push('⚠️ Keyword sebaiknya di awal judul');
      }
    } else if (targetKeyword) {
      issues.push('❌ Keyword tidak ditemukan di judul');
    }

    // Numbers in title (clickbait element)
    if (/\d+/.test(videoTitle)) {
      score += 10;
      tips.push('✅ Menggunakan angka dalam judul');
    } else {
      issues.push('💡 Pertimbangkan menambahkan angka (e.g., "5 Cara", "2024")');
    }

    // Power words
    const powerWords = ['tutorial', 'cara', 'tips', 'trik', 'rahasia', 'mudah', 'cepat', 'lengkap', 'terbaik', 'gratis', 'free', 'how to', 'best', 'ultimate', 'complete'];
    const hasPowerWord = powerWords.some(word => videoTitle.toLowerCase().includes(word));
    if (hasPowerWord) {
      score += 10;
      tips.push('✅ Menggunakan power words');
    } else {
      issues.push('💡 Gunakan power words (tutorial, cara, tips, mudah, dll)');
    }

    // Brackets/Parentheses
    if (/[\[\(]/.test(videoTitle)) {
      score += 10;
      tips.push('✅ Menggunakan brackets untuk emphasis');
    }

    // All caps check (negative)
    if (videoTitle === videoTitle.toUpperCase() && videoTitle.length > 5) {
      issues.push('❌ Hindari ALL CAPS di seluruh judul');
      score -= 10;
    }

    // Emoji check
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(videoTitle)) {
      score += 10;
      tips.push('✅ Menggunakan emoji untuk menarik perhatian');
    } else {
      issues.push('💡 Pertimbangkan menambahkan emoji yang relevan');
    }

    return { score: Math.max(0, Math.min(100, score)), issues, tips };
  };

  const calculateDescriptionScore = () => {
    let score = 0;
    const issues = [];
    const tips = [];

    // Length check (optimal 200+ chars)
    if (videoDescription.length >= 200) {
      score += 25;
      tips.push('✅ Deskripsi cukup panjang');
    } else if (videoDescription.length > 0) {
      issues.push(`⚠️ Deskripsi terlalu pendek (${videoDescription.length}/200 karakter)`);
      score += (videoDescription.length / 200) * 25;
    }

    // Keyword in first 100 chars
    if (targetKeyword && videoDescription.length >= 100) {
      const first100 = videoDescription.substring(0, 100).toLowerCase();
      if (first100.includes(targetKeyword.toLowerCase())) {
        score += 25;
        tips.push('✅ Keyword di 100 karakter pertama');
      } else {
        issues.push('❌ Keyword harus di 100 karakter pertama');
      }
    }

    // Keyword frequency
    if (targetKeyword && videoDescription.length > 0) {
      const keywordCount = (videoDescription.toLowerCase().match(new RegExp(targetKeyword.toLowerCase(), 'g')) || []).length;
      if (keywordCount >= 2 && keywordCount <= 4) {
        score += 20;
        tips.push(`✅ Keyword muncul ${keywordCount}x (optimal: 2-4x)`);
      } else if (keywordCount === 1) {
        score += 10;
        issues.push('⚠️ Keyword hanya muncul 1x, optimal: 2-4x');
      } else if (keywordCount > 4) {
        score += 5;
        issues.push('⚠️ Keyword terlalu sering (keyword stuffing)');
      } else {
        issues.push('❌ Keyword tidak ditemukan di deskripsi');
      }
    }

    // Links check
    const hasLinks = /https?:\/\//.test(videoDescription);
    if (hasLinks) {
      score += 15;
      tips.push('✅ Menggunakan links (social media, website)');
    } else {
      issues.push('💡 Tambahkan links ke social media atau website');
    }

    // Timestamps check
    const hasTimestamps = /\d+:\d+/.test(videoDescription);
    if (hasTimestamps) {
      score += 15;
      tips.push('✅ Menggunakan timestamps');
    } else {
      issues.push('💡 Tambahkan timestamps untuk navigasi mudah');
    }

    return { score: Math.max(0, Math.min(100, score)), issues, tips };
  };

  const calculateTagsScore = () => {
    let score = 0;
    const issues = [];
    const tips = [];

    const tagsArray = videoTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Quantity check (optimal 15-20 tags)
    if (tagsArray.length >= 15 && tagsArray.length <= 20) {
      score += 30;
      tips.push(`✅ Jumlah tags optimal (${tagsArray.length} tags)`);
    } else if (tagsArray.length > 0) {
      if (tagsArray.length < 15) {
        issues.push(`⚠️ Tambahkan lebih banyak tags (${tagsArray.length}/15-20)`);
        score += (tagsArray.length / 15) * 30;
      } else {
        issues.push('⚠️ Terlalu banyak tags, fokus pada yang paling relevan');
        score += 20;
      }
    }

    // Keyword in tags
    if (targetKeyword && tagsArray.length > 0) {
      const hasTargetKeyword = tagsArray.some(tag => tag.toLowerCase() === targetKeyword.toLowerCase());
      if (hasTargetKeyword) {
        score += 25;
        tips.push('✅ Target keyword ada dalam tags');
      } else {
        issues.push('❌ Target keyword harus menjadi tag pertama');
      }
    }

    // Mix of broad and specific
    const hasShortTags = tagsArray.some(tag => tag.split(' ').length === 1);
    const hasLongTags = tagsArray.some(tag => tag.split(' ').length >= 3);
    if (hasShortTags && hasLongTags) {
      score += 25;
      tips.push('✅ Mix broad tags & specific long-tail tags');
    } else if (tagsArray.length > 0) {
      issues.push('⚠️ Gunakan mix: broad tags (1 kata) & long-tail tags (3+ kata)');
      score += 15;
    }

    // Tag length check
    const tooLongTags = tagsArray.filter(tag => tag.length > 30);
    if (tooLongTags.length > 0) {
      issues.push(`⚠️ ${tooLongTags.length} tags terlalu panjang (>30 karakter)`);
    } else if (tagsArray.length > 0) {
      score += 20;
      tips.push('✅ Semua tags memiliki panjang yang baik');
    }

    return { score: Math.max(0, Math.min(100, score)), issues, tips, count: tagsArray.length };
  };

  const titleResult = calculateTitleScore();
  const descriptionResult = calculateDescriptionScore();
  const tagsResult = calculateTagsScore();
  const overallScore = Math.round((titleResult.score + descriptionResult.score + tagsResult.score) / 3);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="w-8 h-8 text-red-500" />
          <span>SEO Studio - Video Optimizer</span>
        </h2>
        <p className="text-gray-300">
          Analisa dan optimalkan SEO video Anda untuk ranking yang lebih baik di YouTube search
        </p>
      </div>

      {/* Overall SEO Score */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">Overall SEO Score</p>
          <div className={`text-6xl font-bold ${getScoreColor(overallScore)} mb-4`}>
            {overallScore}/100
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div
              className={`bg-gradient-to-r ${getScoreGradient(overallScore)} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
          <p className="text-gray-300">
            {overallScore >= 80 && '🎉 Excellent! Video Anda sangat ter-optimasi'}
            {overallScore >= 60 && overallScore < 80 && '👍 Good! Masih ada ruang untuk improvement'}
            {overallScore >= 40 && overallScore < 60 && '⚠️ Average. Perlu optimasi lebih lanjut'}
            {overallScore < 40 && '❌ Poor. Video perlu optimasi signifikan'}
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Keyword */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <label className="text-white font-semibold mb-2 flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>Target Keyword</span>
          </label>
          <input
            type="text"
            value={targetKeyword}
            onChange={(e) => setTargetKeyword(e.target.value)}
            placeholder="e.g., tutorial javascript"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-gray-400 text-sm mt-2">Keyword utama yang ingin Anda targetkan</p>
        </div>

        {/* Title Input */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <label className="text-white font-semibold mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Video Title</span>
            </span>
            <span className={`text-sm ${getScoreColor(titleResult.score)}`}>
              Score: {titleResult.score}/100
            </span>
          </label>
          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Enter your video title..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-400 text-sm">{videoTitle.length} / 60-70 characters</p>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${getScoreGradient(titleResult.score)} h-2 rounded-full transition-all`}
                style={{ width: `${titleResult.score}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Input */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <label className="text-white font-semibold mb-2 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-400" />
            <span>Video Description</span>
          </span>
          <span className={`text-sm ${getScoreColor(descriptionResult.score)}`}>
            Score: {descriptionResult.score}/100
          </span>
        </label>
        <textarea
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          placeholder="Enter your video description... (Minimum 200 characters recommended)"
          rows={6}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-400 text-sm">{videoDescription.length} characters</p>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${getScoreGradient(descriptionResult.score)} h-2 rounded-full transition-all`}
              style={{ width: `${descriptionResult.score}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tags Input */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <label className="text-white font-semibold mb-2 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <TagIcon className="w-5 h-5 text-orange-400" />
            <span>Video Tags</span>
          </span>
          <span className={`text-sm ${getScoreColor(tagsResult.score)}`}>
            Score: {tagsResult.score}/100
          </span>
        </label>
        <textarea
          value={videoTags}
          onChange={(e) => setVideoTags(e.target.value)}
          placeholder="Enter tags separated by commas (e.g., tutorial, javascript, programming, coding)"
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-400 text-sm">{tagsResult.count} tags (Recommended: 15-20)</p>
          <div className="w-32 bg-gray-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${getScoreGradient(tagsResult.score)} h-2 rounded-full transition-all`}
              style={{ width: `${tagsResult.score}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Title Analysis */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>Title Analysis</span>
          </h3>
          <div className="space-y-2">
            {titleResult.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-green-300">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
            {titleResult.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-orange-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description Analysis */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-green-400" />
            <span>Description Analysis</span>
          </h3>
          <div className="space-y-2">
            {descriptionResult.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-green-300">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
            {descriptionResult.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-orange-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Analysis */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <TagIcon className="w-6 h-6 text-orange-400" />
            <span>Tags Analysis</span>
          </h3>
          <div className="space-y-2">
            {tagsResult.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-green-300">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
            {tagsResult.issues.map((issue, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm text-orange-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Best Practices */}
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6" />
          <span>SEO Best Practices</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">📌 Title Optimization</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>60-70 karakter untuk tampilan optimal</li>
              <li>Keyword di awal judul</li>
              <li>Gunakan angka dan power words</li>
              <li>Tambahkan emoji yang relevan</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">📝 Description Tips</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Minimum 200 karakter</li>
              <li>Keyword di 100 karakter pertama</li>
              <li>Gunakan keyword 2-4x</li>
              <li>Tambahkan timestamps & links</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🏷️ Tags Strategy</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>15-20 tags optimal</li>
              <li>Target keyword sebagai tag pertama</li>
              <li>Mix broad & long-tail tags</li>
              <li>Maksimal 30 karakter per tag</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🎯 General Tips</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Riset keyword sebelum upload</li>
              <li>Analisa kompetitor top-ranking</li>
              <li>Update metadata secara berkala</li>
              <li>Monitor performa & adjust</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
