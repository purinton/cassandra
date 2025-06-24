import { jest } from '@jest/globals';
import help from '../../commands/help.mjs';

describe('help command', () => {
  it('replies with help text and logs', async () => {
    const log = { debug: jest.fn() };
    const msg = jest.fn((key, def) => def);
    const reply = jest.fn();
    const interaction = { reply };
    await help({ log, msg }, interaction);
    expect(log.debug).toHaveBeenCalledWith('help Request', { interaction });
    expect(log.debug).toHaveBeenCalledWith('help Response', expect.objectContaining({ response: expect.objectContaining({ content: 'This is the default help text.' }) }));
    expect(reply).toHaveBeenCalledWith(expect.objectContaining({ content: 'This is the default help text.' }));
  });
});
