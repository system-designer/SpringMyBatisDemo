var mapping_cityId;
var mapping_appId;

function initLayer() {
	// 创建舞台
	var canvas = document.getElementById('canvas');
	stage = new JTopo.Stage(canvas);
	// 创建场景
	scene = new JTopo.Scene();
	scene.mode = "select";
	scene.areaSelect = false;
	stage.add(scene);
	
	$(window).resize(function() {
		$('#canvasdiv').height($('#detail').height() - 110);
	});
	
	$('#detail').on('click', '.save-mapping-btn', function() {
		submitMapping();
	});
	$(document).keydown(function(e){
		if( e.ctrlKey  == true && e.keyCode == 83 && $('#detail').is(':visible')){
			submitMapping();
			return false; // 截取返回false就不会保存网页了
		}
	});
}

/**
 * 注册连线事件
 * 
 * @param scene
 */
function initLayerListener() {
	var beginNode = null;
	var tempNodeA = new JTopo.Node('tempA');
	tempNodeA.setSize(1, 1);
	var tempNodeZ = new JTopo.Node('tempZ');
	tempNodeZ.setSize(1, 1);

	var link = new JTopo.FlexionalLink(tempNodeA, tempNodeZ);
	link.direction = 'horizontal';
	link.arrowsRadius = 10;
	link.lineWidth = 3; // 线宽
	link.offsetGap = 35;
	link.bundleGap = 15; // 线条之间的间隔
	link.strokeColor = '218,165,32';

	scene.mouseup(function(e) {
		if (e.button == 2) {
			scene.remove(link);
			return;
		}
		if (e.target != null && e.target instanceof JTopo.Node) {
			if (beginNode == null && e.target.attr.id.indexOf('bus') === 0 && e.target.attr.type == 'td') {
				beginNode = e.target;
				scene.add(link);
				tempNodeA.setLocation(e.x, e.y);
				tempNodeZ.setLocation(e.x, e.y);
			} else if (beginNode != null && beginNode !== e.target
					&& e.target.attr.id.indexOf('sos') === 0 && e.target.attr.type == 'td') {
				var endNode = e.target;
				deleteBeforeLink(beginNode, endNode);
				newFlexionalLink(beginNode, endNode, {color: '218,165,32'});
				beginNode = null;
				scene.remove(link);
			} else {
				beginNode = null;
				scene.remove(link);
			}
		} else {
			scene.remove(link);
		}
	});

	scene.mousedown(function(e) {
		if (e.target == null || e.target === beginNode || e.target === link) {
			scene.remove(link);
		}
	});

	scene.mousemove(function(e) {
		tempNodeZ.setLocation(e.x, e.y);
	});
	
	scene.dbclick(function(e) {
		if (e.target && e.target.elementType == "link") {
			scene.remove(e.target);
		}
	});
}

// 节点
function newNode(x, y, w, h, data) {
	var node = new JTopo.Node();
	node.text = data.text;
	if(data.contain==null && data.sameToOthers!=undefined && data.sameToOthers!=null){
		node.fillColor = "51,122,183";
	}else{
		node.fillColor = data.contain ? "255,255,0" : "255,255,255";
	}
	
	
	node.fontColor = "0,0,0";
	node.dragable = false;
	node.textPosition = 'Middle_Center';// 文字居中
	node.setLocation(x, y);
	node.setSize(w, h); // 尺寸
	node.borderWidth = 1; // 边框的宽度
	node.borderColor = "221,221,221"; // 边框的宽度
	node.attr = {
		id : data.id,
		type : "td",
		orderNum: data.orderNum
	};
	scene.add(node);
	return node;
}

function newth(x, y, w, h, data) {
	var node = new JTopo.Node();
	node.text = data.text;
	node.fillColor = "221,221,221";
	node.fontColor = "0,0,0";
	node.dragable = false;
	node.textPosition = 'Middle_Center';// 文字居中
	node.setLocation(x, y);
	node.setSize(w, h); // 尺寸
	node.borderWidth = 1; // 边框的宽度
	node.borderColor = "221,221,221"; // 边框的宽度
	node.attr = {
		id : data.id,
		type : "th"
	};
	scene.add(node);
	return node;
}

function newButton(x, y, w, h, data) {
	var node = new JTopo.Node();
	node.text = data.text;
	node.fillColor = "24,188,156";
	node.fontColor = "255,255,255";
	node.dragable = false;
	node.textPosition = 'Middle_Center';// 文字居中
	node.setLocation(x, y);
	node.setSize(w, h); // 尺寸
	node.borderWidth = 1; // 边框的宽度
	node.borderColor = "16,176,144";
	node.attr = {
		id : data.id,
		type : "button",
		idef:data.idef
	};
	scene.add(node);
	return node;
}

