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

  hgetAll(pattern) {
    return new Promise(accept =>
      client.keys(pattern, (err, keys) => {
        if (err) {
          throw err;
        }

        if (keys.length <= 0) {
          accept([]);
        }

        client.mget(keys, (err2, result) => {
          if (err2) {
            throw err2;
          }
          let res = result.map(item => JSON.parse(item));

          accept(res);
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

  async clear(pattern) {
    return new Promise(accept => {
      client.keys(pattern, (err, keys) => {
        if (err) {
          throw err;
        }

        client.del.apply(client, keys);
        accept(1);
      });
    });
  }

  async close(pattern) {
    await this.clear(pattern);
    await new Promise(accept => {
      client.quit();
      accept();
    });
  }
}

module.exports = RedisHelper;
