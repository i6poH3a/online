(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v34.0 Stealth)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    // Используем максимально скрытный шлюз
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Режим прорыва активен! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #6a1b9a 0%, #ad1457 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; box-shadow: 0 6px 20px rgba(0,0,0,0.5);">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Ищу лазейку в Vega...');
                        runQueen(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function runQueen(movie) {
        var url = proxy + encodeURIComponent(base + '?id=' + movie.id + '&token=' + token + '&cb=' + Date.now());

        var network = new Lampa.Reguest();
        network.native(url, function(result) {
            try {
                // Пытаемся достать данные даже если Vega их "помяла"
                var raw = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                var items = raw.items || raw.playlist || raw;

                if (items && items.length) {
                    Lampa.Select.show({
                        title: 'Королева: ' + movie.title,
                        items: items.map(function(i) {
                            return {
                                title: i.title || i.name || 'Озвучка',
                                subtitle: i.quality || 'Нажми для просмотра',
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
                    Lampa.Noty.show('Королева: Vega блокирует ответ (Empty)');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Ошибка связи (DPI)');
            }
        }, function() {
            Lampa.Noty.show('Королева: Канал заблокирован провайдером');
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
