package com.raymond.core.common;

import java.io.Serializable;

public class JsonMessage implements Serializable{
	private static final long serialVersionUID = -841344051253841771L;
	private String code = "0000";
	private String message;
	private Boolean _exception = false;
	
	public JsonMessage() {
	}
	
	public JsonMessage(String message) {
		super();
		this.message = message;
	}
	public JsonMessage(String code, String message) {
		super();
		this.code = code;
		this.message = message;
	}
	
	public JsonMessage(String code, String message, Boolean _exception) {
		super();
		this.code = code;
		this.message = message;
		this._exception = _exception;
	}



	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Boolean get_exception() {
		return _exception;
	}
	public void set_exception(Boolean _exception) {
		this._exception = _exception;
	}
}
