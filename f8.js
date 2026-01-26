(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v48.0 O.D.)
    var my_api = 'http://api.spotfy.biz/lam/f8lgdpq2';
    // Технический мост для работы HTTP ссылки на HTTPS сайте
    var bridge = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Моя Королева: К службе готова! 👑 О.Д.');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    
                    // Кнопка в королевском стиле
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #311b92 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; border: 1px solid #7b1fa2; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">' +
                        '<span style="font-weight:bold; font-size:1.1em; color: #fff; text-transform: uppercase; letter-spacing: 2px;">Моя Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('О.Д.: Загружаю переводы...');
                        runQueen(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function runQueen(movie) {
        // Прямой запрос к твоему API через технический мост
        var id = movie.imdb_id || movie.id;
        var url = bridge + encodeURIComponent(my_api + '?id=' + id);

        var network = new Lampa.Reguest();
        network.native(url, function(result) {
            try {
                var res = (typeof result.contents === 'string') ? JSON.parse(result.contents) : result.contents;
                var items = res.items || res.playlist || res;

                if (items && Array.isArray(items) && items.length) {
                    Lampa.Select.show({
                        title: 'Выбор озвучки — О.Д.',
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
                    Lampa.Noty.show('О.Д.: В API пусто по этому фильму');
                }
            } catch(e) {
                Lampa.Noty.show('О.Д.: Ошибка связи с сервером');
            }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
