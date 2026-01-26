(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v52.0 O.D. Final)
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
                        Lampa.Noty.show('О.Д.: Загружаю переводы...');
                        loadQueenData(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function loadQueenData(movie) {
        var id = movie.imdb_id || movie.id;
        var final_url = api_url + '?id=' + id + '&cb=' + Math.random();

        var network = new Lampa.Reguest();
        network.native(final_url, function(result) {
            try {
                // Извлекаем данные (учитываем разные форматы ответа API)
                var items = result.items || result.playlist || (Array.isArray(result) ? result : false);

                if (items && items.length) {
                    Lampa.Select.show({
                        title: 'Озвучка — Моя Королева',
                        items: items.map(function(i) {
                            return {
                                title: i.title || i.name || 'Вариант О.Д.',
                                subtitle: i.quality || 'HD',
                                url: i.video || i.file || i.link
                            };
                        }),
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
                    Lampa.Noty.show('О.Д.: В API пусто по этому фильму');
                }
            } catch(e) {
                Lampa.Noty.show('О.Д.: Ошибка в структуре данных');
            }
        }, function() {
            // Исправляем ошибку со скрина "Сервер не ответил"
            Lampa.Noty.show('О.Д.: Провайдер Vega блокирует spotfy.biz');
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
