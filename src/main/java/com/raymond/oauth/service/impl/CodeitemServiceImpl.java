package com.raymond.oauth.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.raymond.core.ServiceLog;
import com.raymond.core.exception.MyException;
import com.raymond.core.feature.orm.mybatis.Page;
import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.oauth.db.dao.CodeitemMapper;
import com.raymond.oauth.db.model.Codeitem;
import com.raymond.oauth.db.model.CodeitemExample;
import com.raymond.oauth.service.CodeitemService;

@Service("codeitemService")
public class CodeitemServiceImpl extends GenericServiceImpl<Codeitem, Long>
		implements CodeitemService {

	@Resource
    private CodeitemMapper codeitemMapper;
	
	@Override
	public GenericDao<Codeitem, Long> getDao() {
		return codeitemMapper;
	}

	@Override
	public List<Codeitem> findCodeItem(String codemap) {
		CodeitemExample example = new CodeitemExample();
		example.createCriteria().andCodemapEqualTo(codemap);
		example.setOrderByClause(" sort asc");
		return codeitemMapper.selectByExample(example);
	}

	@Override
	public Codeitem findCodeItem(String codemap, String value) {
		CodeitemExample example = new CodeitemExample();
		CodeitemExample.Criteria c = example.createCriteria();
		c.andCodemapEqualTo(codemap);
		c.andCodeEqualTo(value);
		List<Codeitem> list = codeitemMapper.selectByExample(example);
		if(list.size()!=0){
			return list.get(0);
		}
		return null;
	}

	@Override
	public Page<Codeitem> findCodeItem(String codemap, Page<Codeitem> page) {
		CodeitemExample example = new CodeitemExample();
		example.createCriteria().andCodemapEqualTo(codemap);
		example.setOrderByClause(" sort asc");
		codeitemMapper.selectByExample(example, page);
		return page;
	}
 
	@Override
	@ServiceLog(text="新增代码值")
	public int insert(Codeitem model) {
		CodeitemExample example = new CodeitemExample();
		CodeitemExample.Criteria c = example.createCriteria();
		c.andCodeEqualTo(model.getCode());
		c.andCodemapEqualTo(model.getCodemap());
		List<Codeitem> list = codeitemMapper.selectByExample(example);
		if(list.size()!=0){
			throw new MyException("代码值不能重复");
		}
		return codeitemMapper.insertSelective(model);
	}	

	@Override
	@ServiceLog(text="修改代码值")
	public int update(Codeitem model) {
		Codeitem item = codeitemMapper.selectByPrimaryKey(model.getId());
		if(!item.getCode().equals(model.getCode())){
			CodeitemExample example = new CodeitemExample();
			CodeitemExample.Criteria c = example.createCriteria();
			c.andCodeEqualTo(model.getCode());
			c.andCodemapEqualTo(model.getCodemap());
			List<Codeitem> list = codeitemMapper.selectByExample(example);
			if(list.size()!=0){
				throw new MyException("代码值不能重复");
			}
		}
		return codeitemMapper.updateByPrimaryKeySelective(model);
	}
	
	@Override
	@ServiceLog(text="删除代码值")
	public int delete(Long id) {
		return codeitemMapper.deleteByPrimaryKey(id);
	}
	
	@Override
	public Map<String,Codeitem> findByCode(String codemap){
		CodeitemExample example = new CodeitemExample();
		example.createCriteria().andCodemapEqualTo(codemap);
		List<Codeitem> list = codeitemMapper.selectByExample(example);
		Map<String,Codeitem> map = new HashMap<String,Codeitem>();
		for (Codeitem codeItem : list) {
			map.put(codeItem.getCode(),codeItem);
		}
		return map;
	}

	@Override
	public Map<Integer, Codeitem> findIntCode(String codemap) {
		CodeitemExample example = new CodeitemExample();
		example.createCriteria().andCodemapEqualTo(codemap);
		List<Codeitem> list = codeitemMapper.selectByExample(example);
		Map<Integer,Codeitem> map = new HashMap<Integer,Codeitem>();
		for(Codeitem ci : list){
			try{
				map.put(Integer.parseInt(ci.getCode()), ci);
			}catch(Exception e){
				
			}
		}
		return map;
	}
}
