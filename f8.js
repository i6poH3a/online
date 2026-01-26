(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v16.0 Full Data)
    var token = 'f8lgdpq2';
    var gateway = 'https://api.allorigins.win/get?url=';
    var base = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;
        
        Lampa.Noty.show('Королева: Магия активирована! 👑');

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                var targetUrl = base + '?id=' + object.movie.id + '&token=' + token + '&cb=' + Date.now();
                var finalUrl  = gateway + encodeURIComponent(targetUrl);

                Lampa.Noty.show('Королева: Запрашиваю переводы...');

                network.native(finalUrl, function(result) {
                    try {
                        // Пытаемся достать данные из обертки прокси
                        var contents = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                        
                        if (contents && contents.length) {
                            Lampa.Noty.show('Королева: Нашла ' + contents.length + ' варианта(ов)!');
                            files.append(contents);
                            _this.start();
                        } else {
                            // Если пусто, добавляем техническую кнопку для проверки
                            files.append([{
                                title: 'Ошибка: Провайдер Vega блокирует данные',
                                quality: 'DNS?',
                                info: 'Попробуй сменить DNS в ТВ на 1.1.1.1'
                            }]);
                            _this.start();
                        }
                    } catch(e) {
                        Lampa.Noty.show('Королева: Ошибка разбора данных');
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Vega полностью закрыла канал');
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

        // Создаем фиолетовую кнопку "Королева"
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.view--online').length) {
                    var btn = $('<div class="full-start__button selector view--online" style="background: #7b1fa2 !important; border-radius: 8px; font-weight: bold;"><span>Королева 👑</span></div>');
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
