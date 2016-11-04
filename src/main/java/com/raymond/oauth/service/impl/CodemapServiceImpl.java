package com.raymond.oauth.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.raymond.core.ServiceLog;
import com.raymond.core.exception.MyException;
import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.oauth.db.dao.CodemapMapper;
import com.raymond.oauth.db.model.Codemap;
import com.raymond.oauth.db.model.CodemapExample;
import com.raymond.oauth.service.CodemapService;

@Service("codemapService")
public class CodemapServiceImpl extends GenericServiceImpl<Codemap, Long>
		implements CodemapService {

	@Resource
    private CodemapMapper codemapMapper;
	
	@Override
	public GenericDao<Codemap, Long> getDao() {
		return codemapMapper;
	}

	@Override
	@ServiceLog(text="新增代码集")
	public int insert(Codemap model) {
		CodemapExample example = new CodemapExample();
		example.createCriteria().andCodeEqualTo(model.getCode());
		List<Codemap> list = codemapMapper.selectByExample(example);
		if(list.size()!=0){
			throw new MyException("编号不能重复");
		}
		return codemapMapper.insertSelective(model);
	}
	
	@Override
	@ServiceLog(text="修改代码集")
	public int update(Codemap model) {
		Codemap map = codemapMapper.selectByPrimaryKey(model.getId());
		if(!map.getCode().equals(model.getCode())){
			CodemapExample example = new CodemapExample();
			example.createCriteria().andCodeEqualTo(model.getCode());
			List<Codemap> list = codemapMapper.selectByExample(example);
			if(list.size()!=0){
				throw new MyException("编号不能重复");
			}
		}
		return codemapMapper.updateByPrimaryKeySelective(model);
	}

}
