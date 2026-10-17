import { CacheService } from './cache.service';

describe('CacheService (fail-open)', () => {
  const store = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
  const service = new CacheService(store as never);

  beforeEach(() => jest.clearAllMocks());

  it('returns the cached value', async () => {
    store.get.mockResolvedValue({ a: 1 });
    await expect(service.get('k')).resolves.toEqual({ a: 1 });
  });

  it('treats a failing get as a miss', async () => {
    store.get.mockRejectedValue(new Error('redis down'));
    await expect(service.get('k')).resolves.toBeUndefined();
  });

  it('swallows set and del failures', async () => {
    store.set.mockRejectedValue(new Error('redis down'));
    store.del.mockRejectedValue(new Error('redis down'));
    await expect(service.set('k', 1, 1000)).resolves.toBeUndefined();
    await expect(service.del('k')).resolves.toBeUndefined();
  });

  it('invalidateDashboard deletes the per-user key', async () => {
    await service.invalidateDashboard('u1');
    expect(store.del).toHaveBeenCalledWith('dashboard:u1');
  });
});
