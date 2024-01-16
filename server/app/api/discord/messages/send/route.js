import fetch from 'node-fetch';
import { getIDWithName, DISCORD_TOKEN} from "../../utils.js";

/**
 * Function to send a message to a channel
 * @param {string} botToken - Bot's authorization token
 * @param {string} chanID - The ID of the channel to sends message from.
 * @param {string} messageToSend - The message to send
 * @return {boolean} - Returns true if the message is successfully sent, otherwise false.
 */
const sendMessageChannel = async (botToken, chanID, messageToSend) => {
    try {
        const response = await fetch(`https://discord.com/api/v10/channels/${chanID}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bot ${botToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content: messageToSend})
        });

        if (response.ok) {
            console.log('Message sent');
            return true;
        } else {
            console.error(`Error to send :`, response.status);
            return false;
        }
    } catch (error) {
        console.error('Error connecting to the Discord API:', error);
        return false;
    }
};

export const GET = async (req) => {
    try {
        const url = new URL(req.url);
        const guildName = url.searchParams.get("guild");
        const chanName = url.searchParams.get("channel");
        const messageToSend = "A recup plus tard dans la base de donnée chp comment";

        const guild = await getIDWithName(DISCORD_TOKEN, guildName, 0, null, null); //0 for guilds and 1 for channels
        const chanId = await getIDWithName(DISCORD_TOKEN, chanName, 1, guild, 0);

        sendMessageChannel(DISCORD_TOKEN, chanId, messageToSend);

        return Response.json(`Message send to ${chanName} successfully`);
    } catch (error) {
        return Response.json({error});
    }
}