package com.raymond.oauth.security;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.shiro.authc.Account;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAccount;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.stereotype.Component;

import com.google.common.collect.Maps;
import com.raymond.core.exception.VaildCodeAuthException;
import com.raymond.core.exception.VaildMobileAuthException;
import com.raymond.core.util.ApplicationUtils;
import com.raymond.oauth.db.model.Permission;
import com.raymond.oauth.db.model.Role;
import com.raymond.oauth.db.model.User;
import com.raymond.oauth.service.PermissionService;
import com.raymond.oauth.service.RoleService;
import com.raymond.oauth.service.UserService;

/**
 * 用户身份验证,授权 Realm 组件
 * 
 * @author StarZou
 * @since 2014年6月11日 上午11:35:28
 **/
@Component(value = "securityRealm")
public class SecurityRealm extends AuthorizingRealm {
	private Map<User,Account> accounts = Maps.newHashMap();
    @Resource
    private UserService userService;

    @Resource
    private RoleService roleService;

    @Resource
    private PermissionService permissionService;

    /**
     * 权限检查
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
    	return accounts.get(principals.getPrimaryPrincipal());
    }

    /**
     * 登录验证
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken user) throws AuthenticationException {
    	UserLoginToken token = (UserLoginToken) user;
		if(!token.isVerifitionCodePass()) throw new VaildCodeAuthException();
		if(!token.isMobileCodePass()) throw new VaildMobileAuthException();
        String password = ApplicationUtils.md5Hex(new String((char[]) token.getPassword()));
        // 通过数据库进行验证
        final User authentication = userService.authentication(new User(token.getUsername(),password));
        SimpleAccount account = new SimpleAccount(authentication,authentication.getPassword(), User.class.toString());
        final List<Role> roleInfos = roleService.selectRolesByUserId(authentication.getId());
        for (Role role : roleInfos) {
        	account.addRole(role.getRoleSign());

            final List<Permission> permissions = permissionService.selectPermissionsByRoleId(role.getId());
            for (Permission permission : permissions) {
            	account.addStringPermission(permission.getPermissionSign());
            }
        }
         accounts.put((User) account.getPrincipals().getPrimaryPrincipal(), account);
		return account;
    }

}
