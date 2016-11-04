package com.raymond.oauth.service;

import java.util.List;

import com.raymond.core.generic.GenericService;
import com.raymond.oauth.db.model.Role;

/**
 * 角色 业务接口
 * 
 * @author chen_zx
 * 
 **/
public interface RoleService extends GenericService<Role, Long> {
    /**
     * 通过用户id 查询用户 拥有的角色
     * 
     * @param userId
     * @return
     */
    List<Role> selectRolesByUserId(Long userId);
    
    /**
     * 通过用户id 查询用户 选中的角色
     * @param userId
     * @return
     */
    List<Role> selectCheckedByUserId(Long userId);
}
