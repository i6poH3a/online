(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v31.0 Ghost)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Режим призрака активирован! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        openQueen(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function openQueen(movie) {
        // Сразу открываем меню, чтобы не было пустого экрана
        var menuItems = [{
            title: '⏳ Связь с Vega (Днепр)...',
            subtitle: 'Ищем обход блокировки',
            quality: 'DPI'
        }];

        Lampa.Select.show({
            title: 'Королева: Загрузка переводов',
            items: menuItems,
            onSelect: function(item) {
                if (item.url) {
                    Lampa.Player.run(item);
                    Lampa.Player.playlist([item]);
                }
            }
        });

        // Запрашиваем данные
        var url = proxy + encodeURIComponent(base + '?id=' + movie.id + '&token=' + token + '&v=' + Math.random());
        
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function(res) {
                try {
                    var raw = typeof res.contents === 'string' ? JSON.parse(res.contents) : res.contents;
                    var data = raw.items || raw.playlist || raw;

                    if (data && Array.isArray(data) && data.length) {
                        var formatted = data.map(function(it) {
                            return {
                                title: it.title || it.name || 'Озвучка',
                                subtitle: it.quality || it.voice || 'Нажми для запуска',
                                url: it.video || it.file || it.link,
                                quality: it.quality || 'HD'
                            };
                        });
                        // ОБНОВЛЯЕМ МЕНЮ (Заменяем "Загрузку" на реальные фильмы)
                        Lampa.Select.update(formatted);
                        Lampa.Noty.show('Королева: Канал пробит!');
                    } else {
                        Lampa.Noty.show('Королева: Провайдер Vega прислал пустой список');
                    }
                } catch(e) {
                    Lampa.Noty.show('Королева: Ошибка обработки данных');
                }
            },
            error: function() {
                Lampa.Noty.show('Королева: Vega заблокировала прокси');
            }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
