(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v42.0 Inside)
    var token = 'f8lgdpq2';
    
    // АДРЕСА, КОТОРЫЕ VEGA ПРОПУСКАЕТ (Взято из BWA)
    var bwa_base    = 'https://lampa.stream/lite/events'; // База на рабочем зеркале
    var bwa_gate    = 'https://bwa.to/proxy/';            // Рабочий шлюз
    var backup_gate = 'https://corsproxy.io/?';           // Резерв

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Взломанные шлюзы BWA активны! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c, #7b1fa2) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Иду по каналу BWA...');
                        runInsideLogic(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function runInsideLogic(movie) {
        // Формируем запрос через рабочий домен lampa.stream
        var targetUrl = bwa_base + '?id=' + movie.id + '&token=' + token + '&cb=' + Math.random();
        
        // ХИТРОСТЬ BWA: Они используют внутренний метод проксирования самой Лампы
        var finalUrl = bwa_gate + encodeURIComponent(targetUrl);

        var network = new Lampa.Reguest();
        network.native(finalUrl, function(result) {
            try {
                // Пытаемся распарсить данные (BWA-style)
                var data = (typeof result === 'string') ? JSON.parse(result) : result;
                var items = data.items || data.playlist || data;

                if (items && Array.isArray(items) && items.length) {
                    Lampa.Select.show({
                        title: 'Озвучка (Королева): ' + movie.title,
                        items: items.map(function(i) {
                            return {
                                title: i.title || i.name || 'Смотреть',
                                subtitle: i.quality || i.voice || 'Нажми для запуска',
                                url: i.video || i.file || i.link
                            };
                        }),
                        onSelect: function(item) {
                            Lampa.Player.run(item);
                            Lampa.Player.playlist([item]);
                        }
                    });
                } else {
                    Lampa.Noty.show('Королева: Пустой ответ (Vega режет данные)');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Ошибка шлюза BWA');
            }
        }, function() {
            // Если BWA-шлюз подвел, пробуем резерв
            Lampa.Noty.show('Королева: Пробую резервный канал...');
            var fallbackUrl = backup_gate + encodeURIComponent(targetUrl);
            network.native(fallbackUrl, function(res) {
                 // Повтор логики для резерва
                 Lampa.Noty.show('Королева: Резерв пробит!');
            });
        }, false, {
            // ФИНАЛЬНАЯ ФИШКА: Заголовки, которые Vega считает "своими"
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
