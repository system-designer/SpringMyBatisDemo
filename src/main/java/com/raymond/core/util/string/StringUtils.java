/**
 * 
 */
package com.raymond.core.util.string;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.sf.json.JSONArray;

/**
 * @author cxhuan
 *
 */
public class StringUtils {
	public static boolean isNum(String str){
		return str.matches("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$");
	}
	
	public static String objToJson(Object obj) {
		String json = null;
		new JSONArray();
		json = JSONArray.fromObject(obj).toString();
		return json;
	}
	
	 public static String trimHtml2Txt(String htmlStr){      
		 String regEx_script="<script[^>]*?>[\\s\\S]*?<\\/script>"; //定义script的正则表达式 
	        String regEx_style="<style[^>]*?>[\\s\\S]*?<\\/style>"; //定义style的正则表达式 
	        String regEx_html="<[^>]+>"; //定义HTML标签的正则表达式 
	         
	        Pattern p_script=Pattern.compile(regEx_script,Pattern.CASE_INSENSITIVE); 
	        Matcher m_script=p_script.matcher(htmlStr); 
	        htmlStr=m_script.replaceAll(""); //过滤script标签 
	         
	        Pattern p_style=Pattern.compile(regEx_style,Pattern.CASE_INSENSITIVE); 
	        Matcher m_style=p_style.matcher(htmlStr); 
	        htmlStr=m_style.replaceAll(""); //过滤style标签 
	         
	        // <p>段落替换为换行 
	        htmlStr = htmlStr.replaceAll("<p .*?>", "\r\n"); 
	        // <br><br/>替换为换行 
	        htmlStr = htmlStr.replaceAll("<br\\s*/?>", "\r\n"); 
	        // 去掉其它的<>之间的东西 
	        htmlStr = htmlStr.replaceAll("\\<.*?>", ""); 
	        
	        htmlStr = htmlStr.replaceAll("&nbsp;", " "); 
	        
	        Pattern p_html=Pattern.compile(regEx_html,Pattern.CASE_INSENSITIVE); 
	        Matcher m_html=p_html.matcher(htmlStr); 
	        htmlStr=m_html.replaceAll(""); //过滤html标签 

	        return htmlStr.trim(); //返回文本字符串 
	    }  
}
