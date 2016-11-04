package com.raymond.oauth.service.impl;

import com.raymond.core.exception.MyException;
import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.oauth.db.dao.AreaMapper;
import com.raymond.oauth.db.model.Area;
import com.raymond.oauth.db.model.AreaExample;
import com.raymond.oauth.service.AreaService;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("areaService")
public class AreaServiceImpl extends GenericServiceImpl<Area, Long> implements
		AreaService {
	@Resource
	private AreaMapper areaMapper;

	@Override
	public GenericDao<Area, Long> getDao() {
		return areaMapper;
	}

	/*
	 * 获取英文名称
	 * 
	 * @param enName
	 * 
	 * @return 2015年7月10日
	 */
	@Override
	public String getCode(String enName) {
		AreaExample ex = new AreaExample();
		ex.createCriteria().andCityEnEqualTo(enName);
		List<Area> list = areaMapper.selectByExample(ex);
		if (list == null || list.size() == 0)
			throw new MyException("查无此城市！请确保小学语文过关！");
		return list.get(0).getCode();
	}

	/*
	 * TODO
	 * 
	 * @param id
	 * 
	 * @return 2015年9月14日
	 */
	@Override
	public Area detail(long id) {
		return areaMapper.selectByPrimaryKey(id);
	}

	/*
	 * TODO
	 * 
	 * @param id
	 * 
	 * @return 2015年9月14日
	 */
	@Override
	public JSONObject del(long id) {
		areaMapper.deleteByPrimaryKey(id);
		JSONObject obj = new JSONObject();
		obj.put("msg", "删除成功！");
		return obj;
	}

	@Override
	public Map<String, Area> getMap() {
		List<Area> list = areaMapper.selectByExample();

		Map<String, Area> map = new HashMap<String, Area>();
		if (list != null) {
			for (Area o : list) {
				map.put(o.getCode(), o);
			}
		}

		return map;
	}


	/*
	 * TODO
	 * 
	 * @param enName
	 * 根据城市英文名查找中文名
	 * @return 2016年1月11日
	 */
	@Override
	public String getCnName(String enName) {
		AreaExample ex = new AreaExample();
		ex.createCriteria().andCityEnEqualTo(enName);
		List<Area> list = areaMapper.selectByExample(ex);
		if (list == null || list.size() == 0)
			throw new MyException("查无此城市！请确保小学语文过关！");
		return list.get(0).getCityCn();
	}

	@Override
	public Area getCity(String cityId) {
		if (StringUtils.isEmpty(cityId)) {
			return null;
		}
		AreaExample ex = new AreaExample();
		ex.createCriteria().andCodeEqualTo(cityId);
		List<Area> list = areaMapper.selectByExample(ex);
		if (list == null || list.size() == 0)
			throw new MyException("查无此城市！cityId=" + cityId );
		return list.get(0);
	}

	@Override
	public List<Area> getCityList() {
		AreaExample ex = new AreaExample();
		ex.createCriteria().andParentIsNull();
		ex.setOrderByClause(" code_ asc ");
		List<Area> areas = areaMapper.selectByExample(ex);
		return areas;
	}
}
