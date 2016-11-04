package com.raymond.oauth.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.raymond.core.ServiceLog;
import com.raymond.core.exception.MyException;
import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.oauth.db.dao.MenuMapper;
import com.raymond.oauth.db.model.Menu;
import com.raymond.oauth.db.model.MenuExample;
import com.raymond.oauth.service.AuthService;
import com.raymond.oauth.service.MenuService;
/**
 * 菜单实现类
 * @author chen_zx
 *
 */
@Service("menuService")
public class MenuServiceImpl  extends GenericServiceImpl<Menu, String> implements MenuService {

	@Resource
    private MenuMapper menuMapper;
	
	@Resource
    private AuthService authService;

	@Override
	public GenericDao<Menu, String> getDao() {
		  return menuMapper;
	}

	@Override
	public Menu selectByUrl(String url) {
		return menuMapper.selectByUrl(url);
	}

	@Override
	public List<Menu> selectByRoleId(Long roleId) {
		return menuMapper.selectByRoleId(roleId);
	}

	@Override
	@ServiceLog(text="角色授权")
	public void saveRoleMenu(Long roleId, String[] menus) {
		menuMapper.deleteByRoleId(roleId);
		for(String menu : menus){
			menuMapper.insertRoleMenu(roleId, menu);
		}
		authService.reCreateFilterChains();
	}

	@Override
	public List<Menu> selectByUserId(Long userId) {
		return menuMapper.selectByUserId(userId);
	}
	
	@ServiceLog(text="新增菜单")
	public int insert(Menu menu){
		int result = menuMapper.insertSelective(menu);
		authService.reCreateFilterChains();
		return result;
	}
	
	@ServiceLog(text="修改菜单")
	public int update(Menu menu){
		int result = menuMapper.updateByPrimaryKeySelective(menu);
		authService.reCreateFilterChains();
		return result;
	}
	
	@Override
	@ServiceLog(text="删除菜单")
	public int delete(String id) {
		MenuExample me = new MenuExample();
		me.createCriteria().andParentEqualTo(id);
		int c = menuMapper.countByExample(me);
		if(c!=0){
			throw new MyException("有子级菜单,不能删除");
		}
		menuMapper.deleteByPrimaryKey(id);//删除菜单
		menuMapper.deleteByMenuId(id);//删除角色菜单关系
		authService.reCreateFilterChains();
		return super.delete(id);
	}

}
