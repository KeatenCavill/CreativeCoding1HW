function setup()
{
    createCanvas(500, 450);
}

function draw()
{
    background(255,0,0);
    textSize(22)
    text("Keaten :D", 0,400);

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
    triangle(230,100, 245,80, 245, 100);
    
    // mouth
    strokeWeight(10)
    line(175,140,290,140)

    // body
    fill(128, 128, 128);
    ellipse(250,250,100,150);
    
    //arms
    fill(0,0,0)
    strokeWeight(8)
    line(280,195,350,240)
    line(220,195,140,240)
    
    //legs
    rect(215,310,10,90);
    rect(275,310,10,90);

}