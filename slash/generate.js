const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate')
        .setDescription('Отправить файл')
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Название модели')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emotion')
                .setDescription('Эмоция')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Текст для генерации')
                .setRequired(true)),
    async execute(interaction) {
        // Получаем значение параметра с названием файла
        const model = interaction.options.getString('model');
        const emonation = interaction.options.getString('emotion');

        // Отправляем сообщение с вложением файла
        await interaction.reply({ content: 'Отправка файла...', files: ['./generated/geralt_00005.wav'] });
    },
};