// 二次折线
function newFlexionalLink(nodeA, nodeZ, data, direction, dashedPattern) {
	var link = new JTopo.FlexionalLink(nodeA, nodeZ, data ? data.text : undefined);
	link.direction = direction || 'horizontal';
	link.arrowsRadius = 10;
	link.lineWidth = 3; // 线宽
	link.offsetGap = 35;
	link.bundleGap = 2; // 线条之间的间隔
	link.strokeColor = data ? data.color : undefined;
	link.dashedPattern = dashedPattern;
	link.attr = {
		id : nodeA.attr.id + '_' + nodeZ.attr.id
	};
	scene.add(link);
	return link;
}

/**
 * 创建节点列表
 * 
 * @param scene
 * @param x
 * @param y
 * @param w
 * @param h
 * @param data
 */
function newNodeList(x, y, w, h, data, revert) {
	var gap = 0, line = data.line, prefix = data.prefix, tag = '';
	switch (prefix) {
		case 'bus' : tag = '[车来了]'; break;
		case 'sos' : tag = '[第三方]'; break;
		case 'rd' : tag = '推荐'; break;
		default: break;
	}
	newth(x, y + gap, w, h, {id: prefix + line.lineId, text: tag + "线路:" + line.lineName + "，方向:" + line.direction});
	gap += 40;
	var nodes = line.details, node = {};
	for (var i = 0; i < nodes.length; i++) {
		//强制映射里，查询车来了线路返回的是linemapId，查询映射关系里，返回的字段叫lineMapId
		node = {
				id: prefix + (nodes[i].lineMapId ? nodes[i].lineMapId : nodes[i].linemapId),
				text: nodes[i].orderNum + ". " + nodes[i].stopName,
				orderNum: nodes[i].orderNum + "",
				contain: revert ? !nodes[i].contain : nodes[i].contain,
				sameToOthers: revert ? !nodes[i].sameToOthers : nodes[i].sameToOthers		
		}
		newNode(x, y + gap, w, h, node);
		gap += 40;
	}
}

/**
 * 创建映射关系图
 * 
 * @param scene
 * @param org_mapping
 * @param auto_mapping
 */
function newMappingLink(org_mapping, auto_mapping) {
	var mappings = new Array();
	if (org_mapping) {
		for (var i = 0; i < org_mapping.length; i++) {
			var nodes = scene.findElements(function(e) {
				return e.attr.id == "bus" + org_mapping[i].cllMapId
						|| e.attr.id == "sos" + org_mapping[i].appMapId;
			})
			if (nodes && nodes.length == 2) {
				newFlexionalLink(nodes[0], nodes[1], {color: '200,200,200'});
			}
		}
	}
	
	if (auto_mapping) {
		for (var i = 0; i < auto_mapping.length; i++) {
			var nodes = scene.findElements(function(e) {
				return e.attr.id == "bus" + auto_mapping[i].cllMapId
						|| e.attr.id == "sos" + auto_mapping[i].appMapId;
			})
			if (nodes && nodes.length == 2) {
				newFlexionalLink(nodes[0], nodes[1], {color: '24,188,156'});
			}
		}
	}
}

/**
 * 删除旧的映射关系
 * 
 * @param scene
 * @param nodeA
 * @param nodeZ
 */
function deleteBeforeLink(nodeA, nodeZ) {
	if (nodeA && nodeA.outLinks && nodeA.outLinks.length > 0) {
		scene.remove(nodeA.outLinks[0]);
	}
	if (nodeZ && nodeZ.inLinks && nodeZ.inLinks.length > 0) {
		scene.remove(nodeZ.inLinks[0]);
	}
}

function deleteAllLinks() {
	var links = scene.findElements(function(e) {
		return e.elementType === "link";
	});
	for (var i = 0; i < links.length; i++) {
		scene.remove(links[i])
	}
}

function deleteSosLine() {
	var nodes = scene.findElements(function(e) {
		return e.attr.id.indexOf('sos') === 0;
	});
	for (var i = 0; i < nodes.length; i++) {
		scene.remove(nodes[i])
	}
}

