
var keys = [];

function toRadians(deg){
			return (deg*(Math.PI / 180));
		}

		function rand(l,h){
			return( Math.floor((Math.random()*(h-l)))+l );
		}//rand

		function getDist(x1,y1,x2,y2){
			return( Math.sqrt( (Math.pow((x2-x1),2) + Math.pow((y2-y1),2)) ) );
		}//end distance funciton


		function findin(x,array){
			var found = false;
			for(var i=0; i<array.length; i++){
					if(array[i] == x){
						found = true;
					}//end if true
				}//for
				return(found);
		}//end findin

		function picture(x,y,w,h,img_name){
			var draw_img = document.getElementById(img_name);
			ctx.drawImage(draw_img, x, y, w, h);
		}//picture



		function getKeys(){
			return keys;
		}

		document.addEventListener("keydown",function(event){
					//console.log(event.keyCode);
					var isin = false;
					for(var i=0; i<keys.length; i++){
						if(keys[i] == event.keyCode){
							isin = true;
						}//if it is, say it was found
					}//for
					if(isin == false){
						keys.push(event.keyCode);
					}//end adding it
					//console.log(keys);
				});
		document.addEventListener("keyup",function(event){
			for(var i=0; i<keys.length; i++){
				if(keys[i] == event.keyCode){
					keys.splice(i,1);
				}//if
			}//for
		});
