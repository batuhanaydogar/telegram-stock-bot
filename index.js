const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
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

// Stock API configuration (using Alpha Vantage as example)
const STOCK_API_KEY = process.env.STOCK_API_KEY || 'demo';
const STOCK_API_BASE = 'https://www.alphavantage.co/query';

// Bot commands and functionality
const commands = {
  start: '/start - Bot\'u başlat',
  help: '/help - Yardım menüsü',
  price: '/price <symbol> - Hisse fiyatını öğren (örn: /price AAPL)',
  search: '/search <company> - Şirket ara (örn: /search Apple)',
  portfolio: '/portfolio - Portföyünü görüntüle',
  news: '/news - Güncel borsa haberleri'
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
    `• /news - Güncel haberler`;
  
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
    
    const response = await axios.get(STOCK_API_BASE, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: STOCK_API_KEY
      }
    });
    
    const data = response.data;
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const quote = data['Global Quote'];
      const price = parseFloat(quote['05. price']).toFixed(2);
      const change = parseFloat(quote['09. change']).toFixed(2);
      const changePercent = quote['10. change percent'];
      const volume = parseInt(quote['06. volume']).toLocaleString();
      
      const message = `📊 *${symbol.toUpperCase()} Hisse Bilgileri*\n\n` +
        `💰 **Fiyat:** $${price}\n` +
        `📈 **Değişim:** $${change} (${changePercent})\n` +
        `📊 **Hacim:** ${volume}\n` +
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
    
    const response = await axios.get(STOCK_API_BASE, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: company,
        apikey: STOCK_API_KEY
      }
    });
    
    const data = response.data;
    
    if (data.bestMatches && data.bestMatches.length > 0) {
      let message = `🔍 *${company} için bulunan sonuçlar:*\n\n`;
      
      data.bestMatches.slice(0, 5).forEach((match, index) => {
        message += `${index + 1}. **${match['1. symbol']}** - ${match['2. name']}\n`;
        message += `   📍 ${match['4. region']} | 💼 ${match['3. type']}\n\n`;
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

// Handle /news command
async function handleNews(msg) {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId, `📰 *Borsa haberleri alınıyor...*`, { parse_mode: 'Markdown' });
    
    // Using Alpha Vantage news API
    const response = await axios.get(STOCK_API_BASE, {
      params: {
        function: 'NEWS_SENTIMENT',
        topics: 'technology',
        apikey: STOCK_API_KEY,
        limit: 5
      }
    });
    
    const data = response.data;
    
    if (data.feed && data.feed.length > 0) {
      let message = `📰 *Güncel Borsa Haberleri*\n\n`;
      
      data.feed.slice(0, 3).forEach((news, index) => {
        message += `${index + 1}. **${news.title}**\n`;
        message += `   📅 ${new Date(news.time_published).toLocaleDateString('tr-TR')}\n`;
        message += `   🔗 [Detaylar](${news.url})\n\n`;
      });
      
      message += `📊 Daha fazla haber için: https://finance.yahoo.com/news/`;
      
      await bot.sendMessage(chatId, message, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
    } else {
      await bot.sendMessage(chatId, `❌ Haber verisi alınamadı. Lütfen daha sonra tekrar deneyin.`);
    }
  } catch (error) {
    console.error('News API error:', error);
    await bot.sendMessage(chatId, '❌ Haberler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
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
