module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // Client application
    {
      name      : 'client',
      script    : 'client/index.js',
      watch     : true,
      env: {
          CLIENT_PORT: 3000
      }
    },

    // Server application
    {
      name      : 'server',
      script    : 'server/index.js',
      watch     : true,
      env: {
          SOCKET_PORT: 2000
      }
    },
  ]
};
