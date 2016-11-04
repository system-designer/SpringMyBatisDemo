package com.raymond.oauth.security;

import org.apache.shiro.authc.UsernamePasswordToken;

public class UserLoginToken extends UsernamePasswordToken{

	/**
	 * 
	 */
	private static final long serialVersionUID = 784302250725457802L;

	private boolean verifitionCodePass = true;
	private boolean mobileCodePass = true;
	public boolean isVerifitionCodePass() {
		return verifitionCodePass;
	}
	public void setVerifitionCodePass(boolean verifitionCodePass) {
		this.verifitionCodePass = verifitionCodePass;
	}
	public boolean isMobileCodePass() {
		return mobileCodePass;
	}
	public void setMobileCodePass(boolean mobileCodePass) {
		this.mobileCodePass = mobileCodePass;
	}
}
