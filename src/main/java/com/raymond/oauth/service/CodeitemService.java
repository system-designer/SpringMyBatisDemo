package com.raymond.oauth.service;

import java.util.List;
import java.util.Map;

import com.raymond.core.feature.orm.mybatis.Page;
import com.raymond.core.generic.GenericService;
import com.raymond.oauth.db.model.Codeitem;

public interface CodeitemService extends GenericService<Codeitem, Long>{
	List<Codeitem> findCodeItem(String codemap);
	
	Page<Codeitem> findCodeItem(String codemap,Page<Codeitem> page);
	
	Codeitem findCodeItem(String codemap,String value);

	Map<String, Codeitem> findByCode(String codemap);
	/**
	 * code 转换为int类型
	 * @param codemap
	 * @return
	 */
	Map<Integer,Codeitem> findIntCode(String codemap);
}
