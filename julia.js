const canvas = document.getElementById('juliaCanvas');
const ctx = canvas.getContext('2d');
let isDragging = false;
let lastX;
let lastY;

function renderJulia() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = createImageDataJulia(width, height);
    drawImageData(imageData);
}

function drawImageData(imageData) {
    ctx.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
        return '#' + r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function createImageDataJulia(width, height) {
    const imageData = ctx.createImageData(width, height);
    const imageDataArray = imageData.data;

    const maxIterations = parseFloat(document.getElementById('maxIterations').value);
    const escapeRadius = 2;
    const constantX = parseFloat(document.getElementById('constantX').value);
    const constantY = parseFloat(document.getElementById('constantY').value);
    const zoom = parseFloat(document.getElementById('zoom').value);
    const offsetX = parseFloat(document.getElementById('shiftX').value);
    const offsetY = parseFloat(document.getElementById('shiftY').value);
    const color = hexToRgb(document.getElementById('color').value);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const cx = (x - width / 2) / zoom - offsetX;
            const cy = (y - height / 2) / zoom - offsetY;
            const c = calculateJulia(cx, cy, maxIterations, escapeRadius, constantX, constantY);
            setPixel(imageDataArray, x, y, adjustColor(c, maxIterations, color));
        }
    }

    return imageData;
}

function calculateJulia(cx, cy, maxIterations, escapeRadius, constantX, constantY) {
    let zx = cx;
    let zy = cy;
    let i = 0;

    while (zx * zx + zy * zy < escapeRadius * escapeRadius && i < maxIterations) {
        const temp = zx * zx - zy * zy + constantX;
        zy = 2 * zx * zy + constantY;
        zx = temp;
        i++;
    }

    return i;
}
console.log(grayscaleToColor(255));
function adjustColor(iterations, maxIterations, color) {
    if (iterations === maxIterations) {
        return [0, 0, 0];
    } else {
        let gray = iterations / maxIterations;
        const colorValue = color.slice();
        if(colorValue[0] == 0 && colorValue[1] == 0 && colorValue[2] == 0){
            newColor = grayscaleToColor(gray);
            colorValue[0] = newColor.r;
            colorValue[1] = newColor.g;
            colorValue[2] = newColor.b;
        }
        else{
            colorValue[0] *= gray;
            colorValue[1] *= gray;
            colorValue[2] *= gray;
        }
        return colorValue;
    }
}

function grayscaleToColor(grayscale) {
    let r = Math.round(grayscale * 255);
    let g = Math.round((1 - Math.abs(1 - grayscale - 0.5)) * 255);
    let b = Math.round((1 - grayscale) * 255);
    return {
        r: Math.max(0, Math.min(r, 255)),
        g: Math.max(0, Math.min(g, 255)),
        b: Math.max(0, Math.min(b, 255))
    };
}

function setPixel(imageDataArray, x, y, color) {
    const pixelIndex = (y * canvas.width + x) * 4;
    imageDataArray[pixelIndex] = color[0];
    imageDataArray[pixelIndex + 1] = color[1];
    imageDataArray[pixelIndex + 2] = color[2];
    imageDataArray[pixelIndex + 3] = 255;
}

function handleMouseDown(event) {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
}

function handleMouseUp() {
    isDragging = false;
}

function handleMouseMove(event) {
    if (!isDragging) return;
    const offsetX = parseFloat(document.getElementById('shiftX').value);
    const offsetY = parseFloat(document.getElementById('shiftY').value);
    const deltaX = (event.clientX - lastX) / parseFloat(document.getElementById('zoom').value);
    const deltaY = (event.clientY - lastY) / parseFloat(document.getElementById('zoom').value);
    document.getElementById('shiftX').value = offsetX + deltaX;
    document.getElementById('shiftY').value = offsetY + deltaY;
    lastX = event.clientX;
    lastY = event.clientY;
    renderJulia();
}

function handleWheel(event) {
    const zoomInput = document.getElementById('zoom');
    const currentZoom = parseFloat(zoomInput.value);
    const newZoom = currentZoom * (1 - event.deltaY * 0.001);
    zoomInput.value = Math.max(1, Math.min(100000, newZoom));
    renderJulia();
    event.preventDefault();
}

function goldenRatio(){
    return (1 + Math.sqrt(5))/2
}

function pre(preValue){
    let constantX, constantY, maxIterations, zoom;

    switch (preValue) {
        case '1-golden ratio':
            constantX = 1 - goldenRatio();
            constantY = 0;
            maxIterations = 50;
            zoom = 200;
            break;
        case '-0.4 + 0.6i':
            constantX = -0.4;
            constantY = 0.6;
            maxIterations = 500;
            zoom = 180;
            break;
        case '0.285 + 0.01i':
            constantX = 0.285;
            constantY = 0.01;
            maxIterations = 500;
            zoom = 150;
            break;
        case '0.8i':
            constantX = 0;
            constantY = 0.8;
            maxIterations = 100;
            zoom = 150;
            break;
        case '-0.835 + -0.321i':
            constantX = -0.835;
            constantY = -0.321;
            maxIterations = 100;
            zoom = 175;
            break;
        case '-0.51 + 0.52i':
            constantX = -0.51;
            constantY = 0.52;
            maxIterations = 1000;
            zoom = 175;
            break;
        case 'continuous':
            sequenceStarted = true;
            zoom = 100;
            maxIterations = 50;
            document.getElementById('color').value = "#000000";
            renderContinuousSequence();
            break;
        default:
            constantX = -0.7;
            constantY = 0.27015;
            maxIterations = 20;
            zoom = 175;
            // constantX = -0.7;
            // constantY = 0.27015;
            // maxIterations = 1000;
            // zoom = 175;
    }

    document.getElementById('constantX').value = constantX;
    document.getElementById('constantY').value = constantY;
    document.getElementById('shiftX').value = 0;
    document.getElementById('shiftY').value = 0;
    document.getElementById('zoom').value = zoom;
    document.getElementById('maxIterations').value = maxIterations;

    renderJulia();
}

let sequenceStarted = false;
let currentAngle = 0;
const angleIncrement = 0.005;

function renderContinuousSequence() {
    if (!sequenceStarted) {
        return;
    }
    document.getElementById('constantX').value = 0.7885 * Math.cos(currentAngle);
    document.getElementById('constantY').value = 0.7885 * Math.sin(currentAngle);

    renderJulia();

    currentAngle += angleIncrement;
    if (currentAngle > 2 * Math.PI) {
        currentAngle = 0;
    }

    requestAnimationFrame(renderContinuousSequence);
}

document.getElementById('pre').addEventListener('change', function() {
    const preValue = this.value;
    pre(preValue);
    if (preValue !== 'continuous') {
        sequenceStarted = false;
    }
    pre(preValue);
});

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('wheel', handleWheel);

document.getElementById('zoom').addEventListener('input', renderJulia);
document.getElementById('shiftX').addEventListener('input', renderJulia);
document.getElementById('shiftY').addEventListener('input', renderJulia);

pre('default')
