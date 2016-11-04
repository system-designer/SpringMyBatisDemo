package com.raymond.oauth.service.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.raymond.core.ServiceLog;
import com.raymond.core.exception.MyException;
import com.raymond.core.generic.GenericDao;
import com.raymond.core.generic.GenericServiceImpl;
import com.raymond.core.util.ApplicationUtils;
import com.raymond.oauth.db.dao.UserMapper;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.db.model.UserExample;
import com.raymond.oauth.service.UserService;

/**
 * 用户Service实现类
 *
 * @author chen_zx
 * 
 */
@Service("userService")
public class UserServiceImpl extends GenericServiceImpl<User, Long> implements UserService {

    @Resource
    private UserMapper userMapper;

    @Override
    public GenericDao<User, Long> getDao() {
        return userMapper;
    }

    @Override
    public User authentication(User user) {
        return userMapper.authentication(user);
    }

    @Override
    public User selectByUsername(String username) {
        UserExample example = new UserExample();
        example.createCriteria().andUsernameEqualTo(username);
        final List<User> list = userMapper.selectByExample(example);
        return list.get(0);
    }

	@Override
	@ServiceLog(text="新增/修改用户")
	public void saveUser(User user, Long[] roles) {
		if(user.getId()!=null){
			User u = userMapper.selectByPrimaryKey(user.getId());
			if(!u.getUsername().equals(user.getUsername())){
				UserExample example = new UserExample();
				example.createCriteria().andUsernameEqualTo(user.getUsername());
				List<User> list = userMapper.selectByExample(example);
				if(list.size()!=0){
					throw new MyException("登录账户不能重复");
				}
			}
			userMapper.deleteByUserId(user.getId());
			userMapper.updateByPrimaryKeySelective(user);
			for(Long id : roles){
				userMapper.insertUserRole(id, user.getId());
			}
		}else{
			UserExample example = new UserExample();
			example.createCriteria().andUsernameEqualTo(user.getUsername());
			List<User> list = userMapper.selectByExample(example);
			if(list.size()!=0){
				throw new MyException("登录账户不能重复");
			}
			user.setPassword(ApplicationUtils.md5Hex("123456"));
			user.setCreateTime(new Date());
			user.setState("01");
			userMapper.insert(user);
			for(Long id : roles){
				userMapper.insertUserRole(id, user.getId());
			}
		}
		
	}

 	@Override
 	@ServiceLog(text="密码修改")
 	public int update(User model) {
  		return userMapper.updateByPrimaryKeySelective(model);
 	}
 	/**
     * 含有指定角色的用户
     * @param roles
     * @return
     */
    public List<User> selectByRoles(List<String> roles){
    	return userMapper.selectByRoles(roles);
    }
    /**
     * 含有指定菜单的用户
     * @param menus
     * @return
     */
    public List<User> selectByMenus(List<String> menus){
    	return userMapper.selectByMenus(menus);
    }
}
