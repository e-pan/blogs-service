const OSS = require('ali-oss')
const config = require('./../config')
const router = require('koa-router')()
const multer = require('@koa/multer'); 
// https://www.npmjs.com/package/@koa/multer
// https://bingzhe.github.io/2018/11/22/koa-%E5%85%AD-koa-multer%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6/

let client = new OSS({
  region: config.oss.region,
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: config.oss.bucket
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 上传到本地目录
    cb(null, 'public/upload'); //配置图片上传的目录
  },
  filename: function (req, file, cb) {   /*图片上传完成重命名*/
    const fileFormat = (file.originalname).split(".");
    const filename = Date.now() + "." + fileFormat[fileFormat.length - 1] // 确保本地文件名和服务器文件名一致
    // 同时上传到oss服务器
    client.put(filename, file.stream).then(res => {
      console.log(res, res.url)
      cb(null, filename);
    })
  }
})

var upload = multer({
  storage: storage
});

router.post('/upload', upload.single('file'), async (ctx, next) => {
  // console.log('ctx.request.file', ctx.request.file);
  // console.log('ctx.file', ctx.file);
  // console.log('ctx.request.body', ctx.request.body);
  const filename = `http://${config.oss.bucket}.${config.oss.region}.aliyuncs.com/${ctx.file.filename}`
  ctx.body = {
    code: 200,
    data: filename,
    dataMsg: 'success'
  };
})

module.exports = router