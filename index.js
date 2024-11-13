const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildInvites] });

const TOKEN = process.env.DISCORD_TOKEN; // 環境変数からトークンを取得
const GUILD_ID = '1274660396011229205'; // サーバーID
const ROLE_ID = '1305910588869709925'; // 付与するロールのID
const INVITE_CODE = 'https://discord.gg/GNz3NyKHFH'; // 特定の招待コード（コード部分のみ）

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', async (member) => {
    console.log(`New member joined: ${member.user.tag}`);
    if (member.guild.id === GUILD_ID) {
        try {
            const invites = await member.guild.invites.fetch();
            console.log(`Fetched invites: ${invites.size}`);

            const invite = invites.find(inv => inv.code === INVITE_CODE.split('/').pop()); // URLからコード部分だけを抽出
            if (invite) {
                const role = member.guild.roles.cache.get(ROLE_ID);
                if (role) {
                    await member.roles.add(role);
                    console.log(`Assigned role to ${member.user.tag}`);
                } else {
                    console.log('Role not found');
                }
            } else {
                console.log(`Invite with code ${INVITE_CODE} not found`);
            }
        } catch (error) {
            console.error(`Error fetching invites or assigning role: ${error.message}`);
        }
    }
});
client.on('error', console.error);

client.login(TOKEN);