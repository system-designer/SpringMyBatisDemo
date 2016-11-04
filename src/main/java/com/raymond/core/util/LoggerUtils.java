package com.raymond.core.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 获取Log4j日志记录工具 <br/>
 * <p/>
 * 对应配置文件 log4j.properties <br/>
 * 维护平台日志分类<br/>
 * ---基础数据操作日志  universe-operate<br/>
 * ---版本发布日志  universe-vp<br/>
 * ---站点操作日志（存文件）<br/>
 * ---一般日志   universe<br/>
 * ---任务操作日志 universe-task<br/>
 * ---定时任务日志 universe-schedule<br/>
 * 日志路径 : /home/logs or /logs<br/>
 *
 * 可以通过 : (
 * 1.recordOperate <br/>
 * 2.recordVersion <br/>
 * 3.recordTask <br/>
 * 4.recordSchedule <br/>)
 * 四种方法进行相对应的日志记录
 *
 * @author cxhuan 20160616111801
 */
public class LoggerUtils {

    /** 基础数据操作日志 */
    public final static String LOG_CATEGORY_OPERATE = "operate";

    /** 版本发布日志 */
    public final static String LOG_CATEGORY_VP = "vp";

    /** 任务操作日志 */
    public final static String LOG_CATEGORY_TASK = "task";

    /** 定时任务日志 */
    public final static String LOG_CATEGORY_SCHEDULE = "schedule";

    /** 根据 debug 类型进行日志记录 */
    public final static String LOG_TYPE_DEBUG = "debug";

    /** 根据 info 类型进行日志记录 */
    public final static String LOG_TYPE_INFO = "info";

    /** 根据 warn 类型进行日志记录 */
    public final static String LOG_TYPE_WARN = "warn";

    /** 根据 error 类型进行日志记录 */
    public final static String LOG_TYPE_ERROR = "error";

    /** 私有化 */
    private LoggerUtils() {
        super();
    }

    /** 基础数据 */
    private static final Logger OPERATE = LoggerFactory.getLogger(LOG_CATEGORY_OPERATE);

    /** 版本发布 */
    private static final Logger VP = LoggerFactory.getLogger(LOG_CATEGORY_VP);

    /** 任务操作 */
    private static final Logger TASK = LoggerFactory.getLogger(LOG_CATEGORY_TASK);

    /** 定时任务 */
    private static final Logger SCHEDULE = LoggerFactory.getLogger(LOG_CATEGORY_SCHEDULE);

    /** 获取'基础数据'操作日志Logger对象 */
    public static Logger getOperateLogger() {
        return LoggerFactory.getLogger(LOG_CATEGORY_OPERATE);
    }

    /** 获取'版本发布'日志Logger对象 */
    public static Logger getVpLogger() {
        return LoggerFactory.getLogger(LOG_CATEGORY_VP);
    }

    /** 获取'任务操作'日志Logger对象 */
    public static Logger getTaskLogger() {
        return LoggerFactory.getLogger(LOG_CATEGORY_TASK);
    }

    /** 获取'定时任务'日志Logger对象 */
    public static Logger getScheduleLogger() {
        return LoggerFactory.getLogger(LOG_CATEGORY_SCHEDULE);
    }



