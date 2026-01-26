(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v49.0 O.D.)
    var api_url = 'http://api.spotfy.biz/lam/f8lgdpq2';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Моя Королева: Слушаю и повинуюсь 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    
                    // Кнопка в стиле О.Д.
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #311b92 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; border: 1px solid #7b1fa2;">' +
                        '<span style="font-weight:bold; font-size:1.1em; color: #fff; text-transform: uppercase; letter-spacing: 2px;">Моя Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('О.Д.: Загружаю переводы...');
                        loadData(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function loadData(movie) {
        var id = movie.imdb_id || movie.id;
        var url = api_url + '?id=' + id;

        var network = new Lampa.Reguest();
        network.native(url, function(result) {
            try {
                var items = result.items || result.playlist || result;

                if (items && Array.isArray(items) && items.length) {
                    Lampa.Select.show({
                        title: 'Озвучка — О.Д.',
                        items: items.map(function(i) {
                            return {
                                title: i.title || i.name || 'Смотреть',
                                subtitle: i.quality || 'HD',
                                url: i.video || i.file || i.link
                            };
                        }),
                        onSelect: function(item) {
                            Lampa.Player.run(item);
                            Lampa.Player.playlist([item]);
                        },
                        onBack: function() { Lampa.Controller.toggle('full'); }
                    });
                } else {
                    Lampa.Noty.show('О.Д.: В API пока ничего нет');
                }
            } catch(e) {
                Lampa.Noty.show('О.Д.: Ошибка ответа сервера');
            }
        }, function() {
            Lampa.Noty.show('О.Д.: Сервер api.spotfy.biz недоступен');
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
