/* eslint-disable eqeqeq */
/**
 * MessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let RedisHelper = require('../custom/redis_helper');
let _redisHelper = new RedisHelper();

module.exports = {
  get: async function(req, res) {
    const params = req.allParams();

    if (params.id == null) {
      return res.status(400).send({ message: 'missing parameters' });
    }

    let _messageExists = await _redisHelper.hexists(params.id);
    if (!_messageExists) {
      return res.status(404).send({ message: `The message deosn't exist...` });
    } else {
      let _message = await _redisHelper.hget(params.id);
      return res.status(200).send(_message);
    }
  },

  getAll: async function(req, res) {
    let messages = await _redisHelper.hgetAll('*');
    return res.status(200).send(messages);
  },

  exists: async function(req, res) {
    const params = req.allParams();

    if (params.id == null) {
      return res.status(400).send({ message: 'missing parameters' });
    }

    let _messageExists = await _redisHelper.hexists(params.id);
    return res.status(200).send(_messageExists ? true : false);
  },

  add: async function(req, res) {
    const params = req.allParams();

    if (params.id == null || params.content == null) {
      return res.status(400).send({ message: 'missing parameters' });
    }

    _redisHelper.hset(params.id, {
      id: params.id,
      content: params.content,
    });

    return res.status(201).send({
      message: `Message successfully created. Message Id is : ${params.id}`,
    });
  },

  del: async function(req, res) {
    const params = req.allParams();

    if (params.id == null) {
      return res.status(400).send({ message: 'missing parameters' });
    }

    let _messageExists = await _redisHelper.hexists(params.id);
    if (!_messageExists) {
      return res.status(404).send({ message: `The message deosn't exist...` });
    }

    let status = await _redisHelper.hdel(params.id);

    if (status === 1) {
      return res.status(200).send({
        message: 'Message successfully deleted.',
      });
    } else {
      return res.status(500).send({ message: 'Unable to delete message...' });
    }
  },
};
