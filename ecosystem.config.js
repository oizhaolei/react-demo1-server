module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [{
    name: 'react-demo1-server',
    script: 'index.js',
    exec_interpreter: './node_modules/.bin/babel-node',
    watch: true,
    exec_mode: 'fork',
    env: {
      PORT: 3001,
      NODE_ENV: 'dev',
    },
  }],

  deploy: {
    dev: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '  /works/source/1.react/react-demo1-server/dist/',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev',
      },
    },
  },
};
