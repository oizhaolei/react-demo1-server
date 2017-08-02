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
  const { text, completed } = req.body;
  let { id } = req.body;
  if (!id) {
    id = new Date() / 1000;
  }

  await redisClient.hset('rect-demo1-todos', id, JSON.stringify({ id, text, completed }));

  res.json(await todos(res));
});

// curl -X POST http://localhost:3001/todos/complete-all
router.post('/todos/complete-all', async(req, res, next) => {
  const data = await redisClient.hgetall('rect-demo1-todos');

  // all or all not
  let completed = true;
  _.each(data, (v) => {
    const todo = JSON.parse(v);
    if (!todo.completed) {
      completed = false;
      return false;
    }
    return true;
  });

  completed = !completed;
  await Promise.all(_.map(data, async (v, id) => {
    const todo = JSON.parse(v);
    await redisClient.hset('rect-demo1-todos', id, JSON.stringify({ ...todo, completed }));
  }));

  res.json(await todos(res));
});


// curl -X POST http://localhost:3001/todos/clear_completed
router.post('/todos/clear-completed', async(req, res, next) => {
  const data = await redisClient.hgetall('rect-demo1-todos');

  await Promise.all(_.map(data, async (v) => {
    const todo = JSON.parse(v);
    if (todo.completed) {
      await redisClient.hdel('rect-demo1-todos', todo.id);
    }
  }));

  res.json(await todos(res));
});


//  curl -X DELETE http://localhost:3001/todos/1
router.delete('/todos/:id', async(req, res, next) => {
  const { id } = req.params;

  await redisClient.hdel('rect-demo1-todos', id);

  res.json(await todos(res));
});

module.exports = router;
