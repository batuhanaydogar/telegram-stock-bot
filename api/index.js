const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const yahooFinance = require('yahoo-finance2').default;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Bot token from environment variable
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: false });

// Stock API configuration (using Yahoo Finance)
// No API key required - completely free!

// Bot commands and functionality
const commands = {
  start: '/start - Bot\'u başlat',
  help: '/help - Yardım menüsü',
  price: '/price <symbol> - Hisse fiyatını öğren (örn: /price AAPL)',
  search: '/search <company> - Şirket ara (örn: /search Apple)',
  chart: '/chart <symbol> - Hisse grafiği (örn: /chart AAPL)',
  portfolio: '/portfolio - Portföyünü görüntüle',
  news: '/news - Güncel borsa trendleri'
};

// Handle /start command
async function handleStart(msg) {
  const chatId = msg.chat.id;
  const welcomeMessage = `🚀 *Amerikan Borsa Botuna Hoş Geldiniz!*\n\n` +
    `Bu bot ile:\n` +
    `• 📈 Hisse fiyatlarını takip edebilirsiniz\n` +
    `• 🔍 Şirket arayabilirsiniz\n` +
    `• 📰 Güncel borsa haberlerini okuyabilirsiniz\n` +
    `• 💼 Portföyünüzü yönetebilirsiniz\n\n` +
    `Komutları görmek için /help yazın.`;
  
  await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
}

// Handle /help command
async function handleHelp(msg) {
  const chatId = msg.chat.id;
  let helpText = `📋 *Mevcut Komutlar:*\n\n`;
  
  Object.entries(commands).forEach(([cmd, desc]) => {
    helpText += `${desc}\n`;
  });
  
  helpText += `\n💡 *Örnek Kullanım:*\n` +
    `• /price AAPL - Apple hisse fiyatı\n` +
    `• /search Tesla - Tesla şirket bilgisi\n` +
    `• /chart AAPL - Apple hisse grafiği\n` +
    `• /news - Güncel borsa trendleri`;
  
  await bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
}

