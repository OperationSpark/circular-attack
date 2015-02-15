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
    
    window.opspark.makePlayerManager = function (player, projectileManager) {
        var 
            _player, 
            _projectileManager, 
            _force;
        
        _player = player,
        _projectileManager = projectileManager,
        _force = 0;
        
        var _playerManager = {
            player: _player,
            update: update
        };
        
        /*
         * update: The update function calculates new velocityX and velocityY
         * properties of the body, but does not apply them. It is assumed the 
         * body is apart of a collection of bodies in a physics system.
         */
        function update() {
            var angle = _player.rotation * Math.PI / 180;
            var ax = Math.cos(angle) * _force;
            var ay = Math.sin(angle) * _force;
            _player.velocityX += ax;
            _player.velocityY += ay;
        }
        
        function onKeyDown(e) {
            if (!e) { e = window.event; }
            if (_player.integrity > 0) {
                switch (e.keyCode) {
                    case KEYCODE_LEFT :
                        _player.rotationalVelocity = -5;
                        break;
                    case KEYCODE_RIGHT :
                        _player.rotationalVelocity = 5;
                        break;
    
                    case KEYCODE_UP :
                        //_player.exhaust.activate();
                        _force = 0.1;
                        break;
    
                    case KEYCODE_SPACE :
                        _projectileManager.fire(_player);
                        break;
    
                    default :
                        break;
                }
            }
        }
        
        function onKeyUp(e) {
            _player.rotationalVelocity = 0;
            _force = 0;
            //_player.exhaust.deactivate();
        }
        
        document.onkeydown = onKeyDown;
        document.onkeyup = onKeyUp;
        
        return _playerManager;
    };
}(window));