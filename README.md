# 📱 Telegram Stock Bot - Amerikan Borsa

Bu Telegram bot, Amerikan borsasındaki hisse senetlerini takip etmenizi, fiyat sorgulamanızı ve güncel borsa haberlerini almanızı sağlar.

## 🚀 Özellikler

- 📈 **Hisse Fiyat Sorgulama**: Gerçek zamanlı hisse fiyatları
- 🔍 **Şirket Arama**: Şirket adına göre hisse sembolü bulma
- 📰 **Borsa Haberleri**: Güncel finansal haberler
- 💼 **Portföy Yönetimi**: (Geliştirme aşamasında)
- 🌐 **Webhook Desteği**: Vercel deployment için optimize edilmiş

## 🛠️ Kurulum

### 1. Gereksinimler

- Node.js 18+ 
- Telegram Bot Token
- Alpha Vantage API Key (ücretsiz)

### 2. Telegram Bot Oluşturma

1. [@BotFather](https://t.me/botfather) ile konuşun
2. `/newbot` komutunu kullanın
3. Bot adı ve kullanıcı adı belirleyin
4. Bot token'ını kaydedin

### 3. Yahoo Finance API

✅ **Ücretsiz!** - API key gerektirmez
✅ **Gerçek zamanlı veriler** - Anlık hisse fiyatları
✅ **Sınırsız kullanım** - Rate limit yok
✅ **Detaylı bilgiler** - Piyasa değeri, P/E oranı, grafik verileri

### 4. Yerel Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp env.example .env

# .env dosyasını düzenleyin
nano .env

# Botu başlatın
npm run dev
```

### 5. Vercel Deployment

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Projeyi deploy edin
vercel

# Production'a deploy edin
vercel --prod
```

## ⚙️ Konfigürasyon

### Environment Variables

```bash
# .env dosyasında
TELEGRAM_BOT_TOKEN=your_bot_token
# STOCK_API_KEY=not_needed (Yahoo Finance ücretsiz!)
NODE_ENV=production
```

### Webhook Kurulumu

Bot deploy edildikten sonra webhook'u ayarlayın:

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-domain.vercel.app/webhook"}'
```

## 📱 Bot Komutları

- `/start` - Bot'u başlat
- `/help` - Yardım menüsü
- `/price <symbol>` - Hisse fiyatını öğren (örn: `/price AAPL`)
- `/search <company>` - Şirket ara (örn: `/search Apple`)
- `/chart <symbol>` - Hisse grafiği (örn: `/chart AAPL`)
- `/portfolio` - Portföyünü görüntüle
- `/news` - Güncel borsa trendleri

## 🌐 API Endpoints

- `GET /` - Ana sayfa
- `GET /health` - Sağlık kontrolü
- `POST /webhook` - Telegram webhook

## 🚀 Vercel Deployment

### Otomatik Deployment

1. GitHub'a projeyi push edin
2. [Vercel](https://vercel.com) hesabı oluşturun
3. GitHub repo'nuzu bağlayın
4. Environment variables'ları ayarlayın
5. Deploy edin

### Custom Domain

1. Vercel dashboard'da domain ekleyin
2. DNS ayarlarını yapın
3. SSL sertifikası otomatik olarak verilir

## 📊 Hisse Verileri

Bot şu bilgileri sağlar:
- Güncel fiyat ve değişim
- Piyasa değeri ve P/E oranı
- İşlem hacmi ve trend analizi
- 30 günlük grafik verileri
- En yüksek/düşük fiyatlar
- Güncelleme zamanı

## 🔒 Güvenlik

- Helmet.js ile güvenlik başlıkları
- CORS koruması
- Rate limiting (gelecek sürümde)
- Input validation

## 🐛 Sorun Giderme

### Bot yanıt vermiyor
- Webhook URL'ini kontrol edin
- Bot token'ın doğru olduğundan emin olun
- Vercel logs'u kontrol edin

### Hisse verisi alınamıyor
- API key'in doğru olduğundan emin olun
- API limit'ini kontrol edin
- Hisse sembolünün doğru olduğundan emin olun

## 📈 Gelecek Özellikler

- [ ] Portföy yönetimi
- [ ] Fiyat alarmları
- [ ] Grafik görüntüleme
- [ ] Teknik analiz göstergeleri
- [ ] Çoklu dil desteği
- [ ] Admin paneli

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 Destek

- 📧 Email: your-email@example.com
- 💬 Telegram: @your_username
- 🐛 Issues: GitHub Issues

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
