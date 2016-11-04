package com.raymond.oauth.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.shiro.SecurityUtils;
import org.springframework.stereotype.Service;

import com.raymond.core.ServiceLog;
import com.raymond.core.exception.MyException;
import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.oauth.db.dao.RoleMapper;
import com.raymond.oauth.db.model.Role;
import com.raymond.oauth.db.model.RoleExample;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.service.AuthService;
import com.raymond.oauth.service.RoleService;

/**
 * 角色Service实现类
 *
 * @author chen_zx
 * 
 */
@Service("roleService")
public class RoleServiceImpl extends GenericServiceImpl<Role, Long> implements RoleService {

    @Resource
    private RoleMapper roleMapper;
    @Resource
    private AuthService authService;

    @Override
    public GenericDao<Role, Long> getDao() {
        return roleMapper;
    }

    @Override
    public List<Role> selectRolesByUserId(Long userId) {
        return roleMapper.selectRolesByUserId(userId);
    }

	@Override
	public List<Role> selectCheckedByUserId(Long userId) {
		User user = (User) SecurityUtils.getSubject().getPrincipal();
		return roleMapper.selectCheckedByUserId(userId,user.getUserLevel());
	}
	@ServiceLog(text="新增角色")
	public int insert(Role role){
		RoleExample example = new RoleExample();
		example.createCriteria().andRoleSignEqualTo(role.getRoleSign());
		List<Role> list = roleMapper.selectByExample(example);
		if(list.size()!=0){
			throw new MyException("角色代码不能重复");
		}
		return roleMapper.insertSelective(role);
	}
	
	@ServiceLog(text="修改角色")
	public int update(Role role){
		Role r = roleMapper.selectByPrimaryKey(role.getId());
		if(!r.getRoleSign().equals(role.getRoleSign())){
			RoleExample example = new RoleExample();
			example.createCriteria().andRoleSignEqualTo(role.getRoleSign());
			List<Role> list = roleMapper.selectByExample(example);
			if(list.size()!=0){
				throw new MyException("角色代码不能重复");
			}
		}
		authService.reCreateFilterChains();
		return roleMapper.updateByPrimaryKeySelective(role);
	}
}
