const multer = require('multer');
const path = require('path');
const fs = require('fs');
function updateSqlByParams(updateParams, whereParams) {
  const updateParamsKeys = Object.keys(updateParams);
  const whereParamsKeys = Object.keys(whereParams);
  if (!updateParamsKeys.length || !whereParamsKeys.length) {
    return false;
  }
  let sqlStr = 'update user set';
  updateParamsKeys.forEach((item, index) => {
    if (updateParams[item] !== undefined) {
      sqlStr = `${sqlStr} ${item} = '${updateParams[item]}'`;
      if (index < updateParamsKeys.length - 1) {
        sqlStr += ',';
      }
    }
  })
  sqlStr += ` where`;
  whereParamsKeys.forEach((item, index) => {
    if (whereParams[item] !== undefined) {
      sqlStr = `${sqlStr} ${item} = '${whereParams[item]}'`;
      if (index < whereParamsKeys.length - 1) {
        sqlStr += ' and';
      }
    }
  })
  return sqlStr;
}

function upload ({fileid, extList, savePath, defaultExt}) {
  return multer({
    storage: multer.diskStorage({
      //设置文件存储目录
      destination: function (req, file, cb) {
        let dir = path.join(__dirname, '../public/uploads' + savePath);
        //判断目录是否存在，没有则创建
        if(!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        //dir就是上传文件存放的目录
        cb(null, dir);
      },
      //设置文件名称
      filename: function(req, file, cb) {
        const extname = path.extname(file.originalname);
        //filename就是上传的文件名称
        let filename = Date.now() + Math.random() + (extList.includes(extname) ? extname : defaultExt);
        cb(null, filename);
      }
    })
  }).single(fileid)
}

//操作原型链
function handlePrototype () {
  //扩展计算相对时间的方法
  Date.prototype.getRelativeTime = function () {
    const now = new Date();
    const timeStamp = this.getTime(),
          year = this.getFullYear(),
          month = this.getMonth() + 1,
          day = this.getDate(),
          hours = this.getHours(),
          minutes = this.getMinutes();
    if(this == 'Invalid Date' || timeStamp > now.getTime()) {
      return '-';
    }
    const pad0 = function (val) {
      return String(val).padStart(2, '0');
    }
    const monthPad0 = pad0(month),
          dayPad0 = pad0(day),
          hoursPad0 = pad0(hours),
          minutesPad0 = pad0(minutes);
    if(timeStamp > now.getTime() - 60*1000) {
      return '刚刚';
    }
    if(timeStamp > now.getTime() - 60*1000*30) {
      const interval = Math.floor((now.getTime() - timeStamp) / (60*1000));
      return `${interval}分钟前`;
    }
    if(day == now.getDate()) {
      return `${hoursPad0}:${minutesPad0}`;
    }
    if(day + 1 == now.getDate()) {
      return `昨天 ${hoursPad0}:${minutesPad0}`;
    }
    if(day + 2 == now.getDate()) {
      return `前天 ${hoursPad0}:${minutesPad0}`;
    }
    if(year == now.getFullYear()) {
      return `${monthPad0}月${dayPad0}日 ${hoursPad0}:${minutesPad0}`;
    }
    return `${year}年${monthPad0}月${dayPad0}日 ${hoursPad0}:${minutesPad0}`;
  }
}

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

module.exports = {
  updateSqlByParams,
  upload,
  handlePrototype,
  randomString
}