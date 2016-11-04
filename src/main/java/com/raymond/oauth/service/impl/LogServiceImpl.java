package com.raymond.oauth.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.oauth.db.dao.LogMapper;
import com.raymond.oauth.db.model.Log;
import com.raymond.oauth.service.LogService;

@Service("logService")
public class LogServiceImpl extends GenericServiceImpl<Log, Long>
		implements LogService{

	@Resource
    private LogMapper logMapper;
	@Override
	public GenericDao<Log, Long> getDao() {
		return logMapper;
	}

}
