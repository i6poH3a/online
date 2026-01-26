(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (Ultra Network Fix)
    var token = 'f8lgdpq2';
    // Новый, более быстрый прокси для обхода блокировок Vega
    var proxy = 'https://corsproxy.io/?'; 
    var base  = 'https://lampac.hdgo.me/';

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                var targetUrl = base + 'lite/events?id=' + object.movie.id + '&token=' + token;
                // Формируем запрос через новый шлюз
                var finalUrl = proxy + encodeURIComponent(targetUrl);

                network.native(finalUrl, function(json) {
                    if (json && json.length) {
                        Lampa.Noty.show('Королева пробила защиту!');
                        files.append(json);
                        _this.start();
                    } else {
                        Lampa.Noty.show('Королева: Внутри пусто (пробуем обновить)');
                    }
                }, function() {
                    // Если corsproxy не сработал, пробуем запасной вариант без прокси
                    Lampa.Noty.show('Королева: Переключаю канал связи...');
                    network.native(targetUrl, function(res) {
                        if (res && res.length) { files.append(res); _this.start(); }
                    });
                });

                return files.render();
            };

            this.render = function() { return files.render(); };

            this.start = function() {
                Lampa.Controller.add('content', {
                    toggle: function() {
                        Lampa.Controller.collectionSet(scroll.render());
                        Lampa.Controller.collectionFocus(scroll.render().find('.selector').eq(0), scroll.render());
                    },
                    left: function() { Lampa.Controller.toggle('menu'); },
                    up: function() { Lampa.Controller.toggle('head'); },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('content');
            };

            this.pause = function() {};
            this.stop = function() {};
            this.destroy = function() { network.clear(); scroll.destroy(); files.destroy(); };
        });

        // Та самая легендарная фиолетовая кнопка
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 5px; height: 3.5em; width: 12em;">' +
                        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 12px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight: bold; font-size: 1.2em;">Королева</span></div>');

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
