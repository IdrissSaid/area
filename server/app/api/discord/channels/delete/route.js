import fetch from 'node-fetch';
import {DISCORD_TOKEN, getIDWithName} from "../../utils";

/**
 * Deletes a channel in a Discord server.
 * @param {string} botToken - The bot's authorization token.
 * @param {string} channelId - The ID of the channel to be deleted.
 * @returns {Promise<boolean>} - Returns true if the channel is successfully deleted, otherwise false.
 */
const deleteChannel = async (botToken, channelId) => {
    try {
        const response = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        if (response.ok) {
            console.log(`Channel with ID ${channelId} has been deleted.`);
            return true;
        } else {
            console.error(`Error deleting channel with ID ${channelId}:`, response.status);
            throw new Error('Error deleting channel');
        }
    } catch (error) {
        console.error('Error connecting to the Discord API:', error);
        throw new Error('Error deleting channel');
    }
};

export const GET = async (req) => {
    try {
        const url = new URL(req.url);
        const guildName = url.searchParams.get("guild");
        const chanName = url.searchParams.get("channel");
        const chanType = parseInt(url.searchParams.get("type"), 10);

        const guild = await getIDWithName(DISCORD_TOKEN, guildName, 0, null, null); //0 for guilds and 1 for channels
        const chanId = await getIDWithName(DISCORD_TOKEN, chanName, 1, guild, chanType);

        await deleteChannel(DISCORD_TOKEN, chanId);

        return Response.json(`Delete channel with ID ${chanId} has been done successfully`);
    } catch (error) {
        return Response.json("Error to delete chan");
    }
}