package com.raymond.oauth.db.dao;

import com.raymond.oauth.db.model.VisitIpSta;
import com.raymond.oauth.db.model.VisitIpStaExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface VisitIpStaMapper {
    int countByExample(VisitIpStaExample example);

    int deleteByExample(VisitIpStaExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(VisitIpSta record);

    int insertSelective(VisitIpSta record);

    List<VisitIpSta> selectByExample(VisitIpStaExample example);

    VisitIpSta selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") VisitIpSta record, @Param("example") VisitIpStaExample example);

    int updateByExample(@Param("record") VisitIpSta record, @Param("example") VisitIpStaExample example);

    int updateByPrimaryKeySelective(VisitIpSta record);

    int updateByPrimaryKey(VisitIpSta record);
}