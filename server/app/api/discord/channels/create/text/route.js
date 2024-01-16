import fetch from 'node-fetch';
import { getIDWithName, channelExists, getOneGuild,  DISCORD_TOKEN} from "../../../utils.js";


/**
 *  Creates a text channel in a Discord server.
 *  @param {string} botToken - The bot's authorization token.
 *  @param {object} guild - The guild object where the channel will be created.
 *  @param {string} chanName - The name for the channel to be created.
 *  @returns {Promise<object>} - Returns the newly created channel as an object.
 */
const createTextChannel = async (botToken, guild, chanName) => {
    try {
        const chanExists = await channelExists(DISCORD_TOKEN, guild, chanName, 0);
        if (chanExists === false) {
            const response = await fetch(`https://discord.com/api/v10/guilds/${guild.id}/channels`, {
                method: 'POST',
                headers: {
                    Authorization: `Bot ${botToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: chanName,
                    type: 0,
                }),
            });

            if (response.ok) {
                console.log(`The channel ${chanName} is created.`);
                return await response.json();
            } else {
                console.error(`Error creating channel ${chanName} :`, response.status);
                return null;
            }
        } else {
            console.log('The channel already exists');
            return null;
        }
    } catch (error) {
        console.error('Error connecting to the Discord API:', error);
        return null;
    }
};

export const GET = async (req) => {
    try {
        const url = new URL(req.url);
        const guildName = url.searchParams.get("guild");
        const chanName = url.searchParams.get("channel");

        const guildID = await getIDWithName(DISCORD_TOKEN, guildName, 0, null); //0 for guilds and 1 for channels
        const guild = await getOneGuild(DISCORD_TOKEN, guildID);

        await createTextChannel(DISCORD_TOKEN, guild, chanName);

        return Response.json(`Channel ${chanName} created successfully`);
    } catch (error) {
        return Response.json({error});
    }
}