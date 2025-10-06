# 🎥 YouTube Analytics Pro

Platform analitik YouTube lengkap untuk menganalisa performa channel, video, trending, dan SEO keyword. Dibuat dengan Next.js 14, TypeScript, dan Tailwind CSS.

![YouTube Analytics Pro](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Fitur Utama

### 📊 Channel Analytics
- **Statistik Channel Lengkap**: Subscribers, total views, total video
- **Channel Insights**: Rata-rata views per video, subscriber to view ratio
- **Video Terbaru**: Menampilkan 12 video terbaru dari channel
- **Informasi Detail**: Tanggal bergabung, lokasi channel, custom URL

### 🎬 Video Analytics
- **Performa Video**: Views, likes, comments, engagement rate
- **Engagement Breakdown**: Visualisasi pie chart engagement
- **Video Metrics**: Like ratio, comment ratio, estimated watch time
- **Tags & Keywords**: Menampilkan semua tags yang digunakan
- **Deskripsi Lengkap**: Full video description untuk SEO analysis

### 🔥 Trending Videos
- **Multi-Region Support**: Indonesia, US, UK, Japan, Korea, India, Brazil, Mexico
- **Sorting Options**: Urutkan berdasarkan views, likes, atau comments
- **Real-time Data**: Refresh untuk update data terbaru
- **Engagement Metrics**: Tampilan lengkap engagement rate setiap video

### 🔍 Keyword & SEO Analysis
- **Video/Channel Search**: Cari video atau channel berdasarkan keyword
- **Keyword Suggestions**: 8+ keyword populer untuk inspirasi
- **SEO Tips**: Tips optimasi untuk meningkatkan ranking
- **Related Keywords**: Saran keyword terkait untuk expand konten
- **Competition Analysis**: Lihat berapa banyak konten serupa

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Animations
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date**: date-fns
- **HTTP Client**: Axios
- **API**: YouTube Data API v3

## 📦 Installation

1. Clone repository:
```bash
git clone https://github.com/arulgroup666-glitch/youtubeanalisabro.git
cd youtubeanalisabro
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env.local` dan tambahkan YouTube API Key:
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. Jalankan development server:
```bash
npm run dev
```

5. Buka browser dan akses:
```
http://localhost:3000
```

## 🔑 Mendapatkan YouTube API Key

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Enable **YouTube Data API v3**
4. Buat credentials (API Key)
5. Copy API Key ke file `.env.local`

## 🌐 Deploy ke Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Tambahkan environment variable di Vercel Dashboard:
   - Key: `NEXT_PUBLIC_YOUTUBE_API_KEY`
   - Value: `your_youtube_api_key`

### Option 2: Deploy via GitHub

1. Push code ke GitHub
2. Import repository di [Vercel Dashboard](https://vercel.com/new)
3. Tambahkan environment variable
4. Deploy!

## 📁 Struktur Project

```
youtube-analisa/
├── app/
│   ├── globals.css          # Global styles & animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/
│   ├── ChannelAnalytics.tsx  # Channel analytics component
│   ├── VideoAnalytics.tsx    # Video analytics component
│   ├── TrendingVideos.tsx    # Trending videos component
│   └── KeywordAnalysis.tsx   # Keyword analysis component
├── lib/
│   └── youtube.ts            # YouTube API functions
├── .env.local                # Environment variables (not in git)
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vercel.json               # Vercel deployment config
```

## 🎨 Fitur UI/UX

- **Dark Theme**: Modern gradient purple-pink theme
- **Smooth Animations**: Card hover, fade in, slide in effects
- **Responsive Design**: Mobile-first, support semua device
- **Glass Morphism**: Modern frosted glass effect
- **Custom Scrollbar**: Gradient scrollbar matching theme
- **Loading States**: Skeleton loading & spinner animations
- **Interactive Charts**: Visualisasi data dengan Recharts

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📊 API Endpoints yang Digunakan

- `GET /youtube/v3/channels` - Mendapatkan statistik channel
- `GET /youtube/v3/videos` - Mendapatkan statistik video & trending
- `GET /youtube/v3/search` - Mencari video/channel dan keyword analysis

## 🎯 Use Cases

### Untuk YouTubers:
- Monitor performa channel dan video
- Analisa engagement rate
- Research keyword dan kompetitor
- Track trending topics

### Untuk Content Creators:
- Planning konten berdasarkan trending
- Optimasi SEO video
- Analisa tags dan keywords
- Study kompetitor

### Untuk Marketers:
- Riset influencer
- Analisa market trend
- Planning campaign
- Competitor analysis

## 🤝 Contributing

Contributions are welcome! Silakan buat issue atau pull request.

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Created with ❤️ untuk YouTubers Indonesia

Powered by YouTube Data API v3

---

## 🌟 Features Roadmap

- [ ] Export data ke CSV/Excel
- [ ] Compare multiple channels
- [ ] Historical data tracking
- [ ] Email reports
- [ ] Advanced analytics dashboard
- [ ] Comment sentiment analysis
- [ ] Auto-generated thumbnail analyzer
- [ ] Video title A/B testing suggestions

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di GitHub repository.

## 🎉 Acknowledgments

- YouTube Data API v3
- Next.js Team
- Vercel
- Tailwind CSS
- Recharts
- Lucide Icons

---

**Happy Analyzing! 🚀**
