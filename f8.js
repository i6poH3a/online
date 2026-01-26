(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" Edition (Token: f8lgdpq2)
    
    var Defined = {
        api: 'lampac',
        localhost: 'https://lampac.hdgo.me/', 
        apn: 'https://warp.cfhttp.top/'
    };

    var token = 'f8lgdpq2';

    function startPlugin() {
        window.hdgo_plugin = true;
        
        // Манифест с твоим названием
        var manifst = {
            type: 'video',
            version: '1.6.8',
            name: 'Королева', 
            component: 'hdgo',
            onContextLauch: function(object) {
                Lampa.Activity.push({
                    url: '',
                    title: 'Королева',
                    component: 'hdgo',
                    movie: object,
                    page: 1
                });
            }
        };

        Lampa.Manifest.plugins = manifst;

        // Перевод названия на "Королева"
        Lampa.Lang.add({
            lampac_watch: { ru: 'Королева', uk: 'Королева', en: 'Queen' },
            title_online: { ru: 'Королева', uk: 'Королева', en: 'Queen' }
        });

        // Создание кнопки в карточке фильма
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    // Красивая фиолетовая кнопка "Королева"
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; border-radius: 5px; margin-top: 10px;">' +
                        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 8px; vertical-align: middle;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span>Королева</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({
                            url: 'https://lampac.hdgo.me/lite/events?id=' + e.data.movie.id + '&token=' + token,
                            title: 'Королева',
                            component: 'hdgo',
                            movie: e.data.movie,
                            page: 1
                        });
                    });

                    // Вставляем после кнопки Торренты
                    var target = render.find('.view--torrent');
                    if (target.length) target.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    // Запуск через проверку готовности системы
    function init() {
        if (window.Lampa && Lampa.Component) {
            // Подгружаем стили и запускаем
            startPlugin();
        } else {
            setTimeout(init, 100);
        }
    }

    init();
})();
