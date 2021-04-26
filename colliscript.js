//collision function
//uses entity position and block position to find the collision location

//entity x, entity y, entity size, tile x, tile y, ts
function collision(ex,ey,es,x,y,ts){
		if(ex+es > x && ex < x+ts && ey+es > y && ey+es < y+(ts/3)){//top of block
			vy = 0;
			ey = y-es-0;
			dojump = 1;
			//console.log("top");
		}

		if(ex+es > x && ex < x+ts && ey < y+ts && ey > y+(ts-(ts*0.2))){//bottom of block
			vy = 0;
			ey = y+ts;
			//console.log("bottom");
		}

		if(ey+es > y && ey < y+ts && ex+es > x && ex+es < x+(ts/3)){//left side
			vx = 0;
			ex = x-es;
			//console.log("left");
		}

		if(ey+es > y && ey < y+ts && ex > x+((2*ts)/3) && ex < x+ts){//left side
			vx = 0;
			ex = x+ts;
			//console.log("right");
		}

		return([ex,ey]);

	}//end block collisions


	function offset_bottom_collision(ex,ey,es,x,y,ts,off_perc){
		if(ex+es > x && ex < x+ts && ey+es > y && ey+es < y+(ts*0.1)){//top of block
			vy = 0;
			ey = y-es-0;
			dojump = 1;
			//console.log("top");
		}

		if(ex+es > x && ex < x+ts && ey < y+(ts*off_perc) && ey > y+(ts-(ts*(off_perc-0.1)))){//bottom of block
			vy = 0;
			ey = y+(ts*off_perc);
			//console.log("bottom");
		}

		if(ey+es > y && ey < y+(ts-(ts*(off_perc-0.1))) && ex+es > x && ex+es < x+(ts/3)){//left side
			vx = 0;
			ex = x-es;
			//console.log("left");
		}

		if(ey+es > y && ey < y+(ts-(ts*(off_perc-0.1))) && ex > x+((2*ts)/3) && ex < x+ts){//left side
			vx = 0;
			ex = x+ts;
			//console.log("right");
		}

		return([ex,ey]);

	}//end block collisions



	function offset_bottom_collision_print(ex,ey,es,x,y,ts,off_perc){
		if(ex+es > x && ex < x+ts && ey+es > y && ey+es < y+(ts*0.1)){//top of block
			return("top");
			//console.log("top");
		}
		else if(ex+es > x && ex < x+ts && ey < y+(ts*off_perc) && ey > y+(ts-(ts*(off_perc-0.1)))){//bottom of block
			return("bottom");
			//console.log("bottom");
		}
		else if(ey+es > y && ey < y+(ts-(ts*(off_perc-0.1))) && ex+es > x && ex+es < x+(ts/3)){//left side
			return("left");
			//console.log("left");
		}
		else if(ey+es > y && ey < y+(ts-(ts*(off_perc-0.1))) && ex > x+((2*ts)/3) && ex < x+ts){//left side
			return("right");
			//console.log("right");
		}
		else{
			return("none");
		}
	}//end block collisions



	function simple_collision(ex,ey,es,x,y,ts){
			return(ex+es > x && ex < x+ts && ey+es > y && ey < y+ts);
		}//end block collisions
