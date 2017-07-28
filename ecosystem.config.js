module.exports = {
  apps: [{
    name: 'react-demo1-server',
    script: 'index.js',
    node_args: '--harmony',
    watch: true,
    exec_mode: 'fork',
    env: {
      PORT: 3001,
      NODE_ENV: 'dev',
    },
  }],

};
