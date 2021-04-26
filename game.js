//game.js


/*
Hello! If you are viewing this, you must be interested in the code, right?

This is not at all my finest work.  This took about 15 hours to make.  It
really should have taken more like 9 hours.  The code is not optimized at
all and is quite ugly, so don't take this as a representation of the best
that I can do.  Finally,  I'm self-taught in JS (and every other language
that I know), so please take that into account if you see things that are
out of place when looking through this.

If you have any questions, email me at nmarencik@sandiego.edu

NJM
*/



var canv = document.getElementById("canv");
var ctx = canv.getContext("2d");

var width = document.getElementById("canv").width;
var height = document.getElementById("canv").height;

var tile_px_size = 3;
var tile_pixel_dim = 16;
var tile_size = tile_px_size*tile_pixel_dim;

var current_screen = "title";//title, char_maker, game, end
var drawing_color = 16777215;//used to be 0
var room_id = 0;
var message = "Room 1"
var msg_color = "#ffffff";

var color_picker = [];
var released_next = false;

var in_note = false;
var current_note = "";
var released_note_key = false;

var current_answer = "";
var do_typing = false;
var allow_typing = false;

var ending_shift = 0;
var scroll_speed = 0;

var player_sprites = [player_0,player_1,player_2];
var starter_sprite = rand(0,player_sprites.length);

var player = {
  x: 0,
  y: 0,
  height: 50,
  width: 50,
  pix_width: 16,
  pix_height: 16,
  facing: "down",
  speed: 3,
  image: player_sprites[starter_sprite],
};

var mouse = {x:0, y:0, clicked:false};

var tile_map = {
  "y": yellow_tile,
  "b": bookshelf,
  "c": counter,
  "s": stairs,
  "t": counter_top,
  "f": sink,
  "r": cradle,
  "d": dark_tile,
  "e": empty_shelf,
  "a": award_shelf,
  "l": light_shelf,
  "o": light_tile,
};


var solid_tiles = ["b","c","t","f","r","e","a","l"];


var rooms = [
  [//room 0
  "yyybbbbbyy",
  "yyyyyyyyyy",
  "yyyyyyyyyy",
  "yyyccccyyy",
  "yyyyyyyyyy",
  "yyyyyyyyyy",
  ],


  [//room 1
  "yyybbbbcct",
  "yyyyyyyyyt",
  "yyyyyyyyyf",
  "yyyttttyyt",
  "yyyccccyyt",
  "yyyyyyyyyt",
  ],

  [//room 2
  "oooccccooo",
  "oooooooooo",
  "oooooooooo",
  "oooccccoot",
  "ooooooooof",
  "oooooooott",
  ],

  [//room 3
  "oooelaelbb",
  "oooooooooo",
  "oooocccooo",
  "oooooooooo",
  "ooccoooooo",
  "oooooooooo",
  ],

  [//room 4
  "yyyyyyycct",
  "yyyyyyyyyc",
  "yyyyyyyyyy",
  "yyyccrcbal",
  "yyyyyyyyyy",
  "yyyyyyyyyy",
  ],

  [//room 5
  "yyyyyyyyyy",
  "yyttyyytty",
  "yyccyyyccy",
  "yyyyyyyyyy",
  "yyccyyyccy",
  "yyyyyyyyyy",
  ],

  [//room 6
  "oooelaelbb",
  "oooooooooo",
  "oooblalbea",
  "oooooooooo",
  "oolbaelbea",
  "oooooooooo",
  ],

  [//room 7
  "oooooooooo",
  "oooblaccoo",
  "oooooooooo",
  "oooooooooo",
  "ooocclaboo",
  "oooooooooo",
  ],

  [//room 8
  "yyyelabcct",
  "yyyyyyyyyt",
  "yyyyyyyyyf",
  "yyyttttyyt",
  "yyyccccyyt",
  "yyyyyyyyyt",
  ],

  [//room 9
  "ooooobccct",
  "oooooooooc",
  "ooooelaboo",
  "oooooooooo",
  "ooocclaboo",
  "oooooooooo",
  ],


];//rooms


