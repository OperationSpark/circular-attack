(function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    
    var 
        createjs = window.createjs,
        draw = window.opspark.draw,
        physikz = window.opspark.racket.physikz;
    
    // TODO : UPDATE so the factory returns instances of managers per asset, etc //
    window.opspark.makeParticleManager = function (stage) {
        var _particleManager;
        
        var context;
        var proton;
        var renderer;
        var emitter;
        
        context = canvas.getContext('2d');
        
        createProton();
        
        function createProton() {
            proton = new Proton;
            emitter = new Proton.Emitter();
            emitter.rate = new Proton.Rate(new Proton.Span(1, 2), .012);
            emitter.addInitialize(new Proton.Mass(1));
            emitter.addInitialize(new Proton.Radius(2, 4));
            emitter.addInitialize(new Proton.Life(0.5, 0.5));
            emitter.addInitialize(new Proton.Velocity(new Proton.Span(1, 2), [45, 135, 225, 315], 'polar'));
            emitter.addBehaviour(new Proton.Collision(emitter));
            emitter.addBehaviour(new Proton.Color("rgba(0, 0, 0, 0.2)"));
            emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'bound'));
            emitter.damping = 0.02;
            proton.addEmitter(emitter);
            renderer = new Proton.Renderer('easel', proton, stage);
            renderer.start();
        }
        
        _particleManager = {
            show: function (point) {
                emitter.emit();
                emitter.p.x = point.x;
                emitter.p.y = point.y;
            },
            
            update: function () {
                window.requestAnimationFrame(_particleManager.update);
                proton.update();
            },
            
            stop: function () {
                emitter.stopEmit();
            }
        };
        _particleManager.update();
        return _particleManager;
    };
}(window));
