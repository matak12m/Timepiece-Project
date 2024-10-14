

const back_canvas = document.getElementById("background_canvas");
const front_canvas = document.getElementById("planets_canvas");

const ctx1 = back_canvas.getContext("2d");
back_canvas.width = 1500;
back_canvas.height = 1500;

const ctx2 = front_canvas.getContext("2d");
front_canvas.width = 1500;
front_canvas.height = 1500;


ctx1.imageSmoothingEnabled = false;  //makes the pixelart assets crisp
ctx2.imageSmoothingEnabled = false;  //makes the pixelart assets crisp

let transX = front_canvas.width * 0.5,
    transY = front_canvas.height * 0.5;

ctx1.translate(transX, transY);
ctx2.translate(transX, transY);

// //Render planet Mars
// T5.contextforeground.beginPath();
// T5.contextforeground.arc((T5.width/2)+(T5.xMars*T5.scale), (T5.height/2)-(T5.yMars*T5.scale), 4, 0, 2*Math.PI, true); 
// T5.contextforeground.fillStyle = 'red';
// T5.contextforeground.fill();
// T5.contextforeground.closePath();	



//approaching equation:  sqrt{y}*11 +x -60=0       where x = time in seconds, y = distance to sun.            when y = 0: comet is at the sun. stop drawing it. 
//change the multiplication of the square root to change the curve of approach
//change 60 to 24 if needed for days - only if theres a huge meteor that changes the days, or the changing of sun texture



const sunRadius = 100;


let currentTime;
let hours;
let minutes;
let seconds;
let miliseconds;
let position;
let timePosition;



function getTime(timeType){
    currentTime = new Date();
    hours = currentTime.getHours();
    minutes = currentTime.getMinutes();
    seconds = currentTime.getSeconds();
    miliseconds = currentTime.getMilliseconds();

  

    if (timeType == "hoursRounded") {

        return hours;
    }


    seconds = seconds + miliseconds/1000;
    minutes = minutes + seconds/60
    hours = hours + minutes/60;


    //console.log(minutes)

    if (timeType == "minutes") {
        return minutes;
    }
    else if (timeType == "hours") {
        return hours;
    }
    else if (timeType == "seconds") {
        return seconds;
    }
    
   

}





function update() {


   

    cometHandler();

    draw();

    
    setTimeout(update, 500);//every 30 miliseconds = 33 frames per second
    console.log("new frame")
}


update();



function draw() {

    ctx1.fillStyle = "black";
    ctx1.fillRect(-front_canvas.width *0.5, -front_canvas.height *0.5, back_canvas.width, back_canvas.height);



ctx1.beginPath();
ctx1.arc(0, 0 ,sunRadius, 0, 2 * Math.PI);
ctx1.fillStyle = "orange";
ctx1.fill();

ctx2.clearRect(-front_canvas.width *0.5, -front_canvas.height *0.5, front_canvas.width, front_canvas.height)



//TODO: remove comets once they collide with sun, make comets relate to time - readable clock - through reading hours.
Comet(0, 0, 60, 60, "blue", "comet", 0, "minutes");




Comet(0, 0, 60, 2, "green", "planet", 1, "minutes");



}



function Comet(addRadius, addAngle, timeToCollide, rotationSlowness, colour, orbitType, clockwise, timeType) {



timePosition = getTime(timeType);

    let radius;
    let cosinus;
    let sinus;

    if (orbitType == "comet" ) {

    radius = timeToCollide - timePosition +addRadius;  //getting closer to the sun as time goes on, may be moved.
    }
    else if (orbitType == "planet") {
    radius = timePosition + addRadius;
    }


    let angle = (timePosition % rotationSlowness) * 6 + addAngle;  // angle in 360 degrees, affected by function value


    if (clockwise == 0) {
        sinus = Math.sin(angle /( 2 * Math.PI));  //converted from radians to degrees
        cosinus = Math.cos(angle /( 2 * Math.PI));
    }
    else if (clockwise ==1) {           //swapping sine and cosine changes the direction of rotation
        sinus = Math.cos(angle /( 2 * Math.PI));  //converted from radians to degrees
        cosinus = Math.sin(angle /( 2 * Math.PI));
    }


    //console.log(radius);
    //console.log(angle)
    //console.log(sinus);
    //console.log(cosinus);

    
ctx2.beginPath();
ctx2.arc((radius * 12.5 + (sunRadius/2)) * sinus  , (radius* 12.5 + (sunRadius/2))*cosinus  , 50, 0, 2*Math.PI);
ctx2.fillStyle = colour;
ctx2.fill();


}




function cometHandler() {
    //dictates which comets are visible based on time
    //base 4 system up to 24: 0, 1, 2, 3 10, 11, 12, 13 20, 21, 22, 23 30, 31, 32, 33 100, 101, 102, 103 110, 111, 112, 113,
   

    let hoursCalc = getTime("hoursRounded")
    let hoursBaseFour = convertToBaseFour(hoursCalc);

    





}





function convertToBaseFour(input) {
    let baseFour = 0;

    let hoursStorage = input;  //current time in hours rounded down
    
    
    if (hoursStorage >=16) {               //calculate base 4
        baseFour+=100;
        hoursStorage-=16;
    }

    while (hoursStorage >= 4) {
        baseFour +=10;
        hoursStorage-=4;
    }
    
    while (hoursStorage >= 1) {
        baseFour +=1;
        hoursStorage-=1;
    }

//console.log(input);
//console.log(baseFour);

return baseFour;

}