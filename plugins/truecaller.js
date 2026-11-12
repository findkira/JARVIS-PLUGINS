
const axios = require("axios");
const { System, isPrivate } = require("../lib/");

System({
    pattern: "true",
    fromMe: isPrivate,
    desc: "Lookup caller information",
    type: "search"
}, async (message, match) => {
    try {
        const number = (match || "")
            .trim()
            .replace(/[\s+()-]/g, "");

        if (!number) {
            return await message.reply(
                "TRUECALLER LOOKUP\n\n" +
                "Usage: .true 919876543210"
            );
        }

        if (!/^\d{8,15}$/.test(number)) {
            return await message.reply(
                "Invalid phone number.\n" +
                "Enter a valid number with country code."
            );
        }

        await message.reply("Searching caller information...");

        const response = await axios.get(
            "https://oggy-api.vercel.app/truecaller",
            {
                params: { number },
                timeout: 20000
            }
        );

        const data = response.data;

        if (!data || data.status !== "success") {
            return await message.reply(
                "No caller information found."
            );
        }

        const result = [
            "╭━━〔 TRUECALLER 〕━━╮",
            "┃",
            `┃ Name: ${data.name || "Not available"}`,
            `┃ Number: ${data.number || number}`,
            `┃ International: ${data.international_format || "Unknown"}`,
            "┃",
            `┃ Country: ${data.country || "Unknown"}`,
            `┃ Location: ${data.location || "Unknown"}`,
            "┃",
            `┃ Carrier: ${data.carrier || "Unknown"}`,
            `┃ Line Type: ${data.line_type || "Unknown"}`,
            "┃",
            "╰━━━━━━━━━━━━━━━━━━╯"
        ].join("\n");

        return await message.client.sendMessage(message.jid, {
            text: result,
            contextInfo: {
                externalAdReply: {
                    title: "Truecaller information.",
                    body: "",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: "https://lokixer.onrender.com/file/kpgapmzyfcktr.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VaPeVWFHwXbM08nIIr2v"
                }
            }
        });

    } catch (error) {
        console.error("[TRUE ERROR]", error);

        return await message.reply(
            "Unable to fetch caller information.\n" +
            "Please try again later."
        );
    }
});
