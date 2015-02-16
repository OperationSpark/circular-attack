(function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    
    var 
        createjs = window.createjs,
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz;
    
    window.opspark.makeProjectileManager = function (view, space) {
        var 
            _view, 
            _space,
            _pool,
            _objects,
            _projectileManager;
            
            _objects = [], 
            _view = view,
            _space = space;
        
        function makeObject() {
            var projectile = _.extend(draw.circle(5, '#ff0000'), physikz.makeBody());
            projectile.volatility = 1;
            //projectile.cache(-(projectile.radius), -(projectile.radius), (projectile.radius) * 2, (projectile.radius) * 2);
            // TODO : get from settings JSON //
            projectile.velocityMax = 10;
            return projectile;
        }
        
        function onTweenComplete(e) {
            _pool.recycle(e.target);
        }
        
        _pool = {
            objects: _objects,
            
            get: function () {
                if (_objects.length > 0) {
                    return _objects.pop();
                }
                return makeObject();
            },
        
            recycle: function (object) {
                var index = _space.indexOf(object);
                if (index !== -1) {
                    _space.splice(index, 1);
                }
                object.x = -(object.width);
                object.alpha = 1;
                object.scaleX = object.scaleY = 1;
                _objects.push(object);
            }
        };
        
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
                
                var projectilePoint = emitter.getProjectilePoint();
                //projectile.activate();
                projectile.x = projectilePoint.x;
                projectile.y = projectilePoint.y;
                
                createjs.Tween.get(projectile, {override: true}).wait(500).to({alpha: 0, scaleX: 0.1, scaleY: 0.1}, 1000, createjs.Ease.linear).call(onTweenComplete);
                
                _view.addChild(projectile);
                _space.push(projectile);
            }
        };
        return _projectileManager;
    };
}(window));
