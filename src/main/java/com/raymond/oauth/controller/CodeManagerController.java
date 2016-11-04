package com.raymond.oauth.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.raymond.core.common.JsonMessage;
import com.raymond.core.feature.orm.mybatis.Page;
import com.raymond.oauth.db.model.Codeitem;
import com.raymond.oauth.db.model.CodeitemExample;
import com.raymond.oauth.db.model.Codemap;
import com.raymond.oauth.db.model.CodemapExample;
import com.raymond.oauth.service.CodeitemService;
import com.raymond.oauth.service.CodemapService;

@Controller
@RequestMapping("/code")
public class CodeManagerController {
	@Resource
	private CodemapService codemapManager;
	@Resource
	private CodeitemService codeitemManager;
	
	
	/**
	 * 参数管理页面
	 * @return
	 */
	@RequestMapping("/index")
	public String codeManager(){
		return "code/index";
	}
	/**
	 * 保存代码项
	 * @param codeMap
	 * @return
	 */
	@RequestMapping("/save")
	@ResponseBody
	public JsonMessage saveCode(Codemap codeMap){
		if(codeMap.getId()!=null){
			codemapManager.update(codeMap);
		}else{
			 codemapManager.insert(codeMap);
		}
		return new JsonMessage("保存成功!");
	}
	/**
	 * 查询代码项详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/{id}",method=RequestMethod.GET)
	@ResponseBody
	public Codemap getCode(@PathVariable("id") Long id){
		return codemapManager.selectById(id);
	}
	/**
	 * 翻页查询代码项
	 * @param page
	 * @param codemap
	 * @return
	 */
	@RequestMapping(value="/pager")
	@ResponseBody
	public Page<Codemap> findByPage(Page<Codemap> page,Codemap codemap){
		CodemapExample example = new CodemapExample();
		CodemapExample.Criteria c = example.createCriteria();
		if(codemap.getCode()!=null&&!"".equals(codemap.getCode())){
			c.andCodeLike("%"+codemap.getCode()+"%");
		}
		if(codemap.getName()!=null &&!"".equals(codemap.getName())){
			c.andNameLike("%"+codemap.getName()+"%");
		}
		example.setOrderByClause(page.getPageSorts());
		return codemapManager.selectByExample(example, page);
	}
	/**
	 * 根据代码翻页查询代码值
	 * @param page
	 * @param codemap
	 * @return
	 */
	@RequestMapping(value="/item/pager")
	@ResponseBody
	public Page<Codeitem> findCodeItemByPage(Page<Codeitem> page,@RequestParam(value="codemap",defaultValue="") String codemap){
		return codeitemManager.findCodeItem(codemap, page);
	}
	/**
	 * 保存代码值
	 * @param codeItem
	 * @return
	 */
	@RequestMapping("/item/save")
	@ResponseBody
	public JsonMessage saveCodeItem(Codeitem codeItem){
		if(codeItem.getId()!=null){
			codeitemManager.update(codeItem);
		}else{
			codeitemManager.insert(codeItem);
		}
		return new JsonMessage("保存成功!");
	}
	
	/**
	 * 查看代码值详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/item/{id}",method=RequestMethod.GET)
	@ResponseBody
	public Codeitem getCodeItem(@PathVariable("id") Long id){
		return codeitemManager.selectById(id);
	}
	
	/**
	 * 根据代码查询代码值列表
	 * @param codemap
	 * @return
	 */
	@RequestMapping(value="/items")
	@ResponseBody
	public List<Codeitem> findCodeItems(@RequestParam(value="codemap",required=true) String codemap){
		CodeitemExample example = new CodeitemExample();
		example.createCriteria().andCodemapEqualTo(codemap);
		example.setOrderByClause("sort asc");
		return codeitemManager.selectByExample(example);
	}
	
	/**
	 * 代码值删除
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/item/delete/{id}")
	@ResponseBody
	public JsonMessage delete(@PathVariable("id") Long id){
		 codeitemManager.delete(id);
		return new JsonMessage("删除成功!");
	}
	
}
