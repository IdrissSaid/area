import fetch from "node-fetch";
import response from "superagent/lib/response-base";

require('dotenv').config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

/**
 * Function to fetch guilds accessible by the bot from Discord API
 * @param {string} botToken - Bot's authorization token
 * @returns {Promise<Array<Object>> | null} - Promise resolving to an array of guilds accessible by the bot or null if there's an error
 **/
export const getListOfGuilds = async (botToken) => {
    try {
        const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error to fetch servers :', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error connexion to the discord API :', error);
        return null;
    }
};

/**
 * Function to fetch a specific guild
 * @param {string} botToken - Bot's authorization token
 * @param {string} guildID - The ID of the guild we want to find
 * @returns {Promise<Object> | null} - Promise resolving to a guild or null if there's an error
 **/
export const getOneGuild = async (botToken, guildID) => {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildID}`, {
            headers: {
                method: 'GET',
                Authorization: `Bot ${botToken}`,
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error to fetch a guild with ID ${guildID} :`, response.status);
            return null;
        }
    } catch (error) {
        console.error('Error connexion to the discord API :', error);
        return null;
    }
};

/**
 * Function to fetch guilds roles
 * @param {string} botToken - Bot's authorization token
 * @param {object} guild - information about the server we want to get the list of role from.
 * @return {Promise<Array<Object>> | null} - Promise resolving to an array of role list or null if there's no role or an error
 */
export const getRoles = async (botToken, guild) => {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guild.id}/roles`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error fetching roles in ${guild.name} :`, response.status);
            return null
        }
    } catch (error) {
        console.error('Error connecting to the Discord API:', error);
        return null;
    }
};

/**
 * Function to fetch channels in a guild
 * @param {string} botToken - Bot's authorization token
 * @param {string} guildID - The ID of the channel to get the list of channels from.
 * @return {Promise<Array<Object>> | null} - Promise resolving to an array of channels list or null if there's an error
 */
export const getChannels = async (botToken, guildID) => {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildID}/channels`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error fetching channels :`, response.status);
            return null;
        }
    } catch (error) {
        console.error('Error connecting to the Discord API:', error);
        return null;
    }
};

/**
 * Checks if a channel already exists in a Discord server.
 * @param {string} botToken - The bot's authorization token.
 * @param {object} guild - The guild object to check for the channel.
 * @param {string} chanName - The name for the channel to check.
 * @param {number} type - The type of the channel (0 for text, 2 for voice).
 * @returns {Promise<boolean>} - Returns true if a channel with the given name and type exists, otherwise false.
 */
export const channelExists = async (botToken, guild, chanName, type) => {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guild.id}/channels`, {
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        if (response.ok) {
            const channels = await response.json();
            const existingChannel = channels.find(channel => channel.name === chanName && channel.type === type);
            return !!existingChannel; // Returns true if an existing channel is found, otherwise false
        } else {
            console.error('Error fetching channels:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error connecting to the Discord API:', error);
        return false;
    }
};

/**
 * Function to leave a guild
 * @param {string} botToken - Bot's authorization token
 * @param {string} guildID - ID of the server we want to leave.
 */
export const leaveGuild = async (botToken, guildID) => {
    try {
        const response = await fetch(`https://discord.com/api/v10/users/@me/guilds/${guildID}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        if (response.ok) {
            console.log(`The bot has left the server  with ID ${guildID}.`);
        } else {
            console.error(`Error when exiting server  with ID ${guildID} : `, response.status);
        }
    } catch (error) {
        console.error('Error API Discord connection failed:', error);
    }
};

/**
 * Get the ID of the given element.
 * @param {string} botToken - The bot's authorization token.
 * @param {string} name - The name of the guild or the channel to check.
 * @param {number} type - The type of the element (0 for guild, 1 for a channel).
 * @param {object} guild - The guild object to check a channel or null.
 * @param {number} chanType - The type of the channel (0 = text, 2 = voice)
 * @returns {string} - Returns the ID find, otherwise false.
 */
export const getIDWithName = async (botToken, name, type, guild, chanType) => {
    if (type === 0) { // for server/guild
        try {
            const guilds = await getListOfGuilds(botToken);
            const guild = guilds.find(guild => guild.name === name);
            console.log(`Id of ${name} is ${guild.id}`);
            return guild.id;
        } catch {
            console.log(`Can't find a guild with the name ${name} :`, response.status);
            return null;
        }
    } else if (type === 1 && guild) { // for channel
        try {
            const channels = await getChannels(botToken, guild);
            const chan = channels.find(channel => channel.name === name && channel.type === chanType);
            console.log(`Id of ${name} is ${chan.id}`);
            return chan.id;
        } catch {
            console.log(`Can't find a channel with the name ${name} :`, response.status);
            return null;
        }
    } else {
        console.log("The given type is incorrect or the params required fot the type are missing or incorrect");
        return null;
    }
}
