'use client';

import { useState } from 'react';
import { Search, TrendingUp, Target, Award, BarChart3, Zap, AlertTriangle } from 'lucide-react';
import { searchVideosWithStats } from '@/lib/youtube';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: number;
  difficulty: number;
  opportunity: number;
  videoCount: number;
  avgViews: number;
  topChannelAvgSubs: number;
}

export default function KeywordExplorer() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  const [relatedKeywords, setRelatedKeywords] = useState<KeywordData[]>([]);

  const calculateKeywordMetrics = async (kw: string): Promise<KeywordData> => {
    // Search for videos with this keyword
    const videos = await searchVideosWithStats(kw, 50);

    const videoCount = videos.length;
    const totalViews = videos.reduce((sum: number, v: any) => sum + parseInt(v.statistics.viewCount || '0'), 0);
    const avgViews = videoCount > 0 ? totalViews / videoCount : 0;

    // Simulate search volume based on video count and avg views
    const searchVolume = Math.min(100, Math.round((videoCount * avgViews) / 1000000));

    // Competition based on number of videos and their performance
    const competition = Math.min(100, Math.round((videoCount / 50) * 100));

    // Difficulty: high competition = high difficulty
    const difficulty = competition;

    // Opportunity: high search volume + low competition = high opportunity
    const opportunity = Math.max(0, Math.min(100, searchVolume - (competition * 0.5)));

    // Get top channels subscriber estimate (simulated)
    const topChannelAvgSubs = videoCount > 0 ? Math.round(avgViews * 10) : 0;

    return {
      keyword: kw,
      searchVolume,
      competition,
      difficulty,
      opportunity,
      videoCount,
      avgViews: Math.round(avgViews),
      topChannelAvgSubs,
    };
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      // Main keyword analysis
      const mainData = await calculateKeywordMetrics(keyword);
      setKeywordData(mainData);

      // Generate and analyze related keywords
      const variations = [
        `${keyword} tutorial`,
        `${keyword} untuk pemula`,
        `${keyword} bahasa indonesia`,
        `cara ${keyword}`,
        `${keyword} 2025`,
      ];

      const relatedData = await Promise.all(
        variations.map(async (v) => {
          try {
            return await calculateKeywordMetrics(v);
          } catch {
            return null;
          }
        })
      );

      setRelatedKeywords(relatedData.filter((d): d is KeywordData => d !== null));
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menganalisa keyword. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-green-500 to-emerald-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty >= 70) return { label: 'Very Hard', color: 'text-red-400', icon: '🔥' };
    if (difficulty >= 50) return { label: 'Hard', color: 'text-orange-400', icon: '⚠️' };
    if (difficulty >= 30) return { label: 'Medium', color: 'text-yellow-400', icon: '⚡' };
    return { label: 'Easy', color: 'text-green-400', icon: '✅' };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Search className="w-8 h-8 text-red-500" />
          <span>Keyword Explorer</span>
        </h2>
        <p className="text-gray-300">
          Riset keyword mendalam dengan score, difficulty, dan opportunity analysis untuk menemukan niche yang profitable
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter keyword to analyze..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
          >
            <Search className="w-5 h-5" />
            <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-2">Popular niches to explore:</p>
          <div className="flex flex-wrap gap-2">
            {['programming', 'gaming', 'cooking', 'fitness', 'music', 'travel', 'tech review', 'vlog'].map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setKeyword(kw);
                  handleSearch();
                }}
                className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm hover:bg-white/10 transition-all"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-300 mt-4">Analyzing keyword metrics...</p>
        </div>
      )}

      {/* Main Keyword Analysis */}
      {keywordData && !loading && (
        <>
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-2">Keyword: "{keywordData.keyword}"</p>
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Opportunity Score</p>
                  <div className={`text-6xl font-bold ${getScoreColor(keywordData.opportunity)}`}>
                    {keywordData.opportunity}
                  </div>
                </div>
                <div className="text-left">
                  <div className="mb-3">
                    <p className="text-gray-400 text-xs">Search Volume</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${keywordData.searchVolume}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm font-semibold">{keywordData.searchVolume}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-gray-400 text-xs">Competition</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-400 h-2 rounded-full"
                          style={{ width: `${keywordData.competition}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm font-semibold">{keywordData.competition}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Difficulty</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getScoreGradient(keywordData.difficulty)} h-2 rounded-full`}
                          style={{ width: `${keywordData.difficulty}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-semibold ${getDifficultyLabel(keywordData.difficulty).color}`}>
                        {getDifficultyLabel(keywordData.difficulty).icon} {getDifficultyLabel(keywordData.difficulty).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Videos</p>
                  <p className="text-white text-2xl font-bold">{keywordData.videoCount}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Avg Views per Video</p>
                  <p className="text-white text-2xl font-bold">{formatNumber(keywordData.avgViews)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Top Channels Avg Subs</p>
                  <p className="text-white text-2xl font-bold">{formatNumber(keywordData.topChannelAvgSubs)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`bg-gradient-to-br ${
            keywordData.opportunity >= 70 ? 'from-green-500/20 to-emerald-500/20 border-green-500/30' :
            keywordData.opportunity >= 40 ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30' :
            'from-red-500/20 to-pink-500/20 border-red-500/30'
          } backdrop-blur-md rounded-xl p-6 border`}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Recommendation</span>
            </h3>
            <div className="bg-white/10 rounded-lg p-4">
              {keywordData.opportunity >= 70 && (
                <>
                  <p className="text-green-400 font-bold text-lg mb-2">🎯 EXCELLENT OPPORTUNITY!</p>
                  <p className="text-white">
                    Keyword ini memiliki high search volume dengan low competition. Ini adalah golden opportunity untuk ranking tinggi!
                    Segera buat konten berkualitas untuk keyword ini.
                  </p>
                </>
              )}
              {keywordData.opportunity >= 40 && keywordData.opportunity < 70 && (
                <>
                  <p className="text-yellow-400 font-bold text-lg mb-2">⚡ GOOD OPPORTUNITY</p>
                  <p className="text-white">
                    Keyword ini memiliki decent opportunity. Dengan SEO yang baik dan konten berkualitas, Anda bisa bersaing.
                    Fokus pada quality dan consistency.
                  </p>
                </>
              )}
              {keywordData.opportunity < 40 && (
                <>
                  <p className="text-red-400 font-bold text-lg mb-2">⚠️ CHALLENGING</p>
                  <p className="text-white">
                    Keyword ini sangat kompetitif. Pertimbangkan untuk target long-tail keywords atau niche yang lebih spesifik.
                    Lihat related keywords di bawah untuk alternatif.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Related Keywords */}
          {relatedKeywords.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6" />
                <span>Related Keyword Opportunities</span>
              </h3>
              <div className="space-y-3">
                {relatedKeywords
                  .sort((a, b) => b.opportunity - a.opportunity)
                  .map((kw, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => {
                        setKeyword(kw.keyword);
                        handleSearch();
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold flex items-center space-x-2">
                          <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📊'}</span>
                          <span>{kw.keyword}</span>
                        </h4>
                        <div className={`text-2xl font-bold ${getScoreColor(kw.opportunity)}`}>
                          {kw.opportunity}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Search Vol.</p>
                          <p className="text-white font-semibold">{kw.searchVolume}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Competition</p>
                          <p className="text-white font-semibold">{kw.competition}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Difficulty</p>
                          <p className={`font-semibold ${getDifficultyLabel(kw.difficulty).color}`}>
                            {getDifficultyLabel(kw.difficulty).label}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Videos</p>
                          <p className="text-white font-semibold">{kw.videoCount}</p>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getScoreGradient(kw.opportunity)} h-2 rounded-full transition-all`}
                          style={{ width: `${kw.opportunity}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Strategy Guide */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Award className="w-6 h-6" />
              <span>Keyword Strategy Guide</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span>High Opportunity (70+)</span>
                </h4>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Upload immediately!</li>
                  <li>Create comprehensive content</li>
                  <li>Optimize title, desc, tags fully</li>
                  <li>Consistent upload schedule</li>
                  <li>Promote aggressively</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <span>Medium Opportunity (40-69)</span>
                </h4>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Quality &gt; Quantity</li>
                  <li>Better production value</li>
                  <li>Strong SEO optimization</li>
                  <li>Build audience loyalty</li>
                  <li>Engage with community</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span>Low Opportunity (&lt; 40)</span>
                </h4>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Consider long-tail variations</li>
                  <li>Find sub-niches</li>
                  <li>Exceptional quality required</li>
                  <li>Build authority first</li>
                  <li>Patience is key</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span>General Tips</span>
                </h4>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Mix high & low competition keywords</li>
                  <li>Long-tail keywords easier to rank</li>
                  <li>Monitor trends regularly</li>
                  <li>Analyze top competitors</li>
                  <li>Update strategy quarterly</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