    /**
     * 记录 '基础数据操作日志'
     *
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) message <br/>
     *             recordOperate("测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试开始.....xxx <br/>
     */
    public static void recordOperate(String message) {
        recordOperate("", message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '基础数据操作日志'
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordOperate(String head, String message) {
        recordOperate(head, message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '基础数据操作日志' 带类型
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息
     * @param type 日志类型 如下:(<br/>
     *   > LOG_TYPE_DEBUG - debug <br/>
     *   > LOG_TYPE_INFO  - info <br/>
     *   > LOG_TYPE_WARN  - warn <br/>
     *   > LOG_TYPE_ERROR - error )<br/>
     * <p>参考如下</p>
     * [type] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx",LoggerUtils.LOG_TYPE_INFO) <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordOperate(String head, String message, String type) {
        recordLog(OPERATE, head, message, type);
    }

    /**
     * 记录 '版本发布信息'
     *
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) message <br/>
     *             recordOperate("测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试开始.....xxx <br/>
     */
    public static void recordVersion(String message) {
        recordVersion("", message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '版本发布信息'
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordVersion(String head, String message) {
        recordVersion(head, message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '版本发布信息'
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息
     * @param type 日志类型 如下:(<br/>
     *   > LOG_TYPE_DEBUG - debug <br/>
     *   > LOG_TYPE_INFO  - info <br/>
     *   > LOG_TYPE_WARN  - warn <br/>
     *   > LOG_TYPE_ERROR - error )<br/>
     * <p>参考如下</p>
     * [type] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx",LoggerUtils.LOG_TYPE_INFO) <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordVersion(String head, String message, String type) {
        recordLog(VP, head, message, type);
    }

    /**
     * 记录 '任务操作' 信息 <br/>
     *
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) message <br/>
     *             recordOperate("测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试开始.....xxx <br/>
     */
    public static void recordTask(String message) {
        recordTask("", message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '任务操作' 信息 <br/>
     *
     * (默认记录INFO类型,如果需要记录为其他类型,推荐使用recordTask(String head, String message, String type)方法)<br/>
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordTask(String head, String message) {
        recordTask(head, message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '任务操作' 信息
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息
     * @param type 日志类型 如下:(<br/>
     *   > LOG_TYPE_DEBUG - debug <br/>
     *   > LOG_TYPE_INFO  - info <br/>
     *   > LOG_TYPE_WARN  - warn <br/>
     *   > LOG_TYPE_ERROR - error )<br/>
     * <p>参考如下</p>
     * [type] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx",LoggerUtils.LOG_TYPE_INFO) <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordTask(String head, String message, String type) {
        recordLog(TASK, head, message, type);
    }

    /**
     * 记录 '定时任务' 信息
     *
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) message <br/>
     *             recordOperate("测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试开始.....xxx <br/>
     */
    public static void recordSchedule(String message) {
        recordSchedule("", message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '定时任务' 信息
     *
     * (默认记录INFO类型,如果需要记录为其他类型,推荐使用recordTask(String head, String message, String type)方法)<br/>
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息 <br/>
     * [INFO] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx") <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordSchedule(String head, String message) {
        recordSchedule(head, message, LOG_TYPE_INFO);
    }

    /**
     * 记录 '定时任务' 信息
     *
     * @param head 日志抬头,推荐使用 LoggerUtils.getTitle方法作为日志抬头
     * @param message 记录信息
     * @param type 日志类型 如下:(<br/>
     *   > LOG_TYPE_DEBUG - debug <br/>
     *   > LOG_TYPE_INFO  - info <br/>
     *   > LOG_TYPE_WARN  - warn <br/>
     *   > LOG_TYPE_ERROR - error )<br/>
     * <p>参考如下</p>
     * [type] (自动生成的时间) head : message <br/>
     *             recordOperate("测试","测试开始.....xxx",LoggerUtils.LOG_TYPE_INFO) <br/>
     * [INFO] 2016-6-17 09:43:37 测试 : 测试开始.....xxx <br/>
     */
    public static void recordSchedule(String head, String message, String type) {
        recordLog(SCHEDULE, head, message, type);
    }

    /**
     * 获取日志 抬头信息(记录戳) <br/>
     * 获得调用者的信息 如: "类名@(文件名:方法名:行号)" <br/>
     *
     * @return "test.service.junit4.rt.manage.TestCityServiceTest@(TestCityServiceTest.java:myTest:71)"
     */
    public static String getHead() {
        StringBuilder sb = new StringBuilder();
        StackTraceElement[] stacks = new Throwable().getStackTrace();
        sb.append(stacks[1].getClassName())
                .append("@(").append(stacks[1].getFileName())
                .append(":").append(stacks[1].getMethodName())
                .append(":").append(stacks[1].getLineNumber())
                .append(") : ");
        return sb.toString();
    }

    /**
     * 根据参数类型分别记录日志到对应文件
     * @param logger  日志对象
     *                根据log4j配置文件确定数据存到哪个文件下
     * @param head   标题
     * @param message 记录信息
     * @param type    日志类型
     *
     * <p>[type] (自动生成时间) head message</p>
     */
    public static void recordLog(Logger logger, String head, String message, String type) {
        switch(type){
            case LOG_TYPE_DEBUG : logger.debug(head + " " + message); break;
            case LOG_TYPE_INFO  : logger.info(head + " " + message);  break;
            case LOG_TYPE_WARN  : logger.warn(head + " " + message);  break;
            case LOG_TYPE_ERROR : logger.error(head + " " + message); break;
                default: logger.info(head + " " + message);
        }
    }
}