//easter egg  - did you just ctrl-f for "easter egg"?
var vector = "        /====\\\n       []?[ ]=}\n        \\<__./\n         =\\ /=\n       ===/ \\===\n     ===./  \\..===\n  </=.../    \\....==\\>\n   ....( |     |.....\n    ....\\     /....\n     .../ / \\ \\...\n      ./ /   \\ \\.\n      ";



var interaction_map = {
  0: {'1':"show_note('Force is equal\\nto mass times\\nacceleration\\n(f=ma).')",'2':"type_answer('What is the force?:\\n\\nmass = 10 kg.\\naccel. = 5 m/s^2.\\n\\nType your answer\\nwithout units.\\n\\nPress enter\\nto submit.')"},
  1: {'1':"show_note('mechanical engineering\\nis a branch of\\nengineering that\\ndeals with making\\nand designing machines.');",'2':"type_answer('If you were to design\\na machine, you\\nwould be\\na ____ engineer.\\n\\nFill in the blank.')"},
  2: {'1':"show_note('The formula for\\nkinetic energy is\\nk = 0.5*m*v^2');", '2':"show_note('k = 0.5*m*v^2 can be\\nmodified to solve\\n for velocity:\\nv = sqrt(2k/m)');", '3':"type_answer('An object has\\nkinetic enery of 45j\\nand a mass of 5kg.\\nWhat is its velocity\\nto the nearest two\\ndecimal places?\\n\\nExclude units in your\\nanswer.')"},
  3: {'1':"show_note('Work is equal to\\nforce times distance\\n\\nor...\\n\\nw = f * d');", '2':"type_answer('12 newtons of force is\\napplied to an object\\nover a distance of\\n8 meters.  What is the\\nwork don on the object?\\n\\nExclude units in your\\nanswer.')"},
  4: {'1':"show_note('Electrical engineers use\\nelectricity to create\\ndevices and systems.');", '2':"type_answer('The branch of\\nengineering that\\nmakes systems with\\nelectricity\\nis called\\n____ engineering.')"},
  5: {'1':"show_note('An object`s average\\nvelocitycan be\\ndetermined by\\ndividing its change in\\nposition over the time\\nit took.\\n\\ndelta x / time');", '2':"type_answer('What is an object`s\\naverage velocity\\nwhen traveling\\nfor 10m in\\n5 seconds?\\n\\nAnswer without units.')"},
  6: {'1':"show_note('The momentum (p) of an\\nobject is equal to its\\nmass times velocity.\\n\\np = mv');", '2':"type_answer('What is the momentum\\nof an object with a\\nmass of 12 kg and\\na velocity of\\n8 m/s?\\n\\nAnswer without units.')"},
  7: {'1':"show_note('acceleration can be\\nfound using the change\\nin velocity over time.\\n\\na = (v-v0)/t');", '2':"type_answer('vf = 20 m/s\\nv0 = 0 m/s\\nt = 5 sec.\\nFind the acceleration.\\n\\nAnswer without units.')"},
  8: {'1':"show_note('The people who build\\nroads, buildings, and\\npublic infrastructure are\\ncalled civil engineers.');", '2':"type_answer('Someone who engineers a\\nhighway would be\\na ____ engineer.')"},
  9: {'1':"show_note('A vector points in\\na direction with a\\ncertain magnitude');", '2':"type_answer('a vector has both\\nmagnitude and what?')",'3':"show_note(vector)"},
};//interaciton map

var max_level = rooms.length-1;


