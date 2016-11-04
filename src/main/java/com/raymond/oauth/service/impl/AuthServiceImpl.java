package com.raymond.oauth.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;

import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.mgt.DefaultFilterChainManager;
import org.apache.shiro.web.filter.mgt.PathMatchingFilterChainResolver;
import org.apache.shiro.web.servlet.AbstractShiroFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.raymond.oauth.db.dao.MenuMapper;
import com.raymond.oauth.db.model.Menu;
import com.raymond.oauth.db.model.MenuExample;
import com.raymond.oauth.service.AuthService;

@Service(value="authService")
public class AuthServiceImpl implements AuthService{
    //注意/r/n前不能有空格

    private static final String CRLF= "\r\n";

    private static final String LAST_AUTH_STR= "/** =authc\r\n";

    @Autowired(required=false)
    private ShiroFilterFactoryBean shiroFilterFactoryBean;
    
    @Resource
    private MenuMapper menuMapper;
    
	private Map<String,Menu> menuId = new HashMap<String,Menu>();
	private Map<String,Menu> menuUrl = new HashMap<String,Menu>();

    @Override

    public String loadFilterChainDefinitions() {
    	List<Menu> all = menuMapper.selectByExample(new MenuExample());
    	menuId.clear();
    	menuUrl.clear();
		for(Menu m:all){
			menuId.put(m.getId(), m);
			menuUrl.put(m.getUrl(), m);
		}
       StringBuffer sb = new StringBuffer("");
       sb.append(getFixedAuthRule())
       .append(getDynaAuthRule())
       .append(getRestfulOperationAuthRule())
       .append(LAST_AUTH_STR);
      return sb.toString();

    }

    

    /**
     * 生成restful风格功能权限规则 后期再调整
     * @return
     */

    private String getRestfulOperationAuthRule() {
    	
      List<Menu> urls = menuMapper.selectMenuRule();
       StringBuffer sb  = new StringBuffer("");

       for(Menu menu :urls ) {
    	   String url = menu.getUrl();
            if( url.startsWith("/")) {
            	sb.append(url).append("=").append("authc, anyroles[").append(menu.getRoles()).append("]").append(CRLF);
           }
       }

       return sb.toString();
       

    }
    

    //根据角色，得到动态权限规则

    private String getDynaAuthRule() {

       StringBuffer sb = new StringBuffer("");
       /*
       Map<String, Set<String>> rules = new HashMap<String,Set<String>>();
     List<Role> roles = dao.queryEntitys("from Role r left join fetch r.menus", newObject[]{});
      for(Role role: roles) {
           for(Iterator<Menu> menus = role.getMenus().iterator(); menus.hasNext();) {
              String url = menus.next().getUrl();
              if(!url.startsWith("/")) {
                  url = "/"+ url;
             }
             if(!rules.containsKey(url)) {
                  rules.put(url, new HashSet<String>());
              }
              rules.get(url).add((role.getRoleCode()));
           }
       }
       for(Map.Entry<String, Set<String>> entry :rules.entrySet()) {
           sb.append(entry.getKey()).append(" = ").append("authc,anyroles").append(entry.getValue()).append(CRLF);
       }
     */ 

       return sb.toString();

    }

    //得到固定权限验证规则串

    private String getFixedAuthRule() {

       StringBuffer sb = new StringBuffer("");
       ClassPathResource cp = new ClassPathResource("fixed_shiro_auth.properties");
       Properties properties = new Properties();
       try{
           properties.load(cp.getInputStream());
       } catch(IOException e) {

           throw new RuntimeException("load fixed_shiro_auth.properties error!");

       }

       for(Iterator<Object> its = properties.keySet().iterator();its.hasNext();) {
           String key = (String)its.next();
           sb.append(key).append(" = ").append(properties.getProperty(key).trim()).append(CRLF);
       }      

       return sb.toString();

       

    }

    

    @Override

    //此方法加同步锁

    public synchronized void reCreateFilterChains() {
       AbstractShiroFilter shiroFilter = null;
       try{
           shiroFilter = (AbstractShiroFilter)shiroFilterFactoryBean.getObject();
      } catch(Exception e) {
           throw new RuntimeException("get ShiroFilter from shiroFilterFactoryBean error!");
       }

       PathMatchingFilterChainResolver filterChainResolver =(PathMatchingFilterChainResolver)shiroFilter.getFilterChainResolver();

       DefaultFilterChainManager manager =(DefaultFilterChainManager)filterChainResolver.getFilterChainManager();

       //清空老的权限控制

       manager.getFilterChains().clear();

       shiroFilterFactoryBean.getFilterChainDefinitionMap().clear();

       shiroFilterFactoryBean.setFilterChainDefinitions(loadFilterChainDefinitions());

       //重新构建生成

       Map<String, String> chains = shiroFilterFactoryBean.getFilterChainDefinitionMap();

        for(Map.Entry<String, String> entry :chains.entrySet()) {

            String url = entry.getKey();

            String chainDefinition =entry.getValue().trim().replace(" ", "");

            manager.createChain(url,chainDefinition);

        }

    }

	public ShiroFilterFactoryBean getShiroFilterFactoryBean() {
		return shiroFilterFactoryBean;
	}

	public void setShiroFilterFactoryBean(
			ShiroFilterFactoryBean shiroFilterFactoryBean) {
		this.shiroFilterFactoryBean = shiroFilterFactoryBean;
	}



	@Override
	public Map<String, Map<String, Menu>> getMenus() {
		Map<String, Map<String, Menu>> map = new HashMap<String, Map<String, Menu>>();
		map.put("menuId", menuId);
		map.put("menuUrl", menuUrl);
		return map;
	}


}