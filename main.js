"use strict";

(function(){
	// c: context, deltaX, deltaY: drawing speed
	var canvas, c, lineX, lineY, begin, deltaX, deltaY;
	function scale() 
	{
		canvas.height = self.innerHeight;
		canvas.width = self.innerWidth;
		lineX = canvas.width * 0.382;
		lineY = canvas.height * 0.618;
		/* drawing speed: pixel / millisecond */
		deltaX = canvas.height / 1500;
		deltaY = canvas.width / (1500 - 500);
	}
	window.addEventListener("load", function() {
		canvas = document.getElementById("canvas");
		c = canvas.getContext("2d");
		begin = performance.now();
		scale();
		function frame(e) {
			e -= begin;
			var f = Math.max(0,e - 500);
			e = Math.min(canvas.height,deltaX * e);
			if(e < canvas.height)
				window.requestAnimationFrame(frame);
			c.lineWidth = 5;
			c.beginPath();
			c.moveTo(lineX,0);
			c.lineTo(lineX,e);
			c.stroke();
			f = Math.min(canvas.width,deltaY * f);
			c.beginPath();
			c.moveTo(0,lineY);
			c.lineTo(f,lineY);
			c.stroke();
		}
		window.requestAnimationFrame(frame);
	});
	window.addEventListener("resize",scale);
})();
