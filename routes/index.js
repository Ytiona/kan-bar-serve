const express = require('express');
const router = express.Router();
const querySql = require('../db/index');
const { SIGN_IN_ADD_INTEGRAL } = require('../config/work');
const { upload, randomString } = require('../utils');
const { PIC_EXTS } = require('../utils/constants');
const query = require('../db/index');
const Core = require('@alicloud/pop-core');
const request = require('request');
const MD5 = require('md5-node');
const Fxp = require("fast-xml-parser");
const fs = require('fs');
const path = require('path');
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



router.post('/sendCode', async (req, res, next) => {
  try {
    const { phone } = req.body;
    const code = (Math.floor(Math.random() * 1000000) + '').padEnd(6, '0');
    if(!/^(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}$/.test(phone)) {
      res.send({ code: -1, msg: '手机号码格式错误！' });
      return;
    }
    const client = new Core({
      accessKeyId: 'LTAIa2w1oouakcQj',
      accessKeySecret: 'lNf6dWvJP07XVdlvGWjhMeLtN4E5Hu',
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
    const params = {
      "PhoneNumbers": phone,
      "SignName": "几木设计",
      "TemplateCode": "SMS_195721793",
      "TemplateParam": `{ "code": ${code} }`
    }
    const requestOption = {
      method: 'POST'
    };  
    client.request('SendSms', params, requestOption).then(async result => {
      console.log(result);
      if(result.Code == 'OK') {
        await querySql(
          'REPLACE INTO code(phone, code, create_time) VALUES (?, ?, NOW())',
          [phone, code]
        );
      }
      res.send(result);
    }, (ex) => {
      res.send(ex);
    }).catch(err => {
      res.send(err);
    })
  } catch (e) { next(e); }
})

router.post('/checkCode', async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if(!/^(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}$/.test(phone)) {
      res.send({ code: -1, msg: '手机号码格式错误！' });
      return;
    }
    if(!code) {
      res.send({ code: -1, msg: '未传入code' });
      return;
    }
    const queryRes = await querySql(
      'SELECT * FROM code WHERE phone = ? and code = ?',
      [phone, code]
    );
    if(queryRes.length) {
      const diffTime = Date.now() - new Date(queryRes[0].create_time).getTime();
      if(diffTime < 5*60*1000) {
        res.send({ code: 0, result: true, msg: '验证码正确' });
      } else {
        res.send({ code: 0, result: false, msg: '验证码已失效' })
      }
    } else {
      res.send({ code: 0, result: false, msg: '验证码错误' });
    }
  } catch(e) { next(e); }
})


