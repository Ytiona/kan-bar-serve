const querySql = require('../db');
const express = require('express');
const router = express.Router();

/**
 * @api {post} /api/comment/add 新增评论
 * @apiName addComment
 * @apiGroup comment
 * @apiParam open_id 评论人uid 必填
 * @apiParam type 类型：0(评论)、1(评论回复)、2(评论回复的回复) 必填
 * @apiParam content 评论内容 必填
 * @apiParam images 评论图片 可选
 * @apiParam reply_id 评论对象id 必填
 */
router.post('/add', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { type, content, images, reply_id, origin_comment_id } = req.body;
    let insertSqlStr  = `INSERT INTO comment(type, content, images, reply_id, open_id, origin_comment_id) VALUE(?, ?, ?, ?, ?, ?)`;
    await querySql(insertSqlStr, [type, content, images || '', reply_id, openId, origin_comment_id || null]);
    let updateSqlStr = ``;
    if(type == 0) {
      updateSqlStr = `UPDATE article SET comment_count = comment_count + 1 WHERE id = ?`;
    } else if(type == 1 || type == 2) {
      updateSqlStr = `UPDATE comment SET reply_count = reply_count + 1 WHERE id = ?`;
      if(type == 2) {
        updateSqlStr += ` OR origin_comment_id = '${origin_comment_id}'`;
      }
    }
    await querySql(updateSqlStr, [reply_id]);
    res.send({ code: 0, msg: '评论成功！' })
  } catch(e) { next(e); }
})

/**
 * @api {get} /api/comment/get 获取评论
 * @apiName getComment
 * @apiGroup comment
 * @apiParam id 评论对象id 必填
 * @apiParam type 类型：0(评论)、1(评论回复)、2(评论回复的回复) 必填
 * @apiParam pageSize 一次获取多少 必填
 * @apiParam currentPage 获取第几页 必填
 */
router.get('/get', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { id, type, currentPage, pageSize, sortBy } = req.query;
    //统计总评论数量sql语句
    let countSqlStr = `SELECT COUNT(*) AS count FROM comment WHERE del_flag = 0  AND `;
    //查询评论sql语句
    let querySqlStr = `
      SELECT c.laud_count, c.content, c.images, c.reply_count, c.type, 
             DATE_FORMAT(c.create_time, "%Y-%m-%d %H:%i:%s") as create_time,
             u.avatar, u.nickname, c.id, CAST(l.id AS SIGNED) AS lauded, c.reply_id,
             c.open_id
      FROM user u, comment c 
      LEFT JOIN laud l 
      ON c.id = l.target_id AND l.open_id = '${openId}' 
      AND l.status = 1 AND l.target_type = 1 
      WHERE del_flag = 0  AND 
    `;
    if(type == 0) {
      countSqlStr += `reply_id = '${id}' AND type = 0`;
      querySqlStr += `c.open_id = u.open_id AND c.reply_id = '${id}' AND c.type = 0`;
    } else if(type == 1) {
      //如果type为1，则条件为：type == 1且回复对象id为传过来的评论id 或者 type == 2且原评论id为传过来的评论id
      countSqlStr += `((type = 1 AND reply_id = '${id}') OR (type = 2 AND origin_comment_id = '${id}'))`;
      querySqlStr += `((c.open_id = u.open_id AND c.reply_id = '${id}' AND c.type = 1) OR 
      (c.open_id = u.open_id AND c.origin_comment_id = '${id}' AND c.type = 2))`;
    }
    switch(sortBy) {
      default:
      case 'laud': querySqlStr += ' ORDER BY c.laud_count DESC,'; break;
      case 'reply': querySqlStr += ' ORDER BY c.reply_count DESC,'; break;
    }
    querySqlStr += ` c.create_time DESC LIMIT ?, ?`;
    const countRes = await querySql(countSqlStr);
    const queryRes = await querySql(querySqlStr, [(currentPage - 1) * pageSize, Number(pageSize)]);
    const type2CommentIds = [];
    queryRes.forEach(item => {
      if(item.type == 2) type2CommentIds.push(item.reply_id);
      item.lauded = Boolean(item.lauded);
      if(item.open_id == openId) {
        item.isOwn = true;
      }
      if(item.images) {
        item.images = item.images.split(',');
      } else {
        item.images = [];
      }
      item.relativeTime = new Date(item.create_time).getRelativeTime();
    });
    if(type2CommentIds.length) {
      //查询type为2的回复对象的评论内容
      let queryType2SqlStr = `
        SELECT c.content, c.images, u.nickname, c.reply_id, c.id, c.del_flag  
        FROM comment c, user u
        WHERE c.open_id = u.open_id AND c.id IN (${type2CommentIds.toString()})
      `;
      const queryType2Res = await querySql(queryType2SqlStr);
      queryType2Res.forEach(item => {
        if(item.images) {
          item.images = item.images.split(',');
        } else {
          item.images = [];
        }
      })
      queryRes.forEach(item => {
        item.targetComment = queryType2Res.find(type2Item => item.reply_id == type2Item.id);
        if(item.targetComment) {
          //判断是否删除
          if(item.targetComment.del_flag == 1) {
            item.targetComment.content = '评论已删除';
          }
          delete item.targetComment.del_flag;
        }
      });
    }
    res.send({ code: 0, msg: '获取评论成功!', result: queryRes, total: countRes[0].count });
  } catch(e) { next(e); }
})