function loadLayerData(result) {
	scene.clear();
	var dx = 1;
	if (window.source === 'force') {
		dx = -198;
	} else {
		newButton(dx, 1, 69, 28, {id: '', text: '清除映射',idef:''}).click(function(e){
			deleteAllLinks();
		});
		
	}
	newButton(dx + 99, 1, 69, 28, {id: '', text: '还原',idef:''}).click(function(e){
		$.blockUI({
			 title:'请稍等', 
	         timeout: 400,
	         message:'<i class="fa fa-spinner fa-pulse fa-3x" style="margin-top: 20px;"></i><p style="margin: 10px 0;">正在还原...</p>',
	         baseZ:3000,
	         css: {
	              border: 'none',
	              width: '20%',
	              left:	'40%'
	          }
      	}); 
		loadLayerData(result);
	});
	newButton(dx + 199, 1, 69, 28, {id: '', text: '保存',idef:''}).click(function(e){
		submitMapping();
	});
	
	newButton(dx + 299, 1, 69, 28, {id: '', text: '维护跳转',idef:''}).click(function(e){
		if(result.map!=null){
			window.open(_baseUrl+"/baseData/maintenance?cityId="+result.cityId+"&lineId="+result.map.our.lineId);
		}else{
			window.open(_baseUrl+"/baseData/maintenance?cityId="+result.cityId+"&lineId="+result.rd.itself.lineId);
		}
		
	});
	
	
	var maxNum = 0, countW = 0, detailMinWidth = 1000;;
	//返回ResultMapping对象
	var map = result.map, rd = result.rd,otherMapps=result.otherMappingLines;
	if (map) {
		//对应两种情况：线路名称相同；线路名称不相同，但站点匹配度大于1.8(只选匹配度最高的一条)
		var busLine = map.our;
		newNodeList(4, 40, 200, 40, {prefix: "bus", line: busLine});
		maxNum = busLine.details.length > maxNum ? busLine.details.length : maxNum;
		
		var sosLine = map.third;
		newNodeList(400, 40, 200, 40, {prefix: "sos", line: sosLine});
		maxNum = sosLine.details.length > maxNum ? sosLine.details.length : maxNum;
		
		
		//有映射，也要添加其他几个第三方数据
		if(otherMapps){
			for (var i = 0, dx = 0; i < otherMapps.length; i++) {
				newButton(765 + dx, 1, 69, 28, {id: otherMapps[i].lineId + "", text: otherMapps[i].appName,idef:"but"});
				newNodeList(700 + dx, 40, 200, 40, {prefix: "otherThird", line: otherMapps[i]});
				dx += 210;
				//maxNum = otherMapps[i].details.length > maxNum ? otherMapps[i].details.length : maxNum;
			}
			//控制宽度
			countW = otherMapps.length > 1 ? (detailMinWidth = '100%', otherMapps.length - 1) : 0;
		}
		
		
		setTimeout(function() {
			newMappingLink(map.exist, map.recommended);
		}, 400);
	} else if (rd) {
		//推荐线路，最多5条
		var busLine = rd.itself;
		newNodeList(4, 40, 200, 40, {prefix: "bus", line: busLine});
		maxNum = busLine.details.length > maxNum ? busLine.details.length : maxNum;
		
		var rdLines = rd.nominates;
		if (rdLines && rdLines.length > 0) {
			for (var i = 0, dx = 0; i < rdLines.length; i++) {
				newButton(765 + dx, 1, 69, 28, {id: rdLines[i].lineId + "", text: '选择('+rdLines[i].similarity*100+'%)',idef:''}).click(function(e){
					getMapping(e.target.attr.id);
				});
				newNodeList(700 + dx, 40, 200, 40, {prefix: "rd", line: rdLines[i]});
				dx += 210;
				
				maxNum = rdLines[i].details.length > maxNum ? rdLines[i].details.length : maxNum;
			}
			countW = rdLines.length > 1 ? (detailMinWidth = '100%', rdLines.length - 1) : 0;
		} else {
			alert('没有可推荐的第三方线路');
		}
	} else {
		//第三方没有对应的线路，提示没有映射关系
		alert('该线路不存在映射关系');
	}
	
	//$('#detail').width(detailMinWidth);
	var minWidth = 950;
	var minHeight = 600;
	var countH = maxNum > 12 ? maxNum - 12 : 0;
	$('#canvas')[0].width = countW > 0 ? minWidth + 200 * countW : minWidth;
	$('#canvas')[0].height = minHeight + 40 * countH;
}

