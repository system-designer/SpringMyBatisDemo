package com.raymond.oauth.controller;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.raymond.core.common.JsonMessage;
import com.raymond.core.feature.orm.mybatis.Page;
import com.raymond.oauth.db.model.Menu;
import com.raymond.oauth.db.model.MenuExample;
import com.raymond.oauth.db.model.Role;
import com.raymond.oauth.db.model.RoleExample;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.service.MenuService;
import com.raymond.oauth.service.RoleService;

@Controller
@RequestMapping("/sys")
public class BaseController {
	@Resource
	private MenuService menuService;
	
	@Resource
	private RoleService roleService;
	
	@RequestMapping(value="/menu/index")
	public String menu(Model model){
		MenuExample example = new MenuExample();
		MenuExample.Criteria c = example.createCriteria();
		c.andLevelEqualTo(0);
		c.andUrlEqualTo("#");
		menuService.selectByExample(example);
		model.addAttribute("parent", menuService.selectByExample(example));
		return "sys/menu";
	}
	
	@RequestMapping(value="/role/index")
	public String role(Model model){
		return "sys/role";
	}
	
	@RequestMapping(value="/role/find/{id}")
	@ResponseBody
	public Role getMenu(@PathVariable("id") Long id){
		Role role = roleService.selectById(id);
		return role;
	}
	@RequestMapping(value="/role/add")
	@ResponseBody
	public JsonMessage saveRole(Role menu){
		if(menu.getId()!=null){
			roleService.update(menu);
		}else{
			roleService.insert(menu);
		}
		return new JsonMessage("保存成功!");
	}
	@RequestMapping(value="/role/pager")
	@ResponseBody
	public Page<Role> getRole(Page<Role> page,Role role){
		RoleExample example = new RoleExample();
		RoleExample.Criteria c = example.createCriteria();
		if(role.getRoleName()!=null){
			c.andRoleNameLike("%"+role.getRoleName()+"%");
		}
		if(role.getRoleSign()!=null){
			c.andRoleSignLike("%"+role.getRoleSign()+"%");
		}
		return roleService.selectByExample(example, page);
	}
	
	@RequestMapping(value="/role/all")
	@ResponseBody
	public List<Role> getRoleAll(){
		RoleExample example = new RoleExample();
		RoleExample.Criteria c = example.createCriteria();
		User user = (User) SecurityUtils.getSubject().getPrincipal();
		c.andRoleLevelGreaterThanOrEqualTo(user.getUserLevel());
		return roleService.selectByExample(example);
	}
	
	@RequestMapping(value="/menu/all")
	@ResponseBody
	public List<Menu> getAll(){
		return menuService.selectByExample(new MenuExample());
	}
	
	@RequestMapping(value="/menu/tree/{roleId}")
	@ResponseBody
	public JSONObject getTree(@PathVariable("roleId") Long roleId){
		JSONObject json = new JSONObject();
		json.put("roleId", roleId);
		List<Menu> list = menuService.selectByRoleId(roleId);
		json.put("tree", list);
		String menus = "";
		for(Menu menu : list){
			if(menu.getChecked()){
				menus +=","+menu.getId();
			}
		}
		if(!"".equals(menus)){
			menus = menus.substring(1);
		}
		json.put("menus", menus);
		return json;
	}
	
	@RequestMapping(value="/role/menu")
	@ResponseBody
	public JsonMessage saveRoleMenu(@RequestParam(value="roleId",required=true) Long roleId,@RequestParam(value="menus",required=true) String menus){
		menuService.saveRoleMenu(roleId, menus.split(","));
		return new JsonMessage("新增成功!");
	}
	
	@RequestMapping(value="/menu/find/{id}")
	@ResponseBody
	public Menu getMenu(@PathVariable("id") String id){
		return menuService.selectById(id);
	}
	
	@RequestMapping(value="/menu/add")
	@ResponseBody
	public JsonMessage saveMenu(Menu menu){
		if("#".equals(menu.getUrl())||menu.getParent()==null||"".equals(menu.getParent())){
			menu.setLevel(0);
		}else{
			menu.setLevel(1);
		}
		menuService.insert(menu);
		return new JsonMessage("新增成功!");
	}
	
	@RequestMapping(value="/menu/update")
	@ResponseBody
	public JsonMessage updateMenu(Menu menu){
		if("#".equals(menu.getUrl())||menu.getParent()==null||"".equals(menu.getParent())){
			menu.setLevel(0);
		}else{
			menu.setLevel(1);
		}
		menuService.update(menu);
		return new JsonMessage("修改成功!");
	}
	
	@RequestMapping(value="/menu/delete")
	@ResponseBody
	public JsonMessage deleteMenu(Menu menu){
		menuService.delete(menu.getId());
		return new JsonMessage("删除成功!");
	}
	
	@RequestMapping(value="/menu/pager")
	@ResponseBody
	public Page<Menu> getMenu(Page<Menu> page,Menu menu){
		MenuExample example = new MenuExample();
		MenuExample.Criteria c = example.createCriteria();
		if(menu.getParent()!=null){
			c.andParentEqualTo(menu.getParent());
		}
		if(menu.getName()!=null){
			c.andNameLike("%"+menu.getName()+"%");
		}
		return menuService.selectByExample(example, page);
	}
}
