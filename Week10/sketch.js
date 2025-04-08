var size = 22
var count = 0
var size_direction = 2

var armL = 240
var armL_direction = 2
var armR = 240
var armR_direction =2

var legL = 215
var legL_direction = 2
var legR = 280
var legR_direction = 2

var noseX = 240
var noseY = 100
var nose_direction = 2


function setup()
{
    createCanvas(500, 450);
}

function draw()
{
    background(255,0,0);
    textSize(22)
    

    // head
    fill(255, 220, 177);
    circle(250,100,175);
    fill(0, 76, 255, 127);
    strokeWeight(3)
    rect(180,60,50,30);
    rect(260,60,50,30);
    line(180,80,160,50)
    line(310,80,340,50)
  
    // eyes
    strokeWeight(10);
    fill(0);
    point(200,75);
    point(285,75);

    // nose
    strokeWeight(2)
    fill(255,255,255,1)
    noseX += nose_direction
    noseY += nose_direction
    triangle(230,100, 245,80, noseX, noseY);
    if(noseX >= 290 || noseX <= 80)
      {
        nose_direction *= -1
      }
    
    // mouth
    strokeWeight(10)
    line(175,140,290,140)

    // body
    fill(128, 128, 128);
    ellipse(250,250,100,150);
    
    //arms
    fill(0,0,0)
    strokeWeight(8)
    line(280,195,380,armR)
    armR += armR_direction
    if(armR >=250 || armR <= 80)
      {
        armR_direction *= -1
      }
    line(220,195,120,armL)
    armL += armL_direction
    if(armL >=280 || armL <= 80)
      {
        armL_direction *= -1
      }
    
    //legs
    line(215,310,legL,400);
   legL += legL_direction
    if(legL >=250 || legL <= 80)
      {
        legL_direction *= -1
      }
    line(275,310,legR,400);
   legR += legR_direction
    if(legR >=400 || legR <= 240)
      {
        legR_direction *= -1
      }
  
    fill(120);
    textSize(size);
    size+= size_direction;
    count++;
    if(count > 5)
    {
        size_direction *=-1;
        count = 0;
    }
    text("Keaten :D", 0,400);
}