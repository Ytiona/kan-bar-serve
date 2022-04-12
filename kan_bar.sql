/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : kan_bar

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 12/04/2022 23:33:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article`  (
  `title` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容',
  `images` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '图片',
  `laud_count` int unsigned NULL COMMENT '获赞数',
  `comment_count` int unsigned NULL COMMENT '评论数',
  `view_count` int unsigned NULL COMMENT '观看量',
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '作者openid',
  `type` tinyint(0) NOT NULL COMMENT '类型：0 普通、1 求配图、2 找表情',
  `offered_integral` int unsigned NULL COMMENT '悬赏积分',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '标签',
  `create_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `adopte_target_id` int(0) NULL DEFAULT -1 COMMENT '采纳对象（评论）id，-1即没有采纳过',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `del_flag` tinyint(0) NOT NULL DEFAULT 0 COMMENT '0未删除、1已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('弱智吧精选笑话1', '1、“丢死人了！”王老汉一边喊着一边把尸体扔下了楼。\n\n2、王老汉愤怒地打开水龙头，因为开水龙头烫着他了。\n\n3、在发现我没有道德后对方放弃了道德绑架\n\n4、公鸡是鸭子吗', '', 0, 0, 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '搞笑', '2020-10-11 17:25:41', -1, 46, 0);
