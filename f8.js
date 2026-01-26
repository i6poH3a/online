(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" Edition (v1.7.5)
    var token = 'f8lgdpq2';
    // Прокси, который протащит данные через фильтры Vega
    var proxy = 'https://api.allorigins.win/raw?url=';
    var base  = 'https://lampac.hdgo.me/';

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            
            this.create = function() { return files.render(); };

            this.start = function() {
                var _this = this;
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // Формируем секретный запрос через прокси-шлюз
                var url = base + 'lite/events?id=' + object.movie.id + '&token=' + token;
                var proxiedUrl = proxy + encodeURIComponent(url);

                network.native(proxiedUrl, function(json) {
                    if (json && json.length) {
                        // Если данные пришли - рисуем список фильмов
                        Lampa.Noty.show('Королева нашла видео!');
                        files.append(json); // Вот эта строка наполняет экран!
                    } else {
                        Lampa.Noty.show('Королева: Сервер пуст или заблокирован');
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Ошибка связи (Vega DPI)');
                });
            };
        });

        // Та самая крутая кнопка "Королева"
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 5px; height: 3.5em;">' +
                        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 12px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight: bold; font-size: 1.2em;">Королева</span></div>');

                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({
                            title: 'Королева',
                            component: 'hdgo',
                            movie: e.data.movie
                        });
                    });

                    var target = render.find('.view--torrent');
                    if (target.length) target.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    if (window.Lampa && Lampa.Component) {
        startPlugin();
    } else {
        var timer = setInterval(function() {
            if (window.Lampa && Lampa.Component) {
                clearInterval(timer);
                startPlugin();
            }
        }, 100);
    }
})();
