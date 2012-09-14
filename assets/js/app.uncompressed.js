(function() {

    var pads = document.getElementsByClassName('pad'),
        display = document.getElementById('display'),
        pattern = [],
        hold = [],
        level, speed;

    function playerMouseDown(e) {
        this.className += ' active';
    }

    function playerMouseUp(e) {
        simonMouseUp.apply(this);
        playerClick.apply(this);
    }

    function simonMouseUp() {
        this.className = this.className.replace(/ active/, '');
    }

    function playerHoverOver(e) {
        this.className += ' hover';
    }

    function playerHoverOut(e) {
        this.className = this.className.replace(/ hover/, '');
    }

    function playerClick() {
        if (pads[hold.shift()] != this) {
            gameOver();
            return;
        }
        playerSays();
    }

    function clearContents(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }

    function updateDisplay(text) {
        clearContents(display);
        display.appendChild(document.createTextNode(text));
    }

    function registerHandlers() {
        Array.prototype.forEach.call(pads, function(pad) {
            pad.style.cursor = 'pointer';
            pad.addEventListener('mouseover', playerHoverOver, false);
            pad.addEventListener('mouseout', playerHoverOut, false);
            pad.addEventListener('mousedown', playerMouseDown);
            pad.addEventListener('mouseup', playerMouseUp);
        });
    }

    function removeHandlers() {
        Array.prototype.forEach.call(pads, function(pad) {
            pad.style.cursor = 'default';
            pad.removeEventListener('mouseover', playerHoverOver);
            pad.removeEventListener('mouseout', playerHoverOut);
            pad.removeEventListener('mousedown', playerMouseDown);
            pad.removeEventListener('mouseup', playerMouseUp);
        });
    }

    function gameOver() {
        updateDisplay('You Lose!');
        setTimeout(function() {
            init();
        }, 2000);
    }

    function beginLevel() {
        removeHandlers();
        level++;
        speed -= level * 5;
        updateDisplay('Level ' + level);
        setTimeout(function() {
            updateDisplay('Ready?');
        }, speed);
        setTimeout(function() {
            updateDisplay('Begin!');
        }, speed * 2);
        setTimeout(function() {
            generatePattern();
            updateDisplay('SIMON SAYS');
            simonSays();
        }, speed * 3);
    }

    function generatePattern() {
        var p = [];
        for (var i = 0, l = (3 + level); i < l; i++) {
            p.push(Math.floor(Math.random() * 3));
        }
        pattern = p.slice(0), hold = p.slice(0);
    }

    function simonSays() {
        var current = pads[pattern.shift()];
        playerMouseDown.apply(current);
        setTimeout(function() {
            simonMouseUp.apply(current);
            if (pattern.length > 0) {
                setTimeout(simonSays, speed);
            } else {
                updateDisplay('Go!');
                setTimeout(function() {
                    registerHandlers();
                    playerSays();
                }, 2000);
            }
        }, 300);
    }

    function playerSays() {
        if (hold.length == 0) {
            updateDisplay('You Win!');
            setTimeout(function() {
                beginLevel();
            }, 2000);
        } else {
            updateDisplay('turns ' + hold.length);
        }
    }

    function startHandler() {
        this.style.cursor = 'default';
        beginLevel();
        this.removeEventListener('click', startHandler);
    }

    function init() {
        level = 0;
        speed = 2005;
        updateDisplay('START');
        display.style.cursor = 'pointer';
        display.addEventListener('click', startHandler);
    }

    init();

}());
