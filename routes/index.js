const express = require('express');
const router = express.Router();
const querySql = require('../db/index');
const { SIGN_IN_ADD_INTEGRAL } = require('../config/work');
const { upload } = require('../utils');
const { PIC_EXTS } = require('../utils/constants');
const query = require('../db/index');
/**
* @api {post} /api/signIn 签到
* @apiName signIn
* @apiGroup index
* @apiSuccess {object} result
* @apiSuccessExample Success-Response:
  {
    code: 0,
    msg: '签到成功'
    result: {
      feedback: {
        content: '...',
        remarks: '....'
      }
    }
  }
* 
*/
router.post('/signIn', async(req, res, next) => {
  try {
    const { openId } = req.user;
    try {
      const date = new Date();
      //提交记录到签到表
      await querySql('INSERT INTO sign_in(open_id, sign_in_date) VALUE(?, ?)', [openId, `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`]);
      //增加积分
      await querySql('update user SET integral = integral + ? WHERE open_id = ?', [SIGN_IN_ADD_INTEGRAL, openId]);
      //提交记录到积分记录表
      await querySql('INSERT INTO integral_record(integral, type, open_id) VALUE(?, ?, ?)', [SIGN_IN_ADD_INTEGRAL, 0, openId]);
      //随机获取一条寄语
      const feedbacks = await querySql('SELECT * FROM sign_in_feedback ORDER BY RAND() LIMIT 1');
      res.send({ code: 0, msg: '签到成功！', result: { feedback: feedbacks[0] } });
    } catch(e) {
      console.log(e);
      res.send({ code: -2, msg: '签到失败！' });
    }
  } catch(e) { next(e); }
})

/**
* @api {get} /api/getIntegralRecord 获取积分记录
* @apiName getIntegralRecord
* @apiGroup index
* @apiParam currentPage 当前页
* @apiParam pageSize 每页条数
* @apiParam type 类型（全部(all)、支出(expend)、收入(income)）
* @apiSuccess {array} result 积分记录
*/
router.get('/getIntegralRecord', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { currentPage, pageSize, type } = req.query;
    let countSqlStr = 'SELECT COUNT(*) AS count FROM integral_record WHERE open_id = ?';
    let querySqlStr = 'SELECT id, integral, DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time, type FROM integral_record WHERE open_id = ?';
    if(type == 'expend') {
      countSqlStr += ' AND integral < 0';
      querySqlStr += ' AND integral < 0';
    } else if(type == 'income') {
      countSqlStr += ' AND integral > 0';
      querySqlStr += ' AND integral > 0';
    }
    querySqlStr += ' ORDER BY create_time DESC LIMIT ?,?';
    const countRes = await querySql(countSqlStr, [openId]);
    const queryRes = await querySql(querySqlStr, [openId, (currentPage - 1) * pageSize, Number(pageSize)]);
    queryRes.forEach(item => {
      item.relativeTime = new Date(item.create_time).getRelativeTime();
    })
    res.send({ code: 0, result: queryRes, total: countRes[0].count });
  } catch(e) { next(e); }
})

/**
* @api {post} /api/upload 上传图片公共接口
* @apiName upload
* @apiGroup index
* @apiParam file 当前页
* @apiSuccess {result} result 图片链接
*/
router.post('/upload', upload({ fileid: 'file', extList: PIC_EXTS, savePath: '/article', defaultExt: '.png' }), async(req, res, next) => {
  try {
    const imagePath = req.file.path.split('public')[1].replace(/\\/g, '/');
    const imgUrl = `https://ytionb.top:3000` + imagePath;
    res.send({ code: 0, msg: '上传图片成功', result: imgUrl });
  } catch(e) { next(e); }
})


/**
* @api {post} /api/laud 点赞
* @apiName laud
* @apiGroup index
* @apiParam id 点赞对象id 必填
* @apiParam type 点赞对象类型 0（帖子）、1（评论） 必填
* @apiParam status 赞状态(0\1 取消赞或者点赞) 必填
*/
router.post('/laud', async (req, res, next) => {
  try {
    const { openId } = req.user;
    const { id, status, type } = req.body;
    const insertRes = await querySql(
      'INSERT INTO laud(open_id, target_id, target_type) VALUE(?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
      [openId, id, type, Number(status), Number(status)]
    );
    if(insertRes.insertId) {
      await querySql(`UPDATE ${ type == 0 ? 'article' : 'comment' } SET laud_count = laud_count ${status ? '+' : '-'} 1 WHERE id = ?`, [id]);
    }
    res.send({ code: 0, msg: '操作成功！' });
  } catch (e) { next(e); }
})

/**
* @api {post} /api/addUserIdea 用户反馈
* @apiName addUserIdea
* @apiGroup index
* @apiParam title 反馈标题 必填

*/
router.post('/addUserIdea', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { title, content } = req.body;
    await querySql(`INSERT INTO user_idea(title, content, open_id) VALUE(?, ?, ?)`, [title, content, openId]);
    res.send({ code: 0, msg: '已提交反馈！' })
  } catch(e) { next(e); }
})

/**
* @api {get} /api/getUserIdea 获取反馈记录
* @apiName getUserIdea
* @apiGroup index
* @apiParam currentPage 当前页  必填
* @apiParam pageSize  页面尺寸  必填
* @apiSuccess {Array} result 图片链接
*/
router.get('/getUserIdea', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { currentPage, pageSize } = req.query;
    const countRes = await querySql(`SELECT COUNT(*) AS count FROM user_idea WHERE open_id = ?`, [openId]);
    const queryRes = await querySql(`
      SELECT title, content, status, reply, DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") as create_time 
      FROM user_idea 
      WHERE open_id = ? 
      ORDER BY create_time DESC 
      LIMIT ?, ?`, [openId, (currentPage - 1) * pageSize, Number(pageSize)]
    );
    res.send({ code: 0, msg: '已提交反馈！', result: queryRes, total: countRes[0].count });
  } catch(e) { next(e); }
})

/**
* @api {get} /api/getHotSearch 获取热搜
* @apiName getHotSearch
* @apiGroup index
* @apiParam rows 获取条数 必填
* @apiSuccess {Array} result 热搜列表
*/
router.get('/getHotSearch', async(req, res, next) => {
  try {
    const { rows } = req.query;
    const queryRes = await querySql('SELECT * FROM search ORDER BY search_count DESC, create_time DESC LIMIT 0, ?', [Number(rows)]);
    res.send({ code: 0, msg: '获取热搜成功', result: queryRes });
  } catch(e) { next(e); }
})


module.exports = router;
