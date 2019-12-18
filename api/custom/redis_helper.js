let redis = require('redis');
const client = redis.createClient();

class RedisHelper {
  constructor() {}

  hget(id) {
    return new Promise(accept =>
      client.get(id, (err, result) => {
        if (err) {
          throw err;
        }

        const res = JSON.parse(result);
        accept(res);
      })
    );
  }

  hexists(id) {
    return new Promise(accept =>
      client.exists(id, (err, result) => {
        if (err) {
          throw err;
        }

        accept(result === 1 ? true : false);
      })
    );
  }

  hgetAll() {
    return new Promise(accept =>
      client.keys('test_*', (err, keys) => {
        if (err) {
          throw err;
        }

        client.mget(keys, (err2, result) => {
          if (err2) {
            throw err2;
          }
          accept(result);
        });
      })
    );
  }

  hdel(id) {
    return new Promise(accept =>
      client.del(id, (err, result) => {
        if (err) {
          throw err;
        }

        accept(result);
      })
    );
  }

  hset(id, message) {
    client.set(id, JSON.stringify(message));
  }

  async close() {
    await new Promise(accept => {
      client.keys('test_*', (err, keys) => {
        if (err) {
          throw err;
        }

        console.log(keys);

        client.del.apply(client, keys);
        client.quit();
        accept();
      });
    });
  }
}

module.exports = RedisHelper;
