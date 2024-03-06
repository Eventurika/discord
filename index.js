require('dotenv').config();
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v10")
const fs = require("fs")

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const LOAD_SLASH = process.argv[2] === "load"

// Список серверов на которые требуется развернуть команды
const GUILD_IDs = [
    '803319898813890620'
]


let commands = []
client.slashcommands = new Collection();

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

async function loadCommands() {
    const rest = new REST().setToken(process.env['DISCORD_TOKEN'])
    console.log("Deploying slash commands on all servers")
    for (let i in GUILD_IDs) {
        await rest.put(Routes.applicationGuildCommands(process.env['CLIENT_ID'], GUILD_IDs[i]), {body: commands})
            .then(() => {
                console.log(`Successfully loaded ${i}`)
            })
            .catch((err) => {
                if (err) {
                    console.log(err)
                    process.exit(1)
                }
            });
    }
    process.exit(0);
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});



if (LOAD_SLASH) {
    loadCommands();
} else {
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await slashcmd.execute(interaction)
        }

        handleCommand()
    })
    client.login(process.env['DISCORD_TOKEN'])
}
