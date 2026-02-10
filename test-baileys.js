
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';

async function testV() {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`Version: ${version}, Latest: ${isLatest}`);

    const { state, saveCreds } = await useMultiFileAuthState('test_auth');
    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'debug' }),
        browser: ['Windows', 'Chrome', '10.0']
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        console.log('Update:', connection, qr ? 'QR Received' : '');
        if (connection === 'close') {
            console.log('Closed', lastDisconnect?.error);
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

testV().catch(console.error);