//获取映射关系
function getMapping(lineId) {
	deleteAllLinks();
	deleteSosLine();
	var obj = {
			cityId: mapping_cityId ? mapping_cityId : $('#cityId').val(),
			busLineId: currentLineId,
			sosLineId: lineId
	};
	$.get(_baseUrl + '/app/mapping', obj, function(result){
		if (result._exception === true) {
			alert(result.message);
			return;
		}
		var sosLine = result.third;
		newNodeList(400, 40, 200, 40, {prefix: "sos", line: sosLine});
		setTimeout(function() {
			newMappingLink(result.exist, result.recommended);
		}, 200);
		
	});
}

//提交映射关系
function submitMapping() {
	if (checkCrossMapping()) {
		alert('当前映射有交叉，将不会更新映射关系');
		return;
	}
	var sosLine = scene.findElements(function(e) {
		return e.attr.id.indexOf('sos') === 0 && e.attr.type == "th";
	});
	if (sosLine.length == 0) {
		alert('当前的第三方没有数据，将不会更新映射关系');
		if (!window.source) {
			$('#detail').modal('hide');
		}
		return;
	}
	sosLine = sosLine[0].attr.id.substr(3);
	var obj = {
			cityId: mapping_cityId ? mapping_cityId : $('#cityId').val(),
			cllLineId: currentLineId,
			appLineId: sosLine,
			appName: mapping_appId ? mapping_appId : ($('#appName').val() ? $('#appName').val() : $('input[name=appName]:checked').val()),
			json: []
	};
	
	var nodeA, nodeZ, orderNum;
	var mappings = scene.findElements(function(e) {
		return e.elementType == "link";
	});
	
	//mapping去重
	for(var y=0;y<mappings.length;y++){
		for(var c=0;c<(mappings.length-1);c++){
			if(mappings[y].nodeA.text==((y+1)<mappings.length?mappings[y+1].nodeA.text:'')){
				mappings.splice(y,1);
			}
		}
	}
	
	for (var i = 0; i < mappings.length; i++) {
		nodeA = mappings[i].nodeA.attr.id.substr(3);
		nodeZ = mappings[i].nodeZ.attr.id.substr(3);
		//orderNum = mappings[i].nodeZ.attr.orderNum;
		orderNum = i+1;
		obj.json.push({
			cllMapId: nodeA,
			appMapId: nodeZ,
			orderNum: orderNum
		});
	}
	obj.json = JSON.stringify(obj.json);
	$.postLock(_baseUrl + '/app/updateMapping', obj, function(result) {
		if (result._exception === true) {
			alert(result.message, "fail");
			return;
		}
		alert('保存成功', "success", null, function() {
			if (window.source === 'force') {
				$('#detail').modal('hide');
				setTimeout(function() {
					var json = JSON.parse(obj.json);
					if (json && json.length > 0) {
						$('#forceDialog tr.selected').remove();
						$('#forceDialog .cll-line').text('');
						$('#forceDialog .app-line').text('');
					}
				}, 800);
			} else if (window.source === 'dm') {
				
			} else {
				$('#detail').modal('hide');
			}
		});
	});
}

//检查交叉映射
function checkCrossMapping() {
	var isCross = false;
	//车来了站序和第三方站序
	var cllOrderNumList = [], appOrderNumList = [];
	var mappings = scene.findElements(function (e) {
		return e.elementType == "link";
	});
	for (var i = 0; i < mappings.length; i++) {
		cllOrderNumList[i] = parseInt(mappings[i].nodeA.attr.orderNum);
		appOrderNumList[i] = parseInt(mappings[i].nodeZ.attr.orderNum);
	}
	for (var j = 0, size = cllOrderNumList.length; j < size; j++) {
		if (cllOrderNumList[j] != appOrderNumList[j]) {
			if (isCross) {
				break;
			}
			for (var k = j + 1; k < size; k++) {
				if (cllOrderNumList[k] != appOrderNumList[k]) {
					if (judge(cllOrderNumList[j], appOrderNumList[j], cllOrderNumList[k], appOrderNumList[k])) {
						isCross = true;
						break;
					}
				}
			}
		}
	}
	return isCross;
}

/**
 * 判断是否交叉
 *
 * @param beginIndex1
 * @param endIndex1
 * @param beginIndex2
 * @param endIndex2
 * @return
 */
function judge(beginIndex1, endIndex1, beginIndex2, endIndex2) {
	if ((beginIndex1 <= beginIndex2 && endIndex1 >= endIndex2) || (beginIndex1 >= beginIndex2 && endIndex1 <= endIndex2)) {
		return true;
	} else {
		return false;
	}
}