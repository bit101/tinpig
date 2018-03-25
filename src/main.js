const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
document.body.appendChild(canvas);

context.fillStyle = "red";
context.beginPath();
context.arc(width / 2, height / 2, height / 2, 0, Math.PI * 2);
context.fill();