/**
 * @api {post} /api/comment/adopte 采纳回答
 * @apiName adopteComment
 * @apiGroup comment
 * @apiParam id 采纳评论的id 必填
 * @apiParam articleId 评论对应的帖子id 必填
 */
router.post('/adopte', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { id, articleId } = req.body;
    /**
     * 帖子被删除
     * 已经采纳过
     * 不是自己的帖子（作弊）
     * 
     * 1.更新文章表，adopte_target_id，
     * 2.更新用户表，联表查询到open_id，增加悬赏积分
     * 3.新增评论人的一条积分记录
     */
    let updateArticleSqlStr = `UPDATE article SET adopte_target_id = ? WHERE id = ? AND open_id = ? AND adopte_target_id = -1`;
    const updateRes = await querySql(updateArticleSqlStr, [ id, articleId, openId ]);
    if(updateRes.affectedRows > 0) {
      const queryCommentUid = await querySql(`SELECT open_id FROM comment WHERE id = ? LIMIT 1`, [id]);
      const queryOfferedIntegral = await querySql(`SELECT offered_integral FROM article WHERE id = ? LIMIT 1`, [articleId]);
      await querySql(
        `UPDATE user SET integral = integral + ? WHERE open_id = ?`, 
        [queryOfferedIntegral[0].offered_integral, queryCommentUid[0].open_id]
      );
      await querySql(
        'INSERT INTO integral_record(integral, type, open_id) VALUE(?, ?, ?)', 
        [queryOfferedIntegral[0].offered_integral, 3, queryCommentUid[0].open_id]
      );
      res.send({ code: 0, msg: '采纳成功！' });
    } else {
      res.send({ code: -1, msg: '采纳失败！' });
    }
  } catch(e) { next(e); } 
})

/**
 * @api {post} /api/comment/delete 删除评论
 * @apiName deleteComment
 * @apiGroup comment
 * @apiParam id 评论id 必填
 * @apiParam type 评论类型 必填
 * @apiParam replyId 回复对象id 必填
 */
router.post('/delete', async(req, res, next) => {
  try {
    const { openId } = req.user;
    const { id, type, replyId } = req.body;
    const updateRes = await querySql(`UPDATE comment SET del_flag = 1 WHERE open_id = ? AND id = ?`, [openId, id]);
    if(updateRes.affectedRows > 0) {
      if(type == 0) {
        await querySql(`UPDATE article SET comment_count = comment_count -1 WHERE id = ?`, [replyId]);
      } else if(type == 1) {
        await querySql(`UPDATE comment SET reply_count = reply_count -1 WHERE id = ?`, [replyId]);
      }
      res.send({ code: 0, msg: '删除成功！' });
    } else {
      res.send({ code: -1, msg: '删除失败！' });
    }
  } catch(e) { next(e); }
})

module.exports = router;

