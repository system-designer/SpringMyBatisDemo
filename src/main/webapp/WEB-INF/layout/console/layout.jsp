<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="sdf" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title><tiles:getAsString name="title"/></title>
<link rel="shortcut icon" href="<%= request.getContextPath() %>/images/logo.png" type="image/png" />
<!-- 菜单栏 控制 -->

<sdf:themestyle src="/css/bsv2/bootstrap.css"></sdf:themestyle>
<sdf:style src="/css/layout/console/main.css"></sdf:style>
<sdf:style src="/css/ui.css"></sdf:style>
<sdf:style src="/css/font-awesome.css" />
<sdf:style src="/css/layout/console/left.css"></sdf:style>
<sdf:style src="/css/sweetalert.css"></sdf:style>

<script type="text/javascript">
    var baseUrl = '${__baseUrl}';
    var G_CFG = {
        username: '<shiro:principal property="name"></shiro:principal>',
        gaTrackingId: '${__gaTrackingId}'
    };
</script>
<sdf:script src="/js/sea-debug.js"></sdf:script>
<sdf:script src="/js/sea-css.js"></sdf:script>
<sdf:script src="/js/sea.config.js"></sdf:script>
<sdf:script src="/js/ace/jquery.js"></sdf:script>
<sdf:script src="/js/ace/transition.js"></sdf:script>
<sdf:script src="/js/ace/ace-extra.js"></sdf:script>
<sdf:script src="/js/ace/ace.js"></sdf:script>
<sdf:script src="/js/ace/ace.ajax-content.js"></sdf:script>
<sdf:script src="/js/ace/ace.sidebar.js"></sdf:script>
<sdf:script src="/js/ace/ace.submenu-hover.js"></sdf:script>
<sdf:script src="/js/jquery/sweetalert.min.js"></sdf:script>
<sdf:script src="/js/op/utility.js"></sdf:script>
<sdf:script src="/js/utils/ga.js"></sdf:script>

<!-- 密码修改 -->
<script type="text/javascript">
seajs.use(['jquery','bootstrap','jquery.cookie','jquery.nicescroll', 'myutil.init'],function($){
	$(function(){
		$('#changePassword').click(function(){
			if($('#module-common-chpwd').length == 0){
				$.post('${__baseUrl}/module/common-chpwd',function(ret){
					$('body').append(ret);
				});
			}
			else{
				$('#module-common-chpwd .modal').modal('show');
			}
		});
		try{
			$('.modal.draggable').draggable({handle:'div.modal-header'});
		}catch(e){}
		//判断是否移动设备
		function checkMoblile() {  
            var sUserAgent = navigator.userAgent.toLowerCase();  
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";  
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";  
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";  
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";  
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";  
            var bIsAndroid = sUserAgent.match(/android/i) == "android";  
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";  
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";  
           if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {  
                return true;
            } else {  
               return false;
            }  
        }  
		
		var parent = '${__parMenu}';
		$('#sidebar li').removeClass('active');
		if(parent){
			$('#sidebar li #menu_${__parMenu.id}').parents('li').addClass('active').addClass('open');
		}
		$('#sidebar li #menu_${__curMenu.id}').parents('li:first').addClass('active');
		
		/* $('#sidebar').on('click','.dropdown-toggle',function(){
			if($(this).parent("li").find('li.active').length==0){
				$(this).parent("li").toggleClass("active");
			}
			return false;
		//	$(this).parent("li").siblings().removeClass('open').children("ul").hide(300);
		}); */
		$('.sidebar-toggle').click(function(){
			$.cookie('sidebar-menu-min', $('#sidebar').hasClass('menu-min'));
		});
		
		if($.cookie('sidebar-menu-min')=='false'){
			$('#sidebar-collapse').click();
			$('#sidebar').addClass('menu-min');
		}
		//非移动设备美化滚动条
		if(!checkMoblile()){
			$('#sidebar').niceScroll({cursorcolor:"#bbd4e5",horizrailenabled:false}); 
			 $('.layout-fill .layout-middle').niceScroll({
				cursorcolor:"#ccc",
				horizrailenabled:false,
				cursormarginright:"1px",
				cursoropacitymin:0.5
			}); 
			 $('.modal-dialog .modal-body').niceScroll({
				cursorcolor:"#ccc",
				cursorwidth:"6px",
				horizrailenabled:false,
				cursormarginright:"1px",
				cursoropacitymin:0.9
			});
		}
	});
});
</script>

<tiles:insertAttribute name="head" defaultValue=""/>
</head>
<body>
<div class="layout no-skin">
	 <div class="layout-header">
		<tiles:insertAttribute name="header"/>
	</div> 
	<div id="sidebar" class="layout-left sidebar responsive" >
				${__allmenuhtml}
		<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse" >
			<i class="ace-icon icon-double-angle-left" data-icon1="ace-icon icon-double-angle-left" data-icon2="ace-icon icon-double-angle-right"></i>
		</div>
	</div> 
	
	 <div class="layout-fill"> 
	 	<div class="layout-middle">
			<tiles:insertAttribute name="body" />
		</div>
    </div> 
</div>
</body>
</html>
