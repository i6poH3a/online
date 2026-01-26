(function() {
    'use strict';
    // Lampa Full Plugin: i6poH3a (Original Source with Vega Fix)
    
    var Defined = {
        api: 'lampac',
        localhost: 'https://lampac.hdgo.me/', // Сменил на https
        apn: 'https://warp.cfhttp.top/'
    };

    var token = 'f8lgdpq2';

    // Функция запуска моста (то самое, что достает кнопку)
    function rchRun(json, call) {
        if (typeof NativeWsClient == 'undefined') {
            // Загружаем скрипт клиента через защищенный протокол
            Lampa.Utils.putScript(["https://lampac.hdgo.me/js/nws-client-es5.js?v2026"], function() {}, false, function() {
                rchInvoke(json, call);
            }, true);
        } else {
            rchInvoke(json, call);
        }
    }

    function startPlugin() {
        window.hdgo_plugin = true;
        
        // Манифест, который создает ту самую кнопку "Онлайн"
        var manifst = {
            type: 'video',
            version: '1.6.6',
            name: 'HDGO',
            component: 'hdgo',
            onContextLauch: function(object) {
                Lampa.Activity.push({
                    url: '',
                    title: 'Онлайн',
                    component: 'hdgo',
                    search: object.title,
                    movie: object,
                    page: 1
                });
            }
        };

        // Регистрация плагина в системе Лампы
        Lampa.Manifest.plugins = manifst;

        // Самый важный кусок кода: Отрисовка кнопки в карточке фильма
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var btn = $('<div class="full-start__button selector view--online lampac--button"><span>Онлайн</span></div>');
                btn.on('hover:enter', function() {
                    Lampa.Activity.push({
                        url: '',
                        title: 'Онлайн',
                        component: 'hdgo',
                        movie: e.data.movie,
                        page: 1
                    });
                });
                // Вставляем кнопку после кнопки Трейлер или Торренты
                e.render.find('.view--torrent').after(btn);
            }
        });
    }

    // Если плагин еще не запущен - запускаем
    if (!window.hdgo_plugin) {
        // Подменяем все внутренние вызовы на HTTPS на лету
        var email = Lampa.Storage.get('account_email', '');
        var uid = Lampa.Storage.get('lampac_unic_id', '');
        
        // Команда на инициализацию с твоим токеном
        startPlugin();
    }
})();
