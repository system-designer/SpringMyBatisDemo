<%@tag import="com.google.common.base.Strings"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="dialogClass" required="false" %>
<%@ attribute name="draggable" required="false" %>
<%@ attribute name="title" required="true" description="对话框标题" %>
<%@ attribute name="id" required="false" %>
<%@ attribute name="style" required="false" %>
<%@ attribute name="showCloseButton" required="false" %>
<%@ attribute name="showfooter" required="false" %>
<%@ attribute name="buttons" required="false" fragment="true"%>
<%@ attribute name="bodyout" required="false" fragment="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
%>
<div class="modal fade ${draggable eq true ? 'draggable':'' } ${dialogClass}" id="${id}"  data-backdrop="static" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog" style="${style}">
    <div class="modal-content" style="${style}">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">${title}</h4>
      </div>
      <div class="modal-body">
			<jsp:doBody />
      </div>
      <div><jsp:invoke fragment="bodyout" /></div>
      <c:if test="${showfooter eq null or showfooter eq true}">
      <div class="modal-footer">
      	<jsp:invoke fragment="buttons" />
      	<c:if test="${showCloseButton eq null or showCloseButton eq true}">
	        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="icon-remove"></i>关闭</button>
      	</c:if>
      </div>
      </c:if>
    </div>
  </div>
</div>
