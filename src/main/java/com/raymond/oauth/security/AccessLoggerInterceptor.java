package com.raymond.oauth.security;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.UnavailableSecurityManagerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.raymond.common.util.GlobalParameters;
import com.raymond.core.feature.orm.dialect.CustomerContextHolder;
import com.raymond.oauth.db.dao.VisitIpStaMapper;
import com.raymond.oauth.db.dao.VisitUserStaMapper;
import com.raymond.oauth.db.model.Menu;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.db.model.VisitIpSta;
import com.raymond.oauth.db.model.VisitIpStaExample;
import com.raymond.oauth.db.model.VisitUserSta;
import com.raymond.oauth.db.model.VisitUserStaExample;
import com.raymond.oauth.service.AuthService;
import com.raymond.oauth.service.MenuService;

/**
 * 记录日志拦截日志
 * @author chen_zx
 *
 */
public class AccessLoggerInterceptor extends HandlerInterceptorAdapter{
	private Logger logger = LoggerFactory.getLogger("access");
	private List<String> exclude = new ArrayList<String>();
	private Map<String,Menu> menuId = new HashMap<String,Menu>();
	private Map<String,Menu> menuUrl = new HashMap<String,Menu>();
	@Resource
    private MenuService menuService;
	@Resource
	private AuthService authService;
	@Value("${ga.trackingId}")
	private String gaTrackingId;
	@Resource
	private VisitIpStaMapper visitIpStaMapper;
	@Resource
	private VisitUserStaMapper visitUserStaMapper;
	
	
	private boolean isExclude(String uri){
		for (String regex: exclude) {
			Pattern part = Pattern.compile(regex);
			Matcher matcher = part.matcher(uri);
			if(matcher.find()) return true;
		}
		return false;
	}
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		request.setAttribute("__startTime", new Date());
		String cityId = request.getParameter("cityId");
		User user= (User) SecurityUtils.getSubject().getPrincipal();
		String ip = request.getHeader("X-Real-IP");
		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		    ip = request.getHeader("X-Forwarded-For");
		}
		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		    ip = request.getHeader("Proxy-Client-IP");
		}
		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		    ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		    ip = request.getRemoteAddr();
		}
		String purl = request.getRequestURL()+"";
		
		if (cityId != null && !"".equals(cityId))  {
			Pattern part = Pattern.compile("^[0-9]*$");
			Matcher matcher = part.matcher(cityId);
			if (!matcher.find()) {
				logger.error("cityId: " + cityId);
				logger.error("remote addr: " + ip);
				logger.error("request url: " + purl);
				if (user != null) logger.error("request user: " + user.getName());
				return false;
			}
		}
		
		if (user == null) {
			VisitIpSta ips = null;
			VisitIpStaExample ex = new VisitIpStaExample();
			if (ip != null && purl != null && !purl.contains("login")
					&& !purl.contains(".") && !purl.contains("/4")
					&& !purl.contains("/5")) {
				String rurl = purl.substring(purl.indexOf("universe") + 8);
				ex.createCriteria().andIpEqualTo(ip)
				.andUrlEqualTo(rurl);
				List<VisitIpSta> slist = visitIpStaMapper.selectByExample(ex);
				if (slist == null || slist.size() == 0) {
					ips = new VisitIpSta();
					ips.setCount(1L);
					ips.setIp(ip);
					ips.setUrl(rurl);
					visitIpStaMapper.insertSelective(ips);
				} else {
					ips = slist.get(0);
					ips.setCount(ips.getCount() + 1);
					visitIpStaMapper.updateByPrimaryKeySelective(ips);
				}
			}
		} else {
			VisitUserSta sta = null;
			VisitUserStaExample ex = new VisitUserStaExample();
			if (ip != null && purl != null && !purl.contains("login")
					&& !purl.contains(".") && !purl.contains("/4")
					&& !purl.contains("/5")) {
				String rurl = purl.substring(purl.indexOf("universe") + 8);
				ex.createCriteria().andUserNameEqualTo(user.getName())
				.andUrlEqualTo(rurl);
				List<VisitUserSta> ulist = visitUserStaMapper.selectByExample(ex);
				if (ulist == null || ulist.size() == 0) {
					sta = new VisitUserSta();
					sta.setCount(1);
					sta.setIp(ip);
					sta.setUrl(rurl);
					sta.setUserName(user.getName());
					visitUserStaMapper.insertSelective(sta);
				} else {
					sta = ulist.get(0);
					sta.setCount(sta.getCount() + 1);
					visitUserStaMapper.updateByPrimaryKeySelective(sta);
				}
			}
		}
		
		
		if(cityId!=null){
			GlobalParameters.CITYID = cityId;
			CustomerContextHolder.setCustomerType(cityId);
		}
		if(!isExclude(request.getRequestURI())){
			request.setAttribute("__baseUrl", request.getContextPath());
			request.setAttribute("_baseUrl", request.getContextPath());
			request.setAttribute("__gaTrackingId", gaTrackingId);
			try{
				if(SecurityUtils.getSubject().isAuthenticated()){
					// 菜单处理
					menuId  = authService.getMenus().get("menuId");
					menuUrl = authService.getMenus().get("menuUrl");
					String url = request.getRequestURI().substring(request.getContextPath().length());
					if("/index".equals(url)){
						url = "/";
					}
					Menu menu = menuUrl.get(url);
					if(menu != null){
						if(menu.getParent()!=null){
							request.setAttribute("__parMenu", menuId.get(menu.getParent()));
						}
						request.setAttribute("__curMenu", menu);
					}
					
				}
			}catch(UnavailableSecurityManagerException e){
				
			}
		}
		return super.preHandle(request, response, handler);
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		if(!isExclude(request.getRequestURI())){
			Date now = new Date();
			super.postHandle(request, response, handler, modelAndView);
			Date start = (Date) request.getAttribute("__startTime");
			long span = now.getTime() - start.getTime();
			logger.info("path={}耗时{}", request.getRequestURI(), span);
		}
		super.postHandle(request, response, handler, modelAndView);
	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		super.afterCompletion(request, response, handler, ex);
	}

	@Override
	public void afterConcurrentHandlingStarted(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		super.afterConcurrentHandlingStarted(request, response, handler);
	}

	public List<String> getExclude() {
		return exclude;
	}

	public void setExclude(List<String> exclude) {
		this.exclude = exclude;
	}
	
	
	
}
