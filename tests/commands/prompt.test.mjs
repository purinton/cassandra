import { jest } from '@jest/globals';
import prompt from '../../commands/prompt.mjs';

const EmbedBuilder = jest.fn(() => ({
  setColor: jest.fn().mockReturnThis(),
  addFields: jest.fn().mockReturnThis(),
}));
jest.unstable_mockModule('discord.js', () => ({ EmbedBuilder }));

describe('prompt command', () => {
  it('handles successful prompt generation', async () => {
    const log = { debug: jest.fn(), error: jest.fn(), info: jest.fn() };
    const msg = jest.fn((key, def) => def);
    const db = {};
    const openai = { generatePrompt: jest.fn().mockResolvedValue(['creative', 'painting', 'cat']) };
    const editReply = jest.fn();
    const deferReply = jest.fn();
    const interaction = { locale: 'en-US', deferReply, editReply };
    await prompt({ log, msg, db, openai }, interaction);
    expect(deferReply).toHaveBeenCalled();
    expect(openai.generatePrompt).toHaveBeenCalled();
    expect(editReply).toHaveBeenCalledWith({ embeds: [expect.any(Object)] });
    expect(log.info).toHaveBeenCalledWith(expect.stringContaining('creative'));
  });

  it('handles OpenAI error', async () => {
    const log = { debug: jest.fn(), error: jest.fn(), info: jest.fn() };
    const msg = jest.fn((key, def) => def);
    const db = {};
    const openai = { generatePrompt: jest.fn().mockRejectedValue(new Error('fail')) };
    const reply = jest.fn();
    const deferReply = jest.fn();
    const interaction = { locale: 'en-US', deferReply, reply };
    await prompt({ log, msg, db, openai }, interaction);
    expect(reply).toHaveBeenCalledWith({ content: 'Failed to generate prompt' });
    expect(log.error).toHaveBeenCalled();
  });

  it('handles null result', async () => {
    const log = { debug: jest.fn(), error: jest.fn(), info: jest.fn() };
    const msg = jest.fn((key, def) => def);
    const db = {};
    const openai = { generatePrompt: jest.fn().mockResolvedValue(null) };
    const reply = jest.fn();
    const deferReply = jest.fn();
    const interaction = { locale: 'en-US', deferReply, reply };
    await prompt({ log, msg, db, openai }, interaction);
    expect(reply).toHaveBeenCalledWith({ content: 'Failed to generate prompt' });
    expect(log.error).toHaveBeenCalled();
  });
});
