package com.raymond.oauth.security;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

import com.raymond.core.exception.VaildCodeAuthException;
import com.raymond.core.exception.VaildMobileAuthException;
import com.raymond.oauth.db.model.Menu;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.service.MenuService;

/**
 * 登录过滤器
 * @author 扬
 *
 */
public class UserLoginFormFilter extends FormAuthenticationFilter {
	
	@Resource
    private MenuService menuService;
	
	static final private String VERIFICATION_CODE = "VERIFICATION_CODE";
	static final private String MOBILE_CODE = "MOBILE_CODE";
	/**
	 * 是否开启验证码
	 */
	private Boolean enableVerificationCode = false;
	private Boolean enableMobileCode = false;
	
	
	private String verificationCodeKey = VERIFICATION_CODE;
	private String mobileCodeKey = MOBILE_CODE;
	@Override
	protected AuthenticationToken createToken(ServletRequest request,
			ServletResponse response) {
		UserLoginToken ut = new UserLoginToken();
		ut.setHost(this.getHost(request));
		ut.setPassword(this.getPassword(request).toCharArray());
		ut.setRememberMe(this.isRememberMe(request));
		ut.setUsername(this.getUsername(request));
		ut.setMobileCodePass(this.getMobileCodePass(request));
		ut.setVerifitionCodePass(this.getVerifitionCodePass(request));
		return ut;
	}

	private boolean getVerifitionCodePass(ServletRequest request) {
		if(!this.enableVerificationCode) return true;
		String code = request.getParameter(this.getVerificationCodeKey());
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		String sessionRandCode = 
				(String) httpRequest.getSession().getAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);
		return sessionRandCode != null && sessionRandCode.equals(code);
	}

	private boolean getMobileCodePass(ServletRequest request) {
		if(!this.enableMobileCode) return true;
		String code = request.getParameter(this.getMobileCodeKey());
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		String mobileCode = 
				(String) httpRequest.getSession().getAttribute(this.getMobileCodeKey());
		return mobileCode != null && mobileCode.equals(code);
	}

	public Boolean getEnableVerificationCode() {
		return enableVerificationCode;
	}

	public void setEnableVerificationCode(Boolean enableVerificationCode) {
		this.enableVerificationCode = enableVerificationCode;
	}

	public Boolean getEnableMobileCode() {
		return enableMobileCode;
	}

	public void setEnableMobileCode(Boolean enableMobileCode) {
		this.enableMobileCode = enableMobileCode;
	}

	public String getVerificationCodeKey() {
		return verificationCodeKey;
	}

	public void setVerificationCodeKey(String verificationCodeKey) {
		this.verificationCodeKey = verificationCodeKey;
	}

	public String getMobileCodeKey() {
		return mobileCodeKey;
	}

	public void setMobileCodeKey(String mobileCodeKey) {
		this.mobileCodeKey = mobileCodeKey;
	}

	@Override
	protected boolean onLoginSuccess(AuthenticationToken token,
			Subject subject, ServletRequest request, ServletResponse response)
			throws Exception {
		  HttpServletRequest hr = (HttpServletRequest) request;
		
          User user = (User)SecurityUtils.getSubject().getPrincipal();
        
			List<Menu> all = menuService.selectByUserId(user.getId());
			List<Menu> first = new ArrayList<Menu>();
			List<Menu> second = new ArrayList<Menu>();
			for(Menu menu : all){
				if(menu.getLevel()==0){
					first.add(menu);
				}else{
					second.add(menu);
				}
			}

//			hr.getSession().setAttribute("__allmenuhtml", MenuBuilder.buildLeftMenu(first,second,hr.getContextPath(),hr.getRequestURI()));
			hr.getSession().setAttribute("__allmenuhtml", MenuBuilder.buildLeftMenu3(all,hr.getContextPath()));
		
		return super.onLoginSuccess(token, subject, request, response);
	}

	@Override
	protected boolean onLoginFailure(AuthenticationToken token,
			AuthenticationException e, ServletRequest request,
			ServletResponse response) {
		return super.onLoginFailure(token, e, request, response);
	}

	@Override
	protected void setFailureAttribute(ServletRequest request,
			AuthenticationException ae) {
		if(ae instanceof VaildCodeAuthException){
			request.setAttribute(getFailureKeyAttribute(), "验证码错误");
		}
		else if(ae instanceof VaildMobileAuthException){
			request.setAttribute(getFailureKeyAttribute(), "手机验证码错误");
		}
		else{
			request.setAttribute(getFailureKeyAttribute(), "用户名或密码错误");
		}
	}

}
