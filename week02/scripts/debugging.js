const radiusOutput = document.getElementById('radius');
const areaOutput = document.querySelector('area');

let area = 0;
let PI = 3.14159;

const radius = 10;
area = PI * radius * radius;
radiusOutput.textContent = radius;
areaOutput.textContent = area;

radius = 20;
area = PI * radius * radius;
radiusOutput.textContent = radius;
areaOutput = area;