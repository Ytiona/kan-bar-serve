define({ "api": [
  {
    "type": "post",
    "url": "/api/user/getUserInfo",
    "title": "获取用户信息",
    "name": "getUserInfo",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "result",
            "description": "<p>用户信息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/user/login",
    "title": "用户登录",
    "name": "login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "code",
            "description": "<p>wx.login获取到的code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "result",
            "description": "<p>token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/user/updateInfo",
    "title": "用户信息更新",
    "name": "updateInfo",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "avatar",
            "description": "<p>头像 可选</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nickname",
            "description": "<p>用户名 可选</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "declaration",
            "description": "<p>个性签名 可选</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sex",
            "description": "<p>性别 可选</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "region",
            "description": "<p>地区 可选</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "qq",
            "description": "<p>QQ 可选</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "result",
            "description": "<p>用户信息</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/user/uploadAvatar",
    "title": "用户头像上传",
    "name": "uploadAvatar",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "avatar",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "result",
            "description": "<p>上传后的头像url</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/article/add",
    "title": "发布文章",
    "name": "addArticle",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "title",
            "description": "<p>标题 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "content",
            "description": "<p>内容 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "images",
            "description": "<p>图片列表,逗号分隔 可选</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "type",
            "description": "<p>类型：0 普通、1 求配图、2 找表情 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "offered_integral",
            "description": "<p>悬赏积分 可选</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "tags",
            "description": "<p>标签 可选</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "get",
    "url": "/api/article/addViewCount",
    "title": "帖子增加访问量",
    "name": "addArticleViewCount",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "id",
            "description": "<p>帖子id 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "post",
    "url": "/api/article/delete",
    "title": "删除帖子",
    "name": "deleteArticle",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "id",
            "description": "<p>帖子id 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "get",
    "url": "/api/article/getAll",
    "title": "获取所有文章",
    "name": "getAllfArticle",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>当前页</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>每页条数</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "type",
            "description": "<p>帖子类型：0（普通帖子）、1（求配图）、2（找表情）</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "result",
            "description": "<p>文章列表</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "get",
    "url": "/api/article/getRankList",
    "title": "获取排行榜帖子",
    "name": "getRankListArticle",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "sortBy",
            "description": "<p>排序依赖: laud_count、comment_count、view_count</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>当前页</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>每页条数</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "result",
            "description": "<p>文章列表</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "get",
    "url": "/api/article/getRecommend",
    "title": "获取推荐文章",
    "name": "getRecommendArticle",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>当前页</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>每页条数</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "type",
            "description": "<p>类型（普通(0)、求配图(1)、找表情(2)）</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "result",
            "description": "<p>文章列表 获取type = 0(普通帖子)的帖子，以赞数降序获取</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "get",
    "url": "/api/article/getSelf",
    "title": "获取自己文章",
    "name": "getSelfArticle",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>当前页</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>每页条数</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "result",
            "description": "<p>文章列表</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "get",
    "url": "/api/article/search",
    "title": "搜索帖子",
    "name": "searchArticle",
    "group": "article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "content",
            "description": "<p>搜索内容 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>当前页</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>每页条数</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "result",
            "description": "<p>文章列表</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/article.js",
    "groupTitle": "article"
  },
  {
    "type": "post",
    "url": "/api/comment/add",
    "title": "新增评论",
    "name": "addComment",
    "group": "comment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "open_id",
            "description": "<p>评论人uid 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "type",
            "description": "<p>类型：0(评论)、1(评论回复)、2(评论回复的回复) 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "content",
            "description": "<p>评论内容 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "images",
            "description": "<p>评论图片 可选</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "reply_id",
            "description": "<p>评论对象id 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/comment.js",
    "groupTitle": "comment"
  },
  {
    "type": "post",
    "url": "/api/comment/adopte",
    "title": "采纳回答",
    "name": "adopteComment",
    "group": "comment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "id",
            "description": "<p>采纳评论的id 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "articleId",
            "description": "<p>评论对应的帖子id 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/comment.js",
    "groupTitle": "comment"
  },
  {
    "type": "post",
    "url": "/api/comment/delete",
    "title": "删除评论",
    "name": "deleteComment",
    "group": "comment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "id",
            "description": "<p>评论id 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/comment.js",
    "groupTitle": "comment"
  },
  {
    "type": "get",
    "url": "/api/comment/get",
    "title": "获取评论",
    "name": "getComment",
    "group": "comment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "id",
            "description": "<p>评论对象id 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "type",
            "description": "<p>类型：0(评论)、1(评论回复)、2(评论回复的回复) 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>一次获取多少 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>获取第几页 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/comment.js",
    "groupTitle": "comment"
  },
  {
    "type": "post",
    "url": "/api/addUserIdea",
    "title": "用户反馈",
    "name": "addUserIdea",
    "group": "index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "title",
            "description": "<p>反馈标题 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "index"
  },
  {
    "type": "get",
    "url": "/api/getHotSearch",
    "title": "获取热搜",
    "name": "getHotSearch",
    "group": "index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "rows",
            "description": "<p>获取条数 必填</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "result",
            "description": "<p>热搜列表</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "index"
  },
  {
    "type": "get",
    "url": "/api/getIntegralRecord",
    "title": "获取积分记录",
    "name": "getIntegralRecord",
    "group": "index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>当前页</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>每页条数</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "type",
            "description": "<p>类型（全部(all)、支出(expend)、收入(income)）</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "result",
            "description": "<p>积分记录</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "index"
  },
  {
    "type": "get",
    "url": "/api/getUserIdea",
    "title": "获取反馈记录",
    "name": "getUserIdea",
    "group": "index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "currentPage",
            "description": "<p>当前页  必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "pageSize",
            "description": "<p>页面尺寸  必填</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "result",
            "description": "<p>图片链接</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "index"
  },
  {
    "type": "post",
    "url": "/api/laud",
    "title": "点赞",
    "name": "laud",
    "group": "index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "id",
            "description": "<p>点赞对象id 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "type",
            "description": "<p>点赞对象类型 0（帖子）、1（评论） 必填</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "status",
            "description": "<p>赞状态(0\\1 取消赞或者点赞) 必填</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "index"
  },
  {
    "type": "post",
    "url": "/api/signIn",
    "title": "签到",
    "name": "signIn",
    "group": "index",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "result",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  code: 0,\n  msg: '签到成功'\n  result: {\n    feedback: {\n      content: '...',\n      remarks: '....'\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "index"
  },
  {
    "type": "post",
    "url": "/api/upload",
    "title": "上传图片公共接口",
    "name": "upload",
    "group": "index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "file",
            "description": "<p>当前页</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "result",
            "optional": false,
            "field": "result",
            "description": "<p>图片链接</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "index"
  }
] });
