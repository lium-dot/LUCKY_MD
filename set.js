const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieU9vejZDZ0lKV2hlOHRrZEd0U2xuQ0x3Rkg1eXg5NlZRRXhtbExxVWhrUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia2YzWlRnYjFZNXpZQkZqZ0YxZThpNXV6c2x4LzJOcGZpalkwQVNzUVlWcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBSVRtY1pvNTVpT1MzTlMxd3hWZ1JLL1doTXhtQzd2LzZTc0NVd0NOdzFnPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ6cTRHSmFtMHdwNnhEeXZjeEczQ0swTnhRRHR5Y0NvSzZicU50TDd6WWk4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdNUmhVTFRCVFRTVzk5RkNJQzg1cDQ2bVo5TU8vdXBlYnFqeTMrUHU3a3M9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InRiYmQ5dTdHMjRmRXcrK1JnVk12aGVJT3d4Z2pDUjBGT1AyOVRDVnRWaTQ9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic1BZNnBIb1RlZ0k5QUc3MXliaVY0Q3d2VzBmR29UZkFNRGpxNU9iMEFXdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNldnL2JzK1hKckFQTjVwL2pMZ25Nb1pXajNWYUJ0K3VrUlNEbjJYR0h4az0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImJmbCt5Q1h2SU96M2dlV2ZBcEsvUG9WZ3lPa25tOXRhbXlYK0VJUDlKRG8wMnhabXZVWUZOcUxCYnpJZjF5Q3p3a25WSGh2cjhJOS9aSU8wNzJ1SmlBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjEwLCJhZHZTZWNyZXRLZXkiOiI0MlcwNkFNbzZWeHBpc0xJOVVoZElFZ1JXTGluU0tnYVpDS0dHQnlPb2NnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiI3aTQ5dnRnMVRULTlRTXlmTnVnQ0RnIiwicGhvbmVJZCI6IjAxZTFmZjUwLTUxMjctNDg1OC1iODkxLWNmYTZjZDViYjE1YSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI1ZndHSUd6YktxREVhRmVRM2JLL0liS0s5ZFk9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZms2a1p5M1J6Y0RWeDJYcFE5UXVxNWNOWTlvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkxNQUdWVldRIiwibWUiOnsiaWQiOiIyNTQ3NTg0NDMxMTE6ODhAcy53aGF0c2FwcC5uZXQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ1BqMzFoQVE2YmpCdndZWUJpQUFLQUE9IiwiYWNjb3VudFNpZ25hdHVyZUtleSI6Inl2NnpGTVpSekg5RFJKSTNxQ2IzNkVXZUhGaGFxY2RNT2piMDhVZWtjZ1E9IiwiYWNjb3VudFNpZ25hdHVyZSI6InF1MUE5Znl4K1dzOG82Mm9ITG43RXBrQlg1a011bFRHK0ZRZEdWcmF6WldIVFRQRjJIazY5TUFBSHR4ZGRSOHRiTmhiUHNoY1dnWUtEeTZheC91MkFRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJnZzcwMDVjMzZzRC9vNUdmU0laMGpmMWhxdWFrcWgreEw4cUJFSnZpNFNDZ1hJTStPdytTOW9TamhCY2IrcDFnSmlSNzNENXZtUThBRVJJQ2M1em9nUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc1ODQ0MzExMTo4OEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJjcitzeFRHVWN4L1EwU1NONmdtOStoRm5oeFlXcW5IVERvMjlQRkhwSElFIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQzODA1NTU4LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUpRcyJ9',
    PREFIXE: process.env.PREFIX || "*",
    GITHUB : process.env.GITHUB|| 'https://github.com/Fred1e/LUCKY_MD',
    OWNER_NAME : process.env.OWNER_NAME || "★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254758443111",  
              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || " yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "non",  
     AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'no',
    URL: process.env.URL || "https://files.catbox.moe/7irwqn.jpeg",  
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'yes',              
    CHAT_BOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "no",
    AUTO_BLOCK: process.env.AUTO_BLOCK || 'no', 
    GCF: process.env.GROUP_HANDLE || 'yes', 
    AUTO_REPLY : process.env.AUTO_REPLY || "no", 
    AUTO_STATUS_TEXT: process.env.AUTO_STATUS_TEXT || '★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫ loves it',   
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'no',
    AUTO_BIO: process.env.AUTO_BIO || 'no',       
    ANTI_CALL_TEXT : process.env.ANTI_CALL_TEXT || '★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫☣ isn't available now ',             
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f",
    CAPTION : process.env.CAPTION || "✧⁠LUCKY_MD✧",
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

