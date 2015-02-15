(function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    
    var 
        createjs = window.createjs,
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz;
    
    window.opspark.makeProjectileManager = function (view, space) {
        var 
            _pool,
            _projectileManager,
            _items, 
            _view, 
            _space;
            
            _items = [], 
            _view = view
            _space = space;
        
        _pool = {
            items: _items,
        
            get: function () {
                if (_items.length > 0) {
                    return _items.pop();
                }
                var projectile = _.extend(draw.circle(5, '#ff0000'), physikz.makeBody());
                
                // TODO : get from settings JSON //
                projectile.velocityMax = 10;
                return  projectile; //new createjs.BitmapAnimation(spriteSheet);
            },
        
            recycle: function (obj) {
                var index = _space.indexOf(obj);
                if (index !== -1) {
                    _space.splice(index, 1);
                }
                obj.x = view.width + obj.width;
                obj.alpha = 1;
                _items.push(obj);
            }
        };
        
        function onTweenComplete(e) {
            _pool.recycle(e.target);
        }
        
        _projectileManager = {
            fire: function (emitter) {
                var projectile, degrees;
                
                projectile = _pool.get();
                projectile.rotation = emitter.rotation;
                
                //console.log(projectile.rotation);
                
                degrees = emitter.rotation;
                projectile.velocityX = Math.cos(physikz.degreesToRadians(degrees)) * (projectile.velocityMax + emitter.velocityX);
                projectile.velocityY = Math.sin(physikz.degreesToRadians(degrees)) * (projectile.velocityMax + emitter.velocityY);
                projectile.rotationalVelocity = 0;
                
                //console.log(projectile.velocityX);
                //console.log(projectile.velocityY);
                
                /*
                 * Additional per commission setup for projectiles.
                 */
                var projectilePoint = emitter.getProjectilePoint();
                //projectile.activate();
                projectile.x = projectilePoint.x;
                projectile.y = projectilePoint.y;
                
                createjs.Tween.get(projectile, {override: true}).wait(500).to({alpha: 0}, 1000, createjs.Ease.linear).call(onTweenComplete);
                
                _view.addChild(projectile);
                _space.push(projectile);
            }
        };
        return _projectileManager;
    };
}(window));