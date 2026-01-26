(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" Edition
    var token = 'f8lgdpq2';
    var base = 'https://lampac.hdgo.me/';

    function startPlugin() {
        window.hdgo_plugin = true;

        // Настройки плагина
        var manifst = {
            type: 'video',
            version: '1.7.0',
            name: 'Королева',
            component: 'hdgo',
            onContextLauch: function(object) {
                Lampa.Activity.push({
                    url: base + 'lite/events?id=' + object.id + '&token=' + token,
                    title: 'Королева',
                    component: 'hdgo',
                    movie: object,
                    page: 1
                });
            }
        };

        Lampa.Manifest.plugins = manifst;

        // Рисуем кнопку "Королева" в карточке
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    // Фиолетовая кнопка с короной (звездой)
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 5px; height: 3.5em;">' +
                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 10px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span>Королева</span></div>');

                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({
                            url: base + 'lite/events?id=' + e.data.movie.id + '&token=' + token,
                            title: 'Королева',
                            component: 'hdgo',
                            movie: e.data.movie,
                            page: 1
                        });
                    });

                    // Ищем кнопку Торрентов и вставляем нашу Королеву рядом
                    var target = render.find('.view--torrent');
                    if (target.length) target.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    // Запуск плагина
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
