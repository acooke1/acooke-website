const moveSpeed = 1;
const angleOffset = 0.1;
const numAgents = 5000;
const agentRadius = 0.5;
const defaultColor = 'black';

function sense(agent, sensorAngleOffset) {

}

function Agent(x, y, angle, radius, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.radius = radius;
    this.color = color;
}

Agent.prototype.draw = function() {
    ctx.beginPath();
    //ctx.fillRect(this.x, this.y, this.radius * 2, this.radius * 2);
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
}

Agent.prototype.sense = function() {
    
}

Agent.prototype.update = function() {
    this.sense();
    deltax = Math.cos(this.angle);
    deltay = Math.sin(this.angle);
    var newx = this.x + deltax * moveSpeed;
    var newy = this.y + deltay * moveSpeed;
    if (newy + deltay > canvas.height-this.radius || newy + deltay < this.radius) {
        this.angle = generateOppositeAngle(this.angle, false);
        newx = Math.min(canvas.width-1,Math.max(0, newx));
        newy = Math.min(canvas.height-1,Math.max(0, newy));
    }
    if (newx + deltax > canvas.width-this.radius || newx + deltax < this.radius) {
        this.angle = generateOppositeAngle(this.angle, true);
        newx = Math.min(canvas.width-1,Math.max(0, newx));
        newy = Math.min(canvas.height-1,Math.max(0, newy));
    }
    this.x = newx;
    this.y = newy;
}

//var canvas = document.getElementById('canvas');
//var ctx = canvas.getContext('2d');
//ctx.translate(0.5, 0.5);
//var raf;

function clear() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function normalizeAngle(theta) {
    return theta % (2 * Math.PI);
}

function randomNumber(minValue, maxValue) {
    return Math.random() * (maxValue - minValue) + minValue;
}

function generateOppositeAngle(angle, isVertical) {
    var unitAngle = normalizeAngle(angle);
    if (unitAngle >= 0 && unitAngle < (Math.PI / 2)) {
        if (isVertical) {
        return randomNumber((Math.PI / 2) + angleOffset, Math.PI - angleOffset);
        } else {
        return randomNumber(((3 * Math.PI) / 2) + angleOffset, (2 * Math.PI) - angleOffset);
        }
    } else if (unitAngle >= (Math.PI / 2) && unitAngle < Math.PI) {
        if (isVertical) {
        return randomNumber(0 + angleOffset, (Math.PI / 2) - angleOffset);
        } else {
        return randomNumber(Math.PI + angleOffset, ((3 * Math.PI) / 2) - angleOffset);
        }
    } else if (unitAngle >= Math.PI && unitAngle < ((3 * Math.PI) / 2)) {
        if (isVertical) {
        return randomNumber(((3 * Math.PI) / 2) + angleOffset, (2 * Math.PI) - angleOffset);
        } else {
        return randomNumber((Math.PI / 2) + angleOffset, Math.PI - angleOffset);
        }
    } else {
        if (isVertical) {
        return randomNumber(Math.PI + angleOffset, ((3 * Math.PI) / 2) - angleOffset);
        } else {
        return randomNumber(0 + angleOffset, (Math.PI / 2) - angleOffset);
        }
    }
}

let agents = [];

while (agents.length <= numAgents) {
    let size = agentRadius;
    let agent = new Agent(
        randomNumber(0 + size,canvas.width - size),
        randomNumber(0 + size,canvas.height - size),
        randomNumber(0, (2 * Math.PI)),
        size,
        defaultColor
    );

    agents.push(agent);
}

function loop() {
    clear();
    for (let i = 0; i < agents.length; i++) {
        agents[i].draw();
        agents[i].update();
    }
  
  raf = window.requestAnimationFrame(loop);
}