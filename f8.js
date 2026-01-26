(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v12.0 Stealth Mode)
    var token = 'f8lgdpq2';
    // Используем зашифрованный туннель AllOrigins через HTTPS
    var gateway = 'https://api.allorigins.win/get?url=';
    var target  = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // Формируем запрос, который Vega увидит как обычный текст
                var finalUrl = gateway + encodeURIComponent(target + '?id=' + object.movie.id + '&token=' + token) + '&callback=' + Math.random();

                Lampa.Noty.show('Королева: Активация стелс-режима...');

                network.native(finalUrl, function(result) {
                    try {
                        // Распаковываем данные (они приходят как JSON-строка внутри объекта)
                        var json = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                        
                        if (json && json.length) {
                            Lampa.Noty.show('Королева: Связь установлена!');
                            files.append(json);
                            _this.start();
                        } else {
                            Lampa.Noty.show('Королева: Сервер молчит (Vega DPI)');
                        }
                    } catch(e) {
                        Lampa.Noty.show('Королева: Ошибка связи');
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Канал заблокирован провайдером');
                });

                return files.render();
            };

            // Исправляем ошибку render из image_e7a0b1.png
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

        // Рисуем фиолетовую кнопку "Королева" со звездой
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 8px; height: 3.5em; width: 14em; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"> ' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 12px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight: bold; font-size: 1.3em;">Королева</span></div>');

                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({ title: 'Королева', component: 'hdgo', movie: e.data.movie });
                    });

                    var targetBtn = render.find('.view--torrent');
                    if (targetBtn.length) targetBtn.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    var wait = setInterval(function() {
        if (window.Lampa && Lampa.Component) { clearInterval(wait); startPlugin(); }
    }, 100);
})();
