const messageData = require('../../data/message');

let RedisHelper = require('../../api/custom/redis_helper');
let _redisHelper = new RedisHelper();

afterAll(async () => {
  await _redisHelper.close('test_*');
});

describe('API - MessageController Tests', () => {
  test('create entry in redis via api', async () => {
    await app
      .post('/api/message')
      .send({ ...messageData[1] })
      .expect(201);

    const _message = await _redisHelper.hget(messageData[1].id);
    expect(_message).not.toBeNull();
  });

  test('get entry from redis via api', async () => {
    const response = await app
      .get(`/api/message/${messageData[1].id}`)
      .send()
      .expect(200);
    expect(response.body).toMatchObject(messageData[1]);
  });

  test('get all enteries from redis via api', async () => {
    const response = await app
      .get('/api/messages')
      .expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test('check if an entry exists in redis via api', async () => {
    const falseResponse = await app
      .get(`/api/message/test_6/exists`)
      .send()
      .expect(200);
    expect(falseResponse.body).toBeFalsy();

    const trueResponse = await app
      .get(`/api/message/${messageData[1].id}/exists`)
      .send()
      .expect(200);
    expect(trueResponse.body).toBe(true);
  });

  test('delete entry in redis via api', async () => {
    await app
      .delete(`/api/message/${messageData[1].id}`)
      .send()
      .expect(200);

    const _message = await _redisHelper.hexists(messageData[1].id);
    expect(_message).toBeFalsy();
  });
});
