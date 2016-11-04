package com.raymond.oauth.controller;

import java.nio.charset.Charset;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.base.Strings;
import com.google.common.hash.Hashing;
import com.raymond.core.common.JsonMessage;
import com.raymond.core.exception.MyException;
import com.raymond.core.feature.orm.mybatis.Page;
import com.raymond.core.util.ApplicationUtils;
import com.raymond.oauth.db.model.Codeitem;
import com.raymond.oauth.db.model.CodeitemExample;
import com.raymond.oauth.db.model.Role;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.db.model.UserExample;
import com.raymond.oauth.service.CodeitemService;
import com.raymond.oauth.service.MenuService;
import com.raymond.oauth.service.RoleService;
import com.raymond.oauth.service.UserService;

/**
 * 用户控制器
 * 
 * @author Raymond
 * 
 **/
@Controller
@RequestMapping(value = "/user")
public class UserController {

    @Resource
    private UserService userService;
    
    @Resource
    private RoleService roleService;

    @Resource
    private MenuService menuService;
    
    @Resource
    private CodeitemService codeitemService;
    
    /**
     * 用户登出
     * 
     * @param session
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpSession session) {
        session.removeAttribute("userInfo");
        // 登出操作
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        return "redirect:/login";
    }

    /**
     * 用户新增
     * 
     * @param session
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public JsonMessage add(User user,@RequestParam("roles") Long[] roles) {
    	userService.saveUser(user, roles);
    	return new JsonMessage("保存成功!");
    }
    
    
    @RequestMapping(value = "/pager")
    @ResponseBody
	public Page<User> pager(Page<User> pager,User user)throws Exception{   
    	User login = (User) SecurityUtils.getSubject().getPrincipal();
		UserExample example = new UserExample();
		UserExample.Criteria c = example.createCriteria();
		c.andUserLevelGreaterThanOrEqualTo(login.getUserLevel());
		
		if(user.getUsername()!=null&&!"".equals(user.getUsername()))
			c.andUsernameLike("%"+user.getUsername()+"%");
		if(user.getName()!=null&&!"".equals(user.getName()))
			c.andNameLike("%"+user.getName()+"%");
		if(user.getState()!=null){
			c.andStateEqualTo(user.getState());
		}
		example.setOrderByClause(pager.getPageSorts());
		return userService.selectByExample(example,pager);
	}
    
    @RequestMapping(value="/manager",method=RequestMethod.GET)
	public String userManagerIndex(Model model){
		return "user/manager";
	}
    
    @RequestMapping(value = "/userLevel")
    @ResponseBody
    public List<Codeitem> getUserLevel(@RequestParam("codemap") String codemap){
    	User user = (User) SecurityUtils.getSubject().getPrincipal();
    	CodeitemExample example  = new CodeitemExample();
    	CodeitemExample.Criteria c =  example.createCriteria();
    	c.andCodemapEqualTo(codemap);
    	c.andCodeGreaterThanOrEqualTo(user.getUserLevel().toString());
    	return codeitemService.selectByExample(example);
    }
    
	@RequestMapping(value="", method={RequestMethod.POST,RequestMethod.PUT})
	@ResponseBody
	public JsonMessage save(User user,@RequestParam("repassword") String repassword){
		if(user.getId() == null){
			if(Strings.isNullOrEmpty(repassword) || !repassword.equals(user.getPassword())){
				throw new MyException("两次输入的密码不一致");
			}
			userService.insert(user);
		}else{
			userService.update(user);
		}
		
		return new JsonMessage("保存成功!");
	}
	@RequestMapping(value="/{id}",method=RequestMethod.GET)
	@ResponseBody
	public JSONObject getUser(@PathVariable("id") Long id){
		JSONObject json = new JSONObject();
		json.put("user", userService.selectById(id));
		List<Role> list = roleService.selectCheckedByUserId(id);
		String roles = "";
		String roleNames = "";
		for(Role role:list){
			if(role.getChecked()){
				roles +=","+role.getId();
				roleNames +=","+role.getDescription();
			}
		}
		if(!"".equals(roles)){
			roles = roles.substring(1);
			roleNames = roleNames.substring(1);
		}
		json.put("roles", roles);
		json.put("roleNames", roleNames);
		json.put("tree", list);
		return json;
	}
	
	@RequestMapping(value="/chpwd", method = RequestMethod.POST)
	@ResponseBody
	public JsonMessage changePwd(@RequestParam("oldPassword") String oldPwd,
			@RequestParam("newPassword") String newPwd,
			@RequestParam("newPassword2") String newPwd2){
		User user = (User) SecurityUtils.getSubject().getPrincipal();
		String hashOldPwd = Hashing.md5().hashString(oldPwd, Charset.forName("utf-8")).toString();
		if(!user.getPassword().equals(hashOldPwd)){
			throw new MyException("原密码不正确!");
		}
		if(!newPwd.equals(newPwd2)){
			throw new MyException("两次输入的密码不一致!");
		}
		User model = new User();
		model.setId(user.getId());
		model.setPassword(ApplicationUtils.md5Hex(newPwd));
		userService.update(model);
		SecurityUtils.getSubject().logout();
		return new JsonMessage("修改密码成功,请<a href=\"\">重新登录</a>系统!");
	}
	/**
	 * 重置密码
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/resetPwd", method = RequestMethod.POST)
	@ResponseBody
	public JsonMessage resetPwd(@RequestParam("id") Long id){
		User model = new User();
		model.setId(id);
		model.setPassword(ApplicationUtils.md5Hex("123456"));
		userService.update(model);
		return new JsonMessage("密码重置成功!");
	}
}