INSERT INTO `article` VALUES ('弱智吧精选笑话2', '5、去掉一个最高温，去掉一个最低温，今天的天气预报播送完了\n\n6、没有一片雪花是无辜的，王老汉指着没信号的电视说到\n\n7、“批瘾犯了。”一晚批了十个班作业的王老师面对采访时解释道\n\n8、案件持续发酵，最后变的松软可口\n\n9、算命的说我22岁之后要多少钱就有多少钱，现在我身上有15元8角，因为今天我只要到这么多。', '', 0, 0, 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '搞笑', '2020-10-11 17:26:05', -1, 47, 0);
INSERT INTO `article` VALUES ('弱智吧精选笑话3', '10、为了让自己文雅一些，拉面改名叫方便面\n\n11、太阳在晒你的同时，你也在晒太阳\n\n12、小明把卫生纸玩弄于股掌之间\n\n13、大法官通过排除法，从而顺利当上大官。\n\n14、战争不停的原因是和平鸽了\n\n15、“不要再打了，我全招！”老板奄奄一息地望着应聘者们\n\n16、“等于400！”震惊！小明仅用时2秒就打破男子4乘100记录', '', 0, 0, 1, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '搞笑', '2020-10-11 17:26:28', -1, 48, 0);
INSERT INTO `article` VALUES ('五个搞笑段子，笑到抽搐', '1.班级有个女孩子特别喜欢班里一个男孩子，传了张字条给那个男孩子，写道“我是小龙女，你愿意当杨过吗？”，，，一会收到回复，上面写着“不 是想当杨过，而是相当难过。”\n\n2..公司正在招聘一个职位，一人前来应聘！老板：“我们这项工作需要一个负责任的人！”应聘者：“我就是你想要的人，以前我工作时，每次一出什么事，其他人都会说是我的责任……”\n\n3.一个人因为和妻子关系不好,就去请教婚姻专家，专家问:“接吻时,你有没有看到你妻子的脸?”　“一次她看起来很愤怒。”　“你是在什么情况下看到她愤怒的脸的呢?”。。。。“她在窗户外面，，，我在屋子里看到的......”\n\n4..小区有位美女开了家动物诊所，我和一哥们忍不住去搭讪：你好，请问这里是给动物看病的吗？她微笑着回答：是的！哥们抢先一步躺在了病床上：请给我检查一下，我是程序猿！我不甘示弱，立即紧挨着他躺下：也请给我检查检查，我是单身狗\n\n5.我哥刚认识的女友交往了半个月，突然有一天爬在我哥怀里哭了，说她家族生意，老爸很势力，肯定要拿她的婚姻做交易，，，我哥忐忑的见了她父亲，结果……她爹是卖包子的，看上了隔壁炸油条的小伙，，，', '', 0, 0, 1, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '搞笑', '2020-10-11 17:29:30', -1, 49, 0);
INSERT INTO `article` VALUES ('吝啬的老华', '老华从小家庭贫穷，邻里邻居对她们家也不好，总觉得她们是穷鬼上身，不愿意靠近乎。老华是家里的独子，看见别人对母亲的欺负，按下心来一定要赚大钱，带着母亲一起享福，母亲还没有等他读完大学就走了，他孤身一人在社会中打拼，看尽了人世间的丑陋，只有钱是最真实的。功夫不负有心人，他抓住了一个商业契机，赚了大钱，买了别墅，但他不想和任何人分享，所以他没有朋友没有爱人，一直独自一人生活。他的钱都存在银行，自己两三年也不换件衣服，他认为这是浪费钱，夏天到了就穿着三块钱的拖鞋，白色的背心，一条短裤就出门，他出门也只是去买菜，毕竟他舍不得请保姆，顺便去公园逛逛，然后再到公司工作，他的日子就这么简单平凡。接触到他的人都跟他说，有钱了就好好享受生活，要不然赚那么多钱干什么？他只觉得赚钱是给自己安全感，母亲都不在世间了，他能一个人享乐？他内心会痛苦，但他没有朋友分享，他觉得身边人都是贪他的钱财。直到有一天，他改变了这个想法，他钱买菜，看见一个小乞丐在乞讨，他刚好买菜剩下一块，就丢给乞丐盘子里，小乞丐满脸的感谢，说了声谢谢。他走开了。吃完饭逛了圈公园，他又看见了小乞丐，小乞丐也看见他、并直向他走过来，他停下来瞧了下，看见小乞丐手里还拿着两个包子，有点脏瘦干的手衬着包子白胖胖的，他愣了愣，不知该如何回应递过来的包子，小乞丐咧开嘴笑了说，爷爷，我每天都看见你一个人买菜逛公园，今天谢谢你给我一块钱，不然我快饿死了，我刚才又讨到了两块钱，买了两个包子，分给你一个。老华的眼眶不禁湿润了，他以前从来没有注意到小乞丐的存在，他忽略生活中太多美好的事了……   他蹲下来，抚摸这小乞丐，和蔼说道：愿不愿意跟我这个老头一起生活呀？', '', 0, 0, 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '故事', '2020-10-11 17:30:25', -1, 50, 0);
INSERT INTO `article` VALUES ('励志鸡汤', '我从来不相信什么懒洋洋的自由，我向往的自由是通过勤奋和努力实现的更广阔的人生，那样的自由才是珍贵的、有价值的；\n\n我相信一万小时定律，我从来不相信天上掉馅饼的灵感和坐等的成就。\n\n做一个自由又自律的人，靠势必实现的决心认真地活着。\n                                                                      —山本耀司', '', 0, 0, 2, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '鸡汤', '2020-10-11 17:32:04', -1, 51, 0);
INSERT INTO `article` VALUES ('心灵鸡汤经典励志语录，精辟哲理！', '1.有些路，走下去会很苦很累，但是不走会后悔。没人心疼，也要坚强；没人鼓掌，也要飞翔，要记住越努力，越幸运。人贵在行动，只有努力了梦想才能实现。前进不必遗憾，若美好，叫做精彩；若糟糕，叫做经历。好好去爱，去生活，每天的太阳都是新的，别辜负了美好时光。你若盛开，蝴蝶自来；你若精彩，天自安排。\n\n2.就算全世界都否定你，你也要相信你自己。不去想别人的看法，旁人的话不过是阳光里的尘埃，下一秒就被风吹走。这是你的生活，没有人能插足，除了你自己，谁都不重要。悲伤，尽情哭得狼狈，泪干后，仰头笑得仍然灿烂。一往直前，激发生命所有的热情。年轻不怕跌倒，永远地，让自己活的很漂亮，很漂亮！', '', 0, 0, 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '鸡汤', '2020-10-11 17:37:31', -1, 52, 0);
INSERT INTO `article` VALUES ('为什么打雷时闪电只有一秒不到，而雷声会持续数秒？', '之前有人回答雷声持续数秒是打雷在天空中回音，我并不是很赞同这样一种解释，云朵这种低密度的类似空气的存在并不足以造成长达数秒的打雷回音。这一点我们可以参考地面爆破的声音，即便有很多建筑造成来回的声音反射，一般的爆炸声也不会有打雷的轰鸣声那么长。\n\n其实打雷时闪电只有一秒不到，而雷声会持续数秒的根本原因在于闪电并非始于一个点，而是发生于很大的一片范围内——比如撕裂天空的闪电，它的实际空间跨度很可能是几万米甚至更大。闪电当中每一处光源也都可被视为一处声音源（这是问题的关键，光源不会传播，虽然看起来像是闪电撕裂天空，但不存在这样一个传播的发光闪电球之类的东西，之所以会亮是因为有能量释放，同时会产生声音），考虑到光速太快，这种空间跨度并不影响人看到闪电的瞬时性；但是音速相对很慢，声源距离观察者距离每增加340米，观察者所听到的雷鸣声就会长处一秒来。\n\n举个例子，大家估摸一下下图这种闪电的范围有多少个340米（当然人听到雷声的时间长度决定于人与最近声源以及人与最远声源之间的距离差，它并不等于闪电在天空划过的距离，这一点要注意），如此一来雷鸣声持续数秒便一点也不奇怪了。', '', 1, 0, 3, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '科普', '2020-10-11 17:39:29', -1, 53, 0);
INSERT INTO `article` VALUES ('js语句最后面该不该写分号？', 'js语句最后面该不该写分号？', '', 1, 2, 16, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, 0, '议题', '2020-10-11 17:40:28', -1, 54, 0);

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论人open_id',
  `laud_count` int(0) NOT NULL DEFAULT 0 COMMENT '获赞数',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '评论内容',
  `images` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '评论图片',
  `reply_count` int(0) NOT NULL DEFAULT 0 COMMENT '回复数量',
  `type` tinyint(0) NOT NULL COMMENT '类型：0(评论)、1(评论回复)、2(评论回复的回复)',
  `reply_id` int(0) NOT NULL COMMENT '回复对象id',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `origin_comment_id` int(0) NULL DEFAULT NULL COMMENT '原始评论id，针对类型2的情况',
  `del_flag` tinyint(0) NOT NULL DEFAULT 0 COMMENT '0：未删除，1：已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 123 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (112, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '写', '', 0, 0, 54, '2020-10-11 17:41:30', NULL, 1);
