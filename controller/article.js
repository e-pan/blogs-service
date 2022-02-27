const pool = require('./pool')
const moment = require('moment')
const logs = require('./../log')

class Article {
  constructor() {

  }
  queryList(param) {
    let {
      pageRow,
      pageNum,
      type,
      startDate,
      endDate
    } = param
    pageRow = pageRow ? pageRow : 10
    pageNum  = pageNum ? pageNum : 1
    let query = [];
    let queryCondition = '';
    if (type) {
      query.push(`type=${type}`)
    }
    if (startDate && endDate) {
      query.push(`create_time >= "${startDate}"`)
      query.push(`create_time <= "${endDate}"`)
    }
    if (query.length) {
      queryCondition = 'where ' + query.join(" and ");
    }
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM article ${queryCondition} order by is_top desc, create_time desc LIMIT ${pageRow * (pageNum - 1)},${pageRow}`, (e, res, fields) => {
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
    const {
      type,
      startDate,
      endDate
    } = param

    let query = [];
    let queryCondition = '';
    if (type) {
      query.push(`type=${type}`)
    }
    if (startDate && endDate) {
      query.push(`create_time >= "${startDate}"`)
      query.push(`create_time <= "${endDate}"`)
    }
    if (query.length) {
      queryCondition = 'where ' + query.join(" and ");
    }
    return new Promise((resolve, reject) => {
      pool.query(`SELECT COUNT(*) FROM article ${queryCondition}`, (e, res, fields) => {
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

  queryDetail(param) {
    console.log('param', param)
    const {
      id
    } = param
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `article` WHERE id=' + id + '', (e, res, fields) => {
        if (e) {
          logs.createLogs(e, 'fail')
          throw e
        } else {
          res[0].create_time = moment(res[0].create_time).format("YYYY-MM-DD HH:mm:ss");
          logs.createLogs(res, 'success')
          resolve(res[0])
          addPreviewNum(res[0].preview_num + 1);
        }
      })
      // 访问次数加1
      function addPreviewNum(num) {
        pool.query(`update article set preview_num=${num} where id=${id}`, (e, res, fields) => {
          if (e) {
            logs.createLogs(e, 'fail')
            throw e
          } else {
            logs.createLogs(res, 'success')
          }
        })
      }
    })
  }

  queryAdd(param) {
    debugger
    let {
      title,
      type,
      content,
      thumbnail,
      author,
      is_top,
      tag_id,
      sourse,
      abstract
    } = param
    return new Promise((resolve, reject) => {
      pool.query(`insert into article (title, type, content, thumbnail, author, create_time, is_top, tag_id, sourse, preview_num, abstract) 
      values ("${title}", ${type}, '${content}',"${thumbnail}", "${author}", now(), ${is_top}, "${tag_id}", "${sourse}", 0, "${abstract}")`, (e, res, fields) => {
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

  modifyArticle(param) {
    let {
      id,
      title,
      type,
      content,
      thumbnail,
      author,
      is_top,
      tag_id,
      sourse,
      preview_num,
      abstract
    } = param
    preview_num = preview_num ? preview_num : 1
    // content = content.replace(/"/g, "'")
    return new Promise((resolve, reject) => {
      pool.query(`update article set title="${title}", 
      type=${type}, 
      content='${content}', 
      thumbnail="${thumbnail}", 
      author="${author}", 
      update_time=now(), 
      is_top=${is_top}, 
      tag_id="${tag_id}", 
      sourse="${sourse}", 
      preview_num=${preview_num},
      abstract= "${abstract}" where id=${id}`, (e, res, fields) => {
        console.log(res)
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

  delArticle(param) {
    const {
      id
    } = param
    return new Promise((resolve, reject) => {
      pool.query(`delete from article where id=${id}`, (e, res, fields) => {
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

  qryTagArticle(param) {
    const {
      id,
      pageRow,
      pageNum
    } = param

    return new Promise((resolve, reject) => {
      // query the articel table tag_id for id data
      pool.query(`SELECT * FROM article WHERE find_in_set(${Number(id)}, tag_id) order by create_time desc LIMIT ${pageRow * (pageNum - 1)}, ${pageRow}`, (e, res, fields) => {
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

  qryTagArticleTotal(param) {
    const { id } = param
    return new Promise((resolve, reject) => {
      pool.query(`SELECT COUNT(*) FROM article where find_in_set(${id}, tag_id)`, (e, res, fields) => {
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
}

module.exports = new Article()