var hidden_tiles = [
  [//room 0
  "......1...",
  "..........",
  "..........",
  "...2......",
  "..........",
  "..........",
  ],

  [//room 1
  "....2.....",
  "..........",
  "........1.",
  "..........",
  "..........",
  "..........",
  ],

  [//room 2
  "...2......",
  "..........",
  "..........",
  ".....3....",
  "........1.",
  "..........",
  ],

  [//room 3
  ".....1....",
  "..........",
  "..........",
  "..........",
  "...2......",
  "..........",
  ],

  [//room 4
  "........2.",
  "..........",
  "..........",
  ".......1..",
  "..........",
  "..........",
  ],

  [//room 5
  "..........",
  "..........",
  "........2.",
  "..........",
  "..1.......",
  "..........",
  ],

  [//room 6
  "..........",
  "..........",
  ".......2..",
  "..........",
  "........1.",
  "..........",
  ],

  [//room 7
  "..........",
  "....2.....",
  "..........",
  "..........",
  "....1.....",
  "..........",
  ],

  [//room 8
  "....2.....",
  "..........",
  "..........",
  "..........",
  ".....1....",
  "..........",
  ],

  [//room 9
  ".......2..",
  "..........",
  ".....1....",
  "..........",
  ".....3....",
  "..........",
  ],


];//rooms



var answers = {
  0: "50",
  1: "mechanical",
  2: "4.24",
  3: "96",
  4: "electrical",
  5: "2",
  6: "96",
  7: "4",
  8: "civil",
  9: "direction",
};



function background(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,width,height);
}//background


function better_picture(px, py, pix_data, pix_size, clear=undefined){
  for(var y=0; y<pix_data.length; y++){
    for(var x=0; x<pix_data[y].length; x++){
      if(pix_data[y][x] !== clear){
        ctx.fillStyle = pix_data[y][x];
        ctx.fillRect(px+(x*pix_size), py+(y*pix_size), pix_size, pix_size);
      }
    }//for
  }//for
}//betterPicture


function basic_line(x1,y1,x2,y2){
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}//line


function set_mouse_pos(canvas, event){
    var rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX-rect.left
    mouse.y = event.clientY-rect.top
}//get mouse pos

function player_controls(){
  //player movement
  if(findin(83,keys)){//s (down)
    player.y += player.speed;
    player.facing = "down";
  }//down button
  if(findin(87,keys)){//w (up)
    player.y -= player.speed;
    player.facing = "up";
  }//down button
  if(findin(65,keys)){//a (left)
    player.x -= player.speed;
    player.facing = "left";
  }//down button
  if(findin(68,keys)){//d (right)
    player.x += player.speed;
    player.facing = "right";
  }//down button


}//player_controls


function show_note(s){
  in_note = true;
  current_note = s;
}//show_note


function type_answer(s){
  current_answer = "";//clear current answer
  do_typing = true;
  show_note(s);
}//type answer




function draw_player(){
  /*
  if(player.facing == "down" || player.facing == "up"){picture(player.x,player.y,player.width,player.height,"player_fwd");}
  if(player.facing == "right"){picture(player.x,player.y,player.width,player.height,"player_right");}
  if(player.facing == "left"){picture(player.x,player.y,player.width,player.height,"player_left");}
  */
  //floor player position to prevent atrifacting in image
  player.x = Math.floor(player.x);
  player.y = Math.floor(player.y);

  var player_pix_size = Math.round(player.width/player.pix_width);
  better_picture(player.x,player.y,player.image,player_pix_size,"#ffffff");

}//draw player

function draw_prompt_bubbles(player_interacting){
  if(player_interacting != 0){//if there is something to say
    var e_bubble_size = 3;
    better_picture(player.x,player.y-player.height,e_button,e_bubble_size,"#ffffff");
  }//is bubble
}//draw_prompt_bubbles


function return_room_center(room){
  var room_width = rooms[room][0].length * tile_size;
  var room_height = rooms[room].length * tile_size;
  return({x: (width/2)-(room_width/2), y: (height/2)-(room_height/2), width: room_width, height: room_height});
}//return_room_center


function fill_color_picker(){
  var picker_width = 5;
  var picker_height = 10;
  var clear_region = 1;
  var clear_strip = [];
  for(var i=0; i<picker_width; i++){clear_strip.push(16777215);}
  for(var i=0; i<clear_region; i++){color_picker.push(clear_strip);}
  for(var h=0; h<picker_height-clear_region; h++){
    line = [];
    for(var w=0; w<picker_width; w++){
      line.push(rand(0,16777215));
    }//height
    color_picker.push(line);
  }//height


}//fill_color_picker



