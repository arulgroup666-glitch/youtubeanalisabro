'use client';

import { useState } from 'react';
import { GitCompare, ThumbsUp, ThumbsDown, TrendingUp, Target, Award, Sparkles } from 'lucide-react';

export default function ABTesting() {
  const [titleA, setTitleA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [thumbnailA, setThumbnailA] = useState('');
  const [thumbnailB, setThumbnailB] = useState('');

  const analyzeTitlePower = (title: string) => {
    let score = 0;
    const insights = [];

    // Length
    if (title.length >= 60 && title.length <= 70) {
      score += 25;
      insights.push({ type: 'positive', text: 'Perfect length' });
    } else if (title.length > 70) {
      insights.push({ type: 'negative', text: 'Too long' });
      score += 10;
    } else if (title.length < 40) {
      insights.push({ type: 'negative', text: 'Too short' });
      score += 10;
    } else {
      score += 20;
    }

    // Numbers
    if (/\d+/.test(title)) {
      score += 20;
      insights.push({ type: 'positive', text: 'Contains numbers' });
    }

    // Power words
    const powerWords = ['tutorial', 'how to', 'best', 'top', 'ultimate', 'complete', 'guide', 'tips', 'tricks', 'secret', 'cara', 'terbaik', 'lengkap', 'mudah', 'cepat'];
    const hasPowerWord = powerWords.some(word => title.toLowerCase().includes(word));
    if (hasPowerWord) {
      score += 20;
      insights.push({ type: 'positive', text: 'Has power words' });
    }

    // Emotional triggers
    const emotionalWords = ['amazing', 'incredible', 'shocking', 'unbelievable', 'must see', 'wow', 'epic', 'luar biasa', 'menakjubkan', 'viral'];
    const hasEmotional = emotionalWords.some(word => title.toLowerCase().includes(word));
    if (hasEmotional) {
      score += 15;
      insights.push({ type: 'positive', text: 'Emotional trigger' });
    }

    // Brackets
    if (/[\[\(]/.test(title)) {
      score += 10;
      insights.push({ type: 'positive', text: 'Uses brackets' });
    }

    // Emoji - simple detection without unicode flag
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/;
    if (emojiRegex.test(title)) {
      score += 10;
      insights.push({ type: 'positive', text: 'Includes emoji' });
    }

    return {
      score: Math.min(100, score),
      insights,
      clickabilityScore: Math.min(100, score * 1.1),
    };
  };

  const titleAAnalysis = analyzeTitlePower(titleA);
  const titleBAnalysis = analyzeTitlePower(titleB);

  const getWinner = (scoreA: number, scoreB: number) => {
    if (Math.abs(scoreA - scoreB) < 5) return 'tie';
    return scoreA > scoreB ? 'A' : 'B';
  };

  const titleWinner = getWinner(titleAAnalysis.score, titleBAnalysis.score);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <GitCompare className="w-8 h-8 text-red-500" />
          <span>A/B Testing Tools</span>
        </h2>
        <p className="text-gray-300">
          Compare 2 versions of titles or thumbnails to determine which one has better potential for views and engagement
        </p>
      </div>

      {/* Title Comparison */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="w-6 h-6 text-blue-400" />
          <span>Title Comparison</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title A */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
              <h4 className="text-white font-semibold mb-3 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <span>Title Version A</span>
                </span>
                <span className="text-blue-400 text-2xl font-bold">{titleAAnalysis.score}</span>
              </h4>
              <textarea
                value={titleA}
                onChange={(e) => setTitleA(e.target.value)}
                placeholder="Enter title version A..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Length: {titleA.length} chars</span>
                  <span className="text-blue-400">CTR Score: {titleAAnalysis.clickabilityScore.toFixed(0)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${titleAAnalysis.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Insights A */}
              <div className="mt-4 space-y-1">
                {titleAAnalysis.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`text-xs flex items-center space-x-2 ${
                      insight.type === 'positive' ? 'text-green-300' : 'text-orange-300'
                    }`}
                  >
                    {insight.type === 'positive' ? (
                      <ThumbsUp className="w-3 h-3" />
                    ) : (
                      <ThumbsDown className="w-3 h-3" />
                    )}
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Title B */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-white font-semibold mb-3 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
                  <span>Title Version B</span>
                </span>
                <span className="text-purple-400 text-2xl font-bold">{titleBAnalysis.score}</span>
              </h4>
              <textarea
                value={titleB}
                onChange={(e) => setTitleB(e.target.value)}
                placeholder="Enter title version B..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Length: {titleB.length} chars</span>
                  <span className="text-purple-400">CTR Score: {titleBAnalysis.clickabilityScore.toFixed(0)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${titleBAnalysis.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Insights B */}
              <div className="mt-4 space-y-1">
                {titleBAnalysis.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`text-xs flex items-center space-x-2 ${
                      insight.type === 'positive' ? 'text-green-300' : 'text-orange-300'
                    }`}
                  >
                    {insight.type === 'positive' ? (
                      <ThumbsUp className="w-3 h-3" />
                    ) : (
                      <ThumbsDown className="w-3 h-3" />
                    )}
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Winner Display */}
        {titleA && titleB && (
          <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
            <div className="text-center">
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {titleWinner === 'tie' ? "It's a Tie! 🤝" : `Version ${titleWinner} Wins! 🏆`}
              </h3>
              <p className="text-gray-300 mb-4">
                {titleWinner === 'A' && `Title A has ${(titleAAnalysis.score - titleBAnalysis.score).toFixed(0)} points higher score`}
                {titleWinner === 'B' && `Title B has ${(titleBAnalysis.score - titleAAnalysis.score).toFixed(0)} points higher score`}
                {titleWinner === 'tie' && 'Both titles have similar performance potential'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Better Title</p>
                  <p className="text-yellow-400 text-2xl font-bold">
                    {titleWinner === 'tie' ? 'Both' : titleWinner}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Score Difference</p>
                  <p className="text-yellow-400 text-2xl font-bold">
                    {Math.abs(titleAAnalysis.score - titleBAnalysis.score).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Predicted CTR</p>
                  <p className="text-yellow-400 text-2xl font-bold">
                    {titleWinner === 'A' && `${titleAAnalysis.clickabilityScore.toFixed(0)}%`}
                    {titleWinner === 'B' && `${titleBAnalysis.clickabilityScore.toFixed(0)}%`}
                    {titleWinner === 'tie' && `${Math.max(titleAAnalysis.clickabilityScore, titleBAnalysis.clickabilityScore).toFixed(0)}%`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Comparison */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span>Thumbnail Comparison</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thumbnail A */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
              <span>Thumbnail Version A</span>
            </h4>
            <input
              type="text"
              value={thumbnailA}
              onChange={(e) => setThumbnailA(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
            />
            {thumbnailA && (
              <div className="relative group">
                <img
                  src={thumbnailA}
                  alt="Thumbnail A"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext fill="%239CA3AF" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white font-semibold">Thumbnail A Preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail B */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
              <span>Thumbnail Version B</span>
            </h4>
            <input
              type="text"
              value={thumbnailB}
              onChange={(e) => setThumbnailB(e.target.value)}
              placeholder="Enter image URL..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
            />
            {thumbnailB && (
              <div className="relative group">
                <img
                  src={thumbnailB}
                  alt="Thumbnail B"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext fill="%239CA3AF" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white font-semibold">Thumbnail B Preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips & Best Practices */}
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6" />
          <span>A/B Testing Best Practices</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">📝 Title Testing</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Test only ONE element at a time</li>
              <li>Use numbers vs. no numbers</li>
              <li>Try different power words</li>
              <li>Test bracket styles [2024] vs (NEW)</li>
              <li>Emoji vs. no emoji</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🎨 Thumbnail Testing</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Test different facial expressions</li>
              <li>Bright colors vs. dark colors</li>
              <li>Text vs. no text on thumbnail</li>
              <li>Close-up vs. wide shot</li>
              <li>Contrasting backgrounds</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">📊 How to Test</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Upload same video with different titles</li>
              <li>Wait 48 hours minimum for data</li>
              <li>Compare CTR in YouTube Analytics</li>
              <li>Keep winner, delete loser</li>
              <li>Document results for future reference</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">⚡ Quick Tips</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>CTR above 10% is excellent</li>
              <li>CTR 5-10% is good</li>
              <li>Below 5% needs improvement</li>
              <li>First 48 hours are most critical</li>
              <li>Iterate based on data, not gut feeling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testing Checklist */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
        <h3 className="text-xl font-bold text-white mb-4">✅ Pre-Upload Testing Checklist</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded" />
            <span className="text-white">Tested 2-3 title variations</span>
          </label>
          <label className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded" />
            <span className="text-white">Analyzed title with SEO Studio</span>
          </label>
          <label className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded" />
            <span className="text-white">Created 2-3 thumbnail options</span>
          </label>
          <label className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded" />
            <span className="text-white">Asked friends/community for feedback</span>
          </label>
          <label className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded" />
            <span className="text-white">Verified on mobile and desktop views</span>
          </label>
          <label className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded" />
            <span className="text-white">Ready to monitor performance first 48h</span>
          </label>
        </div>
      </div>
    </div>
  );
}
