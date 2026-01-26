(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v43.0 X-Sena)
    var token = 'f8lgdpq2';
    
    // Твои новые бронебойные каналы
    var mirrors = [
        'https://cf.xsena.red/lite/events', // WARP (Cloudflare)
        'https://pl.xsena.red/lite/events', // WAW (Poland)
        'http://nl.xsena.red/lite/events'   // AMS (Netherlands)
    ];

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Каналы X-Sena подключены! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #1a237e, #4a148c) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; border: 1px solid #3f51b5;">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        tryMirror(0, e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function tryMirror(index, movie) {
        if (index >= mirrors.length) {
            Lampa.Noty.show('Королева: Все узлы X-Sena заблокированы Vega');
            return;
        }

        var currentMirror = mirrors[index];
        Lampa.Noty.show('Королева: Штурм через ' + (index === 0 ? 'WARP' : (index === 1 ? 'WAW' : 'AMS')) + '...');

        var url = currentMirror + '?id=' + movie.id + '&token=' + token + '&cb=' + Math.random();

        var network = new Lampa.Reguest();
        network.native(url, function(result) {
            try {
                var data = (typeof result === 'string') ? JSON.parse(result) : result;
                var items = data.items || data.playlist || data;

                if (items && items.length) {
                    Lampa.Select.show({
                        title: 'Озвучка (Королева): ' + movie.title,
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
                    tryMirror(index + 1, movie); // Если пусто, пробуем следующий узел
                }
            } catch(e) {
                tryMirror(index + 1, movie);
            }
        }, function() {
            tryMirror(index + 1, movie); // Если ошибка сети, идем дальше
        }, false, {
            headers: { 'User-Agent': 'Mozilla/5.0 (SMART-TV; Tizen 5.0)' }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
