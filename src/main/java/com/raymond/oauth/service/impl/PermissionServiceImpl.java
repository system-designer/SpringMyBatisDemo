package com.raymond.oauth.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.oauth.db.dao.PermissionMapper;
import com.raymond.oauth.db.model.Permission;
import com.raymond.oauth.service.PermissionService;

/**
 * 权限Service实现类
 *
 * @author chen_zx
 * 
 */
@Service("permissionService")
public class PermissionServiceImpl extends GenericServiceImpl<Permission, Long> implements PermissionService {

    @Resource
    private PermissionMapper permissionMapper;


    @Override
    public GenericDao<Permission, Long> getDao() {
        return permissionMapper;
    }

    @Override
    public List<Permission> selectPermissionsByRoleId(Long roleId) {
        return permissionMapper.selectPermissionsByRoleId(roleId);
    }
}