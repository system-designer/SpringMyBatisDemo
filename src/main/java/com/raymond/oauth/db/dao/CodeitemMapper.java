package com.raymond.oauth.db.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.raymond.core.generic.GenericDao;
import com.raymond.oauth.db.model.Codeitem;
import com.raymond.oauth.db.model.CodeitemExample;

public interface CodeitemMapper extends GenericDao<Codeitem, Long>{
    int countByExample(CodeitemExample example);

    int deleteByExample(CodeitemExample example);

    int deleteByPrimaryKey(Long id);

    int insert(Codeitem record);

    int insertSelective(Codeitem record);

    List<Codeitem> selectByExample(CodeitemExample example);

    Codeitem selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Codeitem record, @Param("example") CodeitemExample example);

    int updateByExample(@Param("record") Codeitem record, @Param("example") CodeitemExample example);

    int updateByPrimaryKeySelective(Codeitem record);

    int updateByPrimaryKey(Codeitem record);
}