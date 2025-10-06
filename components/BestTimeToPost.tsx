'use client';

import { useState } from 'react';
import { Clock, TrendingUp, Calendar, BarChart3, Users, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function BestTimeToPost() {
  const [niche, setNiche] = useState<'gaming' | 'tech' | 'vlog' | 'education' | 'entertainment'>('tech');

  // Data berdasarkan riset waktu optimal YouTube
  const hourlyData = [
    { hour: '00:00', gaming: 45, tech: 20, vlog: 15, education: 10, entertainment: 35 },
    { hour: '03:00', gaming: 35, tech: 15, vlog: 10, education: 8, entertainment: 25 },
    { hour: '06:00', gaming: 40, tech: 45, vlog: 30, education: 40, entertainment: 35 },
    { hour: '09:00', gaming: 50, tech: 70, vlog: 50, education: 75, entertainment: 55 },
    { hour: '12:00', gaming: 65, tech: 85, vlog: 70, education: 80, entertainment: 75 },
    { hour: '15:00', gaming: 75, tech: 90, vlog: 80, education: 85, entertainment: 85 },
    { hour: '18:00', gaming: 90, tech: 95, vlog: 90, education: 70, entertainment: 95 },
    { hour: '21:00', gaming: 95, tech: 80, vlog: 85, education: 50, entertainment: 90 },
  ];

  const weeklyData = [
    { day: 'Monday', gaming: 70, tech: 85, vlog: 65, education: 90, entertainment: 75 },
    { day: 'Tuesday', gaming: 75, tech: 90, vlog: 70, education: 95, entertainment: 80 },
    { day: 'Wednesday', gaming: 72, tech: 88, vlog: 68, education: 92, entertainment: 78 },
    { day: 'Thursday', gaming: 78, tech: 92, vlog: 75, education: 93, entertainment: 82 },
    { day: 'Friday', gaming: 85, tech: 85, vlog: 90, education: 75, entertainment: 95 },
    { day: 'Saturday', gaming: 95, tech: 70, vlog: 95, education: 60, entertainment: 98 },
    { day: 'Sunday', gaming: 90, tech: 65, vlog: 92, education: 55, entertainment: 95 },
  ];

  const performanceData = [
    { metric: 'Views', value: hourlyData.reduce((acc, h) => acc + h[niche], 0) / hourlyData.length },
    { metric: 'Engagement', value: 75 },
    { metric: 'Retention', value: 82 },
    { metric: 'CTR', value: 68 },
    { metric: 'Shares', value: 55 },
  ];

  const nicheInfo = {
    gaming: {
      name: 'Gaming',
      icon: '🎮',
      bestTime: '18:00 - 23:00',
      bestDay: 'Saturday & Sunday',
      audience: 'Gamers, mostly evening & weekend',
      color: '#ef4444',
    },
    tech: {
      name: 'Technology',
      icon: '💻',
      bestTime: '12:00 - 18:00',
      bestDay: 'Tuesday & Thursday',
      audience: 'Professionals, business hours',
      color: '#3b82f6',
    },
    vlog: {
      name: 'Vlog/Lifestyle',
      icon: '📹',
      bestTime: '15:00 - 21:00',
      bestDay: 'Friday & Saturday',
      audience: 'General audience, afternoon/evening',
      color: '#10b981',
    },
    education: {
      name: 'Education',
      icon: '📚',
      bestTime: '09:00 - 15:00',
      bestDay: 'Monday - Thursday',
      audience: 'Students & learners, daytime',
      color: '#f59e0b',
    },
    entertainment: {
      name: 'Entertainment',
      icon: '🎬',
      bestTime: '18:00 - 22:00',
      bestDay: 'Friday - Sunday',
      audience: 'General audience, leisure time',
      color: '#8b5cf6',
    },
  };

  const currentNiche = nicheInfo[niche];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Clock className="w-8 h-8 text-red-500" />
          <span>Best Time to Post</span>
        </h2>
        <p className="text-gray-300">
          Analisa waktu optimal untuk upload video berdasarkan niche dan pola aktivitas audience YouTube
        </p>
      </div>

      {/* Niche Selector */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-4">Pilih Niche Channel Anda:</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.keys(nicheInfo) as Array<keyof typeof nicheInfo>).map((key) => (
            <button
              key={key}
              onClick={() => setNiche(key)}
              className={`px-4 py-3 rounded-lg transition-all text-center ${
                niche === key
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105 shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="text-3xl mb-1">{nicheInfo[key].icon}</div>
              <div className="text-sm font-medium">{nicheInfo[key].name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Niche Insights */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Best Time</span>
            </div>
            <p className="text-white text-xl font-bold">{currentNiche.bestTime}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Best Day</span>
            </div>
            <p className="text-white text-xl font-bold">{currentNiche.bestDay}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300 text-sm">Target Audience</span>
            </div>
            <p className="text-white text-sm font-semibold">{currentNiche.audience}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 text-sm">Peak Performance</span>
            </div>
            <p className="text-white text-xl font-bold">
              {Math.max(...hourlyData.map(h => h[niche]))}%
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Performance Chart */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6" />
          <span>Hourly Performance - {currentNiche.name}</span>
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="hour" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={niche}
              stroke={currentNiche.color}
              strokeWidth={3}
              dot={{ fill: currentNiche.color, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-200 text-sm">
            💡 <strong>Insight:</strong> Waktu terbaik untuk upload adalah {currentNiche.bestTime}
            saat audience {currentNiche.name} paling aktif. Peak performance mencapai {Math.max(...hourlyData.map(h => h[niche]))}% engagement.
          </p>
        </div>
      </div>

      {/* Weekly Performance Chart */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-6 h-6" />
          <span>Weekly Performance Comparison</span>
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey={niche} fill={currentNiche.color} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-200 text-sm">
            💡 <strong>Insight:</strong> {currentNiche.bestDay} adalah hari terbaik untuk upload video {currentNiche.name}.
            Hindari upload di hari dengan performa rendah untuk maksimalkan views awal.
          </p>
        </div>
      </div>

      {/* Multi-Niche Comparison */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">📊 Compare All Niches</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="hour" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="gaming" stroke={nicheInfo.gaming.color} strokeWidth={2} />
            <Line type="monotone" dataKey="tech" stroke={nicheInfo.tech.color} strokeWidth={2} />
            <Line type="monotone" dataKey="vlog" stroke={nicheInfo.vlog.color} strokeWidth={2} />
            <Line type="monotone" dataKey="education" stroke={nicheInfo.education.color} strokeWidth={2} />
            <Line type="monotone" dataKey="entertainment" stroke={nicheInfo.entertainment.color} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tips & Best Practices */}
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6" />
          <span>Best Practices untuk Upload Schedule</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">⏰ Timing Strategy</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Upload 2-3 jam sebelum peak time</li>
              <li>Beri waktu untuk YouTube processing</li>
              <li>Konsisten dengan jadwal upload</li>
              <li>Test berbagai waktu untuk data pribadi</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">📅 Frequency Tips</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Minimal 1-2 video per minggu</li>
              <li>Quality over quantity</li>
              <li>Maintain consistency</li>
              <li>Batch recording untuk efisiensi</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🎯 Audience Engagement</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Monitor YouTube Analytics</li>
              <li>Check "When your viewers are on YouTube"</li>
              <li>Respond to comments di jam pertama</li>
              <li>Promote di social media saat upload</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🌍 Time Zone Considerations</h4>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Pertimbangkan lokasi audience utama</li>
              <li>Indonesia: 18:00-21:00 WIB optimal</li>
              <li>Global audience: 14:00-16:00 WIB</li>
              <li>US audience: 08:00-10:00 WIB (US evening)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Action Items */}
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl p-6 border border-orange-500/30">
        <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Action Items</h3>
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg p-4 flex items-start space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
            <div>
              <p className="text-white font-semibold">Schedule Next Upload</p>
              <p className="text-gray-300 text-sm">Upload video Anda pada {currentNiche.bestDay} jam {currentNiche.bestTime}</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
            <div>
              <p className="text-white font-semibold">Check Your Analytics</p>
              <p className="text-gray-300 text-sm">Verifikasi data ini dengan YouTube Analytics → Audience → "When your viewers are on YouTube"</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
            <div>
              <p className="text-white font-semibold">Set Consistent Schedule</p>
              <p className="text-gray-300 text-sm">Buat jadwal upload konsisten setiap minggu di waktu yang sama</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
            <div>
              <p className="text-white font-semibold">Engage Immediately</p>
              <p className="text-gray-300 text-sm">Siap online 30 menit setelah upload untuk respond comments dan boost engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
