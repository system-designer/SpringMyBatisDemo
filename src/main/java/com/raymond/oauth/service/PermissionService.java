package com.raymond.oauth.service;

import java.util.List;

import com.raymond.core.generic.GenericService;
import com.raymond.oauth.db.model.Permission;

/**
 * 权限 业务接口
 * 
 * @author chen_zx
 * 
 **/
public interface PermissionService extends GenericService<Permission, Long> {

    /**
     * 通过角色id 查询角色 拥有的权限
     * 
     * @param roleId
     * @return
     */
    List<Permission> selectPermissionsByRoleId(Long roleId);

}
