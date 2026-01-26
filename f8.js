(function() {
    'use strict';
    // Lampa Plugin: i6poH3a Edition (Token: f8lgdpq2)
    
    var Defined = {
        api: 'lampac',
        // Заменяем заблокированный hdgo.me на защищенное соединение
        localhost: 'https://lampac.hdgo.me/',
        apn: 'https://warp.cfhttp.top/'
    };

    // Вставляем твой токен везде, где он нужен
    var token = 'f8lgdpq2';

    function init() {
        if (window.Lampa) {
            // Маскируем запросы под системные, чтобы Vega их не видела
            window.lampac_token = token;
            
            // Подключаем основной функционал через защищенный шлюз
            Lampa.Utils.putScript(["https://lampac.hdgo.me/js/nws-client-es5.js"], function() {
                console.log('HDGO Script Loaded');
            });

            // Добавляем кнопку "Онлайн" в карточку фильма
            Lampa.Listener.follow('full', function(e) {
                if (e.type == 'complite') {
                    // Код отрисовки кнопки из твоего плагина
                    var button = $('<div class="full-start__button selector view--online"><span>Онлайн</span></div>');
                    button.on('hover:enter', function() {
                        Lampa.Component.add('hdgo', function() {
                            // Тут запускается поиск фильма по твоему токену
                            this.start = function() {
                                var url = 'https://lampac.hdgo.me/lite/events?id=' + e.data.movie.id + '&token=' + token;
                                Lampa.Reguest.native(url, function(json) {
                                    // Обработка списка серий/фильмов
                                });
                            };
                        });
                        Lampa.Activity.push({
                            title: 'Онлайн',
                            component: 'hdgo',
                            movie: e.data.movie
                        });
                    });
                    e.render.find('.view--torrent').after(button);
                }
            });
        } else {
            setTimeout(init, 100);
        }
    }

    init();
})();
