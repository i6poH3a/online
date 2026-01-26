(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v40.0 BWA-Bypass)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    
    // Используем тот же шлюз, через который проходят системные плагины
    var proxy = 'https://corsproxy.io/?';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Синхронизация с BWA... 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Запрашиваю список...');
                        runBwaLogic(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function runBwaLogic(movie) {
        // Формируем запрос как системный "online" запрос
        var target = base + '?id=' + movie.id + '&token=' + token + '&cb=' + Math.random();
        var url    = proxy + encodeURIComponent(target);

        // Используем системный Lampa.Reguest (это ключ к успеху BWA)
        var network = new Lampa.Reguest();
        
        network.native(url, function(result) {
            try {
                // Пытаемся распарсить данные, как это делает системный онлайн-плагин
                var data = result.contents ? (typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents) : (typeof result === 'string' ? JSON.parse(result) : result);
                var items = data.items || data.playlist || data;

                if (items && Array.isArray(items) && items.length) {
                    Lampa.Select.show({
                        title: 'Озвучка (Королева): ' + movie.title,
                        items: items.map(function(i) {
                            return {
                                title: i.title || i.name || 'Смотреть',
                                subtitle: i.quality || i.voice || 'HD',
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
                    Lampa.Noty.show('Королева: Список пуст. Vega обрезала ответ.');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Ошибка обработки (DPI)');
            }
        }, function() {
            Lampa.Noty.show('Королева: Шлюз заблокирован Vega');
        }, false, {
            // Маскируемся под системный плагин (секретка BWA)
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Tizen 5.0; TV) Lampa/1.0'
            }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
