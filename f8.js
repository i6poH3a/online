(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v26.0 Final UI)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Проверка связи с Vega... 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Взлом DPI...');
                        
                        var url = proxy + encodeURIComponent(base + '?id=' + e.data.movie.id + '&token=' + token + '&cb=' + Date.now());

                        // СНАЧАЛА ОТКРЫВАЕМ МЕНЮ, ЧТОБЫ НЕ БЫЛО ПУСТОТЫ
                        Lampa.Select.show({
                            title: 'Королева: Выбор озвучки',
                            items: [
                                {
                                    title: '⏳ Идет загрузка данных...',
                                    subtitle: 'Пробиваем блокировку Vega',
                                    quality: 'DPI'
                                },
                                {
                                    title: '⚙️ Настройки DNS',
                                    subtitle: 'Если пусто - проверь DNS 1.1.1.1',
                                    quality: 'INFO'
                                }
                            ],
                            onSelect: function(item) {
                                if (item.quality !== 'DPI' && item.quality !== 'INFO') {
                                    Lampa.Player.run(item);
                                    Lampa.Player.playlist([item]);
                                }
                            }
                        });

                        // А теперь в фоне заменяем список реальными данными
                        $.ajax({
                            url: url,
                            method: 'GET',
                            dataType: 'json',
                            success: function(result) {
                                try {
                                    var data = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                                    if (data && data.length) {
                                        Lampa.Noty.show('Королева: Успех!');
                                        Lampa.Select.update(data); // Обновляем меню живыми данными
                                    } else {
                                        Lampa.Noty.show('Королева: Vega обнулила ответ');
                                    }
                                } catch(err) {
                                    Lampa.Noty.show('Королева: Ошибка шлюза');
                                }
                            }
                        });
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) {
            clearInterval(wait);
            startPlugin();
        }
    }, 500);
})();
