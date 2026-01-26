(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v23.0 Direct Strike)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Проверка связи... 👑');

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // РИСУЕМ ТЕКСТ МГНОВЕННО
                files.append([{
                    title: '🛰 Сигнал: Поиск обхода Vega...',
                    quality: 'DPI',
                    info: 'Если ты это видишь - код работает. Ждем данные.'
                }]);

                var target = base + '?id=' + object.movie.id + '&token=' + token + '&cb=' + Date.now();
                var url    = proxy + encodeURIComponent(target);

                network.native(url, function(result) {
                    files.clear();
                    try {
                        var data = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                        if (data && data.length) {
                            Lampa.Noty.show('Королева: Данные получены!');
                            files.append(data);
                        } else {
                            files.append([{title: '❌ Vega: Пустой ответ', quality: 'ERR'}]);
                        }
                    } catch(e) {
                        files.append([{title: '❌ Ошибка декодера', quality: 'DPI'}]);
                    }
                    _this.start();
                }, function() {
                    files.clear();
                    files.append([{title: '❌ Vega заблокировала шлюз', quality: 'BLOCK'}]);
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
            this.destroy = function() { network.clear(); files.destroy(); };
        });

        // Добавляем кнопку "Королева" в карточку
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold;">Королева 👑</span></div>');
                    
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
        }, 500);
    }
})();
