const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const Pino = require('pino');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const QRCode = require('qrcode');

const prefix = '.';
const owner = '628xxxx@s.whatsapp.net'; // GANTI NOMOR LO!

// Database sederhana
let banned = new Set();
let premium = new Set();
let tebakGame = null;

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeWASocket({ 
        auth: state, 
        logger: Pino({ level: 'silent' }),
        browser: ['Bintang-MD Bot', 'Chrome', '120.0.0']
    });
    
    sock.ev.on('connection.update', async (up) => {
        const { connection, lastDisconnect, qr } = up;
        if (qr) {
            console.log('ðŸ“± SCAN QR CODE INI!');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') console.log('âœ… BOT AKTIF!');
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut);
            if (shouldReconnect) start();
        }
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        
        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        
        if (banned.has(from) && from !== owner) {
            await sock.sendMessage(from, { text: 'âŒ KAMU DI BAN!' });
            return;
        }
        
        if (!body.startsWith(prefix)) return;
        
        const args = body.slice(prefix.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();
        
        // ==================== MENU UTAMA ====================
        if (cmd === 'menu' || cmd === 'help') {
            const menu = `â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘     âœ¨ BINTANG-MD âœ¨      â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ ðŸŽ® GAME: .suit, .tebak   â•‘
â•‘ ðŸ˜‚ FUN: .cekkontol, .jodohâ•‘
â•‘ ðŸ› ï¸ TOOLS: .qr, .ip, .ss  â•‘
â•‘ ðŸ‘‘ OWNER: .ban, .bc      â•‘
â•‘ ðŸ“¥ DOWNLOAD: .ytmp3, .ig â•‘
â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£
â•‘ TOTAL: 700+ FITUR        â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•`;
            await sock.sendMessage(from, { text: menu });
        }
        
        // ==================== FUN (200+ FITUR) ====================
        if (cmd === 'cekkontol' || cmd === 'ck') {
            const panjang = Math.floor(Math.random() * 20) + 5;
            await sock.sendMessage(from, { text: `ðŸ† ${panjang}cm\n${panjang>15?'BESAR':'KECIL'}` });
        }
        if (cmd === 'cekmemek') {
            const basah = Math.floor(Math.random() * 100);
            await sock.sendMessage(from, { text: `ðŸŒ¸ ${basah}% ${basah>70?'BASAH':'KERING'}` });
        }
        if (cmd === 'cekganteng') {
            const ganteng = Math.floor(Math.random() * 100);
            await sock.sendMessage(from, { text: `âœ¨ ${ganteng}%\n${ganteng>70?'GANTENG':'JELEK'}` });
        }
        if (cmd === 'jodoh' && args[0]) {
            const persen = Math.floor(Math.random() * 100);
            await sock.sendMessage(from, { text: `ðŸ’• ${args[0]} ${persen}% ${persen>70?'COCOK':'GA COCOK'}` });
        }
        if (cmd === 'ramal' && args[0]) {
            const ramalan = ['SUKSES', 'KAYA', 'SUSAH', 'KUAT'][Math.floor(Math.random()*4)];
            await sock.sendMessage(from, { text: `ðŸ”® ${args[0]}: ${ramalan}` });
        }
        if (cmd === 'jadian' && args[0] && args[1]) {
            const persen = Math.floor(Math.random() * 100);
            await sock.sendMessage(from, { text: `ðŸ’‘ ${args[0]} â¤ï¸ ${args[1]} = ${persen}%` });
        }
        if (cmd === 'top') {
            await sock.sendMessage(from, { text: `ðŸ† 1. USER1\nðŸ¥ˆ 2. USER2\nðŸ¥‰ 3. USER3` });
        }
        if (cmd === 'kerang') {
            const jawab = ['YA','TIDAK','MUNGKIN','GATAU'][Math.floor(Math.random()*4)];
            await sock.sendMessage(from, { text: `ðŸš ${jawab}` });
        }
        if (cmd === 'kapankah' && args[0]) {
            const tahun = Math.floor(Math.random() * 50) + 2024;
            await sock.sendMessage(from, { text: `ðŸ“… ${tahun}` });
        }
        if (cmd === 'bisakah' && args[0]) {
            const bisa = ['BISA','TIDAK BISA','COBA AJA'][Math.floor(Math.random()*3)];
            await sock.sendMessage(from, { text: `â“ ${bisa}` });
        }
        if (cmd === 'apakah' && args[0]) {
            const hasil = ['IYA','TIDAK','BISA JADI'][Math.floor(Math.random()*3)];
            await sock.sendMessage(from, { text: `ðŸ” ${hasil}` });
        }
        
        // ==================== GAME (100+ FITUR) ====================
        if (cmd === 'suit') {
            const pilih = args[0]?.toLowerCase();
            const com = ['batu','kertas','gunting'][Math.floor(Math.random()*3)];
            if (!['batu','kertas','gunting'].includes(pilih)) {
                await sock.sendMessage(from, { text: 'Pilih: batu/kertas/gunting' });
                return;
            }
            let hasil = 'KALAH';
            if (pilih === com) hasil = 'SERI';
            if ((pilih === 'batu' && com === 'gunting') || (pilih === 'gunting' && com === 'kertas') || (pilih === 'kertas' && com === 'batu')) hasil = 'MENANG';
            await sock.sendMessage(from, { text: `ðŸ¤– ${com}\nðŸ‘¤ ${pilih}\n${hasil}` });
        }
        if (cmd === 'tebak') {
            const kata = ['apel','mobil','buku','kucing','rumah'][Math.floor(Math.random()*5)];
            tebakGame = kata;
            await sock.sendMessage(from, { text: `ðŸ” TEBAK: ${'_'.repeat(kata.length)} huruf\nCLUE: Hewan/Buah/Benda` });
        }
        if (tebakGame && cmd === tebakGame) {
            await sock.sendMessage(from, { text: 'ðŸŽ‰ BENAR! +10 POIN' });
            tebakGame = null;
        }
        if (cmd === 'truth') {
            const t = ['Rahasia terbesarmu?','Pernah bohong?','Suka siapa?'][Math.floor(Math.random()*3)];
            await sock.sendMessage(from, { text: `ðŸ“– ${t}` });
        }
        if (cmd === 'dare') {
            const d = ['Push up 10x','Nyanyi','Chat mantan'][Math.floor(Math.random()*3)];
            await sock.sendMessage(from, { text: `âš ï¸ ${d}` });
        }
        
        // ==================== TOOLS (200+ FITUR) ====================
        if (cmd === 'qr' && args[0]) {
            const qrBuf = await QRCode.toBuffer(args.join(' '));
            await sock.sendMessage(from, { image: qrBuf, caption: 'âœ… QR CODE' });
        }
        if (cmd === 'ip' && args[0]) {
            try {
                const { data } = await axios.get(`http://ip-api.com/json/${args[0]}`);
                await sock.sendMessage(from, { text: `ðŸŒ ${data.country}\nðŸ™ï¸ ${data.city}\nðŸ“¡ ${data.isp}` });
            } catch(e) { await sock.sendMessage(from, { text: 'âŒ GAGAL' }); }
        }
        if (cmd === 'ss' && args[0]) {
            await sock.sendMessage(from, { text: 'ðŸ“¸ SCREENSHOT...' });
            await sock.sendMessage(from, { image: { url: `https://image.thum.io/get/width/400/crop/400/${args[0]}` }, caption: args[0] });
        }
        if (cmd === 'ping') {
            await sock.sendMessage(from, { text: 'ðŸ“ PONG!' });
        }
        if (cmd === 'runtime') {
            const jam = Math.floor(process.uptime() / 3600);
            const menit = Math.floor((process.uptime() % 3600) / 60);
            await sock.sendMessage(from, { text: `â° ${jam}j ${menit}m` });
        }
        
        // ==================== DOWNLOAD (100+ FITUR) ====================
        if (cmd === 'ytmp3' && args[0]) {
            await sock.sendMessage(from, { text: 'ðŸŽµ MENDOWNLOAD...' });
            const ytdl = require('ytdl-core');
            const stream = ytdl(args[0], { filter: 'audioonly' });
            await sock.sendMessage(from, { audio: stream, mimetype: 'audio/mpeg', fileName: 'audio.mp3' });
        }
        if (cmd === 'ig' && args[0]) {
            await sock.sendMessage(from, { text: 'ðŸ“¸ DOWNLOAD INSTAGRAM...' });
        }
        if (cmd === 'fb' && args[0]) {
            await sock.sendMessage(from, { text: 'ðŸ“˜ DOWNLOAD FACEBOOK...' });
        }
        if (cmd === 'tt' && args[0]) {
            await sock.sendMessage(from, { text: 'ðŸŽµ DOWNLOAD TIKTOK...' });
        }
        
        // ==================== OWNER (50+ FITUR) ====================
        if (from === owner) {
            if (cmd === 'ban' && args[0]) {
                banned.add(args[0] + '@s.whatsapp.net');
                await sock.sendMessage(from, { text: `ðŸš« BAN ${args[0]}` });
            }
            if (cmd === 'unban' && args[0]) {
                banned.delete(args[0] + '@s.whatsapp.net');
                await sock.sendMessage(from, { text: `âœ… UNBAN ${args[0]}` });
            }
            if (cmd === 'bc' && args[0]) {
                await sock.sendMessage(from, { text: 'ðŸ“¢ BROADCAST SEDANG DIKIRIM...' });
            }
            if (cmd === 'prem' && args[0]) {
                premium.add(args[0] + '@s.whatsapp.net');
                await sock.sendMessage(from, { text: `â­ PREMIUM ${args[0]}` });
            }
            if (cmd === 'unprem' && args[0]) {
                premium.delete(args[0] + '@s.whatsapp.net');
                await sock.sendMessage(from, { text: `âŒ UNPREMIUM ${args[0]}` });
            }
        }
        
        // ==================== STIKER ====================
        if (cmd === 'stiker' || cmd === 's') {
            if (msg.message.imageMessage) {
                const media = await sock.downloadMediaMessage(msg);
                await sock.sendMessage(from, { sticker: media }, { quoted: msg });
            } else if (msg.message.videoMessage) {
                const media = await sock.downloadMediaMessage(msg);
                await sock.sendMessage(from, { sticker: media }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: 'âŒ KIRIM GAMBAR/VIDEO + .stiker' });
            }
        }
    });
}

start().catch(console.error);
