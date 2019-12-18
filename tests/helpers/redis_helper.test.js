const messageData = require('../../data/message');

let RedisHelper = require('../../api/custom/redis_helper');
let _redisHelper = new RedisHelper();

afterAll(_redisHelper.close);

describe('Helper - Redis Helper Tests', () => {
  test('create entry in redis', async () => {
    await _redisHelper.hset(messageData[0].id, messageData[0]);

    const _message = await _redisHelper.hget(messageData[0].id);
    expect(_message).not.toBeNull();
  });

  test('get entry from redis', async () => {
    let _entry = await _redisHelper.hget(messageData[0].id);
    expect(_entry).toMatchObject(messageData[0]);
  });

  test('get all enteries from redis', async () => {
    await _redisHelper.hset(messageData[1].id, messageData[1]);
    await _redisHelper.hset(messageData[2].id, messageData[2]);
    await _redisHelper.hset(messageData[3].id, messageData[3]);

    let _entry = await _redisHelper.hgetAll();
    expect(_entry).toHaveLength(4);
  });

  test('check if an entry exists in redis', async () => {
    let _entryCheck = await _redisHelper.hexists(6);
    expect(_entryCheck).toBeFalsy();

    _entryCheck = await _redisHelper.hexists(messageData[0].id);
    expect(_entryCheck).toBe(true);
  });

  test('delete entry in redis', async () => {
    await _redisHelper.hdel(messageData[0].id);

    const _message = await _redisHelper.hexists(messageData[0].id);
    expect(_message).toBeFalsy();
  });
});
