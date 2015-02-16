(function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    
    var 
        createjs = window.createjs,
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz;
    
    window.opspark.makeOrbManager = function (view, space) {
        var 
            _view, 
            _space,
            _pool,
            _objects,
            _orbManager; 
            
            _objects = [], 
            _view = view,
            _space = space;
            
            
        function makeObject() {
                var orb;
                
                orb = draw.randomCircleInArea(canvas, false, true, '#999', 2);
                physikz.addRandomVelocity(orb, canvas);
                
                orb.handleCollision = function (impact) {
                    orb.integrity -= impact;
                    if (orb.integrity <=0) {
                        _pool.recycle(orb);
                    }
                };
                return orb;
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
            
        _orbManager = {
            addOrbs: function (numberOfOrbs) {
                var i;
                
                i = 0;
                while (i < numberOfOrbs) {
                    _space.push(_view.addChild(_pool.get()));
                    i++;
                }
                return _orbManager;
            }
        };
        return _orbManager;
    };
}(window));
