// Modern ES module, improved readability, and testability via dependency injection

export async function fetchRecent({ log, db, limit = 100 }) {
    try {
        const [rows] = await db.query(
            'SELECT adjective, verb, noun FROM history ORDER BY id DESC LIMIT ?',
            [limit]
        );
        return rows.map(({ adjective, verb, noun }) => `${adjective}, ${verb}, ${noun}`);
    } catch (error) {
        log.error('Error fetching recent prompts:', error);
        return [];
    }
}

export async function store({ log, db, personality_trait, hobby, object }) {
    try {
        await db.execute(
            'INSERT INTO history (adjective, verb, noun) VALUES (?, ?, ?)',
            [personality_trait, hobby, object]
        );
    } catch (error) {
        log.error('Error storing prompt:', error);
    }
}


export async function generatePrompt({ log, db, openai, locale }) {
    const usedLocale = (typeof locale === 'string' && locale.trim()) ? locale : 'en-US';
    log.debug('Generating prompt', { usedLocale });
    let usedPrompts = [];
    try {
        usedPrompts = await fetchRecent({ log, db, limit: 100 });
    } catch (err) {
        logger.error('Failed to fetch history:', err);
    }
    const config = JSON.parse(JSON.stringify(openai.promptConfig));
    if (config.messages && config.messages[0] && config.messages[0].content) {
        config.messages[0].content = config.messages[0].content.replace(
            '<USED_PROMPTS>',
            usedPrompts.join('\n')
        ) + `\nPlease generate the response words in language: ${usedLocale}`;
    }

    try {
        const completion = await openai.chat.completions.create(config);
        const args = JSON.parse(completion.choices[0].message.function_call.arguments);
        const { personality_trait, hobby, object } = args;
        await openai.store({ log, db, personality_trait, hobby, object });
        log.info(`Generated prompt: ${personality_trait}, ${hobby}, ${object}`);
        return [personality_trait, hobby, object];
    } catch (error) {
        log.error('OpenAI request failed:', error);
        return null;
    }
}