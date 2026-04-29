// ==============================================
// SETTINGS.JS - KONFIGURASI BOT
// ==============================================

module.exports = {
    // ========== KONFIGURASI DASAR ==========
    prefix: '.',
    ownerNumber: '628xxxxx@s.whatsapp.net', // GANTI NOMOR LO!
    botName: 'Bintang-MD',
    version: '2.0.0',
    
    // ========== FITUR ON/OFF ==========
    autoRead: true,      // Auto read pesan
    autoTyping: false,   // Auto typing indicator
    autoRecord: false,   // Auto recording indicator
    
    // ========== LIMIT & PREMIUM ==========
    defaultLimit: 10,    // Limit default user
    premiumLimit: 999,   // Limit user premium
    
    // ========== DATABASE ==========
    useDatabase: false,   // Pake database? (true/false)
    dbType: 'json',       // json / mongodb / mysql
    
    // ========== API KEY ==========
    apikey: {
        gemini: '',       // API Key Gemini AI
        openai: '',       // API Key OpenAi
        mongodb: '',      // URL MongoDB
        imgbb: ''         // API Key ImgBB
    },
    
    // ========== PESAN OTOMATIS ==========
    welcomeMessage: true,  // Welcome new member
    leftMessage: true,     // Left member message
    
    // ========== ANTILINK & ANTISPAM ==========
    antiLink: false,      // Hapus pesan link
    antiSpam: true,       // Cegah spam
    antiVirtex: true,     // Cegah virtex
    maxSpam: 5,           // Maks spam per detik
    
    // ========== OTHER ==========
    timezone: 'Asia/Jakarta',
    debug: false          // Mode debug (true/false)
};
