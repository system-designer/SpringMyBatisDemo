package com.raymond.oauth.service;

import java.util.List;

import com.raymond.core.generic.GenericService;
import com.raymond.oauth.db.model.User;

/**
 * 用户 业务 接口
 * 
 * @author chen_zx
 * 
 **/
public interface UserService extends GenericService<User, Long> {

    /**
     * 用户验证
     * 
     * @param user
     * @return
     */
    User authentication(User user);

    /**
     * 根据用户名查询用户
     * 
     * @param username
     * @return
     */
    User selectByUsername(String username);
    
    void saveUser(User user,Long[] roles);
    
    /**
     * 含有指定角色的用户
     * @param roles
     * @return
     */
    List<User> selectByRoles(List<String> roles);
    /**
     * 含有指定菜单的用户
     * @param menus
     * @return
     */
    List<User> selectByMenus(List<String> menus);
}
