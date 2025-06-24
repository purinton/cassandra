import { jest } from '@jest/globals';
import ready from '../../events/ready.mjs';

describe('ready event', () => {
  it('logs ready and sets presence', async () => {
    const log = { debug: jest.fn(), info: jest.fn() };
    const setPresence = jest.fn();
    const client = { user: { tag: 'bot#1234', setPresence } };
    const presence = { activities: [] };
    await ready({ log, presence }, client);
    expect(log.debug).toHaveBeenCalledWith('ready', { tag: 'bot#1234' });
    expect(log.info).toHaveBeenCalledWith('Logged in as bot#1234');
    expect(setPresence).toHaveBeenCalledWith(presence);
  });

  it('logs ready without presence', async () => {
    const log = { debug: jest.fn(), info: jest.fn() };
    const client = { user: { tag: 'bot#1234', setPresence: jest.fn() } };
    await ready({ log }, client);
    expect(log.debug).toHaveBeenCalledWith('ready', { tag: 'bot#1234' });
    expect(log.info).toHaveBeenCalledWith('Logged in as bot#1234');
    expect(client.user.setPresence).not.toHaveBeenCalled();
  });
});
