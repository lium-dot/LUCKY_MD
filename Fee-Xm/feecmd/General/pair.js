const {
    default: Toxic_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) {
            return await client.sendMessage(m.chat, {
                text: `📱 *Please provide a number to pair!*\n\nExample:\n*${prefix}pair 2555752593977*`
            }, { quoted: m });
        }

        const number = text.replace(/[^0-9]/g, '');
        if (number.length < 6 || number.length > 20) {
            return await client.sendMessage(m.chat, {
                text: `❌ *Invalid number!* Please enter a valid WhatsApp number (6–20 digits).`
            }, { quoted: m });
        }

        // Create a temporary folder for session
        const tempPath = path.join(__dirname, 'temps', number);
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });

        // Baileys setup
        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(tempPath);

        const Fee_Xmd = Fredi_Ai({
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: ['Ubuntu', 'Chrome'],
            syncFullHistory: false,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
        });

        Fee_Xmd.ev.on('creds.update', saveCreds);

       
        await delay(1500);
        const code = await Fee_Xmd.requestPairingCode(number);

        if (!code) throw new Error("Failed to get pairing code.");

        // Send pairing code message with CTA copy button
        await client.sendMessage(m.chat, {
            interactiveMessage: {
                header: "🔐 🄵🄴🄴-🅇🄼🄳 Pairing Code",
                title: `✅ Pairing code for *${number}*\n\n> ${code}\n\nFollow the link below to learn how to use it 👇`,
                footer: " ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳",
                buttons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Copy Pair Code",
                            id: `copy_${Date.now()}`,
                            copy_code: code,
                        }),
                    },
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Open Pairing Guide",
                            url: "https://www.instagram.com/@frediezra"
                        }),
                    },
                ],
            },
        }, { quoted: m });

        await Fee_Xmd.ws.close();
        setTimeout(() => {
            if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { recursive: true, force: true });
        }, 5000);

    } catch (error) {
        console.error("Error in pair command:", error);
        await client.sendMessage(m.chat, {
            text: `⚠️ *Oops! Failed to generate pairing code.*\n\n> ${error.message}\n\nVisit https://github.com/Fred1e/Fee_Xmd for help.`
        }, { quoted: m });
    }
};