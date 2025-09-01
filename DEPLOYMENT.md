# 🚀 Vercel Deployment Rehberi

## 📋 Ön Gereksinimler

1. **GitHub Hesabı** - Projeyi GitHub'a push etmek için
2. **Vercel Hesabı** - [vercel.com](https://vercel.com) üzerinden ücretsiz hesap
3. **Telegram Bot Token** - @BotFather'dan alınacak
4. **Yahoo Finance API** - ✅ Ücretsiz! API key gerektirmez

## 🔧 Adım Adım Deployment

### 1. GitHub'a Push

```bash
# Git repo başlat
git init
git add .
git commit -m "Initial commit: Telegram Stock Bot"

# GitHub'da yeni repo oluştur ve push et
git remote add origin https://github.com/username/telegram-stock-bot.git
git branch -M main
git push -u origin main
```

### 2. Vercel'e Giriş

1. [vercel.com](https://vercel.com) adresine git
2. "Continue with GitHub" ile giriş yap
3. GitHub repo'nuzu seçin

### 3. Environment Variables Ayarla

Vercel dashboard'da şu environment variables'ları ekleyin:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
# STOCK_API_KEY=not_needed (Yahoo Finance ücretsiz!)
NODE_ENV=production
```

### 4. Deploy Et

1. "Deploy" butonuna tıkla
2. Deployment tamamlanana kadar bekle
3. URL'i kopyala (örn: `https://your-project.vercel.app`)

### 5. Custom Domain Ekle

#### 5.1 Vercel Dashboard'da
1. Proje ayarlarına git
2. "Domains" sekmesine tıkla
3. "Add Domain" ile domain ekle
4. DNS ayarlarını yap

#### 5.2 DNS Ayarları
Domain sağlayıcınızda şu kayıtları ekleyin:

```
Type: A
Name: @
Value: 76.76.19.36

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6. Webhook Kurulumu

Bot deploy edildikten sonra webhook'u ayarlayın:

```bash
# Terminal'de çalıştır
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-domain.com/webhook"}'
```

**Önemli:** `<BOT_TOKEN>` yerine gerçek bot token'ınızı yazın.

## 🧪 Test Etme

### 1. Health Check
```
GET https://your-domain.com/health
```

### 2. Bot Test
1. Telegram'da bot'unuza mesaj gönderin
2. `/start` komutunu deneyin
3. `/help` ile komutları görün

### 3. Hisse Sorgulama
```
/price AAPL
/price TSLA
/search Apple
```

## 🔍 Sorun Giderme

### Bot Yanıt Vermiyor
1. Webhook URL'ini kontrol edin
2. Environment variables'ları kontrol edin
3. Vercel logs'u kontrol edin

### Domain Çalışmıyor
1. DNS ayarlarının yayılmasını bekleyin (24-48 saat)
2. SSL sertifikasının aktif olduğundan emin olun
3. Vercel dashboard'da domain durumunu kontrol edin

### API Hataları
1. Alpha Vantage API key'in doğru olduğundan emin olun
2. API limit'ini kontrol edin
3. Hisse sembolünün doğru olduğundan emin olun

## 📱 Bot Komutları

Bot deploy edildikten sonra şu komutları kullanabilirsiniz:

- `/start` - Bot'u başlat
- `/help` - Yardım menüsü
- `/price AAPL` - Apple hisse fiyatı
- `/search Tesla` - Tesla şirket bilgisi
- `/news` - Güncel borsa haberleri
- `/portfolio` - Portföy yönetimi

## 🌟 Özellikler

✅ **Gerçek Zamanlı Hisse Fiyatları** - Alpha Vantage API ile
✅ **Şirket Arama** - Hisse sembolü bulma
✅ **Borsa Haberleri** - Güncel finansal haberler
✅ **Webhook Desteği** - Vercel için optimize edilmiş
✅ **Custom Domain** - Kendi domain'iniz ile
✅ **SSL Sertifikası** - Otomatik HTTPS
✅ **Global CDN** - Hızlı erişim

## 🔗 Faydalı Linkler

- [Vercel Documentation](https://vercel.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Alpha Vantage API](https://www.alphavantage.co/documentation/)
- [GitHub Repository](https://github.com/username/telegram-stock-bot)

---

🚀 **Başarılı Deployment!** Bot artık canlıda ve Amerikan borsasını takip edebilirsiniz!
