(function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    
    var 
        Proton = window.Proton,
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz;
    
    window.opspark.makeOrbManager = function (view, space) {
        var 
            _pool,
            _objects,
            _orbManager; 
            
        _objects = [];
            
        function makeObject() {
                var orb;
                
                orb = draw.randomCircleInArea(canvas, false, true, '#999', 2);
                physikz.addRandomVelocity(orb, canvas);
                
                /*
                 * We know the max radius of the radomly drawn circles is 20.
                 */
                orb.density = orb.radius / 20 * 100 * .0001;
                
                orb.handleCollision = function (impact, body) {
                    if (body.type === orb.type) return;
                    
                    if (orb.integrity > 0) {
                        orb.integrity -= impact;
                        if (orb.integrity <= 0) {
                            _pool.recycle(orb);
                        }
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
                var index = space.indexOf(object);
                if (index !== -1) {
                    space.splice(index, 1);
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
                    space.push(view.addChild(_pool.get()));
                    i++;
                }
                return _orbManager;
            }
        };
        return _orbManager;
    };
}(window));
