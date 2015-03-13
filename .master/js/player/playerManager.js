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
    
    window.opspark.makePlayerManager = function (player, view, space, hud, projectileManager, emitter) {
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
            player.on('exploded', onPlayerExploded);
            player.on('damaged', onPlayerDamaged);
            document.onkeydown = document.onkeyup = onKeyActivity;
        }
        
        function deactive() {
            onKeyUp();
            player.removeEventListener('exploded', onPlayerExploded);
            player.removeEventListener('damaged', onPlayerDamaged);
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
                emitter.emit(player.getExhaustPoint());
                _force = 0.1;
            }
            
            if (_activeKeys[KEYCODE_SPACE]) { 
                projectileManager.fire(player);
            }
        }
        
        function onKeyUp(e) {
            player.rotationalVelocity = 0;
            _force = 0;
            emitter.stop();
        }
        
        function onPlayerExploded(e) {
            deactive();
            
            var i, id;
            
            hud.setIntegrity(0);
            player.alpha = 0;
            
            i = 0;
            id = setInterval(function(){
              player.explosion.emit({x: player.x, y: player.y});
              if (i > 60) {
                  window.clearInterval(id);
                  player.explosion.stop();
                  space.splice(space.indexOf(player), 1);
                  view.removeChild(player);
              }
              i++;
            }, 17);
        }
        
        function onPlayerDamaged(e) {
            hud.setIntegrity(player.integrity);
        }
        
        return _playerManager;
    };
}(window));