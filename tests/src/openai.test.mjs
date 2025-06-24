import { jest } from '@jest/globals';
import * as openaiModule from '../../src/openai.mjs';

describe('openai.mjs', () => {
    describe('fetchRecent', () => {
        it('returns formatted rows from db', async () => {
            const db = { query: jest.fn().mockResolvedValue([[{ adjective: 'funny', verb: 'dancing', noun: 'cat' }]]) };
            const log = { error: jest.fn() };
            const result = await openaiModule.fetchRecent({ log, db, limit: 1 });
            expect(result).toEqual(['funny, dancing, cat']);
        });
        it('returns [] and logs error on db error', async () => {
            const db = { query: jest.fn().mockRejectedValue(new Error('fail')) };
            const log = { error: jest.fn() };
            const result = await openaiModule.fetchRecent({ log, db });
            expect(result).toEqual([]);
            expect(log.error).toHaveBeenCalled();
        });
    });

    describe('store', () => {
        it('inserts prompt into db', async () => {
            const db = { execute: jest.fn().mockResolvedValue() };
            const log = { error: jest.fn() };
            await openaiModule.store({ log, db, personality_trait: 'brave', hobby: 'swimming', object: 'dog' });
            expect(db.execute).toHaveBeenCalledWith(
                'INSERT INTO history (adjective, verb, noun) VALUES (?, ?, ?)',
                ['brave', 'swimming', 'dog']
            );
        });
        it('logs error on db error', async () => {
            const db = { execute: jest.fn().mockRejectedValue(new Error('fail')) };
            const log = { error: jest.fn() };
            await openaiModule.store({ log, db, personality_trait: 'brave', hobby: 'swimming', object: 'dog' });
            expect(log.error).toHaveBeenCalled();
        });
    });

    describe('generatePrompt', () => {
        it('returns prompt and stores it', async () => {
            const log = { debug: jest.fn(), error: jest.fn() };
            const db = {};
            const openai = {
                fetchRecent: jest.fn().mockResolvedValue(['a, b, c']),
                promptConfig: { messages: [{ content: 'Prompt <USED_PROMPTS>' }] },
                chat: {
                    completions: {
                        create: jest.fn().mockResolvedValue({ choices: [{ message: { function_call: { arguments: JSON.stringify({ personality_trait: 'kind', hobby: 'reading', object: 'book' }) } } }] })
                    }
                },
                store: jest.fn().mockResolvedValue()
            };
            const result = await openaiModule.generatePrompt({ log, db, openai, locale: 'en-US' });
            expect(result).toEqual(['kind', 'reading', 'book']);
            expect(openai.store).toHaveBeenCalledWith({ log, db, personality_trait: 'kind', hobby: 'reading', object: 'book' });
        });
        it('returns null and logs error on OpenAI failure', async () => {
            const log = { debug: jest.fn(), error: jest.fn() };
            const db = {};
            const openai = {
                fetchRecent: jest.fn().mockResolvedValue([]),
                promptConfig: { messages: [{ content: 'Prompt <USED_PROMPTS>' }] },
                chat: { completions: { create: jest.fn().mockRejectedValue(new Error('fail')) } },
                store: jest.fn()
            };
            const result = await openaiModule.generatePrompt({ log, db, openai, locale: 'en-US' });
            expect(result).toBeNull();
            expect(log.error).toHaveBeenCalled();
        });
    });
});
