(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v36.0 Stream Edition)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    // Используем зашифрованный шлюз, который лучше всего работает на lampa.stream
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Канал Stream активирован! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c, #d81b60) !important; border-radius: 10px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Загружаю озвучки...');
                        loadQueen(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function loadQueen(movie) {
        var targetUrl = base + '?id=' + movie.id + '&token=' + token + '&cb=' + Date.now();
        var finalUrl  = proxy + encodeURIComponent(targetUrl);

        var network = new Lampa.Reguest();
        network.native(finalUrl, function(result) {
            try {
                // Распаковка данных (для AllOrigins нужно брать поле contents)
                var rawData = result.contents ? (typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents) : result;
                var items = rawData.items || rawData.playlist || rawData;

                if (items && Array.isArray(items) && items.length) {
                    // ВЫВОДИМ ТОТ САМЫЙ СПИСОК ВЫБОРА
                    Lampa.Select.show({
                        title: 'Озвучка (Королева): ' + movie.title,
                        items: items.map(function(it) {
                            return {
                                title: it.title || it.name || 'Озвучка',
                                subtitle: it.quality || it.voice || 'Нажми для запуска',
                                url: it.video || it.file || it.link
                            };
                        }),
                        onSelect: function(item) {
                            if (item.url) {
                                Lampa.Player.run(item);
                                Lampa.Player.playlist([item]);
                            } else {
                                Lampa.Noty.show('Королева: Ссылка на видео не найдена');
                            }
                        }
                    });
                } else {
                    Lampa.Noty.show('Королева: Провайдер Vega обнулил список');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Ошибка связи (DPI Vega)');
            }
        }, function() {
            Lampa.Noty.show('Королева: Vega заблокировала шлюз');
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
