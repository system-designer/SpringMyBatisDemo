package com.raymond.oauth.controller;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("/server")
public class ServerController {
	
    
    /**
     * 静态资源访问
     * 
     * @param request
     * @return
     */
    @RequestMapping({"/**"})
    public void dynamicResource(HttpServletRequest request ,HttpServletResponse response){
     	
    	Map<String, Object> map = new HashMap<String, Object>();
    	String parameters = "";
    	
    	Enumeration<String> en = request.getParameterNames();
    	while (en.hasMoreElements()) {
    		String nms = en.nextElement();
  		 	map.put(nms, request.getParameter(nms));
  		 	parameters += "&"+nms+"="+request.getParameter(nms);
  		}
    	if(!"".equals(parameters)){
    		parameters = "?"+parameters.substring(1);
    	}
    	RestTemplate restTemplate = new RestTemplate(); 
    	String rest = "";
    	if("POST".equalsIgnoreCase(request.getMethod())){
    		rest = restTemplate.postForObject("http://localhost:8081/"+request.getRequestURI()+parameters, null, String.class);
    	}else{
    		rest = restTemplate.getForObject("http://localhost:8081/"+request.getRequestURI()+parameters, String.class);
    	}
     	
     	try {
     	//	response.addHeader("content-type", "text/plain,text/html,text/json,text/javascript; charset=UTF-8;");
			response.getWriter().write(rest);
		} catch (IOException e) {
			e.printStackTrace();
		}
    	
    }
    
    /**
     * 静态资源访问
     * 
     * @param request
     * @return
     */
    @RequestMapping({"/**/*.js","/**/*.css","/**/*.gif","/**/*.png","/**/*.jpeg","/**/*.eot","/**/*.svg","/**/*.ttf","/**/*.woff","/**/*.otf"})
    public void staticResource(HttpServletRequest request ,HttpServletResponse response){
     
    	RestTemplate restTemplate = new RestTemplate(); 
     	String rest = restTemplate.getForObject("http://localhost:8081/"+request.getRequestURI(), String.class, request,response);
     	try {
			response.getWriter().write(rest);
		} catch (IOException e) {
			e.printStackTrace();
		}
    	
    }
}
