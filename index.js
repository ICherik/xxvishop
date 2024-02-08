const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Client, Intents, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, Collection, Events, ActivityType, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder,Guild, IntentsBitField, VoiceChannel } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice');
const { guildId } = require('./config.json')

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers, 
	GatewayIntentBits.GuildPresences, 
	GatewayIntentBits.GuildVoiceStates, 
	GatewayIntentBits.GuildMessageReactions
] });

client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log('Bot Has connected to discord \nDont Close This APP');
	client.user.setPresence({
        activities: [{ name: `I Cant eat food`, type: ActivityType.Streaming }],
        status: 'idle'
    })
});

//JoinVoice
client.on('ready', async () => {
	const channelId = '1182635959360163851'	
	try {
		const channel = client.channels.cache.get(channelId);
		if (!channel) {
		  console.error('Invalid voice channel');
		  return;
		}
	
		if (!channel.joinable) {
		  console.error('The bot does not have permission to join this voice channel');
		  return;
		}
	
		const connection = await getVoiceConnection(channelId);
		console.log(`Joined voice channel: ${channel.name}`);
		
	} catch (error) {
		console.error('Error joining the voice channel:', error);
	}
});


client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
	} else if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	const { cooldowns } = client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//AutoRole

client.on("guildMemberAdd", async (member) => {
	const autoroleid = "1181646713333747734";
	try {
		const autorole = member.guild.roles.cache.get(autoroleid);
		if (autorole) {
			await member.roles.add(autorole);
			console.log(`Role ${autorole.name} Added To ${member.user.tag}`);
		}else {
			console.log('Role not found');
		}
	} catch (err) {
		console.error('Error adding role:', err);
	};
});



client.on(Events.InteractionCreate, async (interaction) => {
  
	if (!interaction.isButton()) return;

  	if (interaction.customId === 'embed') {
		const embed = new EmbedBuilder()
			.setTitle(`**Nitro Prices**`)
			.setDescription(`
			**N1tro Prices**
			**Sub** <a:wumpusflyer:1172166165733310575> 
			برای فعال شدن هر کدوم از نیترو های مورد نظر لازم به ورود در اکانت های شما است موارد مورد نیاز **__: Email / Password__ ** ** ( فقط ساب نیاز به ورود به اکانت دارد )**
			
			**نیترو های ساب قابلیت فعال سازی در تمامی اکانت ها را دارد و نیازی به اکانت جدید نیست . و تنها شما نباید نیتروی فعالی بر روی اکانت خود داشته باشید.**
			
			Gift <:giftshd:1172177471588794438> 
			** نیترو های گیفت نیاز به اطلاعات اکانت ندارند و با کلیک کردن بر روی گزینه Accept نیترو شما فعال میشود . و در صورتی که نیترویی فعال بر روی اکانت خود داشته باشید نیتروی شما تمدید میشود .**
			═════◈═════
			SUB <a:wumpusflyer:1172166165733310575> 
			1 Months <a:nitrocharkhun:1172166140169027584> 
			Nitro Boost  ━ 195,000 T <a:paymentnitro:1172166202764841012>  
			═════◈═════
			1 years <a:nitrocharkhun:1172166140169027584> 
			Nitro Boost  ━ 0T <a:paymentnitro:1172166202764841012>  
			Nitro Basic  ━ 0T <:disnitro:1172167313986957402>  
			═════◈═════
			Gift <:giftshd:1172177471588794438> 
			1 Months <a:nitrocharkhun:1172166140169027584> 
			Nitro Boost  ━ 245,000 T <a:paymentnitro:1172166202764841012>  
			Nitro Basic  ━ 170,000 T <:disnitro:1172167313986957402>
			═════◈═════
			1 years <a:nitrocharkhun:1172166140169027584> 
			Nitro Boost  ━ 0 T <a:paymentnitro:1172166202764841012>  
			Nitro Basic : ━ 0 T <:disnitro:1172167313986957402>
			
			 ** جهت خرید تیکت بدهید **`)
			.setColor('LuminousVividPink')
			.setFooter({text: 'XXVI Shop' ,iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024})})
			.setTimestamp();
		const embed2 = new EmbedBuilder()
		.setTitle('Nitro 3 Months')
		.setDescription(`
		نیترو بوست 3 ماهه مخصوص اکانت هایی هست  که تا حالا نیتروی براشون فعال نشده است !
		
		شرایط دریافت نیترو بوست 3 ماهه
		
		 تاریخ ساخت اکانت شما باید بالای یک ماه باشد ! ( حدود سی روز گذشته باشه )
		═════◈═════
		
		3 Months  ━ Nitro Boost 3 Months ━ 85,000 T <a:lvlnitro:1172180548345671701>
		
		═════◈═════`)
		.setColor('DarkVividPink')
		.setFooter({text: 'XXVI Shop' ,iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024})})
		.setTimestamp();
		return interaction.reply({embeds: [embed,embed2] , ephemeral: true });
	}

})

module.exports = client
client.login(process.env.TOKEN);