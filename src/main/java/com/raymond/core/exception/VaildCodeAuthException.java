package com.raymond.core.exception;

import org.apache.shiro.authc.AuthenticationException;


public class VaildCodeAuthException extends AuthenticationException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3567655735251689263L;

	public VaildCodeAuthException() {
		super();
	}

	public VaildCodeAuthException(String message, Throwable cause) {
		super(message, cause);
	}

	public VaildCodeAuthException(String message) {
		super(message);
	}

	public VaildCodeAuthException(Throwable cause) {
		super(cause);
	}


}
