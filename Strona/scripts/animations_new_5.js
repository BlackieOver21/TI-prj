
const canvas = document.getElementById('sierpinskiCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = 450;
const height = canvas.height = 450;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);
ctx.fillStyle = 'black';

let dot_stop = false;
let curve_stop = false;
let dot_timeoutId;
let curve_timeoutId;
let timeoutId;

//
///
///           Animation for Curve
///
//

function animateCurve(order, iterations_start){
    clearTimeout(timeoutId);
    dot_stop = true;
    curve_stop = false;

    let iterations = iterations_start || 0; // Start with 0 iterations
    const maxIterations = order || 10; // Maximum number of iterations
    const animationSpeed = 300; // Animation speed in milliseconds

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';

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
                //console.log(iter);

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
                //console.log(level);

                drawGasketCurve(x1, y1, x12, y12, x13, y13, x2, y2, level - 1, iter+1);
                drawGasketCurve(x2, y2, x22, y22, x23, y23, x3, y3, level - 1, iter);
                drawGasketCurve(x3, y3, x32, y32, x33, y33, x4, y4, level - 1, iter+1);
            }
        }
    }

    function animate(ratio) {
        //ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'black';
        
        const side = 350;
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
            timeoutId = setTimeout(animate, animationSpeed);
            iterations++;
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
        // probably also want a ctx.closePath(), check later
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

function animateRandomDot(order) {
    dot_stop = false;
    curve_stop = true;
    clearTimeout(timeoutId);

        const triangleVertices = [
        { x: width / 2, y: 100 }, // Vertex 1
        { x: 50, y: height - 50 }, // Vertex 2
        { x: width - 50, y: height - 50 } // Vertex 3
    ];

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';

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

    const animationSpeed = 0.0001; // Adjust as needed
    let currentPosition = getRandomPointInTriangle();
    console.log(animationSpeed);

    function animateRandomWalk() {
        const randomVertexIndex = Math.floor(Math.random() * 3); // Randomly select a vertex
        const selectedVertex = triangleVertices[randomVertexIndex];
        currentPosition.x += (selectedVertex.x - currentPosition.x) / 2;
        currentPosition.y += (selectedVertex.y - currentPosition.y) / 2;

        ctx.fillRect(currentPosition.x, currentPosition.y, 2, 2); // Plot the current position

        timeoutId = setTimeout(animateRandomWalk, animationSpeed);
        // if (dot_stop) {
        //     clearTimeout(dot_timeoutId);
        //     return;
        // }
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
///           Animation for Pascal
///
//

function animatePascal(){
    clearTimeout(timeoutId);
    const numRows = 1; // Number of rows in Pascal's triangle
        //const cellSize = 20; // Size of each cell
        const delay = 100; // Delay between frames (in milliseconds)

        let triangle = generatePascalsTriangle(numRows);

        function generatePascalsTriangle(numRows) {
            const triangle = [[BigInt(1)]];
            for (let i = 1; i < numRows; i++) {
                const row = [];
                for (let j = 0; j <= i; j++) {
                    const val = BigInt((j > 0 && j < i) ? triangle[i - 1][j - 1] + triangle[i - 1][j] : 1);
                    row.push(val);
                }
                triangle.push(row);
            }
            return triangle;
        }

        function myabs(number){
            return (number > 0) ? number : 0;
        }

        function drawTriangle() {
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);

            const middle_x = 50+175;
            const middle_y = 250;
            const cellSize = 320/triangle.length;

        
            for (let i = 0; i < triangle.length; i++) {
                const row = triangle[i];
                for (let j = 0; j < row.length; j++) {
                    const color = row[j] % BigInt(2) === BigInt(0) ? 'white' : 'black';
                    ctx.fillStyle = color;
                    ctx.fillRect(j * cellSize + (middle_x - ((i+1)/2)*cellSize), i * cellSize + 100, cellSize, cellSize);
        
                    // Draw text representing the value of the number
                    ctx.fillStyle = color === 'white' ? 'black' : 'white'; // Invert text color for better contrast
                    ctx.font = (1 + myabs(20 - triangle.length)) + 'px Arial';
                    if(row[j] < BigInt(100000)) ctx.fillText(row[j], j * cellSize + cellSize / 2 - 5 + (middle_x - ((i+1)/2)*cellSize), i * cellSize + cellSize / 2 + 5 + 100);
                }
            }
        }

        function animate() {
            // Generate the next row of Pascal's triangle
            triangle.push([]);
            const newRow = triangle[triangle.length - 2];
            for (let i = 0; i < newRow.length + 1; i++) {
                const val = BigInt((i > 0 && i < newRow.length) ? newRow[i - 1] + newRow[i] : 1);
                triangle[triangle.length - 1].push(val);
            }

            drawTriangle();

            // Repeat the animation
            timeoutId = setTimeout(animate, delay);
        }

        // Start the animation
        animate();
}

//
///
///           Animation for Square
///
//



//
///
///         Część skryptowa
///
//

function all_stop(){
    clearTimeout(timeoutId);
}

function update_this() {
    dot_stop = true;
    const choice = document.getElementById('choice').value;
    if (choice) {
        var order = document.getElementById('order').value;
        console.log(order);
        switch (choice) {
            case "curve":
                animateCurve(order, order-1);
                break;
            case "randomdot":
                animateRandomDot(order);
                break;
            // Add more cases as needed
            default:
                // code to execute if expression doesn't match any case
        }
    } else {
    }
}

function animate_this() {
    dot_stop = true;
    const choice = document.getElementById('choice').value;
    if (choice) {
        switch (choice) {
            case "curve":
                animateCurve();
                break;
            case "randomdot":
                animateRandomDot();
                break;
            case "pascal":
                animatePascal();
                break;
            default:
                // code to execute if expression doesn't match any case
        }
    } else {
    }
}

function setExplanation(choice){
    textbox = document.getElementById("explanation-container");
    controls = document.getElementById("controls-container");
    if (choice) {
        switch (choice) {
            case "curve":
                textbox.innerText = `Ten algorytm jest bardzo prosty w swojej istocie:
                     - Zacznijmy od pojedynczego odcinka linii na płaszczyźnie.
                     - Wielokrotnie zamieńmy każdy odcinek krzywej na trzy krótsze odcinki, tworząc kąty 120° na każdym skrzyżowaniu \
                dwóch kolejnych segmentów, przy czym pierwszy i ostatni segment krzywej są albo równoległe do pierwotnego odcinka linii, albo \
                tworzą z nim kąt 60°.` ;
                controls.innerHTML = '<label for="order">Stopień: 1</label><input type="range" min="0" max="10" id="order_curve" name="order" \
                onchange="update_this()"><label for="order">7</label> ';
                break;
            case "randomdot":
                textbox.innerText = `Ten algorytm nazywa się również Grą w Chaos:
                 Narysujmy trójkąt równoboczny ABC i definiujmy D0 := punkt A. \
                 Następnie należy wielokrotnie powtórzyć następującą operację: losowo wybieramy jeden z punktów A, B lub C, \
                 rysujemy punkt w połowie odległości między Dn i wybranym punktem. Nowo narysowany punkt oznaczamy przez Dn+1. \
                 Każdy punkt Dn będzie należeć do trójkąta Sierpińskiego, i cały trójkąt Sierpińskiego będzie \
                domknięciem zbioru {D0, D1,...}.

                Jeśli wybieramy D0 nie jako punkt A, lecz jako dowolny punkt trójkąta Sierpińskiego, \
                to znowu otrzymujemy (prawie na pewno) trójkąt Sierpińskiego. Jeśli D0 należy do trójkąta ABC,\
                ale nie do trójkąta Sierpińskiego, to żaden punkt Dn do tego trójkąta nie należy, jednak otrzymujemy ten trójkąt \
                jako zbiór punktów skupienia ciągu (D0, D1,...).` ;
                controls.innerHTML = '\
                <label for="x1">x1:</label><input pattern="[0-9]*" type="text" id="x1" name="x1" value="225">\
                <label for="y1">y1:</label><input pattern="[0-9]*" type="text" id="y1" name="y1" value="100">\
                <br>\
                <label for="x2">x2:</label><input pattern="[0-9]*" type="text" id="x2" name="x2" value="50">\
                <label for="y2">y2:</label><input pattern="[0-9]*" type="text" id="y2" name="y2" value="400">\
                <br>\
                <label for="x3">x3:</label><input pattern="[0-9]*" type="text" id="x3" name="x3" value="400">\
                <label for="y3">y3:</label><input pattern="[0-9]*" type="text" id="y3" name="y3" value="400">\
                <br>';
                const inputs = document.querySelectorAll('input[type="text"]');
                inputs.forEach(input => {
                    input.addEventListener('input', function(event) {
                        const regex = /^[0-9]*$/;
                        if (!regex.test(event.target.value)) {
                            event.target.value = event.target.value.replace(/[^0-9]/g, '');
                        }
                        const value = parseInt(event.target.value);
                        if (isNaN(value) || value < 0 || value > 450) {
                            event.target.value = '';
                        }
                    });
                });
                break;
            case "pascal":
                textbox.innerText = `Nieoczekiwanie, trójkąt Sierpińskiego można również wyprowadzić z trójkąta Pascala!
                Weźmijmy trójkąt Pascala z 2^n wierszami, oraz pokolorujemy liczby parzyste na biało, \
                a liczby nieparzyste - na czarno. Wynikiem takiego prostego działania okaże się coś, co przypomina trójkąt Sierpińskiego.
                Dokładniej mówiąc, granica, gdy n zbliża się do nieskończoności tego pokolorowanego \
                2^n -rzędnego Trójkąt Pascala jest trójkątem Sierpińskiego, a ponieważ proporcja liczb \
                czarnych dąży do zera wraz ze wzrostem n, wynika z tego, że \
                proporcja współczynników nieparzystych do parzystych dąży do zera, gdy n dąży do nieskończoności.` ;
                controls.innerHTML = '<label for="order">Stopień: 1</label><input type="range" min="0" max="10" id="order_pascal" name="order" \
                onchange="update_this()"><label for="order">7</label> ';
                break;
            default:
                // code to execute if expression doesn't match any case
        }
    } else {
    }

}

function SavePreference(){
    const url = 'https://ti-prj.vercel.app/save_preference';

    const postData = {
        dx1: document.getElementById('x1').value,
        dx2: document.getElementById('x2').value,
        dx3: document.getElementById('x3').value,
        dy1: document.getElementById('y1').value,
        dy2: document.getElementById('y2').value,
        dy3: document.getElementById('y3').value,
        dcl: document.getElementById('order_curve').value,
        dpl: document.getElementById('order_pascal').value,
    };

    const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
    };

    // Send the POST request using fetch
    fetch(url, options)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        console.log('Response:', data); // Handle the response data
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function existsCookie(cookieName) {
    // Get all cookies
    const cookies = document.cookie.split(';');

    cookieArray.forEach(function(cookie) {
        var parts = cookies[i].split('=');
        var name = parts[0];
        var value = parts[1];
        console.log(name);
        if (cookieName == name) {
            // Cookie found
            return true;
        }
    });
    // Cookie not found
    return false;
}

function logOut(){
    // const url = 'https://ti-prj.vercel.app/logout';

    // const postData = {};

    // const options = {
    // method: 'POST',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    // body: JSON.stringify(postData),
    // };

    // // Send the POST request using fetch
    // fetch(url, options)
    // .then(response => {
    //     if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //     }
    //     return response.json(); // Parse the JSON response
    // })
    // .then(data => {
    //     console.log('Response:', data); // Handle the response data
    // })
    // .catch(error => {
    //     console.error('There was a problem with the fetch operation:', error);
    // });

    document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}