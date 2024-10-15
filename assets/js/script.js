

const back_canvas = document.getElementById("background_canvas");
const front_canvas = document.getElementById("planets_canvas");

const ctx1 = back_canvas.getContext("2d");
back_canvas.width = 1500;
back_canvas.height = 1500;

const ctx2 = front_canvas.getContext("2d");
front_canvas.width = 1500;
front_canvas.height = 1500;


ctx1.imageSmoothingEnabled = false;  //makes the pixelart assets crisp
//ctx2.imageSmoothingEnabled = false;  //makes the pixelart assets crisp

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



const sunRadius = 80;


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

    
    //hours = 15;

    if (timeType == "hoursRounded") {

        return hours;
    }

    
    seconds = seconds + miliseconds/1000;
    minutes = minutes + seconds/60
    hours = hours + minutes/60;

   //minutes = 59.9;
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


   

    

    draw();

    
    
    setTimeout(update, 30);//every 30 miliseconds = 33 frames per second
    console.log("new frame")
}


update();



function draw() {

    
    ctx1.beginPath();
ctx1.arc(0, 0 ,750, 0, 2 * Math.PI);
ctx1.fillStyle = "rgba(0, 0, 0, 0.1)"
ctx1.fill();






ctx2.beginPath();
ctx2.arc(0, 0 ,750, 0, 2 * Math.PI);
ctx2.fillStyle = "rgba(0, 0, 0, 0.1)"
ctx2.fill();

//ctx2.clearRect(-front_canvas.width *0.5, -front_canvas.height *0.5, front_canvas.width, front_canvas.height)

// Create gradient
const grad=ctx2.createRadialGradient(50,150,750,50,150,750);
grad.addColorStop(0,"black");
grad.addColorStop(1,"white");  

// Fill rectangle with gradient
ctx2.fillStyle = grad;
ctx2.fillRect(-front_canvas.width *0.5, -front_canvas.height *0.5, front_canvas.width, front_canvas.height);

ctx2.beginPath();
ctx2.arc(0, 0 ,sunRadius, 0, 2 * Math.PI);
ctx2.fillStyle = "orange";
ctx2.fill();


cometHandler();

ctx2.drawImage(backgroundWhite,-front_canvas.width *0.5, -front_canvas.height *0.5 )




}



function Comet(addRadius, addAngle, timeToCollide, rotationSlowness, colour, orbitType, clockwise, timeType, sizeMultiplier) {



timePosition = getTime(timeType);

    let radius;
    let cosinus;
    let sinus;

    if (orbitType == "comet" ) {

    radius = timeToCollide - timePosition +addRadius;  //getting closer to the sun as time goes on, may be moved.
    }
    else if (orbitType == "planet") {
    radius = addRadius;
    }


    let angle = (timePosition % rotationSlowness) * (360/rotationSlowness) + addAngle/( 2*Math.PI);  //to have a perfect planet cycle, the rotation slowness needs to be set to around 555       seconds hand moves about 105 radians per second == 6 degrees per second
        // angle in 360 degrees, affected by function value


    if (clockwise == -1) {
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
ctx2.arc((radius * 12.5 + (sunRadius/2)) * sinus  , (radius* 12.5 + (sunRadius/2))*cosinus  ,20 *sizeMultiplier, 0, 2*Math.PI);
ctx2.fillStyle = colour;
ctx2.fill();


}




function cometHandler() {
    //dictates which comets are visible based on time
    //base 4 system up to 24: 0, 1, 2, 3 10, 11, 12, 13 20, 21, 22, 23 30, 31, 32, 33 100, 101, 102, 103 110, 111, 112, 113,
    let clockwiseRotate;

    let hoursCalc = getTime("hoursRounded")
    let hoursBaseFour = convertToBaseFour(hoursCalc);

    Comet(40 , -60, 0 , 549, "green", "planet", 1, "seconds", 1.1);
    Comet(40 , -60, 0 , 549, "lime", "planet", 1, "seconds", 1); //TODO: figure out the perfect angleSlowness


    //comets:
    //clockwise cyan
    //counter-clockwise red
    //clockwise yellow
    //counter-clockwise purple


    console.log(hoursBaseFour)

    if (hoursBaseFour > 40) {
        Comet(0 , 90 , 60 , 105, "blue", "comet", 1, "minutes", 1.05);
        Comet(0 , 90 , 60 , 105, "cyan", "comet", 1, "minutes", 1);
        hoursBaseFour-=100;
    }

    
    if (hoursBaseFour < 40) {
        for (let i =hoursBaseFour; i> 4; i-=10){
            clockwiseRotate = oddOrEven((i-i%10)/10);

            Comet(-i *9.6 ,i*170 , 60 +i * 9.4 ,60 - i * 10, "orange", "comet", -clockwiseRotate, "minutes", 1.05);
            Comet(-i *9.6 ,i*170 , 60 +i * 9.4 ,60 - i * 10, "yellow", "comet", -clockwiseRotate, "minutes", 1);
            hoursBaseFour-=10;
        }


    }


    if (hoursBaseFour < 4) {

        for (let i = hoursBaseFour; i > 0; i-- ){

            clockwiseRotate = oddOrEven(i);
            Comet(  -i * 28 ,i*230 , 60+i * 25.5 , 60 + i*30, "pink", "comet", clockwiseRotate, "minutes", 1.05);
            Comet(  -i * 28 ,i*230 , 60+i * 25.5 , 60 + i*30, "purple", "comet", clockwiseRotate, "minutes", 1);
            hoursBaseFour--;
        }

    }



}



function oddOrEven(input) {
    if (input % 2 == 1) {
        return -1;

    }
    else if (input % 2 ==0) {
        return 1;
    }
    else {
        console.log("error - non-integer number entered to oddOrEven()")
        return 0;
    }

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


function animateSun() {


}