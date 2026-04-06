require('dotenv').config({ path: '/var/www/proposales-backend/.env' });

module.exports = {
  apps: [
    {
      name: 'proposales-backend',
      script: 'dist/server.js',
      cwd: '/var/www/proposales-backend',
      exec_mode: 'cluster',
      instance_var: 'INSTANCE_ID',
      instances: 2,
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      merge_logs: true,
      output: './logs/access.log',
      error: './logs/error.log',
      env: {
        PORT: process.env.PORT,
        NODE_ENV: 'production',
        SECRET_KEY: process.env.SECRET_KEY,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_DATABASE: process.env.DB_DATABASE,
        ORIGIN: process.env.ORIGIN,
        CREDENTIALS: process.env.CREDENTIALS,
        LOG_FORMAT: process.env.LOG_FORMAT,
        LOG_DIR: process.env.LOG_DIR,
      },
    },
  ],
};