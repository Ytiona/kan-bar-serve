const express = require('express');
const router = express.Router();
const querySql = require('../db/index');
const { APP_ID, APP_SECRET, PIC_EXTS } = require('../utils/constants');
const request = require('request');
const jwt = require('jsonwebtoken');
const { PRIVATE_KEY, EXPIRESD } = require('../utils/constants');
const { updateSqlByParams, upload } = require('../utils');


/**
 * @api {post} /api/user/login 用户登录
 * @apiName login
 * @apiGroup User
 * @apiParam {string} code wx.login获取到的code
 * @apiSuccess {string} result token
 */
router.post('/login', async (req, res, next) => {
  try {
    //通过微信的code2session接口获取openid和session_key
    const apiUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${req.body.code}&grant_type=authorization_code`;
    request(apiUrl, async (c2sErr, c2sRes, c2sBody) => {
      if (c2sErr) {
        next(c2sErr);
      } else {
        const { openid, session_key } = JSON.parse(c2sBody);
        const insertRes = await querySql(
          'INSERT INTO user(open_id, session_key) VALUE(?, ?) ON DUPLICATE KEY UPDATE session_key = ?',
          [openid, session_key, session_key]
        );
        await querySql(`UPDATE user SET nickname = ? WHERE open_id = ? AND nickname = ''`, [`侃吧${insertRes.insertId}号选手`, openid]);
        const token = jwt.sign({ openId: openid }, PRIVATE_KEY, { expiresIn: EXPIRESD });
        res.send({
          code: 0,
          msg: '登录成功',
          result: token
        });
      }
    })
  }
  catch (e) { next(e); }
})

/**
 * @api {post} /api/user/getUserInfo 获取用户信息
 * @apiName getUserInfo
 * @apiGroup User
 * @apiParam {string} openId 用户open_id，不传则获取自身的
 * @apiSuccess {object} result 用户信息
 */
router.get('/getUserInfo', async (req, res, next) => {
  try {
    const openId  = req.query.openId;
    const ownOpenId = req.user.openId;
    let followed = false;
    let isOwn = true;
    if(openId) {
      if(openId !== ownOpenId) {
        isOwn = false;
      }
      const checkRes = await querySql(`SELECT * FROM follow WHERE open_id = ? AND target_id = ?`, [ownOpenId, openId]);
      if(checkRes.length) {
        followed = true;
      }
    }
    const sqlStr = `
      SELECT 
      avatar, nickname, declaration, sex, region, qq, integral, laud_count, article_count, create_time, fans_count, follow_count, open_id
      FROM user 
      WHERE open_id = ?
    `;
    const queryRes = await querySql(sqlStr, [openId || ownOpenId]);
    res.send({ code: 0, msg: '获取用户信息成功！', result: queryRes[0], isOwn, followed });
  }catch(e) {  next(e); }
})




/**
* @api {post} /api/user/updateInfo 用户信息更新
* @apiName updateInfo
* @apiGroup User
* @apiParam {string} avatar 头像 可选
* @apiParam {string} nickname 用户名 可选
* @apiParam {string} declaration 个性签名 可选
* @apiParam {string} sex 性别 可选
* @apiParam {string} region 地区 可选
* @apiParam {string} qq QQ 可选
* @apiSuccess {object} result 用户信息
*/
router.post('/updateUserInfo', async (req, res, next) => {
  try {
    const sqlStr = updateSqlByParams(req.body, { open_id: req.user.openId });
    if(sqlStr) {
      await querySql(sqlStr);
      res.send({ code: 0, msg: '更新用户信息成功！' });
    } else {
      res.send({ code: 0, msg: '无可更新字段' });
    }
  } catch (e) { next(e); }
})

/**
 * @api {post} /api/user/uploadAvatar 用户头像上传
 * @apiName uploadAvatar
 * @apiGroup User
 * @apiParam {file} avatar
 * @apiSuccess {string} result 上传后的头像url
 */
router.post('/uploadAvatar', upload({ fileid: 'avatar', extList: PIC_EXTS, savePath: '/user_avatar', defaultExt: '.png' }), async(req, res, next) => {
  try {
    const imagePath = req.file.path.split('public')[1].replace(/\\/g, '/');
    const imgUrl = `https://ytionb.top:3000` + imagePath;
    const user = await querySql(`UPDATE user SET avatar = ? WHERE open_id = ?`, [imgUrl, req.user.openId]);
    if(user.affectedRows) {
      res.send({ code: 0, msg: '上传头像成功', result: imgUrl });
    } else {
      res.send({ code: -1, msg: '上传头像失败' });
    }
  } catch(e) { next(e); }
})

/**
 * @api {post} /api/user/checkNickname 检查用户昵称是否可用
 * @apiName checkNickname
 * @apiGroup User
 * @apiParam {String} nickname 必填
 * @apiSuccess {Boolean} result 是否可用
 */
router.post('/checkNickname', async(req, res, next) => {
  try {
    
    const { openId } = req.user;
    const { nickname } = req.body;
    if(nickname == '') { res.send({ code: -1, msg: '用户昵称不能为空！' }); }
    const queryRes = await querySql(`SELECT * FROM user WHERE open_id <> ? AND nickname = ? LIMIT 1`, [openId, nickname]);
    res.send({ code: 0, result: queryRes.length == 0 });
  } catch(e) { next(e); }
})


