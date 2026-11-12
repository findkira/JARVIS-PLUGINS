
const axios = require("axios");
const { System, isPrivate } = require("../lib/");

System({
    pattern: "true",
    fromMe: isPrivate,
    desc: "Lookup caller information",
    type: "search"
}, async (message, match) => {
    let waitingReact = false;

    try {
        const number = (match || "")
            .trim()
            .replace(/[\s+()-]/g, "");

        if (!number) {
            return await message.reply(
                "*TRUECALLER LOOKUP*\n\n" +
                "Usage: *.true 919876543210*"
            );
        }

        if (!/^\d{8,15}$/.test(number)) {
            return await message.reply(
                "*Invalid phone number.*\n" +
                "Enter a valid number with country code."
            );
        }

        // Waiting reaction
        try {
            await message.react("⏳");
            waitingReact = true;
        } catch (e) {
            console.log("Waiting reaction failed:", e.message);
        }

        const response = await axios.get(
            "https://oggy-api.vercel.app/truecaller",
            {
                params: { number },
                timeout: 30000
            }
        );

        const data = response.data;

        if (!data || data.status !== "success") {
            return await message.reply(
                "*No caller information found.*"
            );
        }

        const result = [
            "*╭━━〔 TRUECALLER 〕━━╮*",
            "┃",
            `┃ *Name:* ${data.name || "Not available"}`,
            `┃ *Number:* ${data.number || number}`,
            `┃ *International:* ${data.international_format || "Unknown"}`,
            "┃",
            `┃ *Country:* ${data.country || "Unknown"}`,
            `┃ *Location:* ${data.location || "Unknown"}`,
            "┃",
            `┃ *Carrier:* ${data.carrier || "Unknown"}`,
            `┃ *Line Type:* ${data.line_type || "Unknown"}`,
            "┃",
            "*╰━━━━━━━━━━━━━━━━━━╯*"
        ].join("\n");

        return await message.client.sendMessage(message.jid, {
            text: result,
            contextInfo: {
                externalAdReply: {
                    title: "Truecaller information.",
                    body: "",
                    mediaType: 1,
                    sourceUrl: "https://whatsapp.com/channel/0029VaPeVWFHwXbM08nIIr2v"
                }
            }
        });

    } catch (error) {
        console.error("[TRUE ERROR]", error.message);

        return await message.reply(
            "*Unable to fetch caller information.*\n" +
            "Please try again later."
        );

    } finally {
        if (waitingReact) {
            try {
                await message.react("");
            } catch (e) {
                console.log("Reaction cleanup failed:", e.message);
            }
        }
    }
});
