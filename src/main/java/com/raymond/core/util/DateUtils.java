package com.raymond.core.util;

import com.raymond.core.exception.MyException;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 时间工具类
 * @author chen_zx
 *
 */
public class DateUtils {
	/** 缺省日期格式 */
	public static final String DEFAULT_DATE_FORMAT = "yyyyMMdd";
	/** 缺省日期格式 */
	public static final String DEFAULT_DATE_FORMAT2 = "yyyy-MM-dd";
	/** 缺省时间格式 */
	public static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";

	/** 缺省月格式 */
	public static final String DEFAULT_MONTH = "MONTH";

	/** 缺省年格式 */
	public static final String DEFAULT_YEAR = "YEAR";

	/** 缺省日格式 */
	public static final String DEFAULT_DATE = "DAY";
	public static final String DEFAULT_HOUR = "HOUR";
	public static final String DEFAULT_MINUTE = "MINUTE";
	public static final String DEFAULT_SECOND = "SECOND";
	/** 缺省长日期格式 */
	public static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	/** 缺省长日期格式,精确到秒 */
	public static final String DEFAULT_DATETIME_FORMAT_SEC = "yyyyMMdd HH:mm:ss";

	/**
	 * 取当前日期
	 * 
	 * @return 当前日期的字符串 ,如20021212
	 */
	public static String today_Min() {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATE_FORMAT);
		java.util.Date currentTime_1 = new java.util.Date();
		String dateString = formatter.format(currentTime_1);
		return dateString;
	}

	/**
	 * 取当前日期
	 * 
	 * @return 当前日期的字符串 ,如2002-12-12
	 */
	public static String today_Min_() {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATE_FORMAT2);
		java.util.Date currentTime_1 = new java.util.Date();
		String dateString = formatter.format(currentTime_1);
		return dateString;
	}

	/**
	 * 取当前日期
	 * 
	 * @return 当前日期的字符，格式为“yyyy-MM-dd HH:mm:ss”
	 */
	public static String today() {

		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATETIME_FORMAT);
		java.util.Date currentTime_1 = new java.util.Date();
		String dateString = formatter.format(currentTime_1);
		return dateString;

	}

	/**
	 * 格式化日期，输入格式为“yyyy-MM-dd HH：mm：ss”
	 * 
	 * @param str
	 * @return 返回格式为“yyyyMMdd HH：mm：ss”
	 * 
	 */
	@SuppressWarnings("deprecation")
	public static String formatDateForSave(String str) {
		Date today = new Date();
		if (str == null || "".equals(str)) {
			return str;
		}
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATETIME_FORMAT_SEC);
		try {
			// 将日期和时间分开
			String[] strs = str.split(" ");
			// 解析日期，得到年、月、日
			String[] str1 = strs[0].split("-");
			int year = Integer.parseInt(str1[0]);
			int month = Integer.parseInt(str1[1]);
			int day = Integer.parseInt(str1[2]);
			// 解析时间，得到时、分、秒
			String[] str2 = strs[1].split(":");
			int hour = Integer.parseInt(str2[0]);
			int min = Integer.parseInt(str2[1]);
			int second = Integer.parseInt(str2[2]);

			Date date = new Date(year - 1900, month - 1, day, hour, min, second);
			java.util.Date currentTime_1 = date;
			return formatter.format(currentTime_1);
		} catch (Exception e) {
			System.out.println("日期格式不为yyyy-mm-dd hh：mm：ss，无法解析");
			// e.printStackTrace();
			return formatter.format(today);
		}
	}

	@SuppressWarnings("deprecation")
	public static String formatMinDateForSave(String str) {
		Date today = new Date();
		if (str == null || "".equals(str)) {
			return str;
		}
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATE_FORMAT);
		try {
			// 解析日期，得到年、月、日
			String[] str1 = str.split("-");
			// System.out.println(str);
			int year = 1;
			if (str1[0] != null)
				year = Integer.parseInt(str1[0]);
			int month = 1;
			if (str1[1] != null)
				month = Integer.parseInt(str1[1]);
			int day = 1;
			if (str1[2] != null)
				day = Integer.parseInt(str1[2]);

			Date date = new Date(year - 1900, month - 1, day, 0, 0, 0);
			java.util.Date currentTime_1 = date;
			return formatter.format(currentTime_1);
		} catch (Exception e) {
			System.out.println("日期格式不为yyyy-mm-dd，无法解析");
			// e.printStackTrace();
			return formatter.format(today);
		}
	}

	public static String formatQuery(String queryDate) {

		String str[] = queryDate.split("-");
		String year = str[0];
		String month = str[1];
		String day = str[2];

		return year + month + day;

	}

	public static String formatShow(String queryDate) {

		String year = queryDate.substring(0, 4);
		year = year + "-";
		String month = queryDate.substring(4, 6);
		month = month + "-";
		String day = queryDate.substring(6, 8);

		return year + month + day;

	}

	public static String formatMinDateForShowWith_(String str) {
		String res = "";
		try {
			if (str.length() >= 4) {
				res += str.substring(0, 4);
			}
			if (str.length() >= 6) {
				res += "-" + Integer.parseInt(str.substring(4, 6));
			}
			if (str.length() >= 8) {
				res += "-" + Integer.parseInt(str.substring(6, 8));
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}
		return res;
	}

	public static String today(String strFormat) {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(strFormat);
		java.util.Date currentTime_1 = new java.util.Date();
		String dateString = formatter.format(currentTime_1);
		return dateString;
	}

	/**
	 * 取当前时间,
	 * 
	 * @return 当前时间,如:21:10:12
	 */
	public static String time() {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_TIME_FORMAT);
		java.util.Date currentTime_1 = new java.util.Date();
		String dateString = formatter.format(currentTime_1);
		return dateString;
	}

	/**
	 * 取当前时间,规定格式
	 * 
	 * @param strFormat 输出格式,如'hh:mm:ss'
	 * @return 当前时间,如:21:10:12
	 */

	public static String time(String strFormat) {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(strFormat);
		java.util.Date currentTime_1 = new java.util.Date();
		String dateString = formatter.format(currentTime_1);
		return dateString;
	}

	/**
	 * 取得相对于当前时间增加天数/月数/年数后的日期 <br>
	 * 欲取得当前日期5天前的日期,可做如下调用:<br>
	 * getAddDay("DATE", -5).
	 * 
	 * @param field,段,如"year","month","date",对大小写不敏感
	 * @param amount,增加的数量(减少用负数表示),如5,-1
	 * @return 格式化后的字符串 如"2000-02-01"
	 */

	public static String getAddDay(String field, int amount) {
		// 当前日期和前一天
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATETIME_FORMAT_SEC);

		Calendar rightNow = Calendar.getInstance();
		int intField = 0;
		String tmpField = field.toUpperCase();

		intField = Calendar.DATE;
		if (tmpField.equals(DEFAULT_YEAR))
			intField = Calendar.YEAR;
		if (tmpField.equals(DEFAULT_MONTH))
			intField = Calendar.MONTH;
		if (tmpField.equals(DEFAULT_DATE))
			intField = Calendar.DATE;
		if (tmpField.equals(DEFAULT_HOUR))
			intField = Calendar.HOUR;
		if (tmpField.equals(DEFAULT_MINUTE))
			intField = Calendar.MINUTE;
		if (tmpField.equals(DEFAULT_SECOND))
			intField = Calendar.SECOND;

		rightNow.add(intField, amount);
		String day = formatter.format(rightNow.getTime());
		return day;
	}

	/**
	 * 取得相对于当前时间增加天数/月数/年数后的日期,按指定格式输出
	 * 
	 * 欲取得当前日期5天前的日期,可做如下调用:<br>
	 * getAddDay("DATE", -5,'yyyy-mm-dd hh:mm').
	 * 
	 * @param field,段,如"year","month","date",对大小写不敏感
	 * @param amount,增加的数量(减少用负数表示),如5,-1
	 * @param strFormat,输出格式,如"yyyy-mm-dd","yyyy-mm-dd
	 *            hh:mm"
	 * @return 格式化后的字符串 如"2000-02-01"
	 */
	public static String getAddDay(String field, int amount, String strFormat) {
		// 当前日期和前一天
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(strFormat);

		Calendar rightNow = Calendar.getInstance();
		int intField = 0;
		String tmpField = field.toUpperCase();

		intField = Calendar.DATE;
		if (tmpField.equals(DEFAULT_YEAR))
			intField = Calendar.YEAR;
		if (tmpField.equals(DEFAULT_MONTH))
			intField = Calendar.MONTH;
		if (tmpField.equals(DEFAULT_DATE))
			intField = Calendar.DATE;
		if (tmpField.equals(DEFAULT_HOUR))
			intField = Calendar.HOUR;
		if (tmpField.equals(DEFAULT_MINUTE))
			intField = Calendar.MINUTE;
		if (tmpField.equals(DEFAULT_SECOND))
			intField = Calendar.SECOND;

		rightNow.add(intField, amount);
		String day = formatter.format(rightNow.getTime());
		return day;
	}

	/**
	 * 功能：对于给定的时间增加天数/月数/年数后的日期,按指定格式输出
	 * 
	 * @param date
	 *            String 要改变的日期
	 * @param field
	 *            int 日期改变的字段，YEAR,MONTH,DAY
	 * @param amount
	 *            int改变量
	 * @param strFormat
	 *            日期返回格式
	 * @return
	 * @throws ParseException
	 * @author caohongbin
	 */
	public static String getAddDay(String date, String field, int amount, String strFormat) throws ParseException {
		// 当前日期和前一天
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(strFormat);

		Calendar rightNow = Calendar.getInstance();
		Date tempdate = formatter.parse(date);
		rightNow.setTime(tempdate);

		int intField = 0;
		String tmpField = field.toUpperCase();

		intField = Calendar.DATE;
		if (tmpField.equals(DEFAULT_YEAR))
			intField = Calendar.YEAR;
		if (tmpField.equals(DEFAULT_MONTH))
			intField = Calendar.MONTH;
		if (tmpField.equals(DEFAULT_DATE))
			intField = Calendar.DATE;
		if (tmpField.equals(DEFAULT_HOUR))
			intField = Calendar.HOUR;
		if (tmpField.equals(DEFAULT_MINUTE))
			intField = Calendar.MINUTE;
		if (tmpField.equals(DEFAULT_SECOND))
			intField = Calendar.SECOND;

		rightNow.add(intField, amount);
		String day = formatter.format(rightNow.getTime());
		return day;
	}

	/**
	 * 得到两个日期之间的日期列表
	 *
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public static List<String> getBetweenDates(String startDate, String endDate) {
		SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATE_FORMAT2);
		List<String> dates = new ArrayList<>();
		try {
			Date endDate_ = formatter.parse(endDate);
			Calendar calendar = new GregorianCalendar();
			calendar.setTime(formatter.parse(startDate));
			while (calendar.getTime().before(endDate_)) {
				Date result = calendar.getTime();
				dates.add(formatter.format(result));
				calendar.add(Calendar.DATE, 1);
			}
			dates.add(endDate);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return dates;
	}

	/**
	 * Timestamp按照指定格式转为字符串
	 * 
	 * @param ts
	 *            源对象
	 * @param sFormat
	 *            ps（如yyyy.mm.dd）
	 * @return 如：2003-01-01 或2003-01-01 13:21
	 */
	public static String toString(Timestamp ts, String sFormat) {
		if (ts == null) {
			return "";
		}
		java.util.Date d = new java.util.Date(ts.getTime());
		return toString(d, sFormat);
	}

	/**
	 * Timestamp按照缺省格式转为字符串
	 * 
	 * @param ts
	 *            源对象
	 * @return 如：2003-01-01
	 */
	public static String toString(Timestamp ts) {
		return toString(ts, DEFAULT_DATE_FORMAT);
	}

	/**
	 * Timestamp按照缺省格式转为字符串，可指定是否使用长格式
	 * 
	 * @param ts
	 *            欲转化之变量Timestamp
	 * @param fullFormat
	 *            是否使用长格式
	 * @return 如：2003-01-01 或2003-01-01 13:21
	 */
	public static String toString(Timestamp ts, boolean fullFormat) {
		String s = null;
		if (fullFormat) {
			s = DEFAULT_DATETIME_FORMAT_SEC;
		} else {
			s = DEFAULT_DATE_FORMAT;
		}

		return toString(ts, s);
	}

	/**
	 * 将sqldate型按照指定格式转为字符串
	 * 
	 * @param sqldate
	 *            源对象
	 * @param sFormat
	 *            ps
	 * @return 如：2003-01-01 或2003-01-01 00:00
	 */
	public static String toString(java.sql.Date sqldate, String sFormat) {
		if (sqldate == null) {
			return "";
		}
		java.util.Date d = new java.util.Date(sqldate.getTime());
		return toString(d, sFormat);
	}

	/**
	 * 将sqldate型按照缺省格式转为字符串
	 * 
	 * @param sqldate
	 *            源对象
	 * @return 如：2003-01-01
	 */
	public static String toString(java.sql.Date sqldate) {
		return toString(sqldate, DEFAULT_DATE_FORMAT);
	}

	/**
	 * 将java.util.date型按照指定格式转为字符串
	 * 
	 * @param d
	 *            源对象
	 * @param sFormat
	 *            ps
	 * @return 如：2003-01-01
	 */
	public static String toString(java.util.Date d, String sFormat) {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(sFormat);
		String dateString = formatter.format(d);
		return dateString;
	}

	/**
	 * 将java.util.date型按照缺省格式转为字符串
	 * 
	 * @param d
	 *            源对象
	 * @return 如：2003-01-01
	 */
	public static String toString(java.util.Date d) {
		return toString(d, DEFAULT_DATE_FORMAT);
	}

	/**
	 * 强制类型转换 从串到日期
	 * 
	 * @param sDate
	 *            源字符串，采用yyyy-MM-dd格式
	 * @param sFormat
	 *            ps
	 * @return 得到的日期对象
	 * @throws ParseException
	 */

	/**
	 * 强制类型转换 从串到日期
	 * 
	 * @param sDate
	 *            源字符串，采用yyyy-MM-dd格式
	 * @param sFormat
	 *            ps
	 * @return 得到的日期对象
	 * @throws ParseException
	 */
	public static java.util.Date parseDate(String sDate, String sFormat) throws ParseException {
		java.text.SimpleDateFormat formatter = null;

		java.util.Date utildate = null;
		formatter = new java.text.SimpleDateFormat(sFormat);
		utildate = formatter.parse(sDate);
		return utildate;
	}

	/**
	 * 强制类型转换 从串到时间戳
	 * 
	 * @param sDate
	 *            源串
	 * @param sFormat
	 *            遵循格式
	 * @return 取得的时间戳对象
	 * @throws ParseException
	 */
	public static Timestamp parseTimestamp(String sDate, String sFormat) throws ParseException {
		java.text.SimpleDateFormat formatter = null;

		java.util.Date utildate = null;
		formatter = new java.text.SimpleDateFormat(sFormat);
		utildate = formatter.parse(sDate);
		java.sql.Timestamp tsdate = new java.sql.Timestamp(utildate.getTime());
		return tsdate;
	}

	/**
	 * getCurDate 取当前日期
	 * 
	 * @return java.util.Date型日期
	 */
	public static java.util.Date getCurDate() {
		return (new java.util.Date());
	}

	/**
	 * getCurTimestamp 取当前时间戳
	 * 
	 * @return java.sql.Timestamp
	 */
	public static java.sql.Timestamp getCurTimestamp() {
		java.util.Date today = new java.util.Date();
		java.sql.Timestamp ts = new java.sql.Timestamp(today.getTime());
		return ts;
	}

	/**
	 * getCurTimestamp 取遵循格式的当前时间
	 * 
	 * @param format
	 *            遵循格式
	 * @return java.sql.Timestamp
	 */
	public static Date getCurDate(String format) throws Exception {
		SimpleDateFormat formatter = new SimpleDateFormat(format);
		String strCurDate = toString(new Date(), format);
		Date date = formatter.parse(strCurDate);
		return date;
	}

	/**
	 * 构造一个显示格式为：2008年2月1日
	 */
	public static String formatDateToCn(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH) + 1;
		int day = calendar.get(Calendar.DAY_OF_MONTH);
		return year + "年" + month + "月" + day + "日";
	}

	/**
	 * 构造一个显示格式为：2008年2月1日
	 */
	public static String formatDateToCnWeek(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH) + 1;
		int day = calendar.get(Calendar.DAY_OF_MONTH);
		int week = calendar.get(Calendar.DAY_OF_WEEK);
		return year + "年" + month + "月" + day + "日 " + getCnWeek(week);
	}

	public static String getCnWeek(int week) {
		switch (week) {
		case 1:
			return "星期日";
		case 2:
			return "星期一";
		case 3:
			return "星期二";
		case 4:
			return "星期三";
		case 5:
			return "星期四";
		case 6:
			return "星期五";
		case 7:
			return "星期六";
		default:
			return "";
		}
	}

	/**
	 * 获得给定日期sDate所在周，星期几的日期值
	 * @param sDate
	 * @param sFormat
	 * @param week 1-星期一, 7-星期日
	 * @return
	 * @throws ParseException
	 */
	public static String currentWeekDate(String sDate, String sFormat, int week) throws ParseException {
		Calendar c = Calendar.getInstance();
		if (week == 7) {
			sDate = DateUtils.getAddDay(sDate, "DAY", 7, sFormat);
		}
		c.setTime(DateUtils.parseDate(sDate, sFormat));

		switch (week) {
		case 1:
			c.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
			break;
		case 2:
			c.set(Calendar.DAY_OF_WEEK, Calendar.TUESDAY);
			break;
		case 3:
			c.set(Calendar.DAY_OF_WEEK, Calendar.WEDNESDAY);
			break;
		case 4:
			c.set(Calendar.DAY_OF_WEEK, Calendar.THURSDAY);
			break;
		case 5:
			c.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
			break;
		case 6:
			c.set(Calendar.DAY_OF_WEEK, Calendar.SATURDAY);
			break;
		case 7:
			c.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
			break;
		}

		return new SimpleDateFormat("yyyy-MM-dd").format(c.getTime());
	}
	
	/**
	 * 获得给定日期sDate之后星期几的日期值
	 * @param sDate 给定日期
	 * @param sFormat 
	 * @param week 1-星期一, 7-星期日
	 * @return
	 */
	public static String afterWeekDate(String sDate, String sFormat, int week) {
		String currentWeekDate = null;
		String afterWeekDate = null;
		try {			
			currentWeekDate = DateUtils.currentWeekDate(sDate, sFormat, week);
			if(DateUtils.parseDate(currentWeekDate, sFormat).compareTo(DateUtils.parseDate(sDate, sFormat)) == -1) {
				afterWeekDate = DateUtils.getAddDay(currentWeekDate, "DAY", 7, sFormat);
				afterWeekDate = DateUtils.currentWeekDate(afterWeekDate, "yyyy-MM-dd", week);
				
				return afterWeekDate;
			} 
					
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return currentWeekDate;	
	}
	/**
	 * 根据当前时间格显示式化日期，如当前时间与time为同一天则返回“时：分：秒”，否则则返回年月日
	 * @param time 要格式化的日期
	 * @throws ParseException 
	 */
	static public String autoFormatTime(String time){
		if(time == null || time.length() < 10) return "";
		String today = today();
		if(today.substring(0,10).equals(time.substring(0,10))){
			return time.substring(11);
		}
		if(today.substring(0,4).equals(time.substring(0,4))){
			return time.substring(5,10);
		}
		return time.substring(0,10);
	}

	public static String getInstanceYear() {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new java.util.Date());
		return String.valueOf(calendar.get(Calendar.YEAR));
	}

	//返回本月第一天的日期
	static public String getFirstDayOfMonth(){
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATE_FORMAT);
		Calendar calendar = Calendar.getInstance();      
	    calendar.set(Calendar.DAY_OF_MONTH, calendar      
	            .getActualMinimum(Calendar.DAY_OF_MONTH));      
	     
	    return formatter.format(calendar.getTime());      
	}
	
	static public String getFirstDayOfMonth_2(){
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(DEFAULT_DATE_FORMAT2);
		Calendar calendar = Calendar.getInstance();      
	    calendar.set(Calendar.DAY_OF_MONTH, calendar      
	            .getActualMinimum(Calendar.DAY_OF_MONTH));      
	     
	    return formatter.format(calendar.getTime());      
	}
	
	/**
	 * 功能：比较两个日期
	 * 
	 * @param startDate
	 *            String 开始时间
	 * @param endDate
	 *            String 欲比较时间
	 * @param strFormat
	 *            日期格式
	 * @return
	 * 			  -1: 开始时间早于比较时间
	 * 			  1：开始时间晚于比较时间
	 * 			  0：开始时间等于比较时间
	 * @throws ParseException
	 * @author zouhaibo
	 */
	public static int compareDate(String startDate, String endDate, String strFormat){
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat(strFormat);

		Calendar start = Calendar.getInstance();
		Date tempstartdate;
		Calendar end = null;
		try {
			tempstartdate = formatter.parse(startDate);
			start.setTime(tempstartdate);
			
			end = Calendar.getInstance();
			Date tempenddate = formatter.parse(endDate);
			end.setTime(tempenddate);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if(start.before(end))
		{
			return -1;
		}else if(start.after(end))
		{
			return 1;
		}else
		{
			return 0;
		}
	}
	
	/**
	 * Calendar set 方法
	 * @param date
	 * @param field
	 * @param value
	 * @return
	 */
	public static Date set(Date date,int field,int value){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(field, value);
		return calendar.getTime();
	}
	
	/**
	 * Calendar add 方法
	 * @param field
	 * @param amount
	 * @return
	 */
	public static Date add(Date date,int field,int amount){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(field, amount);
		return calendar.getTime();
	}
	
	/**
	 * 对"yyyy-MM-dd"的日期进行加减
	 * @param date 日期参数
	 * @param del 变化天数
	 * @param method 日期加或者减方法
	 * @return
	 */
	public static String computeDate(String date, int del, String method) {
		String result = null;
		Date day = null;
		try {
			day = new SimpleDateFormat("yyyy-MM-dd").parse(date);
		} catch (ParseException e) {
			throw new MyException("日期解析出错啦！原因：" + e.getMessage());
		}
		
		if ("+".equals(method)) {
			long delt = day.getTime() + del * 24L * 60L * 60L * 1000L;
			result = new SimpleDateFormat("yyyy-MM-dd").format(new Date(delt));
		} else if ("-".equals(method)) {
			long delt = day.getTime() -  del * 24L * 60L * 60L * 1000L;
			result = new SimpleDateFormat("yyyy-MM-dd").format(new Date(delt));
		} else {
			throw new MyException("日期解析出错啦！原因：" + "传入method参数不正确。");
		}
		
		return result;
	}
	
	public static int getDelDay(String startDate, String endDate) {
		int del = 0;
		Date start = null;
		Date end = null;
		try {
			start = new SimpleDateFormat("yyyy-MM-dd").parse(startDate);
			end = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
		} catch (ParseException e) {
			throw new MyException("日期解析出错啦！原因：" + e.getMessage());
		}
		del = (int) ((start.getTime() - end.getTime()) / (24 * 60 * 60 * 1000));
		
		return Math.abs(del);
	}
	
	public static String formatDay(String date) {
		String result = null;
		
		String[] tmp = date.split("\\-");
		String year = tmp[0];
		String month = tmp[1];
		String day = tmp[2];
		
		if (Integer.parseInt(month) < 10) {
			month = "0" + month; 
		}
		if (Integer.parseInt(day) < 10) {
			day = "0" + day;
		}
		
		result = year + "-" + month + "-" + day;
		
		return result;
	}

	public static boolean isFirstDayOfWeek() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.DAY_OF_WEEK) == Calendar.MONDAY;
	}

	public static boolean isFirstDayOfMonth() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.DAY_OF_MONTH) == 1;
	}
}
