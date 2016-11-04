package com.raymond.core.feature.orm.dialect;
/**
 * 动态数据源切换设置
 * @author chen_zx
 *
 */
public abstract class CustomerContextHolder {

	private static final ThreadLocal<String> contextHolder = new ThreadLocal<String>();

	public static void setCustomerType(String customerType) {
		contextHolder.set(customerType);
	}

	public static String getCustomerType() {
		return contextHolder.get();
	}

	public static void clearCustomerType() {
		contextHolder.remove();
	}

}