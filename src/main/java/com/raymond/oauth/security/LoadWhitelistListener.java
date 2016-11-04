/**
 * 
 */
package com.raymond.oauth.security;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.web.context.ServletContextAware;

import com.raymond.oauth.service.LoadIPListService;

/**
 * 启动时加载ip白名单
 * 
 * @author cxhuan
 *
 */
public class LoadWhitelistListener implements InitializingBean,ServletContextAware  {
	private LoadIPListService loadIPListService;


	/* 
	 * TODO
	 * @param servletContext
	 * 2016年7月19日
	 */
	@Override
	public void setServletContext(ServletContext servletContext) {
		loadIPListService.load();
		
	}

	/* 
	 * TODO
	 * @throws Exception
	 * 2016年7月19日
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub
		
	}

	public LoadIPListService getLoadIPListService() {
		return loadIPListService;
	}

	public void setLoadIPListService(LoadIPListService loadIPListService) {
		this.loadIPListService = loadIPListService;
	}
	
}
