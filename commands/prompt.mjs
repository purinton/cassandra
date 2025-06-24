import { EmbedBuilder } from 'discord.js';

// Command handler for /prompt
export default async function ({ log, msg, openai }, interaction) {
    log.debug('prompt Request', { interaction });
    await interaction.deferReply();
    const locale = interaction.locale || 'en-US';
    let result;
    try {
        result = await openai.generatePrompt({ log, openai, locale });
    } catch (err) {
        log.error('Error generating prompt:', err);
        await interaction.reply({ content: msg('prompt_error', 'Failed to generate prompt') });
        return;
    }
    if (!result) {
        log.error('Failed to generate prompt');
        await interaction.reply({ content: msg('prompt_error', 'Failed to generate prompt') });
        return;
    }
    const [trait, hobby, object] = result;
    const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .addFields(
            { name: msg('trait', 'Trait'), value: trait, inline: true },
            { name: msg('hobby', 'Hobby'), value: hobby, inline: true },
            { name: msg('object', 'Object'), value: object, inline: true }
        );
    log.info(`Generated prompt: ${trait}, ${hobby}, ${object}`);
    await interaction.editReply({ embeds: [embed] });
}
