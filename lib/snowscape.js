var cli = module.exports;
var clivas = require('clivas');

var frame = 0;

//black white red blue yellow green magenta
cli.run = function() {
    clivas.line('{red:snowscape}');

    setTimeout(function() {
        clivas.clear();
        clivas.line('{whie:white}');
        clivas.line('{red+inverse:           }');
        clivas.line('hello world (#frame '+frame+')');
        setTimeout(arguments.callee, 100);
        frame++;
    }, 100);


};