// Handle /price command
async function handlePrice(msg) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const symbol = text.split(' ')[1];
  
  if (!symbol) {
    await bot.sendMessage(chatId, '❌ Lütfen bir hisse sembolü belirtin.\nÖrnek: /price AAPL');
    return;
  }
  
  try {
    await bot.sendMessage(chatId, `🔍 *${symbol.toUpperCase()}* hisse fiyatı aranıyor...`, { parse_mode: 'Markdown' });
    
    const quote = await yahooFinance.quote(symbol.toUpperCase());
    
    if (quote && quote.regularMarketPrice) {
      const price = quote.regularMarketPrice.toFixed(2);
      const change = quote.regularMarketChange.toFixed(2);
      const changePercent = quote.regularMarketChangePercent.toFixed(2);
      const volume = quote.regularMarketVolume.toLocaleString();
      const marketCap = quote.marketCap ? (quote.marketCap / 1000000000).toFixed(2) + 'B' : 'N/A';
      const pe = quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A';
      
      const message = `📊 *${symbol.toUpperCase()} Hisse Bilgileri*\n\n` +
        `💰 **Fiyat:** $${price}\n` +
        `📈 **Değişim:** $${change} (${changePercent}%)\n` +
        `📊 **Hacim:** ${volume}\n` +
        `🏢 **Piyasa Değeri:** $${marketCap}\n` +
        `📊 **P/E Oranı:** ${pe}\n` +
        `🕐 **Güncelleme:** ${new Date().toLocaleString('tr-TR')}`;
      
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, `❌ ${symbol.toUpperCase()} hissesi bulunamadı veya veri alınamadı.`);
    }
  } catch (error) {
    console.error('Stock API error:', error);
    await bot.sendMessage(chatId, '❌ Hisse fiyatı alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

// Handle /search command
async function handleSearch(msg) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const company = text.split(' ').slice(1).join(' ');
  
  if (!company) {
    await bot.sendMessage(chatId, '❌ Lütfen bir şirket adı belirtin.\nÖrnek: /search Apple Inc');
    return;
  }
  
  try {
    await bot.sendMessage(chatId, `🔍 *${company}* şirketi aranıyor...`, { parse_mode: 'Markdown' });
    
    const searchResults = await yahooFinance.search(company);
    
    if (searchResults && searchResults.length > 0) {
      let message = `🔍 *${company} için bulunan sonuçlar:*\n\n`;
      
      searchResults.slice(0, 5).forEach((result, index) => {
        const symbol = result.symbol || 'N/A';
        const name = result.shortname || result.longname || 'N/A';
        const exchange = result.exchange || 'N/A';
        const type = result.quoteType || 'N/A';
        
        message += `${index + 1}. **${symbol}** - ${name}\n`;
        message += `   📍 ${exchange} | 💼 ${type}\n\n`;
      });
      
      message += `💡 Fiyat bilgisi için: /price <sembol>`;
      
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, `❌ "${company}" için sonuç bulunamadı.`);
    }
  } catch (error) {
    console.error('Search API error:', error);
    await bot.sendMessage(chatId, '❌ Şirket arama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

// Handle /portfolio command
async function handlePortfolio(msg) {
  const chatId = msg.chat.id;
  
  // This is a placeholder - in a real app you'd store user portfolios in a database
  const message = `💼 *Portföy Yönetimi*\n\n` +
    `Bu özellik geliştirme aşamasında.\n\n` +
    `🚧 Yakında eklenen özellikler:\n` +
    `• Hisse ekleme/çıkarma\n` +
    `• Portföy takibi\n` +
    `• Kar/zarar hesaplama\n` +
    `• Grafik görüntüleme`;
  
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

// Handle /chart command
async function handleChart(msg) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const symbol = text.split(' ')[1];
  
  if (!symbol) {
    await bot.sendMessage(chatId, '❌ Lütfen bir hisse sembolü belirtin.\nÖrnek: /chart AAPL');
    return;
  }
  
  try {
    await bot.sendMessage(chatId, `📊 *${symbol.toUpperCase()}* hisse grafiği hazırlanıyor...`, { parse_mode: 'Markdown' });
    
    // Get historical data for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const historicalData = await yahooFinance.historical(symbol.toUpperCase(), startDate, endDate, '1d');
    
    if (historicalData && historicalData.length > 0) {
      const latest = historicalData[historicalData.length - 1];
      const oldest = historicalData[0];
      const change = (latest.close - oldest.close).toFixed(2);
      const changePercent = ((change / oldest.close) * 100).toFixed(2);
      
      let message = `📈 *${symbol.toUpperCase()} 30 Günlük Grafik Analizi*\n\n`;
      message += `💰 **Güncel Fiyat:** $${latest.close.toFixed(2)}\n`;
      message += `📅 **Tarih:** ${latest.date.toLocaleDateString('tr-TR')}\n`;
      message += `📊 **30 Günlük Değişim:** $${change} (${changePercent}%)\n`;
      message += `📈 **En Yüksek:** $${Math.max(...historicalData.map(d => d.high)).toFixed(2)}\n`;
      message += `📉 **En Düşük:** $${Math.min(...historicalData.map(d => d.low)).toFixed(2)}\n`;
      message += `📊 **Ortalama Hacim:** ${(historicalData.reduce((sum, d) => sum + d.volume, 0) / historicalData.length).toLocaleString()}\n\n`;
      
      message += `🔗 **Grafik Görüntüle:** https://finance.yahoo.com/chart/${symbol.toUpperCase()}\n`;
      message += `📱 **Detaylı Analiz:** https://finance.yahoo.com/quote/${symbol.toUpperCase()}`;
      
      await bot.sendMessage(chatId, message, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
    } else {
      await bot.sendMessage(chatId, `❌ ${symbol.toUpperCase()} için grafik verisi bulunamadı.`);
    }
  } catch (error) {
    console.error('Chart API error:', error);
    await bot.sendMessage(chatId, '❌ Grafik verisi alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

// Handle /news command
async function handleNews(msg) {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId, `📰 *Borsa haberleri alınıyor...*`, { parse_mode: 'Markdown' });
    
    // Using Yahoo Finance trending tickers for market insights
    const trendingTickers = await yahooFinance.trendingSymbols('US');
    
    if (trendingTickers && trendingTickers.length > 0) {
      let message = `🔥 *Güncel Borsa Trendleri (US)*\n\n`;
      
      trendingTickers.slice(0, 5).forEach((ticker, index) => {
        const symbol = ticker.symbol || 'N/A';
        const name = ticker.shortname || ticker.longname || 'N/A';
        const price = ticker.regularMarketPrice ? `$${ticker.regularMarketPrice.toFixed(2)}` : 'N/A';
        const change = ticker.regularMarketChange ? `${ticker.regularMarketChange > 0 ? '📈' : '📉'} ${ticker.regularMarketChange.toFixed(2)}` : 'N/A';
        
        message += `${index + 1}. **${symbol}** - ${name}\n`;
        message += `   💰 ${price} | ${change}\n\n`;
      });
      
      message += `📊 Detaylı bilgi için: /price <sembol>\n`;
      message += `🌐 Daha fazla haber: https://finance.yahoo.com/news/`;
      
      await bot.sendMessage(chatId, message, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
    } else {
      await bot.sendMessage(chatId, `❌ Trend verisi alınamadı. Lütfen daha sonra tekrar deneyin.`);
    }
  } catch (error) {
    console.error('News API error:', error);
    await bot.sendMessage(chatId, '❌ Trend verisi alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

// Message handler
async function handleMessage(msg) {
  const text = msg.text;
  
  if (!text) return;
  
  try {
    if (text === '/start') {
      await handleStart(msg);
    } else if (text === '/help') {
      await handleHelp(msg);
    } else if (text.startsWith('/price')) {
      await handlePrice(msg);
    } else if (text.startsWith('/search')) {
      await handleSearch(msg);
    } else if (text === '/portfolio') {
      await handlePortfolio(msg);
    } else if (text === '/news') {
      await handleNews(msg);
    } else if (text.startsWith('/chart')) {
      await handleChart(msg);
    } else if (text.startsWith('/')) {
      await bot.sendMessage(msg.chat.id, '❌ Bilinmeyen komut. Yardım için /help yazın.');
    }
  } catch (error) {
    console.error('Message handling error:', error);
    await bot.sendMessage(msg.chat.id, '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

// Webhook endpoint for Vercel
app.post('/webhook', async (req, res) => {
  try {
    const { body } = req;
    
    if (body.message) {
      await handleMessage(body.message);
    }
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    bot: 'Telegram Stock Bot',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Telegram Stock Bot API',
    version: '1.0.0',
    endpoints: {
      webhook: '/webhook',
      health: '/health'
    }
  });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Bot server running on port ${PORT}`);
    console.log(`📱 Bot username: ${bot.options.username || 'Not set'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for Vercel
module.exports = app;
