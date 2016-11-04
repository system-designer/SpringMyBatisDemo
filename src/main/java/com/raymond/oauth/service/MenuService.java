package com.raymond.oauth.service;

import java.util.List;

import com.raymond.core.generic.GenericService;
import com.raymond.oauth.db.model.Menu;
/**
 * 菜单 业务接口
 * @author chen_zx
 *
 */
public interface MenuService extends GenericService<Menu, String>{
	/**
	 * 根据 地址查询
	 * @param url
	 * @return
	 */
	Menu selectByUrl(String url);
	/**
	 * 角色权限树  
	 * @param roleId
	 * @return
	 */
	List<Menu> selectByRoleId(Long roleId);
	
	void saveRoleMenu(Long roleId,String[] menus);
	/**
	 * 用户菜单
	 * @param userId
	 * @return
	 */
	List<Menu> selectByUserId(Long userId);
	
}
