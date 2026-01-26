(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v11.0 BWA-Bypass)
    var token = 'f8lgdpq2';
    // Используем прокси зеркала bwa, который Vega обычно не трогает
    var proxy = 'https://cors.bwa.to/';
    var base  = 'http://api.spotfy.biz/lam/'; // Вернулись к истокам через ширму

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // Формируем запрос через зашифрованный шлюз bwa
                var targetUrl = base + token + '?id=' + object.movie.id;
                var finalUrl  = proxy + targetUrl;

                Lampa.Noty.show('Королева: Открываю защищенный канал...');

                network.native(finalUrl, function(json) {
                    if (json && json.length) {
                        Lampa.Noty.show('Королева: Успех! Фильмы найдены.');
                        files.append(json);
                        _this.start();
                    } else {
                        Lampa.Noty.show('Королева: Внутри пока пусто');
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Ошибка связи (Vega DPI)');
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

        // Та самая фиолетовая кнопка "Королева"
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 8px; height: 3.5em; width: 14em;">' +
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
