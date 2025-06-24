#!/usr/bin/env node
import 'dotenv/config';
import { createDb } from '@purinton/mysql';
import { createOpenAI } from '@purinton/openai';
import { createDiscord } from '@purinton/discord';
import { fetchRecent, store, generatePrompt } from './src/openai.mjs';
import { log, fs, path, registerHandlers, registerSignals } from '@purinton/common';

registerHandlers({ log });
registerSignals({ log });

const promptConfig = JSON.parse(fs.readFileSync(path(import.meta, 'prompts', 'prompt.json'), 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(path(import.meta, 'package.json')), 'utf8');
const version = packageJson.version;
const presence = { activities: [{ name: `cassandra v${version}`, type: 4 }], status: 'online' };
const openai = await createOpenAI();

openai.promptConfig = promptConfig;
openai.fetchRecent = fetchRecent;
openai.store = store;
openai.generatePrompt = generatePrompt;

const db = await createDb({ log });
registerSignals({ shutdownHook: () => db.end() });

const client = await createDiscord({
    log,
    rootDir: path(import.meta),
    context: {
        db,
        openai,
        presence,
        version
    }
});
registerSignals({ shutdownHook: () => client.destroy() });
