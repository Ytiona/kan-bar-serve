const querySql = require('../db');
const express = require('express');
const router = express.Router();
const { ADD_ARTICLE_ADD_INTEGRAL } = require('../config/work');

/**
 * @api {post} /api/article/add 发布文章
 * @apiName addArticle
 * @apiGroup article
 * @apiParam title 标题 必填
 * @apiParam content 内容 必填
 * @apiParam images 图片列表,逗号分隔 可选
 * @apiParam type 类型：0 普通、1 求配图、2 找表情 必填
 * @apiParam offered_integral 悬赏积分 可选
 * @apiParam tags 标签 可选
 */
router.post('/add', async (req, res, next) => {
  try {
    const { openId } = req.user;
    const { title, content, images, type, offered_integral, tags } = req.body;
    let msg = '发布成功！';
    //类型为0（普通帖子）
    if (type == 0) {

      //查询今日是否发过帖子
      const queryRes = await querySql('SELECT 1 AS haveData FROM article WHERE open_id = ? AND TO_DAYS(create_time) = TO_DAYS(NOW()) LIMIT 1', [openId]);
      if (!queryRes.length) {
        await querySql('UPDATE user SET integral = integral + ? WHERE open_id = ?', [ADD_ARTICLE_ADD_INTEGRAL, openId]);
        await querySql('INSERT INTO integral_record(integral, type, open_id) VALUE(?, ?, ?)', [ADD_ARTICLE_ADD_INTEGRAL, 1, openId]);
        msg = `今日首次发帖，积分+${ADD_ARTICLE_ADD_INTEGRAL}！`
      }
    } else {
      const querySelfIntegral = await querySql('SELECT * FROM user WHERE open_id = ? LIMIT 1', [openId]);
      if (querySelfIntegral[0].integral < offered_integral) {
        res.send({ code: -1, msg: '发布失败，您的积分不足！' });
        return;
      } else {
        await querySql('UPDATE user SET integral = integral - ? WHERE open_id = ?', [offered_integral, openId]);
        await querySql('INSERT INTO integral_record(integral, type, open_id) VALUE(?, ?, ?)', [-offered_integral, 2, openId]);
      }
    }
    const insertSqlStr = 'INSERT INTO article(open_id, title, content, type, images, offered_integral, tags) VALUE(?, ?, ?, ?, ?, ?, ?)';
    await querySql(insertSqlStr, [openId, title, content, type, images || '', offered_integral || 0, tags || '']);
    await querySql('UPDATE user SET article_count = article_count + 1 WHERE open_id = ?', [openId]);
    res.send({ code: 0, msg });
  } catch (e) { next(e); }
})

