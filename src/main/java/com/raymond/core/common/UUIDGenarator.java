package com.raymond.core.common;

public class UUIDGenarator {
	/**
	 * 获取32位唯一主键
	 * @return
	 */
	public static synchronized String getUUID(){
		return java.util.UUID.randomUUID().toString().replaceAll("-", "") ;
	}


}
