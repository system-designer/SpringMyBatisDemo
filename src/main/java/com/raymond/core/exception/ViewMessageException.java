package com.raymond.core.exception;

import com.google.common.collect.Maps;

import java.util.Map;

public class ViewMessageException extends MyException {
	private String view;
	private Map<String,Object> model = Maps.newHashMap();
	
	public ViewMessageException(String view,String message, String code,Map<String,Object> modelMap) {
		super(message, code);
		this.view = view;
		this.model = modelMap;
	}
	public ViewMessageException(String view,String message, String code) {
		super(message, code);
		this.view = view;
	}

	public ViewMessageException(String view,String message) {
		super(message);
		this.view = view;
	}
	

	public String getView() {
		return view;
	}

	public void setView(String view) {
		this.view = view;
	}

	public Map<String,Object> getModel() {
		return model;
	}

	public void setModel(Map<String,Object> model) {
		this.model = model;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 4727619275213756699L;

}
