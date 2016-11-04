/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50515
Source Host           : localhost:3306
Source Database       : oauth

Target Server Type    : MYSQL
Target Server Version : 50515
File Encoding         : 65001

Date: 2016-11-04 16:16:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_area
-- ----------------------------
DROP TABLE IF EXISTS `sys_area`;
CREATE TABLE `sys_area` (
  `id_` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `code_` varchar(10) DEFAULT NULL COMMENT '城市代码',
  `city_en_` varchar(32) DEFAULT NULL COMMENT '城市拼音',
  `city_cn_` varchar(32) DEFAULT NULL COMMENT '城市名称',
  `parent_` bigint(20) DEFAULT NULL COMMENT '父级',
  `order_` int(11) DEFAULT NULL COMMENT '顺序',
  `type_` varchar(2) DEFAULT NULL COMMENT '类别',
  `area_code_` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='城市地区';

-- ----------------------------
-- Records of sys_area
-- ----------------------------

-- ----------------------------
-- Table structure for sys_codeitem
-- ----------------------------
DROP TABLE IF EXISTS `sys_codeitem`;
CREATE TABLE `sys_codeitem` (
  `id_` bigint(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) DEFAULT NULL,
  `codemap` varchar(32) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL,
  `SORT` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_codeitem
-- ----------------------------
INSERT INTO `sys_codeitem` VALUES ('1', '01', 'user_status', '启用', '1');
INSERT INTO `sys_codeitem` VALUES ('2', '02', 'user_status', '停用', '2');
INSERT INTO `sys_codeitem` VALUES ('3', '1', 'sys_level', '一级', '1');
INSERT INTO `sys_codeitem` VALUES ('4', '2', 'sys_level', '二级', '2');
INSERT INTO `sys_codeitem` VALUES ('5', '3', 'sys_level', '三级', '3');

-- ----------------------------
-- Table structure for sys_codemap
-- ----------------------------
DROP TABLE IF EXISTS `sys_codemap`;
CREATE TABLE `sys_codemap` (
  `id_` bigint(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_codemap
-- ----------------------------
INSERT INTO `sys_codemap` VALUES ('1', 'user_status', '用户状态');
INSERT INTO `sys_codemap` VALUES ('2', 'sys_level', '级别');

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user` bigint(20) DEFAULT NULL COMMENT '操作人id',
  `user_name` varchar(64) DEFAULT NULL COMMENT '操作账号',
  `create_time` varchar(20) DEFAULT NULL COMMENT '操作时间',
  `ip` varchar(32) DEFAULT NULL COMMENT '操作ip',
  `method_text` varchar(64) DEFAULT NULL COMMENT '方法描述',
  `signature` varchar(256) DEFAULT NULL COMMENT '方法签名',
  `status` int(1) DEFAULT '1' COMMENT '成功失败标志',
  `code` varchar(32) DEFAULT '0000' COMMENT '返回码',
  `parames` varchar(2000) DEFAULT NULL COMMENT '输入参数',
  `result` varchar(8000) DEFAULT NULL COMMENT '返回结果',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_log
-- ----------------------------

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` varchar(20) NOT NULL COMMENT '表id',
  `name` varchar(50) DEFAULT NULL COMMENT '菜单名',
  `url` varchar(128) DEFAULT NULL COMMENT '菜单地址',
  `parent` varchar(20) DEFAULT NULL COMMENT '上级菜单',
  `level` int(4) unsigned DEFAULT NULL COMMENT '菜单级别',
  `icon` varchar(128) DEFAULT NULL COMMENT '菜单样式',
  `roles` varchar(128) DEFAULT NULL COMMENT '适应角色集',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC COMMENT='功能菜单表';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES ('00', '首页', '/', '', '0', 'icon-home', null);
INSERT INTO `sys_menu` VALUES ('09', '系统管理', '#', null, '0', 'icon-cogs', null);
INSERT INTO `sys_menu` VALUES ('0901', '用户管理', '/user/manager', '09', '1', 'icon-user', null);
INSERT INTO `sys_menu` VALUES ('0902', '菜单管理', '/sys/menu/index', '09', '1', 'icon-list', null);
INSERT INTO `sys_menu` VALUES ('0903', '角色管理', '/sys/role/index', '09', '1', 'icon-sitemap', null);
INSERT INTO `sys_menu` VALUES ('0904', '代码管理', '/code/index', '09', '1', 'icon-qrcode', null);
INSERT INTO `sys_menu` VALUES ('0905', '城市管理', '/area/index', '09', '1', 'icon-list', null);

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `permission_name` varchar(32) DEFAULT NULL COMMENT '权限名',
  `permission_sign` varchar(128) DEFAULT NULL COMMENT '权限标识,程序中判断使用,如"user:create"',
  `description` varchar(256) DEFAULT NULL COMMENT '权限描述,UI界面显示使用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC COMMENT='权限表';

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES ('1', '用户新增', 'user:create', null);

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `role_name` varchar(32) DEFAULT NULL COMMENT '角色名',
  `role_sign` varchar(128) DEFAULT NULL COMMENT '角色标识,程序中判断使用,如"admin"',
  `description` varchar(256) DEFAULT NULL COMMENT '角色描述,UI界面显示使用',
  `role_level` int(4) DEFAULT '1' COMMENT '角色级别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC COMMENT='角色表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('1', 'admin', 'admin', '系统管理员', '1');

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `role_id` bigint(20) NOT NULL,
  `menu_id` varchar(32) NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES ('1', '00');
INSERT INTO `sys_role_menu` VALUES ('1', '01');
INSERT INTO `sys_role_menu` VALUES ('1', '0101');
INSERT INTO `sys_role_menu` VALUES ('1', '010101');
INSERT INTO `sys_role_menu` VALUES ('1', '0103');
INSERT INTO `sys_role_menu` VALUES ('1', '010301');
INSERT INTO `sys_role_menu` VALUES ('1', '010302');
INSERT INTO `sys_role_menu` VALUES ('1', '010303');
INSERT INTO `sys_role_menu` VALUES ('1', '010304');
INSERT INTO `sys_role_menu` VALUES ('1', '010305');
INSERT INTO `sys_role_menu` VALUES ('1', '0104');
INSERT INTO `sys_role_menu` VALUES ('1', '010401');
INSERT INTO `sys_role_menu` VALUES ('1', '01040101');
INSERT INTO `sys_role_menu` VALUES ('1', '010402');
INSERT INTO `sys_role_menu` VALUES ('1', '01040201');
INSERT INTO `sys_role_menu` VALUES ('1', '010403');
INSERT INTO `sys_role_menu` VALUES ('1', '010404');
INSERT INTO `sys_role_menu` VALUES ('1', '010405');
INSERT INTO `sys_role_menu` VALUES ('1', '010406');
INSERT INTO `sys_role_menu` VALUES ('1', '010407');
INSERT INTO `sys_role_menu` VALUES ('1', '010408');
INSERT INTO `sys_role_menu` VALUES ('1', '0105');
INSERT INTO `sys_role_menu` VALUES ('1', '010501');
INSERT INTO `sys_role_menu` VALUES ('1', '010502');
INSERT INTO `sys_role_menu` VALUES ('1', '010504');
INSERT INTO `sys_role_menu` VALUES ('1', '010505');
INSERT INTO `sys_role_menu` VALUES ('1', '010506');
INSERT INTO `sys_role_menu` VALUES ('1', '010507');
INSERT INTO `sys_role_menu` VALUES ('1', '010508');
INSERT INTO `sys_role_menu` VALUES ('1', '010509');
INSERT INTO `sys_role_menu` VALUES ('1', '0106');
INSERT INTO `sys_role_menu` VALUES ('1', '010601');
INSERT INTO `sys_role_menu` VALUES ('1', '02');
INSERT INTO `sys_role_menu` VALUES ('1', '0201');
INSERT INTO `sys_role_menu` VALUES ('1', '0202');
INSERT INTO `sys_role_menu` VALUES ('1', '0203');
INSERT INTO `sys_role_menu` VALUES ('1', '0204');
INSERT INTO `sys_role_menu` VALUES ('1', '0205');
INSERT INTO `sys_role_menu` VALUES ('1', '03');
INSERT INTO `sys_role_menu` VALUES ('1', '0301');
INSERT INTO `sys_role_menu` VALUES ('1', '0302');
INSERT INTO `sys_role_menu` VALUES ('1', '0303');
INSERT INTO `sys_role_menu` VALUES ('1', '0304');
INSERT INTO `sys_role_menu` VALUES ('1', '0305');
INSERT INTO `sys_role_menu` VALUES ('1', '0306');
INSERT INTO `sys_role_menu` VALUES ('1', '030600');
INSERT INTO `sys_role_menu` VALUES ('1', '030601');
INSERT INTO `sys_role_menu` VALUES ('1', '030602');
INSERT INTO `sys_role_menu` VALUES ('1', '030603');
INSERT INTO `sys_role_menu` VALUES ('1', '030604');
INSERT INTO `sys_role_menu` VALUES ('1', '030605');
INSERT INTO `sys_role_menu` VALUES ('1', '030606');
INSERT INTO `sys_role_menu` VALUES ('1', '030607');
INSERT INTO `sys_role_menu` VALUES ('1', '0307');
INSERT INTO `sys_role_menu` VALUES ('1', '0308');
INSERT INTO `sys_role_menu` VALUES ('1', '030800');
INSERT INTO `sys_role_menu` VALUES ('1', '030801');
INSERT INTO `sys_role_menu` VALUES ('1', '030802');
INSERT INTO `sys_role_menu` VALUES ('1', '030803');
INSERT INTO `sys_role_menu` VALUES ('1', '0309');
INSERT INTO `sys_role_menu` VALUES ('1', '030901');
INSERT INTO `sys_role_menu` VALUES ('1', '030902');
INSERT INTO `sys_role_menu` VALUES ('1', '030903');
INSERT INTO `sys_role_menu` VALUES ('1', '030904');
INSERT INTO `sys_role_menu` VALUES ('1', '030905');
INSERT INTO `sys_role_menu` VALUES ('1', '030906');
INSERT INTO `sys_role_menu` VALUES ('1', '08');
INSERT INTO `sys_role_menu` VALUES ('1', '09');
INSERT INTO `sys_role_menu` VALUES ('1', '0901');
INSERT INTO `sys_role_menu` VALUES ('1', '0902');
INSERT INTO `sys_role_menu` VALUES ('1', '0903');
INSERT INTO `sys_role_menu` VALUES ('1', '0904');
INSERT INTO `sys_role_menu` VALUES ('1', '0905');
INSERT INTO `sys_role_menu` VALUES ('2', '00');
INSERT INTO `sys_role_menu` VALUES ('2', '01');
INSERT INTO `sys_role_menu` VALUES ('2', '0101');
INSERT INTO `sys_role_menu` VALUES ('2', '010101');
INSERT INTO `sys_role_menu` VALUES ('2', '0103');
INSERT INTO `sys_role_menu` VALUES ('2', '010301');
INSERT INTO `sys_role_menu` VALUES ('2', '010302');
INSERT INTO `sys_role_menu` VALUES ('2', '010303');
INSERT INTO `sys_role_menu` VALUES ('2', '010304');
INSERT INTO `sys_role_menu` VALUES ('2', '010305');
INSERT INTO `sys_role_menu` VALUES ('2', '0104');
INSERT INTO `sys_role_menu` VALUES ('2', '010401');
INSERT INTO `sys_role_menu` VALUES ('2', '01040101');
INSERT INTO `sys_role_menu` VALUES ('2', '010402');
INSERT INTO `sys_role_menu` VALUES ('2', '01040201');
INSERT INTO `sys_role_menu` VALUES ('2', '010403');
INSERT INTO `sys_role_menu` VALUES ('2', '010404');
INSERT INTO `sys_role_menu` VALUES ('2', '010405');
INSERT INTO `sys_role_menu` VALUES ('2', '010406');
INSERT INTO `sys_role_menu` VALUES ('2', '010407');
INSERT INTO `sys_role_menu` VALUES ('2', '010408');
INSERT INTO `sys_role_menu` VALUES ('2', '0105');
INSERT INTO `sys_role_menu` VALUES ('2', '010501');
INSERT INTO `sys_role_menu` VALUES ('2', '010502');
INSERT INTO `sys_role_menu` VALUES ('2', '010504');
INSERT INTO `sys_role_menu` VALUES ('2', '010505');
INSERT INTO `sys_role_menu` VALUES ('2', '010506');
INSERT INTO `sys_role_menu` VALUES ('2', '010507');
INSERT INTO `sys_role_menu` VALUES ('2', '010508');
INSERT INTO `sys_role_menu` VALUES ('2', '010509');
INSERT INTO `sys_role_menu` VALUES ('2', '0106');
INSERT INTO `sys_role_menu` VALUES ('2', '010601');
INSERT INTO `sys_role_menu` VALUES ('2', '02');
INSERT INTO `sys_role_menu` VALUES ('2', '0201');
INSERT INTO `sys_role_menu` VALUES ('2', '0202');
INSERT INTO `sys_role_menu` VALUES ('2', '0203');
INSERT INTO `sys_role_menu` VALUES ('2', '0204');
INSERT INTO `sys_role_menu` VALUES ('2', '03');
INSERT INTO `sys_role_menu` VALUES ('2', '0301');
INSERT INTO `sys_role_menu` VALUES ('2', '0302');
INSERT INTO `sys_role_menu` VALUES ('2', '0303');
INSERT INTO `sys_role_menu` VALUES ('2', '0304');
INSERT INTO `sys_role_menu` VALUES ('2', '0305');
INSERT INTO `sys_role_menu` VALUES ('2', '0306');
INSERT INTO `sys_role_menu` VALUES ('2', '030600');
INSERT INTO `sys_role_menu` VALUES ('2', '030601');
INSERT INTO `sys_role_menu` VALUES ('2', '030602');
INSERT INTO `sys_role_menu` VALUES ('2', '030603');
INSERT INTO `sys_role_menu` VALUES ('2', '030604');
INSERT INTO `sys_role_menu` VALUES ('2', '030605');
INSERT INTO `sys_role_menu` VALUES ('2', '030606');
INSERT INTO `sys_role_menu` VALUES ('2', '0307');
INSERT INTO `sys_role_menu` VALUES ('2', '0308');
INSERT INTO `sys_role_menu` VALUES ('2', '030800');
INSERT INTO `sys_role_menu` VALUES ('2', '030801');
INSERT INTO `sys_role_menu` VALUES ('2', '030802');
INSERT INTO `sys_role_menu` VALUES ('2', '030803');
INSERT INTO `sys_role_menu` VALUES ('2', '0309');
INSERT INTO `sys_role_menu` VALUES ('2', '030901');
INSERT INTO `sys_role_menu` VALUES ('2', '030902');
INSERT INTO `sys_role_menu` VALUES ('2', '030903');
INSERT INTO `sys_role_menu` VALUES ('2', '030904');
INSERT INTO `sys_role_menu` VALUES ('2', '030905');
INSERT INTO `sys_role_menu` VALUES ('2', '030906');
INSERT INTO `sys_role_menu` VALUES ('2', '09');
INSERT INTO `sys_role_menu` VALUES ('2', '0902');
INSERT INTO `sys_role_menu` VALUES ('2', '0904');
INSERT INTO `sys_role_menu` VALUES ('2', '0905');
INSERT INTO `sys_role_menu` VALUES ('3', '');
INSERT INTO `sys_role_menu` VALUES ('4', '00');
INSERT INTO `sys_role_menu` VALUES ('4', '01');
INSERT INTO `sys_role_menu` VALUES ('4', '0103');
INSERT INTO `sys_role_menu` VALUES ('4', '0104');
INSERT INTO `sys_role_menu` VALUES ('4', '010401');
INSERT INTO `sys_role_menu` VALUES ('4', '010404');
INSERT INTO `sys_role_menu` VALUES ('4', '0105');
INSERT INTO `sys_role_menu` VALUES ('4', '010509');
INSERT INTO `sys_role_menu` VALUES ('4', '0106');
INSERT INTO `sys_role_menu` VALUES ('4', '02');
INSERT INTO `sys_role_menu` VALUES ('4', '0201');
INSERT INTO `sys_role_menu` VALUES ('4', '0202');
INSERT INTO `sys_role_menu` VALUES ('4', '0203');
INSERT INTO `sys_role_menu` VALUES ('4', '0204');
INSERT INTO `sys_role_menu` VALUES ('4', '0205');
INSERT INTO `sys_role_menu` VALUES ('4', '03');
INSERT INTO `sys_role_menu` VALUES ('4', '0307');
INSERT INTO `sys_role_menu` VALUES ('4', '0308');
INSERT INTO `sys_role_menu` VALUES ('4', '030800');
INSERT INTO `sys_role_menu` VALUES ('4', '030801');
INSERT INTO `sys_role_menu` VALUES ('4', '030802');
INSERT INTO `sys_role_menu` VALUES ('4', '030803');
INSERT INTO `sys_role_menu` VALUES ('4', '0309');
INSERT INTO `sys_role_menu` VALUES ('4', '030901');
INSERT INTO `sys_role_menu` VALUES ('4', '030902');
INSERT INTO `sys_role_menu` VALUES ('4', '030903');
INSERT INTO `sys_role_menu` VALUES ('4', '030904');
INSERT INTO `sys_role_menu` VALUES ('4', '030905');
INSERT INTO `sys_role_menu` VALUES ('4', '030906');
INSERT INTO `sys_role_menu` VALUES ('5', '00');
INSERT INTO `sys_role_menu` VALUES ('5', '01');
INSERT INTO `sys_role_menu` VALUES ('5', '0101');
INSERT INTO `sys_role_menu` VALUES ('5', '010101');
INSERT INTO `sys_role_menu` VALUES ('5', '0105');
INSERT INTO `sys_role_menu` VALUES ('5', '010505');
INSERT INTO `sys_role_menu` VALUES ('6', '01');
INSERT INTO `sys_role_menu` VALUES ('6', '0103');
INSERT INTO `sys_role_menu` VALUES ('6', '010301');
INSERT INTO `sys_role_menu` VALUES ('6', '03');
INSERT INTO `sys_role_menu` VALUES ('6', '0307');
INSERT INTO `sys_role_menu` VALUES ('6', '0308');
INSERT INTO `sys_role_menu` VALUES ('6', '030800');
INSERT INTO `sys_role_menu` VALUES ('6', '030801');
INSERT INTO `sys_role_menu` VALUES ('6', '030802');
INSERT INTO `sys_role_menu` VALUES ('6', '030803');
INSERT INTO `sys_role_menu` VALUES ('6', '0309');
INSERT INTO `sys_role_menu` VALUES ('6', '030901');
INSERT INTO `sys_role_menu` VALUES ('6', '030902');
INSERT INTO `sys_role_menu` VALUES ('6', '030903');
INSERT INTO `sys_role_menu` VALUES ('6', '030904');
INSERT INTO `sys_role_menu` VALUES ('6', '030905');
INSERT INTO `sys_role_menu` VALUES ('6', '030906');
INSERT INTO `sys_role_menu` VALUES ('7', '00');
INSERT INTO `sys_role_menu` VALUES ('7', '01');
INSERT INTO `sys_role_menu` VALUES ('7', '0103');
INSERT INTO `sys_role_menu` VALUES ('7', '010303');
INSERT INTO `sys_role_menu` VALUES ('7', '0104');
INSERT INTO `sys_role_menu` VALUES ('7', '010401');
INSERT INTO `sys_role_menu` VALUES ('7', '01040101');
INSERT INTO `sys_role_menu` VALUES ('7', '0105');
INSERT INTO `sys_role_menu` VALUES ('7', '010501');
INSERT INTO `sys_role_menu` VALUES ('7', '010502');
INSERT INTO `sys_role_menu` VALUES ('7', '010504');
INSERT INTO `sys_role_menu` VALUES ('7', '010506');
INSERT INTO `sys_role_menu` VALUES ('7', '010507');
INSERT INTO `sys_role_menu` VALUES ('7', '010508');
INSERT INTO `sys_role_menu` VALUES ('7', '010509');
INSERT INTO `sys_role_menu` VALUES ('7', '03');
INSERT INTO `sys_role_menu` VALUES ('7', '0301');
INSERT INTO `sys_role_menu` VALUES ('8', '00');
INSERT INTO `sys_role_menu` VALUES ('8', '01');
INSERT INTO `sys_role_menu` VALUES ('8', '0101');
INSERT INTO `sys_role_menu` VALUES ('8', '010101');
INSERT INTO `sys_role_menu` VALUES ('8', '0103');
INSERT INTO `sys_role_menu` VALUES ('8', '010301');
INSERT INTO `sys_role_menu` VALUES ('8', '010303');
INSERT INTO `sys_role_menu` VALUES ('8', '010305');
INSERT INTO `sys_role_menu` VALUES ('8', '0104');
INSERT INTO `sys_role_menu` VALUES ('8', '010401');
INSERT INTO `sys_role_menu` VALUES ('8', '01040101');
INSERT INTO `sys_role_menu` VALUES ('8', '010402');
INSERT INTO `sys_role_menu` VALUES ('8', '01040201');
INSERT INTO `sys_role_menu` VALUES ('8', '010403');
INSERT INTO `sys_role_menu` VALUES ('8', '010404');
INSERT INTO `sys_role_menu` VALUES ('8', '010405');
INSERT INTO `sys_role_menu` VALUES ('8', '010406');
INSERT INTO `sys_role_menu` VALUES ('8', '010407');
INSERT INTO `sys_role_menu` VALUES ('8', '010408');
INSERT INTO `sys_role_menu` VALUES ('8', '0105');
INSERT INTO `sys_role_menu` VALUES ('8', '010501');
INSERT INTO `sys_role_menu` VALUES ('8', '010502');
INSERT INTO `sys_role_menu` VALUES ('8', '010504');
INSERT INTO `sys_role_menu` VALUES ('8', '010505');
INSERT INTO `sys_role_menu` VALUES ('8', '010506');
INSERT INTO `sys_role_menu` VALUES ('8', '010507');
INSERT INTO `sys_role_menu` VALUES ('8', '010508');
INSERT INTO `sys_role_menu` VALUES ('8', '010509');
INSERT INTO `sys_role_menu` VALUES ('8', '03');
INSERT INTO `sys_role_menu` VALUES ('8', '0301');
INSERT INTO `sys_role_menu` VALUES ('8', '0302');
INSERT INTO `sys_role_menu` VALUES ('8', '0303');
INSERT INTO `sys_role_menu` VALUES ('8', '0304');
INSERT INTO `sys_role_menu` VALUES ('8', '0305');
INSERT INTO `sys_role_menu` VALUES ('8', '0307');
INSERT INTO `sys_role_menu` VALUES ('8', '0308');
INSERT INTO `sys_role_menu` VALUES ('8', '030800');
INSERT INTO `sys_role_menu` VALUES ('8', '030801');
INSERT INTO `sys_role_menu` VALUES ('8', '030802');
INSERT INTO `sys_role_menu` VALUES ('8', '030803');
INSERT INTO `sys_role_menu` VALUES ('8', '0309');
INSERT INTO `sys_role_menu` VALUES ('8', '030901');
INSERT INTO `sys_role_menu` VALUES ('8', '030902');
INSERT INTO `sys_role_menu` VALUES ('8', '030903');
INSERT INTO `sys_role_menu` VALUES ('8', '030904');
INSERT INTO `sys_role_menu` VALUES ('8', '030905');
INSERT INTO `sys_role_menu` VALUES ('8', '030906');
INSERT INTO `sys_role_menu` VALUES ('9', '00');
INSERT INTO `sys_role_menu` VALUES ('9', '01');
INSERT INTO `sys_role_menu` VALUES ('9', '0101');
INSERT INTO `sys_role_menu` VALUES ('9', '010101');
INSERT INTO `sys_role_menu` VALUES ('9', '0103');
INSERT INTO `sys_role_menu` VALUES ('9', '010301');
INSERT INTO `sys_role_menu` VALUES ('9', '010302');
INSERT INTO `sys_role_menu` VALUES ('9', '010303');
INSERT INTO `sys_role_menu` VALUES ('9', '010304');
INSERT INTO `sys_role_menu` VALUES ('9', '010305');
INSERT INTO `sys_role_menu` VALUES ('9', '0104');
INSERT INTO `sys_role_menu` VALUES ('9', '010401');
INSERT INTO `sys_role_menu` VALUES ('9', '01040101');
INSERT INTO `sys_role_menu` VALUES ('9', '010402');
INSERT INTO `sys_role_menu` VALUES ('9', '010403');
INSERT INTO `sys_role_menu` VALUES ('9', '010404');
INSERT INTO `sys_role_menu` VALUES ('9', '010405');
INSERT INTO `sys_role_menu` VALUES ('9', '010406');
INSERT INTO `sys_role_menu` VALUES ('9', '010407');
INSERT INTO `sys_role_menu` VALUES ('9', '010408');
INSERT INTO `sys_role_menu` VALUES ('9', '0105');
INSERT INTO `sys_role_menu` VALUES ('9', '010501');
INSERT INTO `sys_role_menu` VALUES ('9', '010502');
INSERT INTO `sys_role_menu` VALUES ('9', '010504');
INSERT INTO `sys_role_menu` VALUES ('9', '010505');
INSERT INTO `sys_role_menu` VALUES ('9', '010506');
INSERT INTO `sys_role_menu` VALUES ('9', '010507');
INSERT INTO `sys_role_menu` VALUES ('9', '010508');
INSERT INTO `sys_role_menu` VALUES ('9', '010509');
INSERT INTO `sys_role_menu` VALUES ('9', '0106');
INSERT INTO `sys_role_menu` VALUES ('9', '010601');
INSERT INTO `sys_role_menu` VALUES ('9', '03');
INSERT INTO `sys_role_menu` VALUES ('9', '0301');
INSERT INTO `sys_role_menu` VALUES ('9', '09');
INSERT INTO `sys_role_menu` VALUES ('9', '0901');
INSERT INTO `sys_role_menu` VALUES ('9', '0903');
INSERT INTO `sys_role_menu` VALUES ('10', '03');
INSERT INTO `sys_role_menu` VALUES ('10', '0301');
INSERT INTO `sys_role_menu` VALUES ('10', '0302');
INSERT INTO `sys_role_menu` VALUES ('10', '0303');
INSERT INTO `sys_role_menu` VALUES ('10', '0304');
INSERT INTO `sys_role_menu` VALUES ('10', '0305');
INSERT INTO `sys_role_menu` VALUES ('10', '0306');
INSERT INTO `sys_role_menu` VALUES ('10', '030600');
INSERT INTO `sys_role_menu` VALUES ('10', '030601');
INSERT INTO `sys_role_menu` VALUES ('10', '030602');
INSERT INTO `sys_role_menu` VALUES ('10', '030603');
INSERT INTO `sys_role_menu` VALUES ('10', '030604');
INSERT INTO `sys_role_menu` VALUES ('10', '030605');
INSERT INTO `sys_role_menu` VALUES ('10', '030606');
INSERT INTO `sys_role_menu` VALUES ('10', '0307');
INSERT INTO `sys_role_menu` VALUES ('10', '0308');
INSERT INTO `sys_role_menu` VALUES ('10', '030800');
INSERT INTO `sys_role_menu` VALUES ('10', '030801');
INSERT INTO `sys_role_menu` VALUES ('10', '030802');
INSERT INTO `sys_role_menu` VALUES ('10', '030803');
INSERT INTO `sys_role_menu` VALUES ('10', '0309');
INSERT INTO `sys_role_menu` VALUES ('10', '030901');
INSERT INTO `sys_role_menu` VALUES ('10', '030902');
INSERT INTO `sys_role_menu` VALUES ('10', '030903');
INSERT INTO `sys_role_menu` VALUES ('10', '030904');
INSERT INTO `sys_role_menu` VALUES ('10', '030905');
INSERT INTO `sys_role_menu` VALUES ('10', '030906');
INSERT INTO `sys_role_menu` VALUES ('11', '00');
INSERT INTO `sys_role_menu` VALUES ('11', '0104');
INSERT INTO `sys_role_menu` VALUES ('11', '010401');
INSERT INTO `sys_role_menu` VALUES ('11', '08');
INSERT INTO `sys_role_menu` VALUES ('12', '00');
INSERT INTO `sys_role_menu` VALUES ('12', '0104');
INSERT INTO `sys_role_menu` VALUES ('12', '010402');
INSERT INTO `sys_role_menu` VALUES ('12', '01040201');
INSERT INTO `sys_role_menu` VALUES ('12', '010403');
INSERT INTO `sys_role_menu` VALUES ('12', '03');
INSERT INTO `sys_role_menu` VALUES ('12', '0307');
INSERT INTO `sys_role_menu` VALUES ('13', '00');
INSERT INTO `sys_role_menu` VALUES ('13', '01');
INSERT INTO `sys_role_menu` VALUES ('13', '0103');
INSERT INTO `sys_role_menu` VALUES ('13', '010301');
INSERT INTO `sys_role_menu` VALUES ('13', '010303');
INSERT INTO `sys_role_menu` VALUES ('15', '00');
INSERT INTO `sys_role_menu` VALUES ('15', '01');
INSERT INTO `sys_role_menu` VALUES ('15', '0101');
INSERT INTO `sys_role_menu` VALUES ('15', '010101');
INSERT INTO `sys_role_menu` VALUES ('15', '0103');
INSERT INTO `sys_role_menu` VALUES ('15', '010301');
INSERT INTO `sys_role_menu` VALUES ('15', '010302');
INSERT INTO `sys_role_menu` VALUES ('15', '010303');
INSERT INTO `sys_role_menu` VALUES ('15', '010304');
INSERT INTO `sys_role_menu` VALUES ('15', '010305');
INSERT INTO `sys_role_menu` VALUES ('15', '0104');
INSERT INTO `sys_role_menu` VALUES ('15', '010401');
INSERT INTO `sys_role_menu` VALUES ('15', '01040101');
INSERT INTO `sys_role_menu` VALUES ('15', '010402');
INSERT INTO `sys_role_menu` VALUES ('15', '01040201');
INSERT INTO `sys_role_menu` VALUES ('15', '010403');
INSERT INTO `sys_role_menu` VALUES ('15', '010404');
INSERT INTO `sys_role_menu` VALUES ('15', '010405');
INSERT INTO `sys_role_menu` VALUES ('15', '010406');
INSERT INTO `sys_role_menu` VALUES ('15', '010407');
INSERT INTO `sys_role_menu` VALUES ('15', '010408');
INSERT INTO `sys_role_menu` VALUES ('15', '0105');
INSERT INTO `sys_role_menu` VALUES ('15', '010501');
INSERT INTO `sys_role_menu` VALUES ('15', '010502');
INSERT INTO `sys_role_menu` VALUES ('15', '010504');
INSERT INTO `sys_role_menu` VALUES ('15', '010505');
INSERT INTO `sys_role_menu` VALUES ('15', '010506');
INSERT INTO `sys_role_menu` VALUES ('15', '010507');
INSERT INTO `sys_role_menu` VALUES ('15', '010508');
INSERT INTO `sys_role_menu` VALUES ('15', '010509');
INSERT INTO `sys_role_menu` VALUES ('15', '0106');
INSERT INTO `sys_role_menu` VALUES ('15', '010601');
INSERT INTO `sys_role_menu` VALUES ('15', '02');
INSERT INTO `sys_role_menu` VALUES ('15', '0201');
INSERT INTO `sys_role_menu` VALUES ('15', '0202');
INSERT INTO `sys_role_menu` VALUES ('15', '0203');
INSERT INTO `sys_role_menu` VALUES ('15', '0204');
INSERT INTO `sys_role_menu` VALUES ('15', '03');
INSERT INTO `sys_role_menu` VALUES ('15', '0301');
INSERT INTO `sys_role_menu` VALUES ('15', '0302');
INSERT INTO `sys_role_menu` VALUES ('15', '0303');
INSERT INTO `sys_role_menu` VALUES ('15', '0304');
INSERT INTO `sys_role_menu` VALUES ('15', '0305');
INSERT INTO `sys_role_menu` VALUES ('15', '0306');
INSERT INTO `sys_role_menu` VALUES ('15', '030600');
INSERT INTO `sys_role_menu` VALUES ('15', '030601');
INSERT INTO `sys_role_menu` VALUES ('15', '030602');
INSERT INTO `sys_role_menu` VALUES ('15', '030603');
INSERT INTO `sys_role_menu` VALUES ('15', '030604');
INSERT INTO `sys_role_menu` VALUES ('15', '030605');
INSERT INTO `sys_role_menu` VALUES ('15', '030606');
INSERT INTO `sys_role_menu` VALUES ('15', '0307');
INSERT INTO `sys_role_menu` VALUES ('15', '09');
INSERT INTO `sys_role_menu` VALUES ('15', '0902');
INSERT INTO `sys_role_menu` VALUES ('15', '0904');
INSERT INTO `sys_role_menu` VALUES ('15', '0905');
INSERT INTO `sys_role_menu` VALUES ('16', '01');
INSERT INTO `sys_role_menu` VALUES ('16', '0105');
INSERT INTO `sys_role_menu` VALUES ('16', '010501');
INSERT INTO `sys_role_menu` VALUES ('16', '010502');
INSERT INTO `sys_role_menu` VALUES ('16', '010504');
INSERT INTO `sys_role_menu` VALUES ('16', '010505');
INSERT INTO `sys_role_menu` VALUES ('16', '010506');
INSERT INTO `sys_role_menu` VALUES ('16', '010507');
INSERT INTO `sys_role_menu` VALUES ('16', '010508');
INSERT INTO `sys_role_menu` VALUES ('16', '010509');
INSERT INTO `sys_role_menu` VALUES ('16', '02');
INSERT INTO `sys_role_menu` VALUES ('16', '0201');
INSERT INTO `sys_role_menu` VALUES ('16', '0202');
INSERT INTO `sys_role_menu` VALUES ('16', '0203');
INSERT INTO `sys_role_menu` VALUES ('16', '0204');
INSERT INTO `sys_role_menu` VALUES ('16', '03');
INSERT INTO `sys_role_menu` VALUES ('16', '0301');
INSERT INTO `sys_role_menu` VALUES ('16', '0302');
INSERT INTO `sys_role_menu` VALUES ('16', '0303');
INSERT INTO `sys_role_menu` VALUES ('16', '0309');
INSERT INTO `sys_role_menu` VALUES ('16', '030901');
INSERT INTO `sys_role_menu` VALUES ('16', '030902');
INSERT INTO `sys_role_menu` VALUES ('16', '030903');
INSERT INTO `sys_role_menu` VALUES ('16', '030904');
INSERT INTO `sys_role_menu` VALUES ('17', '01');
INSERT INTO `sys_role_menu` VALUES ('17', '0103');
INSERT INTO `sys_role_menu` VALUES ('17', '010301');
INSERT INTO `sys_role_menu` VALUES ('17', '010302');
INSERT INTO `sys_role_menu` VALUES ('17', '010303');
INSERT INTO `sys_role_menu` VALUES ('17', '010304');
INSERT INTO `sys_role_menu` VALUES ('17', '010305');
INSERT INTO `sys_role_menu` VALUES ('18', '10');

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `role_id` bigint(20) unsigned DEFAULT NULL COMMENT '角色id',
  `permission_id` bigint(20) unsigned DEFAULT NULL COMMENT '权限id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC COMMENT='角色与权限关联表';

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------
INSERT INTO `sys_role_permission` VALUES ('1', '2', '1');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `username` varchar(50) DEFAULT NULL COMMENT '用户账号',
  `password` varchar(32) DEFAULT NULL COMMENT '密码',
  `state` varchar(32) DEFAULT NULL COMMENT '状态',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `user_level` int(4) DEFAULT '1' COMMENT '用户级别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC COMMENT='用户表';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('1', '管理员', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '01', '2014-07-17 12:59:08', '1');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `user_id` bigint(20) NOT NULL COMMENT '用户id',
  `role_id` bigint(20) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC COMMENT='用户与角色关联表';

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES ('1', '1');
INSERT INTO `sys_user_role` VALUES ('1', '2');
INSERT INTO `sys_user_role` VALUES ('1', '3');
INSERT INTO `sys_user_role` VALUES ('1', '4');
INSERT INTO `sys_user_role` VALUES ('1', '5');
INSERT INTO `sys_user_role` VALUES ('1', '6');
INSERT INTO `sys_user_role` VALUES ('1', '7');
INSERT INTO `sys_user_role` VALUES ('1', '8');
INSERT INTO `sys_user_role` VALUES ('1', '9');
INSERT INTO `sys_user_role` VALUES ('1', '10');
INSERT INTO `sys_user_role` VALUES ('1', '11');
INSERT INTO `sys_user_role` VALUES ('1', '12');
INSERT INTO `sys_user_role` VALUES ('1', '13');
INSERT INTO `sys_user_role` VALUES ('1', '14');
INSERT INTO `sys_user_role` VALUES ('1', '15');
INSERT INTO `sys_user_role` VALUES ('1', '16');
INSERT INTO `sys_user_role` VALUES ('2', '3');
INSERT INTO `sys_user_role` VALUES ('2', '4');
INSERT INTO `sys_user_role` VALUES ('2', '5');
INSERT INTO `sys_user_role` VALUES ('2', '6');
INSERT INTO `sys_user_role` VALUES ('2', '8');
INSERT INTO `sys_user_role` VALUES ('2', '9');
INSERT INTO `sys_user_role` VALUES ('2', '10');
INSERT INTO `sys_user_role` VALUES ('2', '11');
INSERT INTO `sys_user_role` VALUES ('2', '12');
INSERT INTO `sys_user_role` VALUES ('2', '13');
INSERT INTO `sys_user_role` VALUES ('2', '14');
INSERT INTO `sys_user_role` VALUES ('2', '15');
INSERT INTO `sys_user_role` VALUES ('3', '4');
INSERT INTO `sys_user_role` VALUES ('3', '8');
INSERT INTO `sys_user_role` VALUES ('3', '9');
INSERT INTO `sys_user_role` VALUES ('3', '10');
INSERT INTO `sys_user_role` VALUES ('4', '1');
INSERT INTO `sys_user_role` VALUES ('4', '2');
INSERT INTO `sys_user_role` VALUES ('4', '3');
INSERT INTO `sys_user_role` VALUES ('4', '4');
INSERT INTO `sys_user_role` VALUES ('4', '5');
INSERT INTO `sys_user_role` VALUES ('4', '8');
INSERT INTO `sys_user_role` VALUES ('4', '9');
INSERT INTO `sys_user_role` VALUES ('5', '4');
INSERT INTO `sys_user_role` VALUES ('5', '8');
INSERT INTO `sys_user_role` VALUES ('5', '10');
INSERT INTO `sys_user_role` VALUES ('6', '5');
INSERT INTO `sys_user_role` VALUES ('7', '6');
INSERT INTO `sys_user_role` VALUES ('8', '7');
INSERT INTO `sys_user_role` VALUES ('9', '4');
INSERT INTO `sys_user_role` VALUES ('9', '5');
INSERT INTO `sys_user_role` VALUES ('9', '8');
INSERT INTO `sys_user_role` VALUES ('9', '9');
INSERT INTO `sys_user_role` VALUES ('9', '10');
INSERT INTO `sys_user_role` VALUES ('10', '4');
INSERT INTO `sys_user_role` VALUES ('10', '5');
INSERT INTO `sys_user_role` VALUES ('10', '8');
INSERT INTO `sys_user_role` VALUES ('10', '9');
INSERT INTO `sys_user_role` VALUES ('10', '10');
INSERT INTO `sys_user_role` VALUES ('11', '4');
INSERT INTO `sys_user_role` VALUES ('11', '5');
INSERT INTO `sys_user_role` VALUES ('11', '8');
INSERT INTO `sys_user_role` VALUES ('11', '17');
INSERT INTO `sys_user_role` VALUES ('12', '5');
INSERT INTO `sys_user_role` VALUES ('12', '8');
INSERT INTO `sys_user_role` VALUES ('12', '12');
INSERT INTO `sys_user_role` VALUES ('13', '8');
INSERT INTO `sys_user_role` VALUES ('13', '16');
INSERT INTO `sys_user_role` VALUES ('14', '7');
INSERT INTO `sys_user_role` VALUES ('15', '7');
INSERT INTO `sys_user_role` VALUES ('16', '7');
INSERT INTO `sys_user_role` VALUES ('17', '7');
INSERT INTO `sys_user_role` VALUES ('18', '7');
INSERT INTO `sys_user_role` VALUES ('19', '5');
INSERT INTO `sys_user_role` VALUES ('19', '8');
INSERT INTO `sys_user_role` VALUES ('19', '10');
INSERT INTO `sys_user_role` VALUES ('20', '7');
INSERT INTO `sys_user_role` VALUES ('21', '7');
INSERT INTO `sys_user_role` VALUES ('22', '7');
INSERT INTO `sys_user_role` VALUES ('23', '3');
INSERT INTO `sys_user_role` VALUES ('23', '8');
INSERT INTO `sys_user_role` VALUES ('23', '17');
INSERT INTO `sys_user_role` VALUES ('24', '2');
INSERT INTO `sys_user_role` VALUES ('24', '3');
INSERT INTO `sys_user_role` VALUES ('24', '4');
INSERT INTO `sys_user_role` VALUES ('24', '5');
INSERT INTO `sys_user_role` VALUES ('24', '6');
INSERT INTO `sys_user_role` VALUES ('24', '8');
INSERT INTO `sys_user_role` VALUES ('24', '9');
INSERT INTO `sys_user_role` VALUES ('24', '10');
INSERT INTO `sys_user_role` VALUES ('24', '11');
INSERT INTO `sys_user_role` VALUES ('24', '12');
INSERT INTO `sys_user_role` VALUES ('24', '13');
INSERT INTO `sys_user_role` VALUES ('24', '14');
INSERT INTO `sys_user_role` VALUES ('24', '15');
INSERT INTO `sys_user_role` VALUES ('25', '7');
INSERT INTO `sys_user_role` VALUES ('26', '2');
INSERT INTO `sys_user_role` VALUES ('26', '3');
INSERT INTO `sys_user_role` VALUES ('26', '4');
INSERT INTO `sys_user_role` VALUES ('26', '5');
INSERT INTO `sys_user_role` VALUES ('26', '6');
INSERT INTO `sys_user_role` VALUES ('26', '7');
INSERT INTO `sys_user_role` VALUES ('26', '8');
INSERT INTO `sys_user_role` VALUES ('26', '9');
INSERT INTO `sys_user_role` VALUES ('26', '10');
INSERT INTO `sys_user_role` VALUES ('26', '11');
INSERT INTO `sys_user_role` VALUES ('26', '12');
INSERT INTO `sys_user_role` VALUES ('26', '13');
INSERT INTO `sys_user_role` VALUES ('26', '14');
INSERT INTO `sys_user_role` VALUES ('26', '15');
INSERT INTO `sys_user_role` VALUES ('27', '7');
INSERT INTO `sys_user_role` VALUES ('28', '7');
INSERT INTO `sys_user_role` VALUES ('29', '7');
INSERT INTO `sys_user_role` VALUES ('30', '7');
INSERT INTO `sys_user_role` VALUES ('31', '5');
INSERT INTO `sys_user_role` VALUES ('31', '8');
INSERT INTO `sys_user_role` VALUES ('32', '7');
INSERT INTO `sys_user_role` VALUES ('33', '7');
INSERT INTO `sys_user_role` VALUES ('34', '7');
INSERT INTO `sys_user_role` VALUES ('35', '7');
INSERT INTO `sys_user_role` VALUES ('36', '7');
INSERT INTO `sys_user_role` VALUES ('36', '8');
INSERT INTO `sys_user_role` VALUES ('37', '7');
INSERT INTO `sys_user_role` VALUES ('38', '7');
INSERT INTO `sys_user_role` VALUES ('39', '3');
INSERT INTO `sys_user_role` VALUES ('39', '4');
INSERT INTO `sys_user_role` VALUES ('39', '8');
INSERT INTO `sys_user_role` VALUES ('40', '3');
INSERT INTO `sys_user_role` VALUES ('40', '4');
INSERT INTO `sys_user_role` VALUES ('40', '8');
INSERT INTO `sys_user_role` VALUES ('40', '17');
INSERT INTO `sys_user_role` VALUES ('41', '15');
INSERT INTO `sys_user_role` VALUES ('42', '12');
INSERT INTO `sys_user_role` VALUES ('43', '12');
INSERT INTO `sys_user_role` VALUES ('44', '7');
INSERT INTO `sys_user_role` VALUES ('45', '7');
INSERT INTO `sys_user_role` VALUES ('46', '7');
INSERT INTO `sys_user_role` VALUES ('47', '7');
INSERT INTO `sys_user_role` VALUES ('48', '7');
INSERT INTO `sys_user_role` VALUES ('49', '7');
INSERT INTO `sys_user_role` VALUES ('50', '7');
INSERT INTO `sys_user_role` VALUES ('51', '11');
INSERT INTO `sys_user_role` VALUES ('52', '7');
INSERT INTO `sys_user_role` VALUES ('52', '10');
INSERT INTO `sys_user_role` VALUES ('53', '7');
INSERT INTO `sys_user_role` VALUES ('54', '7');
INSERT INTO `sys_user_role` VALUES ('55', '7');
INSERT INTO `sys_user_role` VALUES ('56', '7');
INSERT INTO `sys_user_role` VALUES ('57', '7');
INSERT INTO `sys_user_role` VALUES ('58', '4');
INSERT INTO `sys_user_role` VALUES ('58', '8');
INSERT INTO `sys_user_role` VALUES ('59', '12');
INSERT INTO `sys_user_role` VALUES ('60', '12');
INSERT INTO `sys_user_role` VALUES ('61', '12');
INSERT INTO `sys_user_role` VALUES ('62', '12');
INSERT INTO `sys_user_role` VALUES ('63', '12');
INSERT INTO `sys_user_role` VALUES ('64', '12');
INSERT INTO `sys_user_role` VALUES ('65', '12');
INSERT INTO `sys_user_role` VALUES ('66', '7');
INSERT INTO `sys_user_role` VALUES ('67', '7');
INSERT INTO `sys_user_role` VALUES ('68', '3');
INSERT INTO `sys_user_role` VALUES ('68', '4');
INSERT INTO `sys_user_role` VALUES ('68', '5');
INSERT INTO `sys_user_role` VALUES ('68', '6');
INSERT INTO `sys_user_role` VALUES ('68', '8');
INSERT INTO `sys_user_role` VALUES ('68', '9');
INSERT INTO `sys_user_role` VALUES ('68', '10');
INSERT INTO `sys_user_role` VALUES ('68', '11');
INSERT INTO `sys_user_role` VALUES ('68', '12');
INSERT INTO `sys_user_role` VALUES ('68', '13');
INSERT INTO `sys_user_role` VALUES ('68', '14');
INSERT INTO `sys_user_role` VALUES ('68', '15');
INSERT INTO `sys_user_role` VALUES ('69', '15');
INSERT INTO `sys_user_role` VALUES ('70', '7');
INSERT INTO `sys_user_role` VALUES ('71', '7');
INSERT INTO `sys_user_role` VALUES ('72', '12');
INSERT INTO `sys_user_role` VALUES ('73', '5');
INSERT INTO `sys_user_role` VALUES ('73', '8');
INSERT INTO `sys_user_role` VALUES ('74', '12');
INSERT INTO `sys_user_role` VALUES ('75', '12');
INSERT INTO `sys_user_role` VALUES ('76', '8');
INSERT INTO `sys_user_role` VALUES ('77', '8');
INSERT INTO `sys_user_role` VALUES ('78', '8');
INSERT INTO `sys_user_role` VALUES ('79', '12');
INSERT INTO `sys_user_role` VALUES ('80', '12');
INSERT INTO `sys_user_role` VALUES ('81', '12');
INSERT INTO `sys_user_role` VALUES ('82', '12');
INSERT INTO `sys_user_role` VALUES ('83', '7');
INSERT INTO `sys_user_role` VALUES ('84', '7');
INSERT INTO `sys_user_role` VALUES ('85', '7');
INSERT INTO `sys_user_role` VALUES ('86', '7');
INSERT INTO `sys_user_role` VALUES ('87', '7');
INSERT INTO `sys_user_role` VALUES ('88', '7');
INSERT INTO `sys_user_role` VALUES ('89', '7');
INSERT INTO `sys_user_role` VALUES ('90', '15');
INSERT INTO `sys_user_role` VALUES ('91', '4');
INSERT INTO `sys_user_role` VALUES ('91', '5');
INSERT INTO `sys_user_role` VALUES ('91', '7');
INSERT INTO `sys_user_role` VALUES ('91', '8');
INSERT INTO `sys_user_role` VALUES ('91', '12');
INSERT INTO `sys_user_role` VALUES ('91', '13');
INSERT INTO `sys_user_role` VALUES ('91', '16');
INSERT INTO `sys_user_role` VALUES ('91', '18');
INSERT INTO `sys_user_role` VALUES ('92', '4');
INSERT INTO `sys_user_role` VALUES ('92', '5');
INSERT INTO `sys_user_role` VALUES ('92', '8');
INSERT INTO `sys_user_role` VALUES ('92', '10');
INSERT INTO `sys_user_role` VALUES ('93', '4');
INSERT INTO `sys_user_role` VALUES ('93', '8');
INSERT INTO `sys_user_role` VALUES ('93', '10');
INSERT INTO `sys_user_role` VALUES ('93', '13');
INSERT INTO `sys_user_role` VALUES ('94', '7');
INSERT INTO `sys_user_role` VALUES ('95', '2');
INSERT INTO `sys_user_role` VALUES ('95', '3');
INSERT INTO `sys_user_role` VALUES ('95', '4');
INSERT INTO `sys_user_role` VALUES ('95', '5');
INSERT INTO `sys_user_role` VALUES ('95', '6');
INSERT INTO `sys_user_role` VALUES ('95', '8');
INSERT INTO `sys_user_role` VALUES ('95', '9');
INSERT INTO `sys_user_role` VALUES ('95', '10');
INSERT INTO `sys_user_role` VALUES ('95', '11');
INSERT INTO `sys_user_role` VALUES ('95', '12');
INSERT INTO `sys_user_role` VALUES ('95', '13');
INSERT INTO `sys_user_role` VALUES ('95', '14');
INSERT INTO `sys_user_role` VALUES ('95', '15');
INSERT INTO `sys_user_role` VALUES ('96', '7');
INSERT INTO `sys_user_role` VALUES ('96', '16');
INSERT INTO `sys_user_role` VALUES ('97', '7');
INSERT INTO `sys_user_role` VALUES ('97', '12');
INSERT INTO `sys_user_role` VALUES ('98', '7');
INSERT INTO `sys_user_role` VALUES ('99', '7');
INSERT INTO `sys_user_role` VALUES ('100', '5');
INSERT INTO `sys_user_role` VALUES ('100', '8');
INSERT INTO `sys_user_role` VALUES ('101', '3');
INSERT INTO `sys_user_role` VALUES ('101', '4');
INSERT INTO `sys_user_role` VALUES ('101', '5');
INSERT INTO `sys_user_role` VALUES ('101', '6');
INSERT INTO `sys_user_role` VALUES ('101', '8');
INSERT INTO `sys_user_role` VALUES ('101', '9');
INSERT INTO `sys_user_role` VALUES ('101', '10');
INSERT INTO `sys_user_role` VALUES ('101', '11');
INSERT INTO `sys_user_role` VALUES ('101', '12');
INSERT INTO `sys_user_role` VALUES ('101', '13');
INSERT INTO `sys_user_role` VALUES ('101', '14');
INSERT INTO `sys_user_role` VALUES ('101', '15');
INSERT INTO `sys_user_role` VALUES ('102', '7');
INSERT INTO `sys_user_role` VALUES ('103', '7');
INSERT INTO `sys_user_role` VALUES ('103', '12');
INSERT INTO `sys_user_role` VALUES ('104', '7');
INSERT INTO `sys_user_role` VALUES ('105', '8');
INSERT INTO `sys_user_role` VALUES ('106', '7');
INSERT INTO `sys_user_role` VALUES ('106', '16');
INSERT INTO `sys_user_role` VALUES ('107', '7');
INSERT INTO `sys_user_role` VALUES ('108', '3');
INSERT INTO `sys_user_role` VALUES ('108', '4');
INSERT INTO `sys_user_role` VALUES ('108', '5');
INSERT INTO `sys_user_role` VALUES ('108', '6');
INSERT INTO `sys_user_role` VALUES ('108', '8');
INSERT INTO `sys_user_role` VALUES ('108', '9');
INSERT INTO `sys_user_role` VALUES ('108', '10');
INSERT INTO `sys_user_role` VALUES ('108', '11');
INSERT INTO `sys_user_role` VALUES ('108', '12');
INSERT INTO `sys_user_role` VALUES ('108', '13');
INSERT INTO `sys_user_role` VALUES ('108', '14');
INSERT INTO `sys_user_role` VALUES ('108', '15');
INSERT INTO `sys_user_role` VALUES ('109', '4');
INSERT INTO `sys_user_role` VALUES ('109', '8');
INSERT INTO `sys_user_role` VALUES ('109', '10');
INSERT INTO `sys_user_role` VALUES ('109', '13');
INSERT INTO `sys_user_role` VALUES ('110', '4');
INSERT INTO `sys_user_role` VALUES ('110', '8');
INSERT INTO `sys_user_role` VALUES ('110', '10');
INSERT INTO `sys_user_role` VALUES ('110', '13');
INSERT INTO `sys_user_role` VALUES ('111', '7');
INSERT INTO `sys_user_role` VALUES ('111', '16');
INSERT INTO `sys_user_role` VALUES ('112', '7');
INSERT INTO `sys_user_role` VALUES ('113', '4');
INSERT INTO `sys_user_role` VALUES ('113', '5');
INSERT INTO `sys_user_role` VALUES ('113', '8');
INSERT INTO `sys_user_role` VALUES ('113', '10');
INSERT INTO `sys_user_role` VALUES ('113', '14');
INSERT INTO `sys_user_role` VALUES ('114', '2');
INSERT INTO `sys_user_role` VALUES ('114', '3');
INSERT INTO `sys_user_role` VALUES ('114', '4');
INSERT INTO `sys_user_role` VALUES ('114', '5');
INSERT INTO `sys_user_role` VALUES ('114', '6');
INSERT INTO `sys_user_role` VALUES ('114', '8');
INSERT INTO `sys_user_role` VALUES ('114', '9');
INSERT INTO `sys_user_role` VALUES ('114', '10');
INSERT INTO `sys_user_role` VALUES ('114', '11');
INSERT INTO `sys_user_role` VALUES ('114', '12');
INSERT INTO `sys_user_role` VALUES ('114', '13');
INSERT INTO `sys_user_role` VALUES ('114', '14');
INSERT INTO `sys_user_role` VALUES ('114', '15');
INSERT INTO `sys_user_role` VALUES ('115', '3');
INSERT INTO `sys_user_role` VALUES ('115', '5');
INSERT INTO `sys_user_role` VALUES ('115', '15');
INSERT INTO `sys_user_role` VALUES ('116', '1');
INSERT INTO `sys_user_role` VALUES ('116', '2');
INSERT INTO `sys_user_role` VALUES ('116', '3');
INSERT INTO `sys_user_role` VALUES ('116', '4');
INSERT INTO `sys_user_role` VALUES ('116', '5');
INSERT INTO `sys_user_role` VALUES ('116', '6');
INSERT INTO `sys_user_role` VALUES ('116', '8');
INSERT INTO `sys_user_role` VALUES ('116', '9');
INSERT INTO `sys_user_role` VALUES ('116', '10');
INSERT INTO `sys_user_role` VALUES ('116', '11');
INSERT INTO `sys_user_role` VALUES ('116', '12');
INSERT INTO `sys_user_role` VALUES ('116', '13');
INSERT INTO `sys_user_role` VALUES ('116', '14');
INSERT INTO `sys_user_role` VALUES ('116', '15');
INSERT INTO `sys_user_role` VALUES ('117', '9');
INSERT INTO `sys_user_role` VALUES ('118', '4');
INSERT INTO `sys_user_role` VALUES ('118', '8');
INSERT INTO `sys_user_role` VALUES ('119', '4');
INSERT INTO `sys_user_role` VALUES ('119', '8');
INSERT INTO `sys_user_role` VALUES ('120', '4');
INSERT INTO `sys_user_role` VALUES ('120', '5');
INSERT INTO `sys_user_role` VALUES ('121', '7');
INSERT INTO `sys_user_role` VALUES ('121', '12');
INSERT INTO `sys_user_role` VALUES ('122', '7');
INSERT INTO `sys_user_role` VALUES ('123', '3');
INSERT INTO `sys_user_role` VALUES ('123', '17');
INSERT INTO `sys_user_role` VALUES ('124', '8');
INSERT INTO `sys_user_role` VALUES ('124', '17');
INSERT INTO `sys_user_role` VALUES ('125', '7');
INSERT INTO `sys_user_role` VALUES ('126', '17');
INSERT INTO `sys_user_role` VALUES ('127', '7');
INSERT INTO `sys_user_role` VALUES ('127', '8');
INSERT INTO `sys_user_role` VALUES ('127', '16');
INSERT INTO `sys_user_role` VALUES ('128', '7');
INSERT INTO `sys_user_role` VALUES ('129', '8');
INSERT INTO `sys_user_role` VALUES ('130', '8');
INSERT INTO `sys_user_role` VALUES ('131', '18');
INSERT INTO `sys_user_role` VALUES ('132', '7');
INSERT INTO `sys_user_role` VALUES ('133', '15');
INSERT INTO `sys_user_role` VALUES ('134', '4');
INSERT INTO `sys_user_role` VALUES ('134', '13');
INSERT INTO `sys_user_role` VALUES ('134', '16');
INSERT INTO `sys_user_role` VALUES ('135', '7');
INSERT INTO `sys_user_role` VALUES ('135', '16');
INSERT INTO `sys_user_role` VALUES ('136', '7');
INSERT INTO `sys_user_role` VALUES ('137', '7');
INSERT INTO `sys_user_role` VALUES ('138', '7');
INSERT INTO `sys_user_role` VALUES ('139', '4');
INSERT INTO `sys_user_role` VALUES ('140', '4');
INSERT INTO `sys_user_role` VALUES ('141', '7');

-- ----------------------------
-- Table structure for visit_ip_sta
-- ----------------------------
DROP TABLE IF EXISTS `visit_ip_sta`;
CREATE TABLE `visit_ip_sta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(256) DEFAULT NULL,
  `ip` varchar(64) NOT NULL,
  `count` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='访问ip统计';

-- ----------------------------
-- Records of visit_ip_sta
-- ----------------------------

-- ----------------------------
-- Table structure for visit_user_sta
-- ----------------------------
DROP TABLE IF EXISTS `visit_user_sta`;
CREATE TABLE `visit_user_sta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(128) NOT NULL,
  `url` varchar(128) NOT NULL,
  `params` varchar(128) DEFAULT NULL,
  `ip` varchar(128) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8 COMMENT='访问用户统计';

-- ----------------------------
-- Records of visit_user_sta
-- ----------------------------
INSERT INTO `visit_user_sta` VALUES ('67', '管理员', 'localhost:8092/SpringMyBatisDemo/', null, '127.0.0.1', '3');
INSERT INTO `visit_user_sta` VALUES ('68', '管理员', 'localhost:8092/SpringMyBatisDemo/user/manager', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('69', '管理员', 'localhost:8092/SpringMyBatisDemo/user/userLevel', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('70', '管理员', 'localhost:8092/SpringMyBatisDemo/sys/role/all', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('71', '管理员', 'localhost:8092/SpringMyBatisDemo/user/pager', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('72', '管理员', 'localhost:8092/SpringMyBatisDemo/sys/menu/index', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('73', '管理员', 'localhost:8092/SpringMyBatisDemo/sys/menu/pager', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('74', '管理员', 'localhost:8092/SpringMyBatisDemo/sys/role/index', null, '127.0.0.1', '2');
INSERT INTO `visit_user_sta` VALUES ('75', '管理员', 'localhost:8092/SpringMyBatisDemo/sys/role/pager', null, '127.0.0.1', '2');
INSERT INTO `visit_user_sta` VALUES ('76', '管理员', 'localhost:8092/SpringMyBatisDemo/code/index', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('77', '管理员', 'localhost:8092/SpringMyBatisDemo/code/pager', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('78', '管理员', 'localhost:8092/SpringMyBatisDemo/area/index', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('79', '管理员', 'localhost:8092/SpringMyBatisDemo/area/pager', null, '127.0.0.1', '1');
INSERT INTO `visit_user_sta` VALUES ('80', '管理员', 'localhost:8086/', null, '127.0.0.1', '2');
INSERT INTO `visit_user_sta` VALUES ('81', '管理员', 'localhost:8086/user/logout', null, '127.0.0.1', '1');
