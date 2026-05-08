
import handler from '../api/check';
import { createMocks } from 'node-mocks-http';
import * as disposable from '../utils/disposableList';

jest.mock('../utils/disposableList');

describe('Email check handler', () => {
  test('reject non-POST method', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  test('invalid body', async () => {
    const { req, res } = createMocks({ method: 'POST', body: {} });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  test('detect disposable domain', async () => {
    (disposable.loadDisposableSet as jest.Mock).mockReturnValue(new Set(['test.com']));
    const { req, res } = createMocks({ method: 'POST', body: { email: 'user@test.com' } });
    await handler(req, res);
    const data = JSON.parse(res._getData());
    expect(data.isDisposable).toBe(true);
    expect(data.reason).toBe('disposable');
  });
});
