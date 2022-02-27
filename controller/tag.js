const pool = require('./pool')
const moment = require('moment')
const logs = require('./../log')

class Tag {
  constructor() { }

  query(param) {
    let {
      pageRow,
      pageNum
    } = param
    pageRow = pageRow ? pageRow : 10
    pageNum  = pageNum ? pageNum : 1
    console.log(pageNum, pageRow)
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM tag LIMIT ${pageRow * (pageNum - 1)}, ${pageRow}`, (e, res, fields) => {
        if (e) {
          logs.createLogs(e, 'fail')
          throw e
        } else {
          if (res.length) {
            res.forEach(item => {
              item.create_time = moment(item.create_time).format("YYYY-MM-DD HH:mm:ss");
              item.update_time = moment(item.update_time).format("YYYY-MM-DD HH:mm:ss");
            })
          }
          logs.createLogs(res, 'success')
          resolve(res)
        }
      })
    })
  }

  queryTotal(param) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT COUNT(*) FROM tag', (e, res, fields) => {
        if (e) {
          logs.createLogs(e, 'fail')
          throw e
        } else {
          logs.createLogs(res, 'success')
          resolve(res[0])
        }
      })
    })
  }

  addtag(param) {
    const {
      name,
      alias
    } = param
    return new Promise((resolve, reject) => {
      pool.query(`insert into tag (name, alias, create_time) values ("${name}", "${alias}", now())`, (e, res, fields) => {
        if (e) {
          logs.createLogs(e, 'fail')
          throw e
        } else {
          logs.createLogs(res, 'success')
          resolve(res)
        }
      })
    })
  }

  modifyTag(param) {
    const {
      name,
      alias,
      id
    } = param
    return new Promise((resolve, reject) => {
      pool.query(`update tag set name="${name}", alias="${alias}" where id=${id}`, (e, res, fields) => {
        if (e) {
          logs.createLogs(e, 'fail')
          throw e
        } else {
          logs.createLogs(res, 'success')
          resolve(res)
        }
      })
    })
  }

  delTag(param) {
    const {
      id
    } = param
    return new Promise((resolve, reject) => {
      pool.query(`delete from tag where id=${id}`, (e, res, fields) => {
        if (e) {
          logs.createLogs(e, 'fail')
          throw e
        } else {
          logs.createLogs(res, 'success')
          resolve(res)
        }
      })
    })
  }
}

module.exports = new Tag()