(function () {
    'use strict';

    // Твой личный токен
    var token = 'f8lgdpq2';
    // Прокси-шлюз, который Vega не блокирует (Allorigins)
    var proxy = 'https://api.allorigins.win/raw?url=';
    // Оригинальный адрес твоего плагина
    var target = 'http://api.spotfy.biz/lam/' + token;

    function start() {
        // Проверяем, есть ли Lampa
        if (window.Lampa) {
            // Загружаем основной код через прокси-шлюз
            Lampa.Utils.putScript([proxy + encodeURIComponent(target)], function () {
                console.log('Plugin: Loaded via proxy');
            });
        } else {
            // Если Lampa еще не прогрузилась, ждем секунду
            setTimeout(start, 1000);
        }
    }

    start();
})();