INSERT INTO `comment` VALUES (113, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 0, 54, '2020-10-11 17:47:01', NULL, 1);
INSERT INTO `comment` VALUES (114, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 0, 54, '2020-10-11 17:48:07', NULL, 1);
INSERT INTO `comment` VALUES (115, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 2, 0, 54, '2020-10-11 17:48:30', NULL, 0);
INSERT INTO `comment` VALUES (116, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 1, 115, '2020-10-11 17:49:19', NULL, 1);
INSERT INTO `comment` VALUES (117, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 1, 115, '2020-10-11 17:49:22', NULL, 1);
INSERT INTO `comment` VALUES (118, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 1, 115, '2020-10-11 17:49:34', NULL, 1);
INSERT INTO `comment` VALUES (119, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 1, 115, '2020-10-11 17:52:04', NULL, 1);
INSERT INTO `comment` VALUES (120, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 1, 115, '2020-10-11 18:04:08', NULL, 0);
INSERT INTO `comment` VALUES (121, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '23', '', 0, 1, 115, '2020-10-11 18:04:13', NULL, 0);
INSERT INTO `comment` VALUES (122, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 0, '123', '', 0, 0, 54, '2020-10-11 18:12:28', NULL, 0);

-- ----------------------------
-- Table structure for follow
-- ----------------------------
DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow`  (
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户id',
  `target_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对象用户id',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `status` tinyint(0) NOT NULL DEFAULT 1 COMMENT '0：已取消，1：未取消',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `open_id`(`open_id`, `target_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of follow
-- ----------------------------
INSERT INTO `follow` VALUES ('ozauQ4iVhYuG-dufbeIFhWdwcdpI', 'azauQ4iVhYuG-dufbeIFhWdwcdpI', '2020-10-11 18:13:28', 57, 1);

