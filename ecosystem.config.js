module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'FTC_BE',
      script    : 'app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_uat : {
        name: 'FTC_BE_UAT',
        NODE_ENV: 'uat'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
};
