const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Узнать задержку'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		await interaction.editReply(`:ping_pong: Pong!\n:stopwatch: Uptime: ${Math.round(interaction.client.uptime / 60000)} minutes\n:clown: Websocket heartbeat: ${interaction.client.ws.ping}ms.\n:clown: Rountrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};
