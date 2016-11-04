package com.raymond.oauth.db.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.raymond.core.generic.GenericDao;
import com.raymond.oauth.db.model.Role;
import com.raymond.oauth.db.model.RoleExample;

public interface RoleMapper extends GenericDao<Role, Long>{
    int countByExample(RoleExample example);

    int deleteByExample(RoleExample example);

    int deleteByPrimaryKey(Long id);

    int insert(Role record);

    int insertSelective(Role record);

    List<Role> selectByExample(RoleExample example);

    Role selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Role record, @Param("example") RoleExample example);

    int updateByExample(@Param("record") Role record, @Param("example") RoleExample example);

    int updateByPrimaryKeySelective(Role record);

    int updateByPrimaryKey(Role record);
    
    /**
     * 通过用户id 查询用户 拥有的角色
     * 
     * @param id
     * @return
     */
    List<Role> selectRolesByUserId(Long userId);
    
    List<Role> selectCheckedByUserId(@Param("id") Long id, @Param("level") Integer level);
}