router.post('/sendNotice', async(req, res, next) => {
  try {
    const { phone } = req.body;
    if(!/^(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}$/.test(phone)) {
      res.send({ code: -1, msg: '手机号码格式错误！' });
      return;
    }
    const client = new Core({
      accessKeyId: 'LTAIa2w1oouakcQj',
      accessKeySecret: 'lNf6dWvJP07XVdlvGWjhMeLtN4E5Hu',
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
    const params = {
      "PhoneNumbers": phone,
      "SignName": "几木设计",
      "TemplateCode": "SMS_195721793"
    }
    const requestOption = {
      method: 'POST'
    };
    client.request('SendSms', params, requestOption).then(async result => {
      console.log(result);
      res.send(result);
    }, (ex) => {
      res.send(ex);
    }).catch(err => {
      res.send(err);
    })
  } catch(e) { next(e); }
})


// router.post('/merageFace', async(req, res, next) => {
//   const { template, target } = req.body;
//   const requestData = {
//     version: '3.0',
//     merge_degree: 'COMPLETE',
//     image_template: {
//       image_type: 'URL',
//       image: template,
//       quality_control: 'HIGH'
//     },
//     image_target: {
//       image_type: 'URL',
//       image: target,
//       quality_control: 'HIGH'
//     }
//   }
//   console.log(JSON.stringify(requestData))
//   try {
//     const api = "https://aip.baidubce.com/rest/2.0/face/v1/merge?access_token=24.be06bb9d7f074d726fe46fe31fd30db3.2592000.1613974870.282335-23579690";
//     request({
//       url: api,
//       method: 'POST',
//       json: true,
//       headers: {
//         "content-type": "application/json",
//       },
//       body: requestData
//     }, (err, response, body) => {
//       res.send(body);
//     })
//   }catch(err) { next(err); }
// })


router.post('/enterprisePay', async(req, res, next) => {
  // const config = {
  //   mch_appid: 'wx9cd69def9486c6e8',
  //   mchid: '1563974291',
  //   openid: 'ool7FuNsYbj_StR9EI9lX4H1i0R0',
  // }
  const config = {
    mch_appid: 'wx62c4c2186bdda7f6',
    mchid: '1551011991',
    openid: 'ool7FuNsYbj_StR9EI9lX4H1i0R0',
  }
  const params = {
    ...config,
    amount: 1,
    check_name: 'NO_CHECK',
    desc: 'hhhh',
    nonce_str: randomString(),
    partner_trade_no: Date.now() + randomString(19),
    sign: ''
  }

  Object.keys(params).sort().filter(item => item != 'sign').forEach(item => {
    params.sign += `${item}=${params[item]}&`
  })
  
  // params.sign += 'key=9tdimXhNwaf2ko4IPwNeBdFoCDjGJZTY';
  params.sign += 'key=Yu093231sai1985yu093231sai080522';

  console.log(params.sign);

  params.sign = MD5(params.sign).toUpperCase();

  const obj2xml = '<xml>' + new Fxp.j2xParser({
    format: true,
    attrNodeName: "_attrs",
    textNodeName: "#text",
    cdataTagName: "_cdata"
  }).parse(params) + '</xml>';

  request({
    url: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
    method: 'POST',
    body: obj2xml,
    headers: {
      'content-type': 'application/xml; charset=UTF-8'
    },
    agentOptions: {
      cert: fs.readFileSync(path.join(__dirname, '../cert/apiclient_cert.pem')).toString(), 
      key: fs.readFileSync(path.join(__dirname, '../cert/apiclient_key.pem')).toString()
   }
  }, (err, response, body) => {
    res.send({ result: Fxp.parse(body), params, obj2xml });
  })
})


// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");

const CvmClient = tencentcloud.cvm.v20170312.Client;

const clientConfig = {
  credential: {
    secretId: "AKIDOhqkNm8tbZN6ijiEAwZbNlHbLrXxEJJE",
    secretKey: "rRlvrVt86ozuZ2DZkVO0Ls98bASjmX3J",
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "cvm.tencentcloudapi.com",
    },
  },
};

const client = new CvmClient(clientConfig);
const params = {};



router.post('/merageFace', async(req, res, next) => {
  try {
    const types = [
      'qc_306161_630640_5',
      'qc_306161_827318_4',
      'qc_306161_255217_3',
      'qc_306161_205819_2'
    ];
    const { ModelId, ProjectId } = req.body;
    if(!types.includes(ModelId) || ProjectId != '306161') {
      res.send({
        code: '-1'
      })
      return;
    }
    // Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
    const tencentcloud = require("tencentcloud-sdk-nodejs");

    const FacefusionClient = tencentcloud.facefusion.v20181201.Client;

    const clientConfig = {
      credential: {
        secretId: "AKIDOhqkNm8tbZN6ijiEAwZbNlHbLrXxEJJE",
        secretKey: "rRlvrVt86ozuZ2DZkVO0Ls98bASjmX3J",
      },
      region: "ap-guangzhou",
      profile: {
        httpProfile: {
          endpoint: "facefusion.tencentcloudapi.com",
        },
      },
    };

    const client = new FacefusionClient(clientConfig);
    const params = req.body;

    
    client.FuseFace(params).then(
      (data) => {
        console.log(data);
        res.send(data);
      },
      (err) => {
        console.error("error", err);
        res.send(err);
      }
    );
  }catch(err) { next(err); }
})


router.post('/LFDay/merageFace', async(req, res, next) => {
  try {
    const manTypes = [
  	  ['qc_306188_767450_20', '306188_20_1', 2],
      ['qc_306188_637130_19', '306188_19_1', 6],
      ['qc_306188_108935_18', '306188_18_1', 3],
      ['qc_306188_744218_17', '306188_17_1', 8]
    ];
    const womanTypes = [
      ['qc_306188_397380_16', '306188_16_1',4],
      ['qc_306188_593783_15', '306188_15_1',7],
      ['qc_306188_805770_14', '306188_14_1',5],
      ['qc_306188_678265_13', '306188_13_1',1],
    ];
    const types = manTypes.concat(womanTypes);
    const { ModelId, ProjectId } = req.body;
    // if(types.findIndex(item => item[0] === ModelId) === -1 || ProjectId != '306188') {
    //   res.send({
    //     code: '-1'
    //   })
    //   return;
    // }
    if(ProjectId != '306188') {
      res.send({
        code: '-1'
      })
      return;
    }
    // Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
    const tencentcloud = require("tencentcloud-sdk-nodejs");

    const FacefusionClient = tencentcloud.facefusion.v20181201.Client;

    const clientConfig = {
      credential: {
        secretId: "AKIDg7Liqk3BcQwGLCIKfolT6aqrces7p82n",
        secretKey: "mHttpW1KOeem9Or4JN4WR8tOcwK3ZgaJ",
      },
      region: "ap-guangzhou",
      profile: {
        httpProfile: {
          endpoint: "facefusion.tencentcloudapi.com",
        },
      },
    };

    const client = new FacefusionClient(clientConfig);
    const params = req.body;

    
    client.FuseFace(params).then(
      (data) => {
        console.log(data);
        res.send(data);
      },
      (err) => {
        console.error("error", err);
        res.send(err);
      }
    );
  }catch(err) { next(err); }
})





module.exports = router;