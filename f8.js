(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v51.0 O.D.)
    var api_url = 'http://api.spotfy.biz/lam/f8lgdpq2';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Моя Королева: К службе готова 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #311b92 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; border: 1px solid #7b1fa2;">' +
                        '<span style="font-weight:bold; font-size:1.1em; color: #fff; text-transform: uppercase; letter-spacing: 2px;">Моя Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('О.Д.: Запрашиваю переводы...');
                        loadData(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function loadData(movie) {
        var id = movie.imdb_id || movie.id;
        var fetch_url = api_url + '?id=' + id;

        // Используем универсальный метод запроса Lampa для обхода блокировок
        var network = new Lampa.Reguest();
        network.native(fetch_url, function(result) {
            try {
                // Если API возвращает массив или объект с полем items/playlist
                var items = result.items || result.playlist || (Array.isArray(result) ? result : false);

                if (items && items.length) {
                    var formatted = items.map(function(i) {
                        return {
                            title: i.title || i.name || 'Озвучка О.Д.',
                            subtitle: i.quality || 'HD',
                            url: i.video || i.file || i.link
                        };
                    });

                    // Выводим красивое меню выбора
                    Lampa.Select.show({
                        title: 'Озвучка — Моя Королева',
                        items: formatted,
                        onSelect: function(item) {
                            if (item.url) {
                                Lampa.Player.run(item);
                                Lampa.Player.playlist([item]);
                            } else {
                                Lampa.Noty.show('О.Д.: Ссылка не найдена');
                            }
                        },
                        onBack: function() { Lampa.Controller.toggle('full'); }
                    });
                } else {
                    Lampa.Noty.show('О.Д.: В API пусто (Нет данных)');
                }
            } catch(e) {
                Lampa.Noty.show('О.Д.: Ошибка структуры данных API');
            }
        }, function() {
            // Если сервер не отвечает (как на твоем скрине)
            Lampa.Noty.show('О.Д.: Сервер api.spotfy.biz не ответил');
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
