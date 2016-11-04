define(function(require, exports, module) {
	var $ = require('jquery');
	var jQuery = $;

	jQuery.fn.rotate = function(angle,whence, scale) {
		var p = this.get(0);

		// we store the angle inside the image tag for persistence
		if (!whence) {
			p.angle = ((p.angle==undefined?0:p.angle) + angle) % 360;
		} else {
			p.angle = angle;
		}

		var rotation = 0;
		if (p.angle >= 0) {
			rotation = Math.PI * p.angle / 180;
		} else {
			rotation = Math.PI * (360+p.angle) / 180;
		}
		var costheta = Math.round(Math.cos(rotation) * 1000) / 1000;
		var sintheta = Math.round(Math.sin(rotation) * 1000) / 1000;
	 
		if (document.all && !window.opera) {
			var canvas = document.createElement('img');

			canvas.src = p.src;
			canvas.height = p.height;
			canvas.width = p.width;
			
			canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+costheta+",M12="+(-sintheta)+",M21="+sintheta+",M22="+costheta+",SizingMethod='auto expand')";
		} else {
			var canvas = document.createElement('canvas');
			var imgObj = p.oImage;
			
			if (!imgObj) {
				imgObj = new Image();
				imgObj.src = p.src;
				imgObj.onload = function() {
					p.oImage = imgObj;
					
					var w = imgObj.width;
					var h = imgObj.height;
					// auto scale to the dialog 
					var cancasWidth = Math.abs(costheta*w) + Math.abs(sintheta*h);
					if (p.width > 0) {
						var s = p.width / cancasWidth;
						w *= s;
						h *= s;
					}
					
					if (scale && scale > 0) {
						w *= scale;
						h *= scale;
					}
					
					canvas.style.width = canvas.width = Math.abs(costheta*w) + Math.abs(sintheta*h);
					canvas.style.height = canvas.height = Math.abs(costheta*h) + Math.abs(sintheta*w);

					var context = canvas.getContext('2d');
					
					context.save();
					if (rotation <= Math.PI/2) {
						context.translate(sintheta*h,0);
					} else if (rotation <= Math.PI) {
						context.translate(canvas.width,-costheta*h);
					} else if (rotation <= 1.5*Math.PI) {
						context.translate(-costheta*w,canvas.height);
					} else {
						context.translate(0,-sintheta*w);
					}
					context.rotate(rotation);
					context.drawImage(imgObj, 0, 0, w, h);
					context.restore();	
					
				};
			} else {
				var w = imgObj.width;
				var h = imgObj.height;
				// auto scale to the dialog 
				var cancasWidth = Math.abs(costheta*w) + Math.abs(sintheta*h);
				if (p.width > 0) {
					var s = p.width / cancasWidth;
					w *= s;
					h *= s;
				}
				
				if (scale && scale > 0) {
					w *= scale;
					h *= scale;
				}
				
				canvas.style.width = canvas.width = Math.abs(costheta*w) + Math.abs(sintheta*h);
				canvas.style.height = canvas.height = Math.abs(costheta*h) + Math.abs(sintheta*w);

				var context = canvas.getContext('2d');
				
				context.save();
				if (rotation <= Math.PI/2) {
					context.translate(sintheta*h,0);
				} else if (rotation <= Math.PI) {
					context.translate(canvas.width,-costheta*h);
				} else if (rotation <= 1.5*Math.PI) {
					context.translate(-costheta*w,canvas.height);
				} else {
					context.translate(0,-sintheta*w);
				}
				context.rotate(rotation);
				context.drawImage(imgObj, 0, 0, w, h);
				context.restore();	
				
			}
			
		}
		canvas.id = p.id;
		canvas.angle = p.angle;
		if ($(p.parentNode).find('canvas').length > 0) {
			p.parentNode.replaceChild(canvas, $(p.parentNode).find('canvas')[0]);
		} else {
			$(p.parentNode).append(canvas);
		}
		//p.parentNode.replaceChild(canvas, target);
	};

	jQuery.fn.rotateRight = function(angle) {
		this.rotate(angle==undefined?90:angle);
	};

	jQuery.fn.rotateLeft = function(angle) {
		this.rotate(angle==undefined?-90:-angle);
	};

});