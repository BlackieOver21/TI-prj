
//
///
///           Animation for Curve
///
//

function animateCurve(){
    
        
    const canvas = document.getElementById('sierpinskiCanvas');
    const ctx = canvas.getContext('2d');

    const width = canvas.width = 500;
    const height = canvas.height = 500;

    let iterations = 0; // Start with 0 iterations
    const maxIterations = 10; // Maximum number of iterations
    const animationSpeed = 300; // Animation speed in milliseconds

    ctx.fillStyle = 'white'; // Change this to the color you want
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black'; // Change this to the color you want

    function drawGasketCurve(x1, y1, x2, y2, x3, y3, x4, y4, level, iter, ratio) {
        if (level === 0) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.stroke();
            // drawLine(x1,y1,x2,y2,ratio);
            // drawLine(x2,y2,x3,y3,ratio);
            // drawLine(x3,y3,x4,y4,ratio);
        } else {
            if ((iter%2)==0){
                //1 segment
                var midX = (x1 + x2) / 2;
                var midY = (y1 + y2) / 2;
                var dx = x2 - x1;
                var dy = y2 - y1;
                var angle = Math.atan2(dy, dx);
                var segmentLength = Math.sqrt(dx * dx + dy * dy) / 2;

                const x12 = x1 + Math.cos(angle + Math.PI / 3) * segmentLength;
                const y12 = y1 + Math.sin(angle + Math.PI / 3) * segmentLength;
                const x13 = midX + Math.cos(angle + Math.PI / 3) * segmentLength;
                const y13 = midY + Math.sin(angle + Math.PI / 3) * segmentLength;
                
                //2 segment
                midX = (x2 + x3) / 2;
                midY = (y2 + y3) / 2;
                dx = x3 - x2;
                dy = y3 - y2;
                angle = Math.atan2(dy, dx);
                segmentLength = Math.sqrt(dx * dx + dy * dy) / 2;

                const x22 = x2 + Math.cos(angle - Math.PI / 3) * segmentLength;
                const y22 = y2 + Math.sin(angle - Math.PI / 3) * segmentLength;
                const x23 = midX + Math.cos(angle - Math.PI / 3) * segmentLength;
                const y23 = midY + Math.sin(angle - Math.PI / 3) * segmentLength;
                
                //3 segment
                midX = (x3 + x4) / 2;
                midY = (y3 + y4) / 2;
                dx = x4 - x3;
                dy = y4 - y3;
                angle = Math.atan2(dy, dx);
                segmentLength = Math.sqrt(dx * dx + dy * dy) / 2;

                const x32 = x3 + Math.cos(angle + Math.PI / 3) * segmentLength;
                const y32 = y3 + Math.sin(angle + Math.PI / 3) * segmentLength;
                const x33 = midX + Math.cos(angle + Math.PI / 3) * segmentLength;
                const y33 = midY + Math.sin(angle + Math.PI / 3) * segmentLength;
                console.log(iter);

drawGasketCurve(x1, y1, x12, y12, x13, y13, x2, y2, level - 1, iter+1);
drawGasketCurve(x2, y2, x22, y22, x23, y23, x3, y3, level - 1, iter);
drawGasketCurve(x3, y3, x32, y32, x33, y33, x4, y4, level - 1, iter+1); 
            } else {
                //1 segment
                var midX = (x1 + x2) / 2;
                var midY = (y1 + y2) / 2;
                var dx = x2 - x1;
                var dy = y2 - y1;
                var angle = Math.atan2(dy, dx);
                var segmentLength = Math.sqrt(dx * dx + dy * dy) / 2;

                const x12 = x1 + Math.cos(angle - Math.PI / 3) * segmentLength;
                const y12 = y1 + Math.sin(angle - Math.PI / 3) * segmentLength;
                const x13 = midX + Math.cos(angle - Math.PI / 3) * segmentLength;
                const y13 = midY + Math.sin(angle - Math.PI / 3) * segmentLength;
                
                //2 segment
                midX = (x2 + x3) / 2;
                midY = (y2 + y3) / 2;
                dx = x3 - x2;
                dy = y3 - y2;
                angle = Math.atan2(dy, dx);
                segmentLength = Math.sqrt(dx * dx + dy * dy) / 2;

                const x22 = x2 + Math.cos(angle + Math.PI / 3) * segmentLength;
                const y22 = y2 + Math.sin(angle + Math.PI / 3) * segmentLength;
                const x23 = midX + Math.cos(angle + Math.PI / 3) * segmentLength;
                const y23 = midY + Math.sin(angle + Math.PI / 3) * segmentLength;
                
                //3 segment
                midX = (x3 + x4) / 2;
                midY = (y3 + y4) / 2;
                dx = x4 - x3;
                dy = y4 - y3;
                angle = Math.atan2(dy, dx);
                segmentLength = Math.sqrt(dx * dx + dy * dy) / 2;

                const x32 = x3 + Math.cos(angle - Math.PI / 3) * segmentLength;
                const y32 = y3 + Math.sin(angle - Math.PI / 3) * segmentLength;
                const x33 = midX + Math.cos(angle - Math.PI / 3) * segmentLength;
                const y33 = midY + Math.sin(angle - Math.PI / 3) * segmentLength;
                console.log(level);

drawGasketCurve(x1, y1, x12, y12, x13, y13, x2, y2, level - 1, iter+1);
drawGasketCurve(x2, y2, x22, y22, x23, y23, x3, y3, level - 1, iter);
drawGasketCurve(x3, y3, x32, y32, x33, y33, x4, y4, level - 1, iter+1);
            }
        }
    }

    function animate(ratio) {
        ctx.clearRect(0, 0, width, height);
        const side = 300;
        const x1 = 50;
        const y1 = height - 50;
        const x2 = x1 + side/4;
        const y2 = y1 - (side/2)*(Math.sqrt(3)/2);
        const x3 = x1 + (side/4)*3;
        const y3 = y2;
        const x4 = x1+side;
        const y4 = y1;

        drawGasketCurve(x1, y1, x2, y2, x3, y3, x4, y4, iterations, 0, 1);
        if (iterations < maxIterations) {
            iterations++;
            setTimeout(animate, animationSpeed);
        }
    }

    animate();
    
    function drawLine(x1,y1,x2,y2,ratio) {
        //ctx.fillRect(0,0,300,300);
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        x2 = x1 + ratio * (x2-x1);
        y2 = y1 + ratio * (y2-y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
        // And if we intend to start new things after
        // this, and this is part of an outline, 
        // we probably also want a ctx.closePath()
    }

    ctx.clearRect(0, 0, width, height);
    const side = 300;
    const x1 = 50;
    const y1 = height - 50;
    const x2 = x1 + side/4;
    const y2 = y1 - (side/2)*(Math.sqrt(3)/2);
    const x3 = x1 + (side/4)*3;
    const y3 = y2;
    const x4 = x1+side;
    const y4 = y1;

    //animation(x1, y1, x2, y2, x3, y3, x4, y4);

    function animation(x1, y1, x2, y2, x3, y3, x4, y4, ratio) {
        //drawLine(0,0,300,300,ratio);
        ratio = ratio || 0;
        drawGasketCurve(x1, y1, x2, y2, x3, y3, x4, y4, iterations, 5, ratio);
        if(ratio<1) {
            requestAnimationFrame(function() {
            animate(x1, y1, x2, y2, x3, y3, x4, y4, ratio + 0.01);
            });
        }
    }
}


