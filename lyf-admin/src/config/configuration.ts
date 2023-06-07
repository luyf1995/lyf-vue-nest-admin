export default () => {
  const { APP_SERVICE_PORT, REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PASSWORD } =
    process.env;
  return {
    app: {
      port: APP_SERVICE_PORT || 8888
    },
    // 数据库
    database: {},
    // redis
    redis: {
      REDIS_HOST: REDIS_HOST || '127.0.0.1', // IP
      REDIS_PORT: REDIS_PORT || 6379, // 端口
      REDIS_DB: REDIS_DB || 0, // 数据库
      REDIS_PASSWORD: REDIS_PASSWORD || '' // 密码
    }
  };
};
