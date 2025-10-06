# 🚀 Panduan Deploy ke Vercel

## Cara Deploy YouTube Analytics Pro ke Vercel

### Opsi 1: Deploy via GitHub (Recommended)

1. **Push ke GitHub Repository**

   Repository sudah di-initialize dengan git. Anda perlu:
   - Login ke GitHub dengan akun `arulgroup666-glitch`
   - Push ke repository: `https://github.com/arulgroup666-glitch/youtubeanalisabro.git`

   Jalankan command:
   ```bash
   git remote add origin https://github.com/arulgroup666-glitch/youtubeanalisabro.git
   git branch -M main
   git push -u origin main
   ```

2. **Import ke Vercel**

   - Buka [https://vercel.com/new](https://vercel.com/new)
   - Login dengan GitHub account yang sama
   - Klik "Import Git Repository"
   - Pilih repository `youtubeanalisabro`
   - Klik "Import"

3. **Konfigurasi Environment Variables**

   Di Vercel Dashboard, tambahkan environment variable:
   - Key: `NEXT_PUBLIC_YOUTUBE_API_KEY`
   - Value: `AIzaSyA59zx2HIq7AfnpKJ87vfQoTuZm2b9uUdw`

   ![Add Environment Variable](https://vercel.com/docs/concepts/projects/environment-variables)

4. **Deploy**

   - Klik "Deploy"
   - Tunggu proses build selesai (±2-3 menit)
   - Project akan live di: `https://youtubeanalisabro.vercel.app`

---

### Opsi 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (pilih account Anda)
   - Link to existing project? `N`
   - What's your project's name? `youtubeanalisabro`
   - In which directory is your code located? `./`

4. **Set Environment Variable**
   ```bash
   vercel env add NEXT_PUBLIC_YOUTUBE_API_KEY
   ```
   Paste API key: `AIzaSyA59zx2HIq7AfnpKJ87vfQoTuZm2b9uUdw`
   Select environment: `Production, Preview, Development`

5. **Deploy ke Production**
   ```bash
   vercel --prod
   ```

---

### Opsi 3: Deploy via Drag & Drop (Paling Mudah)

1. **Build Project Locally**
   ```bash
   npm run build
   ```

2. **Buka Vercel Dashboard**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Klik tab "Deploy"

3. **Drag & Drop**
   - Drag & drop folder `.next` ke Vercel
   - ATAU zip seluruh project dan upload

4. **Konfigurasi**
   - Set project name: `youtubeanalisabro`
   - Set framework preset: `Next.js`
   - Tambahkan environment variable seperti di atas

5. **Deploy**
   - Klik Deploy dan tunggu prosesnya selesai

---

## 📝 Checklist Sebelum Deploy

- [x] All dependencies installed (`npm install`)
- [x] Build berhasil (`npm run build`)
- [x] `.env.local` configured dengan YouTube API Key
- [x] Git repository initialized
- [x] `vercel.json` configured
- [ ] Code pushed ke GitHub
- [ ] Project imported ke Vercel
- [ ] Environment variables set di Vercel
- [ ] Deployed successfully

---

## ⚙️ Konfigurasi yang Sudah Dibuat

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_YOUTUBE_API_KEY": "@youtube_api_key"
  }
}
```

### Environment Variables Required
- `NEXT_PUBLIC_YOUTUBE_API_KEY`: YouTube Data API v3 Key

---

## 🔧 Troubleshooting

### Build Failed
Jika build gagal, cek:
1. Semua dependencies sudah terinstall
2. TypeScript errors sudah resolved
3. Environment variable sudah di-set

### API Not Working
Jika API tidak berfungsi di production:
1. Pastikan environment variable `NEXT_PUBLIC_YOUTUBE_API_KEY` sudah di-set di Vercel
2. Cek API key valid dan memiliki quota
3. Cek console browser untuk error messages

### GitHub Permission Denied
Jika error 403 saat push ke GitHub:
1. Login dengan akun GitHub yang benar (`arulgroup666-glitch`)
2. Setup GitHub Personal Access Token
3. Atau clone repository yang sudah ada dan push changes

---

## 🌐 Custom Domain (Optional)

Setelah deploy, Anda bisa menambahkan custom domain:

1. Beli domain di [Namecheap](https://www.namecheap.com/) atau [GoDaddy](https://www.godaddy.com/)
2. Di Vercel Dashboard, pilih project Anda
3. Go to Settings → Domains
4. Add domain dan follow instructions
5. Update DNS records sesuai yang diminta Vercel

---

## 📊 Monitoring & Analytics

Setelah deploy, gunakan Vercel Analytics untuk monitoring:
- Real-time traffic
- Performance metrics
- Error tracking
- Web Vitals

Enable di: Settings → Analytics

---

## 🔄 Auto Deploy

Setelah connect dengan GitHub, setiap push ke branch `main` akan otomatis trigger deployment baru:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel akan automatically build dan deploy perubahan.

---

## 📱 Testing di Production

Setelah deploy, test fitur-fitur berikut:
- [ ] Channel Analytics berfungsi
- [ ] Video Analytics berfungsi
- [ ] Trending Videos load correctly
- [ ] Keyword Search working
- [ ] Responsive di mobile
- [ ] Loading animations smooth
- [ ] API calls berhasil

---

## 💡 Tips

1. **Optimize Images**: Gunakan Next.js Image component untuk auto-optimization
2. **Caching**: Implement caching untuk reduce API calls
3. **Error Handling**: Add proper error boundaries
4. **Loading States**: Sudah implemented dengan skeleton loaders
5. **Analytics**: Integrate Google Analytics untuk tracking users

---

## 🎉 Selamat!

Project Anda siap di-deploy ke production! 🚀

Live URL (setelah deploy): `https://youtubeanalisabro.vercel.app`

---

**Need Help?** Check [Vercel Documentation](https://vercel.com/docs) atau contact support.
