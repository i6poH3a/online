(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v24.0 Select-Mode)
    var token = 'f8lgdpq2';
    var proxy = 'https://api.allorigins.win/get?url=';
    var base  = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Система меню готова! 👑');

        // Создаем кнопку "Королева" в карточке фильма
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        // При нажатии сразу запускаем поиск и показываем меню
                        openQueenMenu(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function openQueenMenu(movie) {
        Lampa.Noty.show('Королева: Ищу переводы...');
        
        var target = base + '?id=' + movie.id + '&token=' + token + '&cb=' + Date.now();
        var url    = proxy + encodeURIComponent(target);

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function(result) {
                try {
                    var data = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                    
                    if (data && data.length) {
                        // ВМЕСТО ЭКРАНА - ОТКРЫВАЕМ ВЫБОР (SELECT)
                        Lampa.Select.show({
                            title: 'Выбор озвучки (Королева)',
                            items: data,
                            onSelect: function(item) {
                                // Запуск видео
                                Lampa.Player.run(item);
                                Lampa.Player.playlist([item]);
                            },
                            onBack: function() {
                                Lampa.Controller.toggle('full');
                            }
                        });
                    } else {
                        Lampa.Noty.show('Королева: Ничего не найдено (DPI Vega)');
                    }
                } catch(e) {
                    Lampa.Noty.show('Королева: Ошибка связи с сервером');
                }
            },
            error: function() {
                Lampa.Noty.show('Королева: Провайдер Vega заблокировал шлюз');
            }
        });
    }

    if (window.Lampa) startPlugin();
    else {
        var wait = setInterval(function() {
            if (window.Lampa) { clearInterval(wait); startPlugin(); }
        }, 500);
    }
})();
