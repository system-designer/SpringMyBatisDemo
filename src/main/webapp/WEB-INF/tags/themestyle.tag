<%@tag import="org.springframework.web.servlet.support.RequestContextUtils"%>
<%@ taglib  prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ attribute name="src" required="true"%>
<link type="text/css" href="<%= request.getContextPath() %>/theme/<%= RequestContextUtils.getTheme(request).getName() %>${src}" rel="stylesheet"/>