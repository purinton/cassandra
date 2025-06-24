import { jest } from '@jest/globals';
import errorHandler from '../../events/error.mjs';

describe('error event', () => {
  it('logs error event', async () => {
    const log = { error: jest.fn() };
    const error = new Error('fail');
    await errorHandler({ log }, error);
    expect(log.error).toHaveBeenCalledWith('error', { error });
  });
});
