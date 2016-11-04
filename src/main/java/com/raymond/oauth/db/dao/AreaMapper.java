package com.raymond.oauth.db.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.raymond.core.generic.GenericDao;
import com.raymond.oauth.db.model.Area;
import com.raymond.oauth.db.model.AreaExample;

public interface AreaMapper extends GenericDao<Area, Long>{
    int countByExample(AreaExample example);

    int deleteByExample(AreaExample example);

    int deleteByPrimaryKey(Long id);

    int insert(Area record);

    int insertSelective(Area record);

    List<Area> selectByExample(AreaExample example);

    Area selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Area record, @Param("example") AreaExample example);

    int updateByExample(@Param("record") Area record, @Param("example") AreaExample example);

    int updateByPrimaryKeySelective(Area record);

    int updateByPrimaryKey(Area record);
    
}