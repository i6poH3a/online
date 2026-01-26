(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v21.0 Monolith)
    var token = 'f8lgdpq2';
    var proxy = 'https://api.allorigins.win/raw?url=';
    var base  = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Взлом системы Vega... 👑');

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                // ПРИНУДИТЕЛЬНАЯ ОТРИСОВКА (Даже если нет сети)
                var items = [{
                    title: '🛰 Статус: Проверка канала Vega...',
                    quality: 'LOG',
                    info: 'Ждем ответ от сервера через прокси'
                }];
                
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                files.append(items);

                // Пытаемся пробить блокировку
                var target = base + '?id=' + object.movie.id + '&token=' + token + '&cb=' + Math.random();
                var finalUrl = proxy + encodeURIComponent(target);

                network.native(finalUrl, function(json) {
                    files.clear();
                    if (json && json.length) {
                        Lampa.Noty.show('Королева: Есть пробитие!');
                        files.append(json);
                    } else {
                        files.append([{title: '❌ Vega обнулила данные (Пусто)', quality: 'DPI'}]);
                    }
                    _this.start();
                }, function() {
                    files.clear();
                    files.append([{title: '❌ Vega заблокировала шлюз AllOrigins', quality: 'BLOCK'}]);
                    _this.start();
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
            this.destroy = function() { network.clear(); scroll.destroy(); files.destroy(); };
        });

        // Создание фиолетовой кнопки
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; display:flex; align-items:center; justify-content:center; height:3.5em; width:100%">' +
                        '<span style="font-weight:bold;">Королева 👑</span></div>');
                    
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

    if (window.Lampa) startPlugin();
    else {
        var wait = setInterval(function() {
            if (window.Lampa) { clearInterval(wait); startPlugin(); }
        }, 500);
    }
})();
