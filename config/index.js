const config = {
  // 启动端口
  port: 4000,

  // 数据库配置
  database: {
    DATABASE: '数据库名称',
    USERNAME: '数据库用户',
    PASSWORD: '数据库密码',
    PORT: '3306',
    HOST: '数据库地址'
  },
  // 阿里云oss
  oss: {
    region: 'your region',
    accessKeyId: 'your accessKeyId',
    accessKeySecret: 'your accessKeySecret',
    bucket: 'your bucket'
  }
}

module.exports = config