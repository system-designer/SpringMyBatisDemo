package com.raymond.oauth.security;

import java.lang.annotation.Annotation;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import com.raymond.core.exception.MyException;
import com.raymond.core.exception.ViewMessageException;

public class ExceptionHandlerExceptionResolver implements HandlerExceptionResolver{
	private Logger logger = LoggerFactory.getLogger("error");

	@Override
	public ModelAndView resolveException(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex) {
		logger.error("请求异常,MSG={}",ex.getMessage(),ex);
		// 判断请求类型JSON 或 HTML
		if(ex instanceof ViewMessageException){
			ViewMessageException vme = (ViewMessageException) ex;
			ModelAndView view = new ModelAndView(vme.getView());
			view.addObject("_message",vme.getMessage());
			view.addObject("_code",vme.getCode());
			view.addAllObjects(vme.getModel());
			return view;
		}
		else if(handler instanceof HandlerMethod){
			HandlerMethod hand = (HandlerMethod) handler;
			Annotation anno = hand.getMethodAnnotation(ResponseBody.class);
			if(anno != null){
				String message = ex.getMessage();
				String code = "9999";
				ModelAndView view = new ModelAndView("error/errorjson");
				if(ex instanceof MyException){
					code = ((MyException)ex).getCode();
					view.addObject("code",code);
					view.addObject("message",message);
				}else{
					view.addObject("code",code);
					view.addObject("message","发生异常");
				}
				
				return view;
			}
		}
		ModelAndView view = new ModelAndView("error/500");
		String message = ex.getMessage();
		String code = "9999";
		if(ex instanceof MyException){
			code = ((MyException)ex).getCode();
			view.addObject("code",code);
			view.addObject("message",message);
		}else{
			view.addObject("code",code);
			view.addObject("message","发生错误");
		}
		
		return view;
	
	}

}
