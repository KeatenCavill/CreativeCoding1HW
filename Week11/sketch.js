var w = 87; 
var s = 83;
var a = 65;
var d = 68;

var characterx=100
var charactery=100

var shape1x = 260
var shape1y = 180
var shape1xspeed;
var shape1yspeed;

var shape2x = 450
var shape2y = 320
var shape2xspeed;
var shape2yspeed;

var characterx = 50
var charactery = 50

var mouseshapeX;
var mouseshapeY;


function setup() {
  createCanvas(500,600);
  
  shape1xspeed = Math.floor(Math.random()*Math.random());
  shape1yspeed = Math.floor(Math.random()*Math.random());
  shape2xspeed = Math.floor(Math.random()*Math.random());
  shape2yspeed = Math.floor(Math.random()*Math.random());
  
  create_character(250,540);
  
}

function draw() {
  background(158,211,235);
  stroke(0);
  fill(0);
  
  create_borders(5)
  textSize(20)
  text("exit",235,15);
  
  draw_character();
  character_movement();
  
  if(characterx > 200 && characterx < 300 && charactery < 0)
    {
       fill(0);
        stroke(5);
        textSize(26);
        text("You Win!", width/2-50, height/2-50);
    }
  
  fill(240,170,196);
  circle(shape1x, shape1y, 10);
  
  shape1xspeed = Math.floor(Math.random() * Math.random()*20);
  shape1yspeed = Math.floor(Math.random() * Math.random()*-10);
  
  shape1x += shape1xspeed;
  shape1y += shape1yspeed;
    if(shape1x > width)
    {
        shape1x = 0;
    }
    if(shape1x < 0)
    {
        shape1x= width;
    }
    if(shape1y > height)
    {
        shape1y= 0;
    }
    if(shape1y < 0)
    {
        shape1y = height;
    }

 
  fill(145,145,226);
  circle(shape2x, shape2y,20);
  
  shape2xspeed = Math.floor(Math.random() * Math.random()*20);
  shape2yspeed = Math.floor(Math.random() * Math.random()*-10);
  
  shape2x += shape1xspeed;
  shape2y += shape1yspeed;
    if(shape2x > width)
    {
        shape2x = 0;
    }
    if(shape2x < 0)
    {
        shape2x= width;
    }
    if(shape2y > height)
    {
        shape2y= 0;
    }
    if(shape2y < 0)
    {
        shape2y = height;
    }
  
   fill(0,255,0);
  circle(mouseshapeX,mouseshapeY,15);
  
}

function create_borders(thickness)
{
    rect(0,0,200,thickness);
    rect(300,0,500,thickness);
    rect(0,0,thickness,height);
    rect(0, height-thickness,width, thickness);
    rect(width-thickness,0,thickness,height);
}
  

function create_character(x,y)
{
    characterx = x;
    charactery = y;
 
    fill(255,0,0)   
    circle(characterx,charactery,25);
}

function draw_character()
{
    fill(255,0,0);
    circle(characterx,charactery,25);
}

function character_movement()
{
    if(keyIsDown(w))
    {
        charactery -= 10;   
    }
    if(keyIsDown(s))
    {
        charactery += 10;   
    }
    if(keyIsDown(a))
    {
        characterx -= 10;   
    }
    if(keyIsDown(d))
    {
        characterx += 10;   
    }
}

function mouseClicked()
{
  mouseshapeX = mouseX;
  mouseshapeY = mouseY;
}