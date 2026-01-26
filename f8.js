(function() {
    'use strict';
    var token = 'f8lgdpq2';
    // Используем максимально скрытный прокси-шлюз
    var proxy = 'https://api.allorigins.win/get?url=';
    var base  = 'https://lampac.hdgo.me/lite/events?id=';

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                var targetUrl = base + object.movie.id + '&token=' + token;
                // Заворачиваем запрос в двойную обертку
                var finalUrl  = proxy + encodeURIComponent(targetUrl);

                network.native(finalUrl, function(result) {
                    // AllOrigins возвращает данные в поле .contents
                    var json = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                    
                    if (json && json.length) {
                        Lampa.Noty.show('Королева: Канал пробит!');
                        files.append(json);
                        _this.start();
                    } else {
                        Lampa.Noty.show('Королева: Сервер пуст');
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Ошибка сети (Нужен DNS 1.1.1.1)');
                });

                return files.render();
            };

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

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 5px; height: 3.5em; width: 14em;">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 12px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight: bold; font-size: 1.3em;">Королева</span></div>');

                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({ title: 'Королева', component: 'hdgo', movie: e.data.movie });
                    });

                    var target = render.find('.view--torrent');
                    if (target.length) target.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    var wait = setInterval(function() {
        if (window.Lampa && Lampa.Component) { clearInterval(wait); startPlugin(); }
    }, 100);
})();
