(function (window) {
    window.opspark = window.opspark || {};
    
    var 
        createjs = window.createjs;
        
    window.opspark.makeApp = function (updateable) {
        var 
            _stage, 
            _canvas, 
            _updateable, 
            _app;
        
        _canvas = document.getElementById('canvas');
        _stage  = new createjs.Stage(_canvas);
        _updateable = (updateable) ? [].concat(updateable) : [];
        
        _app = {
            canvas: _canvas,
            stage: _stage,
            view: new createjs.Container(),
            
            addUpdateable: function(updateable) {
                _updateable.push(updateable);
                return _app;
            },
            
            removeUpdateable: function(updateable) {
                var index = _updateable.indexOf(updateable);
                if (index !== -1) {
                    _updateable.splice(index, 1);
                }
                return _app;
            },
            
            update: function(e) {
                _stage.update();
                for (var i = 0; i < _updateable.length; i++) {
                    _updateable[i].update();
                }
            }
        };
        
        window.addEventListener('resize', onResize, false);
        function onResize(e) {
            setSize();
            _app.update(e);
        }
        
        function setSize() {
            _canvas.width = window.innerWidth;
            _canvas.height = window.innerHeight;
        }
        setSize();
        
        _app.stage.addChild(_app.view);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.on('tick', _app.update);
        
        // createjs.Touch.enable(_canvas, true, false);

        return _app;
    };
}(window));