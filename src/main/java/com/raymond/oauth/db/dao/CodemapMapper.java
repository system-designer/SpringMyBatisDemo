package com.raymond.oauth.db.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.raymond.core.generic.GenericDao;
import com.raymond.oauth.db.model.Codemap;
import com.raymond.oauth.db.model.CodemapExample;

public interface CodemapMapper extends GenericDao<Codemap, Long>{
    int countByExample(CodemapExample example);

    int deleteByExample(CodemapExample example);

    int deleteByPrimaryKey(Long id);

    int insert(Codemap record);

    int insertSelective(Codemap record);

    List<Codemap> selectByExample(CodemapExample example);

    Codemap selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Codemap record, @Param("example") CodemapExample example);

    int updateByExample(@Param("record") Codemap record, @Param("example") CodemapExample example);

    int updateByPrimaryKeySelective(Codemap record);

    int updateByPrimaryKey(Codemap record);
}