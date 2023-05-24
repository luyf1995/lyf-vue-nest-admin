export default () => {
  const {
    APP_SERVICE_PORT,
    PGSQL_HOST,
    PGSQL_PORT,
    PGSQL_USERNAME,
    PGSQL_PASSWORD,
    PGSQL_DATABASE
  } = process.env;
  return {
    app: {
      port: APP_SERVICE_PORT || 8888
    },
    // 数据库
    database: {
      type: 'postgres',
      host: PGSQL_HOST || 'localhost',
      port: PGSQL_PORT || 5432,
      username: PGSQL_USERNAME || 'postgres',
      password: PGSQL_PASSWORD || 'postgres',
      database: PGSQL_DATABASE || 'test'
    }
  };
};