-- ----------------------------
-- Table structure for integral_record
-- ----------------------------
DROP TABLE IF EXISTS `integral_record`;
CREATE TABLE `integral_record`  (
  `integral` int(0) NOT NULL COMMENT '积分流水',
  `create_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `type` tinyint(0) NULL DEFAULT NULL COMMENT '0：签到，1：发帖，2：设置悬赏，3：获得悬赏',
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of integral_record
-- ----------------------------
INSERT INTO `integral_record` VALUES (5, '2020-10-11 17:23:57', 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 45);
INSERT INTO `integral_record` VALUES (10, '2020-10-11 17:25:41', 1, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 46);
INSERT INTO `integral_record` VALUES (5, '2020-10-14 15:50:16', 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 47);
INSERT INTO `integral_record` VALUES (5, '2020-10-14 16:00:53', 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 48);
INSERT INTO `integral_record` VALUES (5, '2022-04-12 23:15:54', 0, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', 49);

-- ----------------------------
-- Table structure for laud
-- ----------------------------
DROP TABLE IF EXISTS `laud`;
CREATE TABLE `laud`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '点赞人open_id',
  `target_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '点赞对象id',
  `target_type` tinyint(0) NOT NULL COMMENT '点赞对象类型：0（帖子）、1（评论）',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(0) NOT NULL DEFAULT 1 COMMENT '0：已取消，1：未取消',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `laud`(`open_id`, `target_id`, `target_type`) USING BTREE COMMENT '每个人只能给某个帖子或评论点一次赞'
) ENGINE = InnoDB AUTO_INCREMENT = 349 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of laud
-- ----------------------------
INSERT INTO `laud` VALUES (348, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', '54', 0, '2020-10-11 18:12:33', 1);
INSERT INTO `laud` VALUES (349, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', '53', 0, '2022-04-12 23:23:25', 1);

-- ----------------------------
-- Table structure for search
-- ----------------------------
DROP TABLE IF EXISTS `search`;
CREATE TABLE `search`  (
  `search_content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '搜索内容',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `search_count` int(0) NOT NULL DEFAULT 1 COMMENT '搜索次数',
  `type` tinyint(0) NOT NULL COMMENT '类型：0帖子，1用户',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `search_content`(`search_content`, `type`) USING BTREE COMMENT '搜索内容和类型组合唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 73 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of search
-- ----------------------------
INSERT INTO `search` VALUES ('搞笑', 70, 4, 0, '2020-10-11 18:13:50');

-- ----------------------------
-- Table structure for sign_in
-- ----------------------------
DROP TABLE IF EXISTS `sign_in`;
CREATE TABLE `sign_in`  (
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '签到人openid',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `sign_in_date` date NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `sign_in_once`(`open_id`, `sign_in_date`) USING BTREE COMMENT '用户每天签到一次'
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sign_in
-- ----------------------------
INSERT INTO `sign_in` VALUES ('ozauQ4iVhYuG-dufbeIFhWdwcdpI', '2020-10-11 17:23:57', '2020-10-11', 54);
INSERT INTO `sign_in` VALUES ('ozauQ4iVhYuG-dufbeIFhWdwcdpI', '2020-10-14 16:00:53', '2020-10-14', 57);
INSERT INTO `sign_in` VALUES ('ozauQ4iVhYuG-dufbeIFhWdwcdpI', '2022-04-12 23:15:54', '2022-04-12', 58);

-- ----------------------------
-- Table structure for sign_in_feedback
-- ----------------------------
DROP TABLE IF EXISTS `sign_in_feedback`;
CREATE TABLE `sign_in_feedback`  (
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '内容',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sign_in_feedback
-- ----------------------------
INSERT INTO `sign_in_feedback` VALUES ('希望能和生命中所有美好白头偕老', '鸡汤', 1);
INSERT INTO `sign_in_feedback` VALUES ('以梦为马，越骑越傻', '毒鸡汤', 2);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `avatar` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像url',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '昵称',
  `declaration` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '个性签名',
  `sex` tinyint(0) NULL DEFAULT -1 COMMENT '性别(1男，0女，-1未知)',
  `region` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '地区/城市',
  `qq` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT 'QQ',
  `integral` int unsigned NOT NULL COMMENT '积分',
  `laud_count` int unsigned NOT NULL COMMENT '获赞数',
  `article_count` int unsigned NOT NULL COMMENT '帖子数',
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '微信openid',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `session_key` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fans_count` int unsigned NOT NULL COMMENT '粉丝数量',
  `follow_count` int unsigned NOT NULL COMMENT '关注数量',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `open_id`(`open_id`) USING BTREE COMMENT '微信openid唯一',
  UNIQUE INDEX `nickname`(`nickname`) USING BTREE COMMENT 'nickname唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 382 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('https://thirdwx.qlogo.cn/mmopen/vi_32/ia2uqKQFHON9kDG2p7PUDmUIjISLj0Kq84O6gJ88f7Is74I7viaQiazNDbq1WibuibLZJXvBkgjsWoacQ4qo91FXAuw/132', 'Shadow', '梧高凤必至，花开蝶自来', 1, '', '', 29, 0, 0, 'azauQ4iVhYuG-dufbeIFhWdwcdpI', '2020-08-28 21:55:12', 255, 'e1JbS7uJfL5DEvYYMBosMw==', 2, 1);
INSERT INTO `user` VALUES ('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202007%2F04%2F20200704075609_ejqjf.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652368771&t=56aed2c138bc25383d364f4630ebc15b', '侃吧1号选手', '哈哈哈哈哈哈哈哈哈哈或', 1, '湖南省 长沙市', '490081587', 70, 0, 10, 'ozauQ4iVhYuG-dufbeIFhWdwcdpI', '2020-08-30 22:54:27', 265, 'H40i0UMEymdw3o/ktYXPeQ==', 1, 2);

-- ----------------------------
-- Table structure for user_idea
-- ----------------------------
DROP TABLE IF EXISTS `user_idea`;
CREATE TABLE `user_idea`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '反馈标题',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '详细内容',
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '反馈人open_id',
  `status` tinyint(0) NOT NULL DEFAULT 0 COMMENT '状态：0已收到、1处理中、2已处理',
  `reply` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '反馈回复',
  `create_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
