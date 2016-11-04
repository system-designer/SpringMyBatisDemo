package com.raymond.oauth.db.dao;

import com.raymond.oauth.db.model.VisitUserSta;
import com.raymond.oauth.db.model.VisitUserStaExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface VisitUserStaMapper {
    int countByExample(VisitUserStaExample example);

    int deleteByExample(VisitUserStaExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(VisitUserSta record);

    int insertSelective(VisitUserSta record);

    List<VisitUserSta> selectByExample(VisitUserStaExample example);

    VisitUserSta selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") VisitUserSta record, @Param("example") VisitUserStaExample example);

    int updateByExample(@Param("record") VisitUserSta record, @Param("example") VisitUserStaExample example);

    int updateByPrimaryKeySelective(VisitUserSta record);

    int updateByPrimaryKey(VisitUserSta record);
}