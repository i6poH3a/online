(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v44.0 Octopus)
    var token = 'f8lgdpq2';
    
    // МАКСИМАЛЬНЫЙ СПИСОК УЗЛОВ (X-Sena + Global Mirrors)
    var mirrors = [
        'https://cf.xsena.red/lite/events', // Cloudflare (Самый сильный)
        'https://pl.xsena.red/lite/events', // Польша
        'https://de.xsena.red/lite/events', // Германия (Новый!)
        'https://fi.xsena.red/lite/events', // Финляндия (Новый!)
        'http://nl.xsena.red/lite/events',   // Нидерланды
        'https://hbgo.me/lite/events',      // Зеркало HBGO
        'https://lampas.top/lite/events',   // Зеркало Lampas
        'https://jac.red/lite/events'       // Зеркало Jacred
    ];

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Глобальная сеть активирована! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #0d47a1, #6a1b9a) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        tryAllMirrors(0, e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function tryAllMirrors(index, movie) {
        if (index >= mirrors.length) {
            Lampa.Noty.show('Королева: Все 8 узлов заблокированы Vega!');
            return;
        }

        var current = mirrors[index];
        var location = current.split('.')[0].split('//')[1].toUpperCase();
        if (location === 'LAMPAS' || location === 'HBGO') location = 'Global';

        Lampa.Noty.show('Королева: Проверка узла ' + location + '...');

        var url = current + '?id=' + movie.id + '&token=' + token + '&cb=' + Math.random();

        var network = new Lampa.Reguest();
        network.native(url, function(result) {
            try {
                var data = (typeof result === 'string') ? JSON.parse(result) : result;
                var items = data.items || data.playlist || data;

                if (items && items.length) {
                    Lampa.Noty.show('Королева: Есть связь через ' + location + '!');
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
                        }
                    });
                } else {
                    tryAllMirrors(index + 1, movie);
                }
            } catch(e) {
                tryAllMirrors(index + 1, movie);
            }
        }, function() {
            tryAllMirrors(index + 1, movie);
        }, false, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
