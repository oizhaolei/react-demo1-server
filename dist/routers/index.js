'use strict';

//night相关
var config = require('../config');
var logger = require('log4js').getLogger('routers/fake');

var _ = require('lodash');
var redis = require('promise-redis')();
var utilities = require('../lib/utilities');

var redisClient = redis.createClient(_.extend(config.redis, {
  retry_strategy: utilities.redis_retry_strategy
}));

var express = require('express');

var router = express.Router();

// curl http://localhost:3001/todos
router.get('/todos', async function (req, res, next) {
  var todos = await redisClient.hgetall('rect-demo1-todos');

  res.json(_.map(todos, function (todo) {
    return JSON.parse(todo);
  }));
});

// curl -X PUT http://localhost:3001/todos -H "Content-Type: application/json" -d '{"id": 4, "text": "it is a good day to die", "completed": false}'
router.put('/todos', async function (req, res, next) {
  var _req$body = req.body,
      id = _req$body.id,
      text = _req$body.text,
      completed = _req$body.completed;


  await redisClient.hset('rect-demo1-todos', id, JSON.stringify({ id: id, text: text, completed: completed }));

  var todos = await redisClient.hgetall('rect-demo1-todos');

  res.json(_.map(todos, function (todo) {
    return JSON.parse(todo);
  }));
});

//  curl -X DELETE http://localhost:3001/todos/1
router.delete('/todos/:id', async function (req, res, next) {
  var id = req.params.id;


  var result = await redisClient.hdel('rect-demo1-todos', id);

  var todos = await redisClient.hgetall('rect-demo1-todos');

  res.json(_.map(todos, function (todo) {
    return JSON.parse(todo);
  }));
});

module.exports = router;