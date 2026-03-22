import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('Missing DISCORD_TOKEN, DISCORD_CLIENT_ID or DISCORD_GUILD_ID');
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName('dayz-messages')
    .setDescription('Generate a messages.xml snippet')
    .addStringOption((option) => option.setName('server').setDescription('Server name').setRequired(true))
    .addIntegerOption((option) => option.setName('restart').setDescription('Restart cycle in minutes').setRequired(true)),
  new SlashCommandBuilder()
    .setName('dayz-weather')
    .setDescription('Generate a cfgweather.xml snippet')
    .addNumberOption((option) => option.setName('overcast').setDescription('Overcast 0-1').setRequired(true))
    .addNumberOption((option) => option.setName('fog').setDescription('Fog 0-1').setRequired(true))
    .addNumberOption((option) => option.setName('rain').setDescription('Rain 0-1').setRequired(true)),
  new SlashCommandBuilder()
    .setName('dayz-links')
    .setDescription('Show website links'),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);
await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (ready) => {
  console.log(`Discord bot ready as ${ready.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'dayz-messages') {
    const server = interaction.options.getString('server', true);
    const restart = interaction.options.getInteger('restart', true);
    const output = `<messages>\n  <message delay="60">Server ${server} restart in 60 minutes</message>\n  <restart cycle="${restart}" />\n</messages>`;
    await interaction.reply({ content: '```xml\n' + output + '\n```', ephemeral: true });
  }

  if (interaction.commandName === 'dayz-weather') {
    const overcast = interaction.options.getNumber('overcast', true);
    const fog = interaction.options.getNumber('fog', true);
    const rain = interaction.options.getNumber('rain', true);
    const output = `<weather reset="1" enable="1">\n  <overcast min="${overcast}" max="${overcast}" time="1200" />\n  <fog min="${fog}" max="${fog}" time="900" />\n  <rain min="${rain}" max="${rain}" time="1500" />\n</weather>`;
    await interaction.reply({ content: '```xml\n' + output + '\n```', ephemeral: true });
  }

  if (interaction.commandName === 'dayz-links') {
    await interaction.reply({ content: 'Step Mod!Z Website: add your Vercel domain here', ephemeral: true });
  }
});

client.login(token);
