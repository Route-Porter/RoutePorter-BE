module.exports = {
    apps: [
      {
        name: 'routeporter',
        script: '/home/ubuntu/RoutePorter-BE/dist/main.js',  // ES 모듈로 출력된 파일
        instances: 1,
        exec_mode: 'cluster',
        watch: true,
        autorestart: true,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
        
        },
      },
    ],
  };
  