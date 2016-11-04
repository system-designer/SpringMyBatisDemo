package com.raymond.core.common;

import java.util.Locale;

import org.springframework.context.MessageSource;

public class LocalMessage {
	private Locale locale = Locale.CHINA;
	private MessageSource messageSource;
	public Locale getLocale() {
		return locale;
	}
	public void setLocale(Locale locale) {
		this.locale = locale;
	}
	public MessageSource getMessageSource() {
		return messageSource;
	}
	public void setMessageSource(MessageSource messageSource) {
		this.messageSource = messageSource;
	}

	public String getMessage(String code, Object...args){
		return messageSource.getMessage(code, args , locale);
	}
}
