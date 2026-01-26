(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v14.0 Resurrection)
    var token = 'f8lgdpq2';
    var proxy = 'https://api.allorigins.win/get?url=';
    var base  = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;
        
        // Сигнал, что плагин загрузился!
        setTimeout(function(){ 
            Lampa.Noty.show('Королева готова к службе!'); 
        }, 2000);

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                var url = proxy + encodeURIComponent(base + '?id=' + object.movie.id + '&token=' + token) + '&cb=' + Math.random();

                network.native(url, function(result) {
                    var data = result.contents ? (typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents) : result;
                    if (data && data.length) {
                        files.append(data);
                        _this.start();
                    } else { Lampa.Noty.show('Королева: Внутри пусто'); }
                }, function() { Lampa.Noty.show('Королева: Vega блокирует сеть'); });

                return files.render();
            };

            // Фикс для работы на всех зеркалах
            this.render = function() { return files.render(); };

            this.start = function() {
                Lampa.Controller.add('content', {
                    toggle: function() {
                        Lampa.Controller.collectionSet(files.render());
                        Lampa.Controller.collectionFocus(files.render().find('.selector').eq(0), files.render());
                    },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('content');
            };
            this.pause = function() {}; this.stop = function() {};
            this.destroy = function() { network.clear(); files.destroy(); };
        });

        // Создаем кнопку "Королева"
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.view--online').length) {
                    var btn = $('<div class="full-start__button selector view--online" style="background: #7b1fa2 !important; border-radius: 8px;"><span>Королева</span></div>');
                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({ title: 'Королева', component: 'hdgo', movie: e.data.movie });
                    });
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    if (window.Lampa) startPlugin();
    else {
        var wait = setInterval(function() {
            if (window.Lampa) { clearInterval(wait); startPlugin(); }
        }, 200);
    }
})();
