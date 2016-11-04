package com.raymond.core;

import com.raymond.core.util.DateUtils;
import com.raymond.core.util.LoggerUtils;
import com.raymond.oauth.db.model.Log;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.service.LogService;
import org.apache.shiro.SecurityUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;


@Aspect
@Component
public class LogAspect {
	// private Logger logger = LoggerUtils.getOperateLogger();

	@Resource
	private LogService logService;

	/**
	 * 获取注解中对方法的描述信息 用于service层注解
	 *
	 * @param joinPoint 切点
	 * @return 方法描述
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public static String getMethodText(JoinPoint joinPoint) {
		String description = "";
		try {
			String targetName = joinPoint.getTarget().getClass().getName();
			String methodName = joinPoint.getSignature().getName();
			Object[] arguments = joinPoint.getArgs();
			Class<?> targetClass = Class.forName(targetName);
			Method[] methods = targetClass.getMethods();
			for (Method method : methods) {
				if (method.getName().equals(methodName)) {
					Class[] clazzs = method.getParameterTypes();
					if (clazzs.length == arguments.length) {
						ServiceLog sl = method.getAnnotation(ServiceLog.class);
						if (sl == null) continue;
						String name = sl.text();
						if (name != null && !"".equals(name)) {
							description = name;
						} else {
							description = methodName;
						}
						break;
					}
				}
			}

		} catch (Exception e) {

		}
		return description;

	}

	@Pointcut("@annotation(com.raymond.core.ServiceLog)")
	public void serviceAspect() {
	}

	/**
	 * 标注该方法体为后置通知，当目标方法执行成功后执行该方法体
	 * @param jp
     * @param ret 返回结果
     */
	@AfterReturning(pointcut = "serviceAspect()", returning = "ret")
	public void addLogSuccess(JoinPoint jp, Object ret) {
		User user = null;//请求用户
		String ip = null; //请求ip
		String time = DateUtils.time("yyyy-MM-dd HH:mm:ss");//操作时间
		if (RequestContextHolder.getRequestAttributes() != null) {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			user = (User) SecurityUtils.getSubject().getPrincipal();//请求用户
			ip = request.getRemoteAddr(); //请求ip
		}

		Object[] parames = jp.getArgs();//获取目标方法体参数
		String params = parseParames(parames); //解析目标方法体的参数
		String signature = jp.getSignature().toString();//获取目标方法签名
		String description = getMethodText(jp); //获取方法描述
        String result = ret!=null?ret.toString():null;
        Log log = new Log();
        log.setCode("0000");
        log.setStatus(1);
        log.setMethodText(description);
        log.setCreateTime(time);
        log.setIp(ip);
        log.setParames(params);
        log.setResult(result);
        if(user!=null){
        	log.setUser(user.getId());
            log.setUserName(user.getUsername());
        }
        log.setSignature(signature);
     //   logService.insert(log);
        LoggerUtils.recordOperate(LoggerUtils.getHead(),log.toString());
	}

	//标注该方法体为异常通知，当目标方法出现异常时，执行该方法体
	@AfterThrowing(pointcut = "serviceAspect()", throwing = "ex")
	public void addLog(JoinPoint jp, Throwable ex) {
		User user = null;//请求用户
		String ip = null; //请求ip
		String time = DateUtils.time("yyyy-MM-dd HH:mm:ss");//操作时间
		if (RequestContextHolder.getRequestAttributes() != null) {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			user = (User) SecurityUtils.getSubject().getPrincipal();//请求用户
			ip = request.getRemoteAddr(); //请求ip
		}

		Object[] parames = jp.getArgs();//获取目标方法体参数
		String params = parseParames(parames); //解析目标方法体的参数
		String signature = jp.getSignature().toString();//获取目标方法签名
		String description = getMethodText(jp); //获取方法描述

        Log log = new Log();
        log.setCode("9999");
        log.setStatus(0);
        log.setMethodText(description);
        log.setCreateTime(time);
        log.setIp(ip);
        log.setParames(params);
        log.setResult(ex.getMessage());
        if(user!=null){
        	log.setUser(user.getId());
            log.setUserName(user.getUsername());
        }
        log.setSignature(signature);
   //   logService.insert(log);
        LoggerUtils.recordOperate(LoggerUtils.getHead(),log.toString(),LoggerUtils.LOG_TYPE_ERROR);
	}

	public String parseParames(Object[] parames){
    	String params = "";
		for (int i = 0; i < parames.length; i++) {
			if(parames[i] instanceof Object[]){
    			 String sub = "";
    			 for(Object obj : (Object[])parames[i] ){
    				 sub +=","+obj;
    			 }
    			 if(!"".equals(sub)){
    				 sub = "["+sub.substring(1)+"]";
    			 }else{
    				 sub = "[]";
    			 }
				 params += sub + ";";
			}else{
				 params += parames[i] + ";";
			}

		}
		return params;
    }
}
