const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
  await middleware(context, async () => {
    const { client, m, botNumber } = context;

    // Log message context for debugging
    console.log(`Kick command context: isGroup=${m.isGroup}, mentionedJid=${JSON.stringify(m.mentionedJid)}, quotedSender=${m.quoted?.sender || 'none'}`);

    // Check if a user is mentioned or quoted
    if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
      return m.reply(`╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ *USER REMOVAL FAILED*
┋❒
┋❒ ❌ No user specified
┋❒
┋❒ 💡 *Usage:*
┋❒ • Reply to user's message
┋❒ • Mention user with @tag
┋❒
┋❒ 📝 *Example:*
┋❒ .kick @username
┋❒ Reply to message with .kick
╰┈┈┈┈━━━━━━┈┈┈┈◈
> ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳`);
    }

    // Get the target user (mentioned or quoted)
    const users = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
    if (!users) {
      console.error(`No valid user found: mentionedJid=${JSON.stringify(m.mentionedJid)}, quotedSender=${m.quoted?.sender || 'none'}`);
      return m.reply(`╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ *USER REMOVAL FAILED*
┋❒
┋❒ ❌ Invalid user target
┋❒
┋❒ 💡 *Please:*
┋❒ 1. Make sure user is in group
┋❒ 2. Use proper @mention
┋❒ 3. Or reply to user's message
╰┈┈┈┈━━━━━━┈┈┈┈◈
> ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳`);
    }

    // Validate JID format
    if (
      typeof users !== 'string' ||
      (!users.includes('@s.whatsapp.net') && !users.includes('@lid'))
    ) {
      console.error(`Invalid JID format: ${users}`);
      return m.reply(`╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ *USER REMOVAL FAILED*
┋❒
┋❒ ❌ Invalid user format
┋❒
┋❒ 🔧 *Technical Error:*
┋❒ JID format not recognized
┋❒ ${users.substring(0, 20)}...
╰┈┈┈┈━━━━━━┈┈┈┈◈
> ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳`);
    }

    // Extract phone number part from JID
    const parts = users.split('@')[0];
    if (!parts) {
      console.error(`Failed to extract number from JID: ${users}`);
      return m.reply(`╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ *USER REMOVAL FAILED*
┋❒
┋❒ ❌ User ID extraction failed
┋❒
┋❒ 🔧 *Technical Error:*
┋❒ Cannot parse user identifier
╰┈┈┈┈━━━━━━┈┈┈┈◈
> ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳`);
    }

    // Prevent kicking the bot itself
    if (users === botNumber) {
      return m.reply(`╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ *USER REMOVAL REJECTED*
┋❒
┋❒ 🤖 Cannot remove myself
┋❒
┋❒ ⚠️ *Security Note:*
┋❒ Bot cannot be removed via command
┋❒
┋❒ 🔒 *Protected Resource*
╰┈┈┈┈━━━━━━┈┈┈┈◈
> ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳`);
    }

    try {
      // Show processing indicator
      await client.sendMessage(m.chat, { 
        react: { text: '⚡', key: m.key } 
      });

      // Attempt to remove the user from the group
      await client.groupParticipantsUpdate(m.chat, [users], 'remove');

      // Success message
      await m.reply(`╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ *USER REMOVED SUCCESSFULLY*
┋❒
┋❒ ✅ *Action:* User Removed
┋❒ 👤 *User:* @${parts}
┋❒ 📞 *Number:* ${parts}
┋❒ 🏷️ *Group:* Current
┋❒ ⏰ *Time:* ${new Date().toLocaleString()}
┋❒
┋❒ ⚡ *Immediate Action Taken*
╰┈┈┈┈━━━━━━┈┈┈┈◈
> ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳`, 
        { mentions: [users] }
      );

    } catch (error) {
      console.error(`Error in kick command: ${error.stack}`);

      // Remove reaction if exists
      try {
        await client.sendMessage(m.chat, { 
          react: { text: '❌', key: m.key } 
        });
      } catch (e) {}

      // Error message based on error type
      let errorMessage = `╭┈┈┈┈━━━━━━┈┈┈┈◈
┋❒ *USER REMOVAL FAILED*
┋❒
┋❒ ❌ Failed to remove user`;

      if (error.message.includes('not authorized') || error.message.includes('admin')) {
        errorMessage += `
┋❒
┋❒ ⚠️ *Reason:*
┋❒ Bot is not group admin
┋❒
┋❒ 💡 *Solution:*
┋❒ Make bot a group admin`;
      } else if (error.message.includes('not in group')) {
        errorMessage += `
┋❒
┋❒ ⚠️ *Reason:*
┋❒ User not in group
┋❒
┋❒ 💡 *Check:*
┋❒ Verify user is still member`;
      } else {
        errorMessage += `
┋❒
┋❒ 🔧 *Technical Error:*
┋❒ ${error.message.substring(0, 50)}...`;
      }

      errorMessage += `
╰┈┈┈┈━━━━━━┈┈┈┈◈
> ©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄵🄴🄴-🅇🄼🄳`;

      await m.reply(errorMessage, { mentions: [users] });
    }
  });
};