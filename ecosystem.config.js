module.exports = {
  apps : [{
    name: 'app',//服务名
    script: './bin/www',//入口文件
    instances: 1,//开启进程数
    watch: true,//监听文件变化，然后重启
    ignore_watch: [
      'node_modules',
      'logs'
    ],
    error_file: './logs/app.err.log',//设置错误日志文件路径
    out_file: './logs/app-out.log',//设置输出日志文件路径
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    autorestart: true,
    max_memory_restart: '1G',//最大运行内存，超过就重启
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      user : 'root',
      host : '106.55.50.55',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
