package com.raymond.core.exception;

public class MyException extends RuntimeException {
	public final static String ERROR_CODE = "300";
	public final static String SUCCESS_CODE = "0000";
	private String code = SUCCESS_CODE;
	/**
	 * 
	 */
	private static final long serialVersionUID = 5058689238804568643L;
	
	public MyException() {
	}
	public MyException(String message){
		super(message);
		this.setCode(ERROR_CODE);
	}
	public MyException(Throwable cause){
		super(cause);
		this.setCode(ERROR_CODE);
	}
	public MyException(String message, Throwable cause){
		super(message, cause);
		this.setCode(ERROR_CODE);
	}
	public MyException(String message, String code){
		super(message);
		this.setCode(code);
	}
	public MyException(String message, String code, Throwable cause){
		super(message, cause);
		this.setCode(code);
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
}
