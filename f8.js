(function() {
    'use strict';
    // Lampa Plugin: HDGO i6poH3a (Token: f8lgdpq2)
    
    var Defined = {
        api: 'lampac',
        localhost: 'https://lampac.hdgo.me/', // Исправлено на HTTPS
        apn: 'https://warp.cfhttp.top/'
    };

    var token = 'f8lgdpq2'; // Твой токен

    // Эта функция ищет фильмы и создает список
    function rchRun(json, call) {
        if (typeof NativeWsClient == 'undefined') {
            Lampa.Utils.putScript(["https://lampac.hdgo.me/js/nws-client-es5.js"], function() {}, false, function() {
                rchInvoke(json, call);
            }, true);
        } else {
            rchInvoke(json, call);
        }
    }

    function startPlugin() {
        window.hdgo_plugin = true;
        
        // Манифест кнопки "Онлайн"
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

        Lampa.Manifest.plugins = manifst;

        // Создание кнопки в карточке фильма
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                // Пытаемся найти место после кнопки Трейлер или Торренты
                var render = e.object.activity.render();
                var torrent_btn = render.find('.view--torrent');
                
                if (!render.find('.lampac--button').length) {
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

                    if (torrent_btn.length) torrent_btn.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    // Запуск всего механизма
    function init() {
        if (window.Lampa) {
            startPlugin();
            // Подгружаем вспомогательные стили
            Lampa.Template.add('hdgo_style', '<style>.view--online.lampac--button{background-color: #3535ff !important;}</style>');
            $('body').append(Lampa.Template.get('hdgo_style', {}, true));
        } else {
            setTimeout(init, 100);
        }
    }

    init();
})();
