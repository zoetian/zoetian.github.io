"use strict";

(function() {
	// c: context, deltaX, deltaY: drawing speed
	var canvas, c, begin, lineX0, lineX1, lineX1d, lineY0, lineY1, lineY2, deltaX0, deltaX1, deltaX1min, deltaY0, deltaY1, deltaY2;
	function scale() {
		canvas.height = self.innerHeight;
		canvas.width = self.innerWidth;
		lineX0 = canvas.width * 80 / 357;
		lineX1 = canvas.width * 324 / 357;
		lineY0 = canvas.height * 267 / 357;
		lineY1 = canvas.height * 312 / 357;
		lineY2 = canvas.height * 118 / 357;
		/* drawing speed: pixel / millisecond */
		deltaX0 = canvas.height / 1500;
		deltaX1min = lineX1 / canvas.width * 1500;
		lineX1d = canvas.height - lineY0;
		var a = (1500 - deltaX1min);
		deltaX1 = lineX1d / a;
		deltaY0 = canvas.width / (1500 - 500);
		deltaY1 = (canvas.width - lineX1) / a;
		deltaY2 = lineX0 / (1500 - 500);
	}
	window.addEventListener("load",function() {
		canvas = document.getElementById("canvas");
		c = canvas.getContext("2d");
		begin = performance.now();
		scale();
		// e: current time in milliseconds
		function frame(e) {
			e -= begin;
			// f: lineY x coordinates
			var f = Math.max(0, e - 500);
			var d = Math.min(lineX0,deltaY2 * f);
			var b = Math.max(0, e - deltaX1min);
			var a = Math.max(lineY0,canvas.height - b * deltaX1);
			var g = Math.max(lineX1,canvas.width - b * deltaY1);
			e = Math.min(canvas.height, deltaX0 * e);
			if(e < canvas.height) {
				window.requestAnimationFrame(frame);
			}
			c.lineWidth = 5;
			f = Math.min(canvas.width, deltaY0 * f);

			c.beginPath();
			{
				c.moveTo(0, lineY0);
				c.lineTo(f, lineY0);
				c.moveTo(lineX0, 0);
				c.lineTo(lineX0, e);
				c.moveTo(0, lineY2);
				c.lineTo(d, lineY2);
				c.moveTo(lineX1, canvas.height);
				c.lineTo(lineX1, a);
				c.moveTo(canvas.width, lineY1);
				c.lineTo(g, lineY1);
			}
			c.stroke();

		}
		window.requestAnimationFrame(frame);
	});
	window.addEventListener("resize", scale);
})();
