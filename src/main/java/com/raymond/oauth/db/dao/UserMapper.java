package com.raymond.oauth.db.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.raymond.core.feature.orm.mybatis.Page;
import com.raymond.core.generic.GenericDao;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.db.model.UserExample;

public interface UserMapper extends GenericDao<User, Long>{
    int countByExample(UserExample example);

    int deleteByExample(UserExample example);

    int deleteByPrimaryKey(Long id);

    int insert(User record);

    int insertSelective(User record);

    List<User> selectByExample(UserExample example);
    
    List<User> selectByExample(UserExample example,Page<User> page);

    User selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") User record, @Param("example") UserExample example);

    int updateByExample(@Param("record") User record, @Param("example") UserExample example);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
    
    /**
     * 用户登录验证查询
     * 
     * @param record
     * @return
     */
    User authentication(@Param("record") User record);
    
    int insertUserRole(@Param("roleId") Long roleId,@Param("userId") Long userId);
    
    int deleteByUserId(Long userId);
    /**
     * 含有指定角色的用户
     * @param roles
     * @return
     */
    List<User> selectByRoles(@Param("roles") List<String> roles);
    /**
     * 含有指定菜单的用户
     * @param menus
     * @return
     */
    List<User> selectByMenus(@Param("menus") List<String> menus);
}