function draw_room(room_x, room_y, room){
  for(var y=0; y<rooms[room].length; y++){
    for(var x=0; x<rooms[room][y].length; x++){
      if(rooms[room][y][x] !== "."){
        //picture(room_x+(x*tile_size),room_y+(y*tile_size),tile_size,tile_size,tile_map[rooms[room][y][x]]);
        better_picture(room_x+(x*tile_size), room_y+(y*tile_size), tile_map[rooms[room][y][x]], tile_px_size);
        if(findin(rooms[room][y][x],solid_tiles)){//if its a solid tile, collide with it
          new_pos = offset_bottom_collision(player.x,player.y,player.width*0.9,room_x+(x*tile_size),room_y+(y*tile_size),tile_size,0.6);
          player.x = new_pos[0];
          player.y = new_pos[1];
        }//if solid tile
      }//if it is an actual tile, not void
    }//for x
  }//for y
}//draw room



function world_interaction(room_x, room_y, room){
  var tile_number = '0';
  for(var y=0; y<hidden_tiles[room].length; y++){
    for(var x=0; x<hidden_tiles[room][y].length; x++){
      if(hidden_tiles[room][y][x] !== "."){
          var tile_touched = simple_collision(player.x,player.y,player.width*0.8,room_x+(x*tile_size),room_y+(y*tile_size),tile_size*0.8);
          if(tile_touched){
            tile_number = hidden_tiles[room][y][x];
          }
      }//if it is an interactable tile
    }//for x
  }//for y
  return(tile_number);
}//world_interaction


function player_interaction(player_interacting, room){
  if(!findin(69,keys)){
    released_note_key = true;
  }//allow next
  if(player_interacting != '0' && findin(69,keys) && released_note_key){
    in_note = false;
    released_note_key = false;
    if(player_interacting == 's'){
      room_id += 1;
      msg_color = "#ffffff";
      message = "Room " + (room_id+1).toString();
      if(room_id > max_level){
        current_screen = "end";
      }
    }
    else{
      eval(interaction_map[room][player_interacting]);
    }
  }//if should interact
}//player_interation




function draw_text(x, y, size, color, string){
  color = color.toLowerCase();//protect against capital hex values
  string = string.toLowerCase();
  var char_width = 5;//char width in pixels
  var char_height = 5;//char height in pixels
  var line_shift = 0;
  var char_return_shift = 0;
  var clear_color = "#ffffff";
  //var used_font = basic_font;
  //console.log(basic_font[0]);
  var font_sheet_key = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","!","@","#","$","%","^","&","*","(",")","-","_","=","+","[","{","]","}","\\","|",";",":","'","\"",",","<",".",">","/","?","`","~"];
  //scan string to draw each char
  for(var s=0; s<string.length; s++){

    //special chars
    if(string[s] == '\n'){
            //if(string[s+1] == 'n'){
              line_shift += 1;
              char_return_shift = s+1;
            //}//return line
    }//escaped chars


    //find that chars index
    var char_index=-1;
    for(var i=0; i<font_sheet_key.length; i++){
      if(font_sheet_key[i] == string[s]){
        char_index = i;
      }//if matched char
    }//for all chars
    //console.log(char_index);

    if(char_index != -1){//if valid char
      //grab char's pixel data
      pixel_index = (char_index * char_width);

      //assemble data into array
      char_pix_data = [];
      for(var i=0; i<char_height; i++){
        char_pix_data.push(basic_font[i].slice(pixel_index,pixel_index+char_width));
      }//for compile layers of char pixel data

      //modify pixel pixel data to change text color (and background if needed)
      if(color == "#ffffff"){
        clear_color = "#000000";
        for(var h=0; h<char_pix_data.length; h++){
          for(var w=0; w<char_pix_data[h].length; w++){
            if(char_pix_data[h][w] == "#000000"){
              char_pix_data[h][w] = "#ffffff";
            }
            else{
              char_pix_data[h][w] = "#000000";
            }
          }//w
        }//h
      }//white text
      else{
        for(var h=0; h<char_pix_data.length; h++){
          for(var w=0; w<char_pix_data[h].length; w++){
            if(char_pix_data[h][w] == "#000000"){
              char_pix_data[h][w] = color;
            }//change color
          }//for width
        }//for height

      }//else other color

      //draw the image of the char
      better_picture(x+(char_width*(s-char_return_shift)*size), y+(line_shift*char_height*size)+(line_shift*size), char_pix_data, size, clear_color);

    }//if valid char

  }//for string chars
}//draw_text




