import { jest } from '@jest/globals';
import debugHandler from '../../events/debug.mjs';

describe('debug event', () => {
  it('logs debug event', async () => {
    const log = { debug: jest.fn() };
    const debug = 'debug info';
    await debugHandler({ log }, debug);
    expect(log.debug).toHaveBeenCalledWith('debug', { debug });
  });
});
