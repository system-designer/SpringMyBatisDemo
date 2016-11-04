package com.raymond.oauth.layout;

import java.io.File;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class ScanLayout extends ArrayList<String> implements InitializingBean,ApplicationContextAware {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7958592601702638318L;
	Logger log = LoggerFactory.getLogger(ScanLayout.class);
	private ApplicationContext cxt;
	@Override
	public void afterPropertiesSet() throws Exception {
		File file = cxt.getResource("/WEB-INF/layout").getFile();
		if(file.isDirectory()){
			File[] files = file.listFiles();
			for (File f : files) {
				if(f.isDirectory()){
					File tiles = new File(f,"tiles.xml");
					String tilesPath = tiles.getPath().substring(file.getPath().length()+1);
					if(tiles.exists()){
						this.add("/WEB-INF/layout/" + tilesPath);
						log.info("loaded layout[{}]",f.getName());
					}
				}
			}
		}
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.cxt = applicationContext;
	}
}
