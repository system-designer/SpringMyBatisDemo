package com.raymond.core.exception;

import org.apache.shiro.authc.AuthenticationException;

public class VaildMobileAuthException extends AuthenticationException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5183141952621376218L;

	public VaildMobileAuthException() {
		super();
	}

	public VaildMobileAuthException(String message, Throwable cause) {
		super(message, cause);
	}

	public VaildMobileAuthException(String message) {
		super(message);
	}

	public VaildMobileAuthException(Throwable cause) {
		super(cause);
	}

}
