(function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    
    var 
        KEYCODE_SPACE = 32,
        KEYCODE_UP = 38,
        KEYCODE_LEFT = 37,
        KEYCODE_RIGHT = 39,
        KEYCODE_W = 87,
        KEYCODE_A = 65,
        KEYCODE_D = 68;
    
    window.opspark.makePlayerManager = function (player) {
        var _force, _activeKeys;
        
        _force = 0, 
        _activeKeys = [];
        
        activate();
        
        var _playerManager = {
            player: player,
            update: update
        };
        
        /*
         * update: The update function calculates new velocityX and velocityY
         * properties of the body, but does not apply them. It is assumed the 
         * body is apart of a collection of bodies in a physics system.
         */
        function update() {
            var angle = player.rotation * Math.PI / 180;
            var ax = Math.cos(angle) * _force;
            var ay = Math.sin(angle) * _force;
            player.velocityX += ax;
            player.velocityY += ay;
        }
        
        function activate() {
            document.onkeydown = document.onkeyup = onKeyActivity;
        }
        
        function deactive() {
            onKeyUp();
            document.onkeydown = document.onkeyup = null;
        }
        
        function onKeyActivity(e){
            e = e || window.event;
            _activeKeys[e.keyCode] = e.type === 'keydown';
            
            if (e.type === 'keyup') {
                onKeyUp(e);
            } else {
                onKeyDown(e);
            }
        };
        
        function onKeyDown(e) {
            if (_activeKeys[KEYCODE_LEFT]) {
                player.rotationalVelocity = -5; 
            } else if (_activeKeys[KEYCODE_RIGHT]) {
                player.rotationalVelocity = 5;
            }
            
            if (_activeKeys[KEYCODE_UP]) { 
                _force = 0.1;
            }
        }
        
        function onKeyUp(e) {
            player.rotationalVelocity = 0;
            _force = 0;
        }
        
        return _playerManager;
    };
}(window));