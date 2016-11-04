package com.raymond.oauth.db.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.raymond.core.generic.GenericDao;
import com.raymond.oauth.db.model.Menu;
import com.raymond.oauth.db.model.MenuExample;

public interface MenuMapper  extends GenericDao<Menu, String>{
    int countByExample(MenuExample example);

    int deleteByExample(MenuExample example);

    int deleteByPrimaryKey(String id);

    int insert(Menu record);

    int insertSelective(Menu record);

    List<Menu> selectByExample(MenuExample example);

    Menu selectByPrimaryKey(String id);

    int updateByExampleSelective(@Param("record") Menu record, @Param("example") MenuExample example);

    int updateByExample(@Param("record") Menu record, @Param("example") MenuExample example);

    int updateByPrimaryKeySelective(Menu record);

    int updateByPrimaryKey(Menu record);
    
    Menu selectByUrl(String url);
    
    List<Menu> selectByUserId(Long userId);
    
    List<Menu> selectMenuRule();
    
    List<Menu> selectByRoleId(Long roleId);
    
    int insertRoleMenu(@Param("roleId") Long roleId,@Param("menuId") String menuId);
    
    int deleteByRoleId(Long roleId);
    
    int deleteByMenuId(@Param("menuId") String menuId);
}