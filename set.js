const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'LUCKY-MD;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRVBxYnhwaHlzV3haOFZuV1o4Z2dQSU5COEpUUnNjVnlaMitjbldia3VFOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid1h3VGlDenZ4SzhTVXY3MTMzOTV3MWcwVC9aeGQyZmx5M05OdG8rZENWZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5RGxqNkxWV1pzTkJDZU5nbzJHT2VUZFlsVWh0R2srY2paV2JCMXlzb1VRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCdmNwaVhqaHZNYWN2cWFKbEJSUWFISUo2UVgwZ2JCRTZSQXA1aDdQVVFBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNBQUpCcGtPSEJkbmhpRndDdXEwNEhKVkNHUTA4SFBQVHg3U0kvdFdrRjg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1BK0tJVW5weUIrRDc3QXpHeUtpYjZJNGRnSGRZK2prN0QxbEw3MWFubVU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU01ZUzNYSWlIcTh3Sm9ZbS9aRHJrc3ZDZ2M0dkpDSTQzWHRTdElBWDJHRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRVVaQmg4SnZMdzN2UEN6VkNPSHRJNFFKSzNUb0VpMG1YblBsbWFqcDVtQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhqL0prcDNaSGQ2QWh5VUk4OWlzWmw4eUk1Y25PZGhzeTBrM1hkRXg0bnpJblZDNm9YYlBKU3dUZHoySG5tOFhBdGVZWWNIUlJTNnRjR1gvWnRMWGhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTYzLCJhZHZTZWNyZXRLZXkiOiJOY0lPbHNFdU02algwSGRrNkFzRytsekt6a253TUZJcXpWRlV1Z1VxTnFZPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJteFZLNFJ1UVRCT3d6THRNdlAtMi1BIiwicGhvbmVJZCI6ImIzZTc1MzQ5LThjNTEtNGFjOC05MjExLWEwNjBkYjkzOTA4ZiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCdmMzOWlHc3pHVkU4ZXlHYWRXMzloZEk4T2M9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaEkydGwxbVJQcDN6ZFV5WURpcXB2M2d4eFBzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlRRTFIxUVZBIiwibWUiOnsiaWQiOiIyNTQ3NTg0NDMxMTE6NTVAcy53aGF0c2FwcC5uZXQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0lLbW9NOENFTzdheWNBR0dBSWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6Ikd5RVlodVpNYUhtbnJPUVJEL1NIOEwwWVFmM2RoVzRJNFNya3AyTlRQa009IiwiYWNjb3VudFNpZ25hdHVyZSI6IklGT2k1b0lIV2RqYWF0Yk1IMzUxeWZJaERnNDFYUk10Z2RZMEFJZnFBRFd3cmRvL2RhdXREcjJtYU94NXJoSERPRjRuK0FBbHRMM2FsM3dLL0VrUkNRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJFb2NDZlh2VDBZbmRDNjdvMnNnQm5YTXFXRnhnUUh5SUc2WHdrTSsxYk03UkxWTHlGYlBuREpEVnFNZGxMV0VuaXNWWWJOOVZqZzlNWTdpSWZtVVpnQT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc1ODQ0MzExMTo1NUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJSc2hHSWJtVEdoNXA2emtFUS8waC9DOUdFSDkzWVZ1Q09FcTVLZGpVejVEIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQ2MDM4MTQwLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUFXOSJ9',
    PREFIXE: process.env.PREFIX || "/",
    GITHUB : process.env.GITHUB|| 'https://github.com/Fred1e/LUCKY_MD',
    OWNER_NAME : process.env.OWNER_NAME || "★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254758443111",  
              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || " yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "non",  
     AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'no',
    URL: process.env.URL || "https://i.ibb.co/cXrVMRgL/file-1131.jpg",  
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'yes',              
    CHAT_BOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "no",
    AUTO_BLOCK: process.env.AUTO_BLOCK || 'no', 
    GCF: process.env.GROUP_HANDLE || 'yes', 
    AUTO_REPLY : process.env.AUTO_REPLY || "no", 
    AUTO_STATUS_TEXT: process.env.AUTO_STATUS_TEXT || '★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫ loves it',   
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'no',
    AUTO_BIO: process.env.AUTO_BIO || 'no',       
    ANTI_CALL_TEXT : process.env.ANTI_CALL_TEXT || '★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫ ĪS ΛŦ ßƐΛSŦ MᎾDƐ ŔĪƓĤŦ ИᎾᏯ ƇΛИŦ ŔƐƇĪƐ√Ɛ YᎾƱŔ ƇΛĿĿ 📞📵',             
    GURL: process.env.GURL  || "",
    WEBSITE :process.env.GURL || "",
    CAPTION : process.env.CAPTION || "✧⁠ᴘσωєʀє∂ ву ★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫✧",
    BOT : process.env.BOT_NAME || '✧⁠LUCKY_MD✧⁠',
    MODE: process.env.PUBLIC_MODE || "no",              
    TIMEZONE: process.env.TIMEZONE || "Africa/Dodoma", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '5' ,
    ETAT : process.env.PRESENCE || '1',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTI_DELETE_MESSAGE : process.env.ANTI_DELETE_MESSAGE || 'yes',
    ANTI_CALL: process.env.ANTI_CALL || 'yes', 
    AUDIO_REPLY : process.env.AUDIO_REPLY || 'no',             
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, 
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

