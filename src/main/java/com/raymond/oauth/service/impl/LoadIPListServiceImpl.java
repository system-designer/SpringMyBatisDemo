/**
 * 
 */
package com.raymond.oauth.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;

import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.raymond.common.util.GlobalParameters;
import com.raymond.core.util.LoggerUtils;
import com.raymond.oauth.service.LoadIPListService;

/**
 * @author cxhuan
 *
 */
@Service(value="loadIPListService")
public class LoadIPListServiceImpl implements LoadIPListService {
	/* 
	 * TODO
	 * @return
	 * 2016年7月19日
	 */
	@Override
	public void load() {
		if (GlobalParameters.WHITELIST_IP == null) {
			GlobalParameters.WHITELIST_IP = new ArrayList<String>();
		}
		ClassPathResource cp = new ClassPathResource("whitelist.properties");
		Properties properties = new Properties();
		try {
			properties.load(cp.getInputStream());
		} catch (IOException e) {
			LoggerUtils.recordLog(
					LoggerFactory.getLogger(LoadIPListServiceImpl.class),
					LoggerUtils.getHead(), "读取ip列表失败！",
					LoggerUtils.LOG_TYPE_ERROR);
			throw new RuntimeException("load whitelist.properties error!");
		}

		for (Iterator<Object> its = properties.keySet().iterator(); its
				.hasNext();) {
			String key = (String) its.next();
			if (!key.matches("[0-9]*")) {
				GlobalParameters.WHITELIST_IP.add(key);
			} else {
				System.out.println("--"+key);
			}
			
		}
	}
	
}