function draw_note(){
  var note_pix_size = 15;
  var note_width = 40;
  var note_height = 30;
  var note_x = (width/2) - ((note_width*note_pix_size)/2);
  var note_y = (height/2) - ((note_height*note_pix_size)/2);

  //draw notebook paper
  better_picture(note_x,note_y,note_paper,note_pix_size,"#ffffff");

  //draw ESC box
  var esc_text_size = 5;
  ctx.fillStyle = "#bdb5ba";
  ctx.fillRect(570, note_y-10,100,50);
  draw_text(570+10, note_y-0, esc_text_size, "#000000", "ESC");


  var note_text_size = 4;
  var text_x_shift = 100;
  var text_y_shift = 50;
  draw_text(note_x+text_x_shift, note_y+text_y_shift, note_text_size, "#000000", current_note);


}//draw_note


function exit_note_controls(){
  if(!findin(69,keys)){
    released_note_key = true;
  }//allow next
  if(released_note_key && findin(27,keys)){//ESC to exit a note
    in_note = false;
    released_note_key = false;
    do_typing = false;
  }
}//exit_note_controls



function draw_typed_answer(){
  var note_pix_size = 15;
  var note_width = 40;
  var note_height = 30;
  var note_x = (width/2) - ((note_width*note_pix_size)/2);
  var note_y = (height/2) - ((note_height*note_pix_size)/2);

  var note_text_size = 4;
  var text_x_shift = 100;
  var text_y_shift = 50;

  var answer_y_shift = 300;

  draw_text(note_x+text_x_shift, note_y+text_y_shift+answer_y_shift, note_text_size, "#000000", current_answer);

}//draw_typed_answer


function typing_action(){
  if(keys.length == 0){
    allow_typing = true;
  }
  //convert keycode of digit keys
  if(keys.length && allow_typing && released_note_key){
    var key_spot = keys[0];
    var has_digit = false;
    if(key_spot-48 >= 0 && key_spot-48 <= 9){
      current_answer += (key_spot-48).toString();
      allow_typing = false;
    }//digit typing
    if(key_spot-65 >= 0 && key_spot-65 <= 26){
      var chars = "abcdefghijklmnopqrstuvwxyz";
      var typed_char = chars[key_spot-65];
      current_answer += typed_char;
      allow_typing = false;
    }//char typing

    if(key_spot == 190){//period
      current_answer += '.';
      allow_typing = false;
    }//period

    if(key_spot == 32){//space
      current_answer += ' ';
      allow_typing = false;
    }//space

    if(key_spot == 8){//backspace
      current_answer = current_answer.slice(0,current_answer.length-1);
      allow_typing = false;
    }//backspace

  }//a key is pressed
}//typing function



function check_answer(room){
  var correct = (answers[room] == current_answer);

  if(correct){
    var line = rooms[room][0].slice(1,rooms[room][0].length);
    rooms[room][0] = "s"+line;//set visual stairs
    line = hidden_tiles[room][0].slice(1,hidden_tiles[room][0].length);
    hidden_tiles[room][0] = "s"+line;//set usable exit tile
    in_note = false;
    do_typing = false;
    msg_color = "#eb4034";
    message = "Room "+(room_id+1).toString() + "\nStairs to the next room have appeared!";
  }//if correct

}//check_answer