{
  const articleFileidStr = `a.id, u.avatar, u.nickname, u.declaration, 
    a.title, a.content, a.offered_integral, a.laud_count, 
    a.comment_count, a.view_count, a.images, a.tags, a.type AS article_type, 
    DATE_FORMAT(a.create_time, "%Y-%m-%d %H:%i:%s") AS create_time, 
    a.adopte_target_id,
    CAST(l.id AS SIGNED) AS lauded,
    a.open_id, f.id AS followed
    `;
  const getArticleCommonSqlStr = `SELECT ${articleFileidStr} 
    FROM user u, article a 
    LEFT JOIN laud l 
    ON a.id = l.target_id AND l.open_id = ? 
    AND l.status = 1 AND l.target_type = 0
    LEFT JOIN follow f
    ON a.open_id = f.target_id AND f.open_id = ? AND f.status = 1
    `;
  /**
  * @api {get} /api/article/getRecommend 获取推荐文章
  * @apiName getRecommendArticle
  * @apiGroup article
  * @apiParam currentPage 当前页
  * @apiParam pageSize 每页条数
  * @apiParam type 类型（普通(0)、求配图(1)、找表情(2)）
  * @apiSuccess {array} result 文章列表
  * 获取type = 0(普通帖子)的帖子，以赞数降序获取
  */
  router.get('/getRecommend', async (req, res, next) => {
    try {
      let countSqlStr = 'SELECT count(*)  AS count FROM article WHERE type = 0 AND del_flag = 0';
      let querySqlStr = `${getArticleCommonSqlStr} 
      WHERE a.open_id = u.open_id AND a.type = 0 AND del_flag = 0 
      ORDER BY a.laud_count DESC, a.create_time DESC
      LIMIT ?, ?`;
      getArticle(req, res, next, countSqlStr, querySqlStr);
    } catch (e) { next(e); }
  })

  /**
  * @api {get} /api/article/getAll 获取所有文章
  * @apiName getAllfArticle
  * @apiGroup article
  * @apiParam currentPage 当前页
  * @apiParam pageSize 每页条数
  * @apiParam type 帖子类型：0（普通帖子）、1（求配图）、2（找表情）
  * @apiParam tag 帖子标签 可选
  * @apiSuccess {array} result 文章列表
  */
  router.get('/getAll', async (req, res, next) => {
    try {
      const { type, tag } = req.query;
      let countSqlStr = `SELECT COUNT(*)  AS count FROM article WHERE type = ${type} AND del_flag = 0`;
      let querySqlStr = `${getArticleCommonSqlStr} 
      WHERE a.open_id = u.open_id AND type = ${type} 
      AND del_flag = 0`;
      if (tag) {
        countSqlStr += ` AND tags LIKE '%${tag}%'`;
        querySqlStr += ` AND a.tags LIKE '%${tag}%'`;
      }
      querySqlStr += ` ORDER BY a.create_time DESC LIMIT ?, ?`;
      getArticle(req, res, next, countSqlStr, querySqlStr);
    } catch (e) { next(e); }
  })

  /**
  * @api {get} /api/article/getSelf 获取自己文章
  * @apiName getSelfArticle
  * @apiGroup article
  * @apiParam currentPage 当前页
  * @apiParam pageSize 每页条数
  * @apiSuccess {array} result 文章列表
  */
  router.get('/getSelf', async (req, res, next) => {
    try {
      const { openId } = req.user;
      let countSqlStr = `SELECT count(*) AS count FROM article WHERE open_id = '${openId}' AND del_flag = 0`;
      let querySqlStr = `${getArticleCommonSqlStr} 
      WHERE a.open_id = u.open_id AND a.open_id = '${openId}' 
      AND del_flag = 0
      ORDER BY a.create_time DESC
      LIMIT ?, ?`;
      getArticle(req, res, next, countSqlStr, querySqlStr);
    } catch (e) { next(e); }
  })

  /**
  * @api {get} /api/article/getRankList 获取排行榜帖子
  * @apiName getRankListArticle
  * @apiGroup article
  * @apiParam sortBy 排序依赖: laud_count、comment_count、view_count
  * @apiParam currentPage 当前页
  * @apiParam pageSize 每页条数
  * @apiSuccess {array} result 文章列表
  */
  router.get('/getRankList', async (req, res, next) => {
    try {
      const { openId } = req.user;
      const { sortBy } = req.query;
      let countSqlStr = `SELECT count(*) AS count FROM article WHERE type = 0`;
      let querySqlStr = `${getArticleCommonSqlStr} 
      WHERE a.open_id = u.open_id AND a.open_id = '${openId}' AND type = 0
      ORDER BY a.${sortBy} DESC, a.create_time DESC
      LIMIT ?, ?`;
      getArticle(req, res, next, countSqlStr, querySqlStr);
    } catch (e) { next(e); }
  })

  /**
  * @api {get} /api/article/search 搜索帖子
  * @apiName searchArticle
  * @apiGroup article
  * @apiParam content 搜索内容 必填
  * @apiParam currentPage 当前页
  * @apiParam pageSize 每页条数
  * @apiSuccess {array} result 文章列表
  */
  router.get('/search', async (req, res, next) => {
    try {
      const { openId } = req.user;
      const { content } = req.query;
      let countSqlStr = `SELECT COUNT(*) AS count FROM article WHERE CONCAT(title, IFNULL(content, ''), tags) LIKE '%${content}%'`;
      let querySqlStr = `${getArticleCommonSqlStr} 
        WHERE a.open_id = u.open_id AND type = 0 AND CONCAT(title, IFNULL(content, ''), tags) LIKE '%${content}%'
        ORDER BY a.create_time DESC
        LIMIT ?, ?
      `;
      let addSearchCountSqlStr = `
        INSERT INTO search(search_content, type) VALUE(?, ?) ON DUPLICATE KEY UPDATE search_count = search_count + 1
      `;
      await querySql(addSearchCountSqlStr, [content, 0]);
      getArticle(req, res, next, countSqlStr, querySqlStr);
    } catch (e) { next(e); }
  })

  /**
  * @api {get} /api/article/getByUser 获取指定用户帖子
  * @apiName getUserArticle
  * @apiGroup article
  * @apiParam openId 用户id 必填
  * @apiParam currentPage 当前页
  * @apiParam pageSize 每页条数
  * @apiSuccess {array} result 文章列表
  */
  router.get('/getByUser', async (req, res, next) => {
    try {
      const { openId } = req.query;
      let countSqlStr = `SELECT COUNT(*)  AS count FROM article WHERE open_id = '${openId}' AND del_flag = 0`;
      let querySqlStr = `${getArticleCommonSqlStr} 
      WHERE a.open_id = u.open_id AND a.open_id = '${openId}'
      AND del_flag = 0
      ORDER BY a.create_time DESC LIMIT ?, ?`;
      getArticle(req, res, next, countSqlStr, querySqlStr);
    } catch (e) { next(e); }
  })

  /**
   * 1.推荐，仅type 1   type = 1 orderBy laud_count 
   * 2.所有，有type条件 type = type
   * 3.自己，open_id  open_id = openId
   * 4.搜索, 标题、标签，仅type1 type = 1
   */
  async function getArticle(req, res, next, countSqlStr, querySqlStr) {
    try {
      const { currentPage, pageSize } = req.query;
      const { openId } = req.user;
      const countRes = await querySql(countSqlStr);
      const queryRes = await querySql(querySqlStr, [openId, openId, (currentPage - 1) * pageSize, Number(pageSize)]);
      queryRes.forEach(item => {
        if (item.images !== '') {
          item.images = item.images.split(',');
        } else {
          item.images = [];
        }
        if (item.open_id == openId) {
          item.isOwn = true;
        }
        if (item.followed === null || item.followed === undefined) {
          item.followed = false;
        } else {
          item.followed = true;
        }
        item.lauded = Boolean(item.lauded);
        item.relativeTime = new Date(item.create_time).getRelativeTime();
      })
      res.send({ code: 0, msg: '获取文章成功', result: queryRes, total: countRes[0].count });
    } catch (e) { next(e); }
  }
}

