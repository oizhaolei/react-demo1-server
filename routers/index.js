//night相关
const config = require('../config');
const logger = require('log4js').getLogger('routers/fake');

const _ = require('lodash');
const redis = require('promise-redis')();
const utilities = require('../lib/utilities');

const redisClient = redis.createClient(_.extend(config.redis, {
  retry_strategy: utilities.redis_retry_strategy,
}));

const express = require('express');

const router = express.Router();

const todos = async () => {
  const data = await redisClient.hgetall('rect-demo1-todos');

  return _.map(data, todo => JSON.parse(todo));
};
// curl http://localhost:3001/todos
router.get('/todos', async(req, res, next) => {
  res.json(await todos(res));
});


// curl -X PUT http://localhost:3001/todos -H "Content-Type: application/json" -d '{"id": 4, "text": "it is a good day to die", "completed": false}'
router.put('/todos', async(req, res, next) => {
  const { id, text, completed } = req.body;

  await redisClient.hset('rect-demo1-todos', id, JSON.stringify({ id, text, completed }));

  res.json(await todos(res));
});


//  curl -X DELETE http://localhost:3001/todos/1
router.delete('/todos/:id', async(req, res, next) => {
  const { id } = req.params;

  await redisClient.hdel('rect-demo1-todos', id);

  res.json(await todos(res));
});

module.exports = router;
