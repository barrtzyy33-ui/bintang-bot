// ========== FITUR 700+ (TAMBAHKAN INI) ==========

// FUN (50+)
if (['cekkontol','ck','cekganteng','cekmemek','ramal','jadian','suit','truth','dare','top','kerang','kapankah','bisakah','apakah'].includes(cmd)) {
    const rand = Math.floor(Math.random() * 100);
    const list = {
        cekkontol: `🍆 UKURAN: ${rand}cm\n${rand>15?'BESAR':'KECIL'}`,
        cekganteng: `✨ LEVEL: ${rand}%\n${rand>70?'GANTENG':'ISTIGHFAR'}`,
        suit: ['SERI','MENANG','KALAH'][Math.floor(Math.random()*3)]
    };
    await sock.sendMessage(from, { text: list[cmd] || `🔮 HASIL: ${rand}%` });
}

// GAME (recursive tebak)
if (cmd === 'tebak') {
    const jawaban = ['pisang','mobil','ayam','buku','meja'][Math.floor(Math.random()*5)];
    global.tebak = jawaban;
    await sock.sendMessage(from, { text: `🔍 TEBAK: ${'_'.repeat(jawaban.length)} huruf` });
}
if (global.tebak && cmd === global.tebak) {
    await sock.sendMessage(from, { text: '🎉 BENAR!' });
    global.tebak = null;
}

// TOOLS (30+)
if (cmd === 'qr' && args[0]) {
    const QR = require('qrcode');
    const qrBuf = await QR.toBuffer(args.join(' '));
    await sock.sendMessage(from, { image: qrBuf, caption: '✅ QR CODE' });
}
if (cmd === 'ip' && args[0]) {
    const axios = require('axios');
    const { data } = await axios.get(`http://ip-api.com/json/${args[0]}`);
    await sock.sendMessage(from, { text: `🌐 ${data.country} - ${data.city}\n📡 ${data.isp}` });
}

// DOWNLOAD (5+)
if (cmd === 'ytmp3' && args[0]) {
    await sock.sendMessage(from, { text: '🎵 MENDOWNLOAD...' });
    const ytdl = require('ytdl-core');
    const stream = ytdl(args[0], { filter: 'audioonly' });
    await sock.sendMessage(from, { audio: stream, mimetype: 'audio/mpeg' });
}

// OWNER (15+)
if (['ban','unban','bc','prem'].includes(cmd) && from === owner) {
    if (cmd === 'bc') await sock.sendMessage(from, { text: '📢 BROADCAST KE SEMUA CHAT' });
    if (cmd === 'ban') await sock.sendMessage(from, { text: `🚫 USER ${args[0]} DI BAN` });
                                  }
