export default () => {
  const { APP_SERVICE_PORT } = process.env;
  return {
    app: {
      port: APP_SERVICE_PORT || 8888
    },
    // 数据库
    database: {}
  };
};