/**
* @api {get} /api/article/addViewCount 帖子增加访问量
* @apiName addArticleViewCount
* @apiGroup article
* @apiParam id 帖子id 必填
*/
router.post('/addViewCount', async (req, res, next) => {
  try {
    const { id } = req.body;
    await querySql(`UPDATE article SET view_count = view_count + 1 WHERE id = ?`, [id]);
    res.send({ code: 0, msg: '访问量+1' });
  } catch (e) { next(e); }
})


/**
* @api {post} /api/article/delete 删除帖子
* @apiName deleteArticle
* @apiGroup article
* @apiParam id 帖子id 必填
*/
router.post('/delete', async (req, res, next) => {
  try {
    const { openId } = req.user;
    const { id } = req.body;
    const deleteRes = await querySql(`UPDATE article SET del_flag = 1 WHERE id = ? AND open_id = ?`, [id, openId]);
    if (deleteRes.affectedRows > 0) {
      res.send({ code: 0, msg: '删除成功！' });
    } else {
      res.send({ code: -1, msg: '删除失败！' });
    }
  } catch (e) { next(e); }
})


/**
 * @api {post} /api/article/add 发布文章
 * @apiName addArticle
 * @apiGroup article
 * @apiParam title 标题 必填
 * @apiParam content 内容 必填
 * @apiParam images 图片列表,逗号分隔 可选
 * @apiParam offered_integral 悬赏积分 可选
 * @apiParam tags 标签 可选
 */
router.post('/update', async (req, res, next) => {
  try {
    const { openId } = req.user;
    const { title, content, images, tags, id } = req.body;
    const updateRes = await querySql(
      `UPDATE article SET title = ?, content = ?, images = ?, tags = ? WHERE id = ? AND open_id = ?`,
      [title, content, images || '', tags || '', id, openId]
    );
    if (updateRes.affectedRows > 0) {
      res.send({ code: 0, msg: '更新帖子成功！' });
    } else {
      res.send({ code: -1, msg: '更新帖子失败！' });
    }
  } catch (e) { next(e); }
})


/**
 * @api {post} /api/article/getByFollow 获取关注用户的帖子
 * @apiName getFollowArticle
 * @apiGroup article
 * @apiParam currentPage 当前页
 * @apiParam pageSize 每页条数
 * @apiSuccess {array} result 文章列表
*/
router.get('/getByFollow', async(req, res, next) => {
  try {
    const { openId } = req.user;
    console.log(openId);
    const { currentPage, pageSize } = req.query;
    const queryStr = `
      SELECT 
      a.id, u.avatar, u.nickname, u.declaration, 
      a.title, a.content, a.offered_integral, a.laud_count, 
      a.comment_count, a.view_count, a.images, a.tags, a.type AS article_type, 
      DATE_FORMAT(a.create_time, "%Y-%m-%d %H:%i:%s") AS create_time, 
      a.adopte_target_id,
      CAST(l.id AS SIGNED) AS lauded,
      a.open_id, f.id AS followed
      FROM user u, article a
      LEFT JOIN follow f
      ON f.open_id = ?
      LEFT JOIN laud l 
      ON a.id = l.target_id AND l.open_id = ? 
      AND l.status = 1 AND l.target_type = 0
      WHERE f.target_id = a.open_id AND u.open_id = a.open_id AND a.del_flag = 0
      ORDER BY a.create_time DESC
      LIMIT ?, ?
    `;
    const countStr = `
      SELECT count(*)  AS count FROM article a
      LEFT JOIN follow f
      ON f.open_id = ?
      WHERE f.target_id = a.open_id AND a.del_flag = 0
    `;
    const countRes = await querySql(countStr, [openId]);
    const queryRes = await querySql(queryStr, [openId, openId, (currentPage - 1) * pageSize, Number(pageSize)]);
    res.send({ code: 0, result: queryRes, total: countRes[0].count });
  } catch(e) { next(e); }
})





module.exports = router;