function enforce_room_borders(ex, ey, es, x, y, w, h){
  if(ex < x){//left side
    ex = x;
  }
  if(ex+es > x+w){//right side
    ex = x+w-es;
  }
  if(ey < y){//top
    ey = y;
  }
  if(ey+es > y+h){//bottom
    ey = y+h-es;
  }
  return({x: ex, y: ey});
}//enforce_room_borders






function title_screen(){
  //background color
  //ctx.fillStyle = "blue";
  //ctx.fillRect(0,0,width,height);
  better_picture(0,0, title_background, 10);

  //draw title name
  var title_font_size = 8;
  var title_char_width = 5;
  var title_width = "Cultivate".length;
  var title_x = (width/2)-((title_width*title_font_size*title_char_width)/2)+50;
  //old color: #13eb3a
  draw_text(20, 30, title_font_size, "#ffffff", "LLC Escape!");

  //draw continue text
  var continue_btn_font_size = 4
  draw_text(310, 130  , continue_btn_font_size, "#f03cb1", "Press enter to play");//300,450

  //draw credits
  var credit_font_size = 4
  //old color: #202124
  draw_text(width*0.01, height*0.75  , credit_font_size, "#ffffff", "Joshua Corvi\nRyan Bill\nZamzam Alabdullah\nNick Marencik");


  //title screen controls
  if(findin(32,keys) || findin(13,keys)){
    current_screen = "char_maker";
  }//if enter/space pressed


  //make sure vars begin at the start
  room_id = 0;
  ending_shift = 0;
  scroll_speed = 0;

}//draw_title_screen




function char_maker(){
  //draw background
  ctx.fillStyle = "#0026FF";//lightblue
  ctx.fillRect(0,0,width,height);


  var pixel_size = 12;
  var canv_plane_x = (width/2)-((player.pix_width*pixel_size)/2);
  var canv_plane_y = (height/2)-((player.pix_height*pixel_size)/2);

  //make a canvas to work on
  var char_canv = {
    x:10,
    y:50,
    width:400,
    height:400
  };

  var color_picker_box = {
    x:450,
    y:50,
    width: color_picker[0].length,
    height: color_picker.length,
    pix_size: 40
  };


  //draw color picker
  for(var y=0; y<color_picker.length;y++){
    for(var x=0; x<color_picker[y].length;x++){
      //var curr_color = rand(0,16777215);
      ctx.fillStyle = "#"+color_picker[y][x].toString(16);
      ctx.fillRect(color_picker_box.x+(x*color_picker_box.pix_size),color_picker_box.y+(y*color_picker_box.pix_size),color_picker_box.pix_size,color_picker_box.pix_size);
    }//y
  }//x


  var color_diff_x = mouse.x - color_picker_box.x;
  var color_diff_y = mouse.y - color_picker_box.y;
  var selected_color_x = Math.floor(color_diff_x/color_picker_box.pix_size);
  var selected_color_y = Math.floor(color_diff_y/color_picker_box.pix_size);

  if(mouse.clicked == true && selected_color_x >= 0 && selected_color_y >= 0 && selected_color_x < color_picker_box.width && selected_color_y < color_picker_box.height){
    drawing_color = color_picker[selected_color_y][selected_color_x];
    console.log(drawing_color);
  }//if clicked




  //draw back canvas
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(char_canv.x,char_canv.y,char_canv.width,char_canv.height);

  //gat mouse position on the char_canv
  var char_pix_size = char_canv.width/player.pix_width;
  var pt_diff_x = mouse.x - char_canv.x;
  var pt_diff_y = mouse.y - char_canv.y;
  var draw_x = Math.floor(pt_diff_x/char_pix_size);
  var draw_y = Math.floor(pt_diff_y/char_pix_size);

  //if clicked, modify that pixel
  if(mouse.clicked == true && draw_x >= 0 && draw_y >= 0 && draw_y < 16 && draw_x < 16){
    player.image[draw_y][draw_x] = "#"+drawing_color.toString(16);
  }//if clicked

  //draw char's pixel data
  better_picture(char_canv.x,char_canv.y, player.image, char_pix_size);

  //draw lines to divide pix
  for(var i=0; i<char_canv.width; i+=char_pix_size){
    basic_line(char_canv.x+i,char_canv.y,char_canv.x+i,char_canv.y+char_canv.height);
    basic_line(char_canv.x,char_canv.y+i,char_canv.x+char_canv.width,char_canv.y+i);
  }//for



  //draw text

  draw_text(10, 10, 4, "#FFFFFF", "Draw a custom character");
  draw_text(10, 470, 4, "#FFFFFF", "Press Enter to continue");





  if(!findin(32,keys) && !findin(13,keys)){
    released_next = true;
  }//allow next
  if(released_next && (findin(32,keys) || findin(13,keys))){
    current_screen = "game";
  }


}//char_maker




