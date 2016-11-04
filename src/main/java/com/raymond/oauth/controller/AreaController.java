package com.raymond.oauth.controller;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.raymond.core.common.JsonMessage;
import com.raymond.core.feature.orm.mybatis.Page;
import com.raymond.oauth.db.model.Area;
import com.raymond.oauth.db.model.AreaExample;
import com.raymond.oauth.service.AreaService;

@Controller
@RequestMapping("/area")
public class AreaController {
	@Resource
	private AreaService areaService;
	
	@RequestMapping(value="/index")
	public String index(Model model){
		return "area/area";
	}
	
	/**
	 * 翻页查询地区
	 * @param page
	 * @param area
	 * @return
	 */
	@RequestMapping(value="/pager")
	@ResponseBody
	public Page<Area> findByPage(Page<Area> page,Area area){
		AreaExample example = new AreaExample();
		AreaExample.Criteria c = example.createCriteria();
		if(area.getCode()!=null){
			c.andCodeEqualTo(area.getCode());
		}
		if(area.getCityCn()!=null){
			c.andCityCnLike("%"+area.getCityCn()+"%");
		}
		if(area.getCityEn()!=null){
			c.andCityEnLike("%"+area.getCityEn()+"%");
		}
		if(area.getParent()!=null){
			c.andParentEqualTo(area.getParent());
		}
		if(area.getType()!=null){
			c.andTypeEqualTo(area.getType());
		}
		if (area.getOrder() != null) {
			c.andOrderEqualTo(area.getOrder());
		}
		example.setOrderByClause(page.getPageSorts());
		return areaService.selectByExample(example, page);
	}
	
	@RequestMapping(value="/detail")
	@ResponseBody
	public Area detail(@RequestParam(value="id",required=true) long id){
		
		return areaService.detail(id);
	}
	
	
	/**
	 * 查询列表
	 * @param area
	 * @return
	 */
	@RequestMapping(value="/list")
	@ResponseBody
	public List<Area> findList(Area area){
		AreaExample example = new AreaExample();
		AreaExample.Criteria c = example.createCriteria();
		if(area.getCode()!=null){
			c.andCodeEqualTo(area.getCode());
		}
		if(area.getCityCn()!=null){
			c.andCityCnLike("%"+area.getCityCn()+"%");
		}
		if(area.getCityEn()!=null){
			c.andCityEnLike("%"+area.getCityEn()+"%");
		}
		if(area.getParent()!=null){
			c.andParentEqualTo(area.getParent());
		}
		if(area.getType()!=null){
			c.andTypeEqualTo(area.getType());
		}
		example.setOrderByClause(" city_en_ asc");
		return areaService.selectByExample(example);
	}
	
	/**
	 * 保存城市地区
	 * @param area
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JsonMessage saveArea(Area area){
		if(area.getId()!=null){
			areaService.update(area);
		}else{
			areaService.insert(area);
		}
		return new JsonMessage("保存成功!");
	}
	
	@RequestMapping(value="/del")
	@ResponseBody
	public JSONObject del(@RequestParam(value="id",required=true) long id){
		
		return areaService.del(id);
	}
}
