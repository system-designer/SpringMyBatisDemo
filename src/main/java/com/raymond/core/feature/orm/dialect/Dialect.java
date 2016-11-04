package com.raymond.core.feature.orm.dialect;

/**
 * 数据库方言抽象类
 * 
 * @author chen_zx
 * 
 **/
public abstract class Dialect {

    /**
     * 得到分页sql
     * 
     * @param sql
     * @param offset
     * @param limit
     * @return
     */
    public abstract String getLimitString(String sql, int offset, int limit);

    /**
     * 得到总数量 sql
     * 
     * @param sql
     * @return
     */
    public abstract String getCountString(String sql);

}
