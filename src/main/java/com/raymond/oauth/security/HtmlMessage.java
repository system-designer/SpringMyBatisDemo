package com.raymond.oauth.security;

public class HtmlMessage {
	public static final String STATUS_CODE_FAILURE = "300";
	private String statusCode = "200";
	private String  message = "操作成功";
	private String navTabId = "";
	private String rel = "";
	private String callbackType = "closeCurrent";
	private String forwardUrl = null;
	private String type = HtmlMessage.class.toString();
	private Object entity;
	private Boolean _exception = false;
	
	public HtmlMessage(Object entity){
		this.setEntity(entity);
	}
	public HtmlMessage(Object entity, String message){
		this.setEntity(entity);
		this.message = message;
	}
	public HtmlMessage(String message){
		this.message = message;
	}
	
	public HtmlMessage(String statusCode,String message){
		this.statusCode = statusCode;
		this.message = message;
	}
	
	public HtmlMessage(String navTabId, String callbackType, String forwardUrl) {
		super();
		this.navTabId = navTabId;
		this.callbackType = callbackType;
		this.forwardUrl = forwardUrl;
	}
	public HtmlMessage(String statusCode, String message, String callbackType, String forwardUrl) {
		super();
		this.statusCode = statusCode;
		this.message = message;
		this.callbackType = callbackType;
		this.forwardUrl = forwardUrl;
	}
	public HtmlMessage(String statusCode, String message, String callbackType, Integer mark) {
		super();
		this.statusCode = statusCode;
		this.message = message;
		this.callbackType = callbackType;
	}
	public String getStatusCode() {
		return statusCode;
	}
	public HtmlMessage setStatusCode(String statusCode) {
		this.statusCode = statusCode;
		return this;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getNavTabId() {
		return navTabId;
	}
	public HtmlMessage setNavTabId(String navTabId) {
		this.navTabId = navTabId;
		return this;
	}
	public String getRel() {
		return rel;
	}
	public HtmlMessage setRel(String rel) {
		this.rel = rel;
		return this;
	}
	public String getCallbackType() {
		return callbackType;
	}
	public HtmlMessage setCallbackType(String callbackType) {
		this.callbackType = callbackType;
		return this;
	}
	
	public String getForwardUrl() {
		return forwardUrl;
	}
	public HtmlMessage setForwardUrl(String forwardUrl) {
		this.forwardUrl = forwardUrl;
		return this;
	}

	public Object getEntity() {
		return entity;
	}

	public HtmlMessage setEntity(Object entity) {
		this.entity = entity;
		return this;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Boolean get_exception() {
		return _exception;
	}
	public HtmlMessage set_exception(Boolean _exception) {
		this._exception = _exception;
		return this;
	}
	
	public String getCode(){
		return this.statusCode;
	}
}
