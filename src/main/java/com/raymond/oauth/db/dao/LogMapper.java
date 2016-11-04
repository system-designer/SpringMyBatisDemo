package com.raymond.oauth.db.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.raymond.core.generic.GenericDao;
import com.raymond.oauth.db.model.Log;
import com.raymond.oauth.db.model.LogExample;

public interface LogMapper extends GenericDao<Log, Long>{
    int countByExample(LogExample example);

    int deleteByExample(LogExample example);

    int deleteByPrimaryKey(Long id);

    int insert(Log record);

    int insertSelective(Log record);

    List<Log> selectByExample(LogExample example);

    Log selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Log record, @Param("example") LogExample example);

    int updateByExample(@Param("record") Log record, @Param("example") LogExample example);

    int updateByPrimaryKeySelective(Log record);

    int updateByPrimaryKey(Log record);
}