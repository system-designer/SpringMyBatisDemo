package com.raymond.oauth.security;

import java.util.List;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.CollectionUtils;
import org.apache.shiro.web.filter.authz.AuthorizationFilter;

public class AnyRoles extends AuthorizationFilter {

	@Override
	protected boolean isAccessAllowed(ServletRequest request,
			ServletResponse response, Object mappedValue) throws Exception {
        Subject subject = getSubject(request, response);
        String[] rolesArray = (String[]) mappedValue;

        if (rolesArray == null || rolesArray.length == 0) {
            //no roles specified, so nothing to check - deny access.
            return true;
        }

        List<String> roles = CollectionUtils.asList(rolesArray);
        boolean[] booleans = subject.hasRoles(roles);
        for (boolean b : booleans) {
			if(b == true) return true;
		}
        return false;
	}

}
