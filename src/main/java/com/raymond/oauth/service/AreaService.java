package com.raymond.oauth.service;

import com.raymond.core.generic.GenericService;
import com.raymond.oauth.db.model.Area;
import net.sf.json.JSONObject;

import java.util.List;
import java.util.Map;

public interface AreaService extends GenericService<Area, Long> {
	public String getCode(String enName);

	public Area detail(long id);

	public JSONObject del(long id);

	public Map<String, Area> getMap();
	
	public String getCnName(String enName);

	Area getCity(String cityId);

	List<Area> getCityList();
}
