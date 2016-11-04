<%@tag import="java.util.List"%>
<%@tag import="java.util.TreeMap"%>
<%@tag import="java.lang.*"%>
<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ attribute name="idKey" required="false" description="主键"%>
<%@ attribute name="pidKey" required="false" description="父级"%>
<%@ attribute name="showText" required="false" description="显示字段"%>
<%@ attribute name="code" required="false" description="后台需要存取的字段"%>
<%@ attribute name="value" required="true" description="后台存取的字段位置"%>
<%@ attribute name="check" required="false" description="是否显示多选框" type="Boolean"%>
<%@ attribute name="text" required="true" description="显示字段存取的位置"%>
<%@ attribute name="id" required="true"%>
<%@ attribute name="divId" required="true"%>
<%@ attribute name="src" required="false"%>
<%@ attribute name="items" required="false"%>
<%

Boolean check = (Boolean)this.getJspContext().getAttribute("check");
if(check == null) this.getJspContext().setAttribute("check",true);

String idKey = (String)this.getJspContext().getAttribute("idKey");
if(idKey == null) this.getJspContext().setAttribute("idKey","id");

String pidKey = (String)this.getJspContext().getAttribute("pidKey");
if(pidKey == null) this.getJspContext().setAttribute("pidKey","parent");

String code = (String)this.getJspContext().getAttribute("code");
if(code == null) this.getJspContext().setAttribute("code","id");

String showText = (String)this.getJspContext().getAttribute("showText");
if(showText == null) this.getJspContext().setAttribute("showText","name");

Object items = this.getJspContext().getAttribute("items");
if(items == null) this.getJspContext().setAttribute("items",false);

%>
<div id="${divId}" class="zTree zTree-dropdown zTree-orient-left" style="visibility:hidden; position: fixed;z-index: 2001;">
	<ul id="${id}" class="ztree" style="margin-top:0; width:180px; max-height: 300px;overflow: auto;"></ul>
</div>
<script type="text/javascript">
	seajs.use(['jquery','myutil.init','jquery.ztree.exhide'],function($){
		
		$('#${id}').data('settings',{check: {
					enable: ${check},
					chkboxType: { "Y" : "ps", "N" : "ps"}
					},
					view: {
						dblClickExpand: false
					},
					data: {
						key:{
							name:"${showText}"
						},
						simpleData: {
							enable: true,
							idKey:'${idKey}',
							pIdKey:"${pidKey}",
						}
					},
					callback: {
						beforeClick: function(treeId, treeNode){
							var zTree = $.fn.zTree.getZTreeObj("${id}");
							zTree.checkNode(treeNode, !treeNode.checked, null, true);
							return false;
						},
						onCheck: function(e, treeId, treeNode) {
							var zTree = $.fn.zTree.getZTreeObj("${id}"),
							nodes = zTree.getCheckedNodes(true),
							v = "",n="";
							for (var i=0, l=nodes.length; i<l; i++) {
								v += nodes[i]['${code}'] + ",";
								n += nodes[i]['${showText}'] + ",";
							}
							if (v.length > 0 ) v = v.substring(0, v.length-1);
							if (n.length > 0 ) n = n.substring(0, n.length-1);
							$("#${text}").val(n);
							$("#${value}").val(v);
						}
					}});
		if('${src}'){
			$.read('${__baseUrl}${src}',{},function(result){
				$('#${id}').data('records',result);
				$.fn.zTree.init($("#${id}"), $("#${id}").data('settings'), result).expandAll(true);
			});
		}
		
		if('${items}'){
			$('#${id}').data('records',${items});
			$.fn.zTree.init($("#${id}"), $("#${id}").data('settings'), ${items}).expandAll(true);
		}
		
		$('#${text}').click(function(){
			var cityOffset = $(this).offset();
			
			var top = cityOffset.top-25;
			var position = 'auto';
			var wh = $(window).height()/2;
			if(top<wh){
				position = 'top';
				top = top + $('#${text}').outerHeight(true);
				$("#${divId}").removeClass('zTree-orient-bottom');
			}else{
				position = 'bottom';
				top = top - $('#${divId}').outerHeight(true);
				$("#${divId}").removeClass('zTree-orient-top');
			}
			$("#${divId}").addClass('zTree-orient-'+position);
			$("#${divId}").css({left:"15px", top:top + "px",visibility:'visible'}).slideDown("fast");
			$("body").bind("mousedown", function(event){
				if (!(event.target.id == '${id}' || $(event.target).parents('#${divId}').length>0)) {
					$('#${divId}').fadeOut("fast");
				}
			});
		});
	
	});
</script>