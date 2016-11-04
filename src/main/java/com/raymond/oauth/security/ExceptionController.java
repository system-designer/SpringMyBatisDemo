package com.raymond.oauth.security;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;

import com.raymond.core.common.LocalMessage;
import com.raymond.core.exception.MyException;

public class ExceptionController {
	protected Logger  log = LoggerFactory.getLogger("error");
	@Autowired(required=false)
	private LocalMessage message;
	protected String getMessage(String code, Object...params){
		return message.getMessage(code, "未定义的错误");
	}
	@ExceptionHandler(Exception.class)
    public @ResponseBody Object handleUncaughtException(Exception ex, WebRequest request, HttpServletResponse response) throws Exception {
		ex.printStackTrace();
		log.error("请求发生异常", ex);
		if(ex instanceof MyException){
			MyException be = (MyException) ex;
			return new HtmlMessage(be.getCode(), be.getMessage()).set_exception(true);
		}
		else if(ex instanceof DataIntegrityViolationException){
			DataIntegrityViolationException dve = (DataIntegrityViolationException) ex;
			if(dve.getRootCause() instanceof SQLException){
				SQLException sqlex = (SQLException) dve.getRootCause();
				return new HtmlMessage(MyException.ERROR_CODE,getMessage("sql.errcode.E" + sqlex.getErrorCode())).set_exception(true);
			}
		}
		else if(ex instanceof BindException){
			BindException be = (BindException) ex;
			List<ObjectError> list = be.getAllErrors();
			String message = "";
			for (ObjectError objectError : list) {
				message += objectError.getDefaultMessage() + "<br/>";
			}
			return new HtmlMessage(MyException.ERROR_CODE, message).set_exception(true);
		}
		return new HtmlMessage(MyException.ERROR_CODE,"未知错误").set_exception(true);
//		return new HtmlMessage()
    }
}
