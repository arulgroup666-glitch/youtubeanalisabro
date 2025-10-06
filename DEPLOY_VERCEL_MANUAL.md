# 🚀 Deploy ke Vercel - Panduan Lengkap

Repository sudah di GitHub: https://github.com/arulgroup666-glitch/youtubeanalisabro.git

## Metode 1: Via Vercel Dashboard (Web) - RECOMMENDED

### Step by Step:

1. **Buka Vercel Dashboard**
   - Go to: https://vercel.com/new
   - Login dengan GitHub (akun `arulgroup666-glitch`)

2. **Import Git Repository**
   - Klik tab **"Import Git Repository"**
   - Jika tidak muncul repositorynya, klik **"Adjust GitHub App Permissions"**
   - Beri akses Vercel ke repository `youtubeanalisabro`
   - Refresh halaman
   - Pilih repository `youtubeanalisabro`
   - Klik **"Import"**

3. **Configure Project**
   - **Project Name**: `youtubeanalisabro` (biarkan default)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (biarkan default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Environment Variables**
   - **SKIP THIS!** API key sudah hardcoded di code
   - Tidak perlu tambah env variable apapun

5. **Deploy**
   - Klik button **"Deploy"** (biru, di bawah)
   - Tunggu proses build (2-4 menit)
   - ✅ Selesai!

---

## Metode 2: Via Vercel CLI

Saya sudah install Vercel CLI. Sekarang jalankan:

```bash
# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

### Detail Commands:

1. **Login:**
```bash
vercel login
```
   - Pilih: Login with GitHub
   - Authorize di browser
   - Kembali ke terminal

2. **Deploy Production:**
```bash
vercel --prod
```
   - Set up and deploy? **Y**
   - Which scope? (pilih account Anda)
   - Link to existing project? **N**
   - What's your project's name? `youtubeanalisabro`
   - In which directory is your code located? `./`
   - Want to override the settings? **N**
   - Tunggu build selesai
   - ✅ URL akan muncul!

---

## Troubleshooting: Repository Tidak Muncul di Vercel

Jika repository tidak muncul di list Vercel:

### Fix 1: Adjust GitHub App Permissions

1. Di halaman https://vercel.com/new
2. Klik **"Adjust GitHub App Permissions"**
3. Atau langsung ke: https://github.com/settings/installations
4. Cari **"Vercel"**
5. Klik **"Configure"**
6. Scroll ke **"Repository access"**
7. Pilih **"All repositories"** ATAU
8. Pilih **"Only select repositories"** → Tambahkan `youtubeanalisabro`
9. Klik **"Save"**
10. Kembali ke Vercel, refresh halaman
11. Repository akan muncul

### Fix 2: Manual Import via URL

1. Di https://vercel.com/new
2. Klik tab **"Import Third-Party Git Repository"**
3. Paste URL: `https://github.com/arulgroup666-glitch/youtubeanalisabro`
4. Klik "Continue"
5. Follow step deploy seperti biasa

### Fix 3: Deploy via CLI (Paling Gampang!)

Langsung jalankan di terminal:
```bash
cd D:\PROJECT\youtube-analisa
vercel login
vercel --prod
```

---

## ✅ Setelah Deploy Berhasil:

### Cek Deployment:
1. Buka Vercel Dashboard: https://vercel.com/dashboard
2. Klik project `youtubeanalisabro`
3. Lihat deployment status
4. Klik **"Visit"** untuk buka live site

### URL Live:
```
https://youtubeanalisabro.vercel.app
```
atau
```
https://youtubeanalisabro-git-main-arulgroup666glitch.vercel.app
```

### Fitur Auto-Deploy:
Setelah ini, setiap push ke GitHub akan auto-deploy:
```bash
git add .
git commit -m "Update"
git push
```
Vercel otomatis build & deploy! 🚀

---

## 🔍 Verifikasi Repository di GitHub:

Cek apakah repository sudah benar:
- URL: https://github.com/arulgroup666-glitch/youtubeanalisabro
- Branch: `main`
- Files: Pastikan semua file ada (package.json, app/, components/, lib/, dll)

---

## 📞 Need Help?

Jika masih error, coba metode CLI (paling reliable):
```bash
vercel login
vercel --prod
```

Good luck! 🎉
