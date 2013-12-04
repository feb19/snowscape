var cli = module.exports;
var clivas = require('clivas');

var frame = 0;

var STAGE_WIDTH  = 50,
    STAGE_HEIGHT = 50,
    MAX_SIZE = 2,
    SNOW_NUMS = 20,
    FPS = 1000/30;

var WhiteBuffer = function(x, y, size) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.size = size;
    this.vx = (Math.random() * 2 - 1) * this.size / 5;
    this.vy = 2 * this.size / 4;
};
WhiteBuffer.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
};
WhiteBuffer.prototype.check = function(px, py) {
    if ((px - this.x)*(px - this.x) + (py - this.y)*(py - this.y) <= this.size*.5 * this.size*.5) {
        return 1;
    } else if ((px - this.x)*(px - this.x) + (py - this.y)*(py - this.y) <= this.size * this.size) {
        return 2;
    }
    return 0;
};
Number.prototype.zeroPad = Number.prototype.zeroPad || 
    function(base){
        var nr = this, len = (String(base).length - String(nr).length)+1;
        return len > 0? new Array(len).join('0')+nr : nr;
    };

var DrawStage = function() {
    this.buffer = [];
    this.displayBuffers = [];
};
DrawStage.prototype.addChild = function(displayBuffer) {
    this.displayBuffers.push(displayBuffer);
};
DrawStage.prototype.update = function() {
    this.buffer = [];
    for (var yy = 0, h = STAGE_HEIGHT; yy < h; yy++) {
        this.buffer[yy] = [];
    }
    for (var i = 0, l = this.displayBuffers.length; i < l; i++) {
        for (var yy = 0, h = STAGE_HEIGHT; yy < h; yy++) {
            for (var xx = 0, w = STAGE_WIDTH; xx < w; xx++) {
                if (this.displayBuffers[i].check(xx, yy) == 1) {
                    this.buffer[yy][xx] = 1;
                } else if (this.displayBuffers[i].check(xx, yy) == 2) {
                    this.buffer[yy][xx] = this.buffer[yy][xx] === 1 ? 1 : 2;
                }
            }
        }
        this.displayBuffers[i].update();
        if (this.displayBuffers[i].y >= STAGE_HEIGHT) {
            this.displayBuffers[i].x = Math.floor(Math.random() * STAGE_WIDTH);
            this.displayBuffers[i].y -= STAGE_HEIGHT;
        }
    }
};
DrawStage.prototype.render = function() {
    clivas.clear();
    for (var i = 0, l = this.buffer.length; i < l; i++) {
        var lineString = '';
        for (var j = 0, m = this.buffer[i].length; j < m; j++) {
            if (this.buffer[i][j] == 1) {
                lineString += '{white+inverse:　}';
            } else if (this.buffer[i][j] == 2) {
                lineString += '{grey+inverse:　}';
            } else {
                lineString += '　';
            }
        }
        clivas.line(lineString);
    }
};

var drawing = new DrawStage();
cli.run = function() {
    for (var i = 0; i < SNOW_NUMS; i++) {
        drawing.addChild(new WhiteBuffer(Math.random() * STAGE_WIDTH, Math.random() * STAGE_HEIGHT, Math.random() * MAX_SIZE));
    }
    setTimeout(function() {
        drawing.update();
        drawing.render();
        var d = new Date();
        clivas.line(d.getHours().zeroPad(10) + ":" + d.getMinutes().zeroPad(10) + ":" + d.getSeconds().zeroPad(10));
        setTimeout(arguments.callee, FPS);
    }, FPS);
};
