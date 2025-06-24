import { jest } from '@jest/globals';
import interactionCreate from '../../events/interactionCreate.mjs';

describe('interactionCreate event', () => {
  it('calls the correct command handler with locale', async () => {
    const handler = jest.fn();
    const log = {};
    const msg = jest.fn();
    const commandHandlers = { test: handler };
    const interaction = { commandName: 'test', locale: 'fr', guild: { preferredLocale: 'fr' } };
    await interactionCreate({ client: {}, log, msg, commandHandlers }, interaction);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ msg: expect.any(Function) }), interaction);
  });

  it('does nothing if no handler', async () => {
    const log = {};
    const msg = jest.fn();
    const commandHandlers = {};
    const interaction = { commandName: 'none' };
    await expect(interactionCreate({ client: {}, log, msg, commandHandlers }, interaction)).resolves.toBeUndefined();
  });
});
