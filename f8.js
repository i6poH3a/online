(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v41.0 BWA-Soul)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    
    // ГЛАВНЫЙ СЕКРЕТ: Используем шлюз BWA, который у тебя работает
    var bwa_proxy = 'https://bwa.to/proxy/';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Логика BWA внедрена! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c, #d81b60) !important; border-radius: 10px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Маскировка под BWA...');
                        runQueenBwa(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function runQueenBwa(movie) {
        // Формируем запрос по схеме BWA
        var targetUrl = base + '?id=' + movie.id + '&token=' + token + '&cb=' + Math.random();
        var finalUrl  = bwa_proxy + encodeURIComponent(targetUrl);

        // Используем мощный сетевой движок Лампы
        var network = new Lampa.Reguest();
        
        network.native(finalUrl, function(result) {
            try {
                // Разбор данных (как в BWA)
                var data = typeof result === 'string' ? JSON.parse(result) : (result.contents ? (typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents) : result);
                var items = data.items || data.playlist || data;

                if (items && items.length) {
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
                    Lampa.Noty.show('Королева: BWA-шлюз пуст. Vega блокирует контент.');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Ошибка декодирования BWA');
            }
        }, function() {
            Lampa.Noty.show('Королева: Vega заблокировала даже BWA-шлюз');
        }, false, {
            // Подменяем UA на телевизор Samsung (Tizen), чтобы провайдер не лез
            headers: {
                'User-Agent': 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebkit/537.36 (KHTML, like Gecko) SamsungBrowser/2.2 Chrome/63.0.3239.111 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    }

    // Запуск с проверкой готовности Лампы
    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
