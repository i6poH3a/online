(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v7.0 DNS-DPI Bypass)
    var token = 'f8lgdpq2';
    // Используем альтернативный шлюз и зеркало
    var gateway = 'https://api.allorigins.win/get?url=';
    var mirror  = 'https://lampa.stream/proxy/https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // Формируем запрос к альтернативному зеркалу
                var target = mirror + '?id=' + object.movie.id + '&token=' + token;
                var finalUrl = gateway + encodeURIComponent(target);

                network.native(finalUrl, function(result) {
                    try {
                        // Распаковываем данные из прокси
                        var data = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                        
                        if (data && data.length) {
                            Lampa.Noty.show('Королева: Связь установлена!');
                            files.append(data);
                            _this.start();
                        } else {
                            Lampa.Noty.show('Королева: На этом канале пусто');
                        }
                    } catch(e) {
                        Lampa.Noty.show('Королева: Ошибка разбора данных');
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Vega блокирует канал');
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
                    left: function() { Lampa.Activity.backward(); },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('content');
            };
            this.pause = function() {}; this.stop = function() {};
            this.destroy = function() { network.clear(); files.destroy(); };
        });

        // Та самая кнопка "Королева"
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 5px; height: 3.5em; width: 14em;">' +
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
