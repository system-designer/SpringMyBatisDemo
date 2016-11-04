package com.raymond.oauth.security;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.raymond.oauth.db.model.Menu;

/**
 * 生成菜单
 * @author 扬
 *
 */
public class MenuBuilder {
	static public String buildLeftMenu(List<Menu> firsts,List<Menu> seconds,String baseUrl,String curUrl){
		String menuString = "<ul class=\"nav nav-list\">";
		Boolean check = false;
		for(Menu menu:firsts){
			menuString += "<li class=\""+(check?"":"start active")+"\">";
			menuString += "<a href=\""+("#".equals(menu.getUrl())?"javascript:;":baseUrl+menu.getUrl())+"\" id=\"menu_"+menu.getId()+"\" class=\""+((!"#".equals(menu.getUrl())?"":"dropdown-toggle"))+"\">";
			menuString += "<i class=\"menu-icon "+menu.getIcon()+"\"></i><span class=\"menu-text\">"+menu.getName()+"</span>";
			if("#".equals(menu.getUrl())){
				menuString += "<b class=\"arrow icon-angle-down\"></b></a>";
				menuString += "<ul class=\"submenu\" >";
				for(Menu second : seconds){
					if(second.getParent().equals(menu.getId())){
						menuString += "<li>";
						menuString += "<a href=\""+baseUrl+second.getUrl()+"\" id=\"menu_"+second.getId()+"\">";
						menuString += "<i class=\"menu-icon icon-caret-right\"></i><i class=\""+second.getIcon()+"\"></i> "+second.getName();
						menuString += "</a></li>";
					}
				}
				menuString += "</ul>";
			}else{
				menuString += (check?"":"<b class=\"arrow\"></b>")+"</a>";
			}
			menuString += "</li>";
			check = true;
		}
		menuString += "</ul>";
		return menuString;
	}
	static public String buildLeftMenu2(List<Menu> firsts,List<Menu> seconds,String baseUrl){
		String menuString = "";
		for(Menu first : firsts){
			
			if("#".equals(first.getUrl())){
				menuString += "<div title=\""+first.getName()+"\" iconCls=\""+first.getIcon()+"\"><ul>";
				for(Menu second : seconds){
					if(second.getParent().equals(first.getId())){
						menuString  += "<li data-options=\""+second.getUrl()+"\" id=\""+second.getId()+"\" iconCls=\""+second.getIcon()+"\" title=\""+second.getName()+"\">";
						menuString  +=  second.getName() + "</li>"; 
					}
				}
				menuString += "</ul></div>";
			}else{
				menuString +="";
			}
			
		}
		
		return menuString;
	}
	
	static public String buildLeftMenu3(List<Menu> menus,String baseUrl){
		Map<String ,List<Menu>> map = new HashMap<String,List<Menu>>();
		List<Menu> root =  new ArrayList<Menu>();
		for(Menu m : menus){
			
			if(m.getParent()==null||"".equals(m.getParent())){
				root.add(m);
			}else{
				List<Menu> list = map.get(m.getParent());
				if(list==null){
					list = new ArrayList<Menu>();
				}
				list.add(m);
				map.put(m.getParent(), list);
			}
			
		}
		Integer level = 1;
		StringBuffer json = new StringBuffer("<ul class=\"nav nav-list\">");
		json = buildMenuTree(json,root,map,baseUrl,level);
		json.append("</ul>");
		return json.toString();
	}
	
	private static  StringBuffer buildMenuTree(StringBuffer json,List<Menu> menus,Map<String ,List<Menu>> map,String baseUrl,Integer level){
		for(Menu menu : menus){
			List<Menu> childrenList = map.get(menu.getId());
			if(childrenList!=null){
				json.append("<li>");
				json.append("<a href=\"#\" id=\"menu_"+menu.getId()+"\" class=\"dropdown-toggle\">");
				if(menu.getParent()==null||"".equals(menu.getParent())){
					json.append("<i class=\"menu-icon "+menu.getIcon()+"\"></i><span class=\"menu-text\">"+menu.getName()+"</span>");
				}else{
					json.append("<i class=\"menu-icon icon-caret-right\"></i>");
					json.append("<i class=\""+menu.getIcon()+"\"></i><span class=\"menu-text\">"+menu.getName()+"</span>");
				}
				json.append("<b class=\"arrow icon-angle-down\"></b></a>");
				json.append("<ul class=\"submenu\" >");
				json = buildMenuTree(json,childrenList,map,baseUrl,level+1);
				json.append("</ul></li>");
			}else{
				json.append("<li>");
				json.append("<a href=\""+baseUrl+menu.getUrl()+"\" id=\"menu_"+menu.getId()+"\">");
				if(level==2){
					json.append("<i class=\"menu-icon icon-caret-right\"></i>");
					json.append("<i class=\""+menu.getIcon()+"\"></i><span class=\"menu-text\">"+menu.getName()+"</span>");
				}else{
					json.append("<i class=\"menu-icon "+menu.getIcon()+"\"></i><span class=\"menu-text\">"+menu.getName()+"</span>");
				}
				json.append("</a></li>");
			}
		}
		
		return json;
	}
	
}
