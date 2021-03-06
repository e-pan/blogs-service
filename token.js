const jwt = require('jsonwebtoken')

class Token {
  constructor() {
    this.secret = 'blog' // 密钥
    this.expiresIn = '24h' // 过期时间
  }
  set(param) {
    return jwt.sign({
      name: param.name,
      password: param.password
    }, this.secret, {
      expiresIn: this.expiresIn
    });
  }
  get(token) {
    console.log('token', token)
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, {}, (err, res) => {
        console.log(err, res)
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}

module.exports = new Token()