//
///
///           Animation for RandomDot
///
//

function animateRandomDot() {    
    const canvas = document.getElementById('sierpinskiCanvas');
    const ctx = canvas.getContext('2d');

    const width = canvas.width = 500;
    const height = canvas.height = 500;

        const triangleVertices = [
        { x: width / 2, y: 100 }, // Vertex 1
        { x: 100, y: height - 100 }, // Vertex 2
        { x: width - 100, y: height - 100 } // Vertex 3
    ];

    ctx.fillStyle = 'white'; // Change this to the color you want
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black'; // Change this to the color you want

    ctx.fillRect(triangleVertices[0].x, triangleVertices[0].y, 2, 2);
    ctx.fillRect(triangleVertices[1].x, triangleVertices[1].y, 2, 2);
    ctx.fillRect(triangleVertices[2].x, triangleVertices[2].y, 2, 2);

    function getRandomPointInTriangle() {
        const u = Math.random();
        const v = Math.random();
        const w = 1 - u - v;
        const point = {
            x: u * triangleVertices[0].x + v * triangleVertices[1].x + w * triangleVertices[2].x,
            y: u * triangleVertices[0].y + v * triangleVertices[1].y + w * triangleVertices[2].y
        };
        return point;
    }

    const animationSpeed = 0.5; // Adjust as needed
    let currentPosition = getRandomPointInTriangle();

    function animateRandomWalk() {
        const randomVertexIndex = Math.floor(Math.random() * 3); // Randomly select a vertex
        const selectedVertex = triangleVertices[randomVertexIndex];
        currentPosition.x += (selectedVertex.x - currentPosition.x) / 2;
        currentPosition.y += (selectedVertex.y - currentPosition.y) / 2;

        ctx.fillRect(currentPosition.x, currentPosition.y, 2, 2); // Plot the current position

        setTimeout(animateRandomWalk, animationSpeed);
    }

    function animate(ratio) {
        //ctx.clearRect(0, 0, width, height);
        const side = 300;
        const x1 = 50;
        const y1 = height - 50;
        const x2 = x1 + side/4;
        const y2 = y1 - (side/2)*(Math.sqrt(3)/2);
        const x3 = x1 + (side/4)*3;
        const y3 = y2;
        const x_start = x1+side;
        const y_start = y1;

        drawGasketCurve(x1, y1, x2, y2, x3, y3, x_start, y_start);
        if (iterations < maxIterations) {
            iterations++;
            setTimeout(animate, animationSpeed);
        }
    }

    animateRandomWalk();
}

//
///
///         Część skryptowa
///
//


function animate_this() {
    const choice = document.getElementById('choice').value;
    if (choice) {
        switch (choice) {
            case "curve":
                animateCurve();
                break;
            case "randomdot":
                animateRandomDot();
                break;
            // Add more cases as needed
            default:
                // code to execute if expression doesn't match any case
        }
    } else {
    }
}