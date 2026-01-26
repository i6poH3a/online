(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v18.0 Nuclear)
    var token = 'f8lgdpq2';
    // Пробуем другой шлюз, который реже блокируют
    var proxy = 'https://api.codetabs.com/v1/proxy?quest=';
    var base  = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Система запущена! 👑');

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // Сначала рисуем "заглушку", чтобы экран не был пустым
                files.append([{
                    title: '⏳ Королева ищет проход...',
                    quality: 'WAIT',
                    info: 'Пробиваем блокировку провайдера Vega'
                }]);

                var targetUrl = base + '?id=' + object.movie.id + '&token=' + token;
                var finalUrl  = proxy + encodeURIComponent(targetUrl);

                network.native(finalUrl, function(json) {
                    files.clear(); // Удаляем надпись загрузки
                    if (json && json.length) {
                        Lampa.Noty.show('Королева: Доступ получен!');
                        files.append(json);
                    } else {
                        files.append([{title: '❌ Vega заблокировала ответ сервера', quality: 'BLOCK'}]);
                    }
                    _this.start();
                }, function() {
                    files.clear();
                    files.append([{title: '❌ Ошибка сети: Провайдер Vega', quality: 'DPI'}]);
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

        // Кнопка в карточке
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.view--online').length) {
                    var btn = $('<div class="full-start__button selector view--online" style="background: #7b1fa2 !important; border-radius: 8px;"><span>Королева 👑</span></div>');
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