/**
 * @api {get} /api/user/search 搜索用户
 * @apiName searchUser
 * @apiGroup User
 * @apiParam {String} userName 必填
 * @apiSuccess {Array} result 用户列表
 * @apiParam currentPage 当前页  必填
 * @apiParam pageSize  页面尺寸  必填
 */
router.get('/search', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { currentPage, pageSize, userName } = req.query;
    const countRes = await querySql(`SELECT COUNT(*) AS count FROM user WHERE open_id <> ? AND nickname LIKE '%${userName}%'`, [openId]);
    const queryRes = await querySql(
      `
        SELECT 
        u.article_count, u.avatar, u.declaration, 
        u.fans_count, u.id, u.integral, 
        u.laud_count, u.nickname, 
        u.qq, u.region, u.sex, u.open_id,
        f.id AS followed
        FROM user u
        LEFT JOIN follow f
        ON u.open_id = f.target_id AND f.open_id = '${openId}' AND f.status = 1
        WHERE u.open_id <> ? AND u.nickname LIKE '%${userName}%'
        ORDER BY u.fans_count DESC, u.create_time DESC
        LIMIT ?, ?
      `, 
      [openId, (currentPage - 1) * pageSize, Number(pageSize)]
    );
    queryRes.forEach(item => {
      if(item.followed === null || item.followed === undefined) {
        item.followed = false;
      } else {
        item.followed = true;
      }
    })
    res.send({ code: 0, msg: '搜索用户成功！', result: queryRes, total: countRes[0].count });
  } catch(e) { next(e); }
})

/**
 * @api {post} /api/user/follow 关注用户
 * @apiName followUser
 * @apiGroup User
 * @apiParam {String} targetId 目标用户id
 * @apiParam {Number} status 状态: 0取消关注，1关注
 */
router.post('/follow', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { targetId, status } = req.body;
    await querySql(`INSERT INTO follow(open_id, target_id) VALUE(?, ?) ON DUPLICATE KEY UPDATE status = ?`, [openId, targetId, status]);
    if(status == 1) {
      await querySql(`UPDATE user SET fans_count = fans_count + 1 WHERE open_id = ?`, [targetId]);
      await querySql(`UPDATE user SET follow_count = follow_count + 1 WHERE open_id = ?`, [openId]);
    } else if(status == 0) {
      await querySql(`UPDATE user SET fans_count = fans_count - 1 WHERE open_id = ?`, [targetId]);
      await querySql(`UPDATE user SET follow_count = follow_count - 1 WHERE open_id = ?`, [openId]);
    }
    res.send({ code: 0, msg: '操作成功！' });
  } catch(e) { next(e); }
})



/**
 * @api {get} /api/user/getFollowList 获取关注用户列表
 * @apiName getFollowList
 * @apiGroup User
 * @apiParam {String} openId 用户id
 * @apiParam pageSize 一次获取多少 必填
 * @apiParam currentPage 获取第几页 必填
 */
router.get('/getFollowList', async(req, res, next) => {
  try {
    const { openId, pageSize, currentPage } = req.query;
    const countRes = await querySql(`SELECT COUNT(*) AS count FROM follow WHERE open_id = ?`, [openId]);
    const queryStr = `
      SELECT 
      u.avatar, u.nickname, u.declaration, u.sex, 
      u.region, u.qq, u.integral, u.laud_count, 
      u.article_count, u.create_time, 
      u.fans_count, u.follow_count, u.open_id
      FROM follow f, user u
      WHERE f.open_id = ? AND u.open_id = f.target_id AND f.status = 1
      LIMIT ?, ?
    `;
    const queryRes = await querySql(queryStr, [openId, (currentPage - 1) * pageSize, Number(pageSize)]);
    queryRes.forEach(item => {
      item.followed = true;
    })
    res.send({ code: 0, msg: '获取关注用户成功!', result: queryRes, total: countRes[0].count || 0 });
  } catch(e) { next(e); }
})

/**
 * @api {get} /api/user/getFansList 获取粉丝列表
 * @apiName getFansList
 * @apiGroup User
 * @apiParam {String} openId 用户id
 * @apiParam pageSize 一次获取多少 必填
 * @apiParam currentPage 获取第几页 必填
 */
router.get('/getFansList', async(req, res, next) => {
  try {
    const { openId, pageSize, currentPage } = req.query;
    const countRes = await querySql(`SELECT COUNT(*) AS count FROM follow WHERE target_id = ?`, [openId]);
    const queryStr = `
      SELECT 
      u.avatar, u.nickname, u.declaration, u.sex, 
      u.region, u.qq, u.integral, u.laud_count, 
      u.article_count, u.create_time, 
      u.fans_count, u.follow_count, u.open_id, f2.id AS followed
      FROM user u, follow f1
      LEFT JOIN follow f2
      ON f1.open_id = f2.target_id AND f2.open_id = '${openId}' AND f2.status = 1
      WHERE f1.target_id = ? AND u.open_id = f1.open_id AND f1.status = 1
      LIMIT ?, ?
    `;
    const queryRes = await querySql(queryStr, [openId, (currentPage - 1) * pageSize, Number(pageSize)]);
    queryRes.forEach(item => {
      if(item.followed === null || item.followed === undefined) {
        item.followed = false;
      } else {
        item.followed = true;
      }
    })
    res.send({ code: 0, msg: '获取粉丝成功!', result: queryRes, total: countRes[0].count || 0 });
  } catch(e) { next(e); }
})



module.exports = router;
