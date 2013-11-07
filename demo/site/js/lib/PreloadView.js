(function()
{
	var PreloadView = function(queue)
	{
		this.queue = queue;

		this.canvasW = 250;
		this.canvasH = 250;
	}

	var p = PreloadView.prototype;

	p.setImgSrc = function(src)
	{
		this.imgSrc = src;
	}

	p.init = function()
	{
		this.initEvents();
		this.initView();
	};

	p.initEvents = function()
	{
		var self = this;

		this.queue.addEventListener("fileprogress", function(e) {
			self.onProgress(e);
		});
		this.queue.addEventListener("fileload", function(e) {
			self.onFileLoad(e);
		});
		this.queue.addEventListener("complete", function(e)
		{
			console.log('complete!');
			self.progress.setValue(1);
		});
	};

	p.onProgress = function(event)
	{
		//console.log('onProgress', this.queue.progress); // event.progress
		this.progress.setValue(this.queue.progress);
	}

	p.onFileLoad = function(event)
	{
		//	console.log('onFileLoad', event.item);
		document.head.appendChild(event.result);
	}
 
	p.initView = function()
	{
		try{
			var canvas = document.createElement('canvas');
			this.ctx = canvas.getContext('2d');
		} catch(err) {
			var canvas = G_vmlCanvasManager.initElement(canvas);
			this.ctx = canvas.getContext('2d');
		}

		//	var canvas = $('<canvas class="canvas" width="'+this.canvasW+'" height="'+this.canvasH+'"></canvas>').appendTo($body).get(0);
		//	var canvas = $(canvas);
		//		canvas.attr('width', this.canvasW)
		//			.attr('height', this.canvasH)
		//			.addClass('canvas');

		//	this.contextView.append(canvas);

		canvas.setAttribute('width', this.canvasW);
		canvas.setAttribute('height', this.canvasH);
		canvas.className = "canvas preloader";

		document.documentElement.appendChild(canvas);


		this.theta = 0;
		this.progress = new ProgressView();

		this.progress.spectrumImg = new Image();
		//this.spectrumImg.onload = ok;
		this.progress.spectrumImg.src = this.imgSrc;

		this.progress.setContext(this.ctx);


		var self = this;
		(function frame(){
			console.log('anim');
			self.animationId = requestAnimFrame(frame);
			self.animLoop();
		})();
	}

	p.animLoop = function()
	{
		this.theta += -.01;
		if (this.theta > Math.PI*2)
		{
			this.theta = 0;
		}
		if (this.theta < 0)
		{
			this.theta = Math.PI*2;
		}	

		this.progress.setTheta(this.theta);
		this.progress.draw();

		if (this.progress.value == 1)
		{
			console.log('cancel animation!');
			cancelAnimationFrame(this.animationId);
		}	
	}



	//export
	window.PreloadView = PreloadView;















	var ProgressView = function(){
		this.value = 0;

		this.theta = 0;

		this.segments = 5;
		this.width = 5;
		this.capWidth = 15;
		this.radius = 30;

		//inner to outer	
		this.radii1 = this.radius - this.width/2 - (this.capWidth-this.width)/2;
		this.radii2 = this.radius - this.width/2;
		this.radii3 = this.radius + this.width/2;
		this.radii4 = this.radius + this.width/2 + (this.capWidth-this.width)/2;

		//	console.log(this.radii1);
		//	console.log(this.radii2);
		//	console.log(this.radii3);	
		//	console.log(this.radii4);		

		this.arcWidth = (Math.PI * 2) / this.segments;

		this.fillColor = '#666666';
		this.strokeColor = '#252525';


	};

	var p = ProgressView.prototype;

	p.setContext = function(ctx)
	{
		this.ctx = ctx;

		this.canvasW = ctx.canvas.width;
		this.canvasH = ctx.canvas.height;		
		this.midX = ctx.canvas.width/2;
		this.midY = ctx.canvas.height/2;

		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = 2;
		ctx.fillStyle = this.fillColor;
	}

	p.setValue = function(pct)
	{
		this.value = pct;
	};

	p.setTheta = function(theta)
	{
		this.theta = theta;
	};

	p.clear = function()
	{
		this.ctx.clearRect(0,0,this.canvasW, this.canvasH);
	}

	p.draw = function()
	{
		this.clear();
		this.drawSegments();
		this.drawCaps();
	};

	p.drawSegments = function()
	{
		var ctx = this.ctx;

		ctx.globalCompositeOperation = "source-over";



		//	for (var i in this.spectrumImg)
		//		console.log(this.spectrumImg[i])
		
		if(this.spectrumImg.complete)
		{	
			ctx.translate(this.canvasW/2, this.canvasH/2); 
			ctx.rotate(-this.theta); 
			ctx.drawImage(this.spectrumImg, -this.canvasW/2, -this.canvasH/2, this.canvasW,this.canvasH);
			ctx.rotate(this.theta);
			ctx.translate(-this.canvasW/2, -this.canvasH/2);
			ctx.globalCompositeOperation = "destination-in";
		}

		
		//ctx.fillStyle = this.backgroundColor;
		

		if (this.value != 1)
		{
				
				ctx.beginPath();

			for (var i=0, len=this.segments; i<len; i++)
			{



				var angle = (this.theta + (i/len) * Math.PI * 2);//%(Math.PI*2);

				//console.log(i, angle)

				var angle2 = angle + this.value * this.arcWidth;
				var sinAngle = Math.sin(angle);
				var cosAngle = Math.cos(angle);
				var sinAngle2 = Math.sin(angle2);
				var cosAngle2 = Math.cos(angle2);			

				

				//inside
				ctx.moveTo(this.midX + cosAngle * this.radii2, this.midY + sinAngle * this.radii2);

				//outside
				ctx.lineTo(this.midX + cosAngle * this.radii3, this.midY + sinAngle * this.radii3);

				//clockwise arc
				ctx.arc(this.midX, this.midY, this.radii3, angle, angle2);

				//inside
				ctx.lineTo(this.midX + cosAngle2 * this.radii2, this.midY + sinAngle2 * this.radii2);

				//c-clockwise arc
				ctx.arc(this.midX, this.midY, this.radii2, angle2, angle, true);

				ctx.moveTo(this.midX + cosAngle * this.radii2, this.midY + sinAngle * this.radii2);


				
				//	ctx.closePath();


			}

				ctx.fill();

				ctx.globalCompositeOperation = "source-over";
				ctx.stroke();

							

					
		}
		else
		{
			ctx.globalCompositeOperation = "destination-in";
			//inside
			ctx.beginPath();
			ctx.arc(this.midX, this.midY, this.radii3, 0, Math.PI * 2);		
			ctx.closePath();

			ctx.fill();
			ctx.globalCompositeOperation = "source-over";
			ctx.stroke();
			//	ctx.globalCompositeOperation = "source-over";
			

			ctx.globalCompositeOperation = "destination-out";
			ctx.beginPath();	
			//outside
			ctx.arc(this.midX, this.midY, this.radii2, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
			ctx.globalCompositeOperation = "source-over";
			ctx.stroke();
		}	




	

		
			//	ctx.globalCompositeOperation = "source-over";
		
	};

	p.drawCaps = function()
	{
		if (this.value == 1) return;

		var ctx = this.ctx;



		for (var i=0, len=this.segments; i<len; i++)
		{
			ctx.beginPath();

			var angle = (this.theta + (i/len) * Math.PI * 2)%(Math.PI*2);
			var angle2 = angle + this.value * this.arcWidth;
			var sinAngle = Math.sin(angle);
			var cosAngle = Math.cos(angle);
			var sinAngle2 = Math.sin(angle2);
			var cosAngle2 = Math.cos(angle2);	



			ctx.moveTo(this.midX + cosAngle * this.radii1, this.midY + sinAngle * this.radii1);
			ctx.lineTo(this.midX + cosAngle * this.radii4, this.midY + sinAngle * this.radii4);


			ctx.moveTo(this.midX + cosAngle2 * this.radii1, this.midY + sinAngle2 * this.radii1);
			ctx.lineTo(this.midX + cosAngle2 * this.radii4, this.midY + sinAngle2 * this.radii4);
				
			ctx.closePath();

			ctx.stroke();
		}	

		
	};





}());

