package com.raymond.oauth.service;

import java.util.Map;

import com.raymond.oauth.db.model.Menu;

public interface AuthService{

    /**

     * 加载过滤配置信息

     * @return

     */

    public String loadFilterChainDefinitions();

    

    /**

     * 重新构建权限过滤器

     * 一般在修改了用户角色、用户等信息时，需要再次调用该方法

     */

    public void reCreateFilterChains();

    public Map<String,Map<String,Menu>> getMenus();

}