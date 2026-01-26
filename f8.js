(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v28.0 Final UI)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    
    var gateways = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest='
    ];

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Канал пробит! Настраиваю экран... 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        tryGateways(0, e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function tryGateways(index, movie) {
        if (index >= gateways.length) {
            Lampa.Noty.show('Королева: Все каналы Vega заблокировала!');
            return;
        }

        var targetUrl = base + '?id=' + movie.id + '&token=' + token + '&cb=' + Math.random();
        var finalUrl  = gateways[index] + encodeURIComponent(targetUrl);

        var network = new Lampa.Reguest();
        network.native(finalUrl, function(result) {
            try {
                var contents = result.contents ? result.contents : result;
                var rawData = typeof contents === 'string' ? JSON.parse(contents) : contents;
                
                if (rawData && rawData.length) {
                    // ТРАНСФОРМАЦИЯ ДАННЫХ: подгоняем под стандарт Лампы
                    var formattedData = rawData.map(function(item) {
                        return {
                            title: item.title || 'Без названия',
                            subtitle: item.quality || item.info || '',
                            quality: item.quality || 'HD',
                            url: item.video || item.link, // Ссылка на видео
                            data: item // Сохраняем оригинал на всякий случай
                        };
                    });

                    Lampa.Select.show({
                        title: 'Королева: Выбор озвучки',
                        items: formattedData,
                        onSelect: function(item) {
                            // Запуск плеера
                            Lampa.Player.run(item);
                            Lampa.Player.playlist([item]);
                        },
                        onBack: function() {
                            Lampa.Controller.toggle('full');
                        }
                    });
                } else {
                    tryGateways(index + 1, movie);
                }
            } catch(e) {
                tryGateways(index + 1, movie);
            }
        }, function() {
            tryGateways(index + 1, movie);
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) {
            clearInterval(wait);
            startPlugin();
        }
    }, 500);
})();