function run_game(){
  //pre-loop processing
  room_center = return_room_center(room_id);


  //movement and interaction
  if(!in_note){
    player_controls();
    room_borders = enforce_room_borders(player.x, player.y, player.width, room_center.x, room_center.y, room_center.width, room_center.height);
    player.x = room_borders.x;
    player.y = room_borders.y;
    var player_interacting = world_interaction(room_center.x, room_center.y, room_id);
    player_interaction(player_interacting, room_id);
  }//not in a note
  else{//in a note
    exit_note_controls();
    if(do_typing){//allow the player to type into the
      typing_action();
    }//do typing
  }//else in a note

  //game processing




  //draw game
  background();
  draw_room(room_center.x, room_center.y, room_id);
  draw_player();
  draw_prompt_bubbles(player_interacting);

  if(in_note){//draw note
    draw_note();
  }//if in note
  if(do_typing){
    draw_typed_answer();
    if(findin(13,keys)){
      check_answer(room_id);
    }
  }//draw typed answer on note

  draw_text(10, 10, 3, msg_color, message);
}//run game



function show_ending(){

  ctx.fillStyle = "#0094FF";
  ctx.fillRect(0,0,width,height);

  if(scroll_speed < 1 && ending_shift < 1000){
    scroll_speed += 0.001;
  }

  if(ending_shift < 1000){
    ending_shift += scroll_speed;
  }
  else if(scroll_speed > 0){
    scroll_speed -= 0.005;
    if(scroll_speed < 0){
      scroll_speed = 0;
    }
    ending_shift += scroll_speed;
  }

  better_picture(0,Math.floor(ending_shift)-1000, ending_background, 10);

  better_picture(150, Math.floor(ending_shift)-1000+1200, player.image, 8, "#ffffff");

  var ending_text_size = 4;
  draw_text(300, Math.floor(ending_shift)-1000+1100, ending_text_size, "#000000", "You made it out of\n the escape room!");
  draw_text(10, Math.floor(ending_shift)-1000+700, ending_text_size, "#000000", "please excuse the\n bad artwork");
  draw_text(250, Math.floor(ending_shift)-1000+0, ending_text_size, "#000000", "Thanks for playing!");

}//show_ending





function setup(){//set up funciton for pre-game
  //set player starting pos
  player.x = return_room_center(room_id).x;
  player.y = return_room_center(room_id).y;

  fill_color_picker();
  room_id = 0;
  ending_shift = 0;

}//setup



function main(evt){

  if(current_screen == "title"){
    title_screen();
  }//title screen
  else if(current_screen == "char_maker"){
    char_maker();
  }//cahr maker
  else if(current_screen == "game"){
    run_game();
  }//game screen
  else if(current_screen == "end"){
    show_ending();
  }




}//main

setup();//run setup
//window.setInterval(player_controls,10);
window.setInterval(main,10);//execute main every 10msec


canv.addEventListener("mousedown", function(event){
  set_mouse_pos(canv, event);
  mouse.clicked = true;
});
canv.addEventListener("mouseup", function(event){
  mouse.clicked = false;
});
