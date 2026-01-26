(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v33.0 Titanium)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://corsproxy.io/?'; // Используем более мощный шлюз

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Система Титан активирована! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c, #7b1fa2) !important; border-radius: 10px; margin-top:12px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Взламываю шлюз Vega...');
                        runTitanEngine(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function runTitanEngine(movie) {
        var url = proxy + encodeURIComponent(base + '?id=' + movie.id + '&token=' + token + '&cb=' + Math.random());

        var network = new Lampa.Reguest();
        network.native(url, function(result) {
            try {
                // Пытаемся достать данные из любого формата (текст или объект)
                var raw = typeof result === 'string' ? JSON.parse(result) : (result.contents ? (typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents) : result);
                var items = raw.items || raw.playlist || raw;

                if (items && Array.isArray(items) && items.length) {
                    Lampa.Noty.show('Королева: Канал пробит! Выбирай.');
                    
                    // ОТКРЫВАЕМ СИСТЕМНОЕ ОКНО (Его невозможно обнулить)
                    Lampa.Select.show({
                        title: 'Королева: ' + movie.title,
                        items: items.map(function(i) {
                            return {
                                title: i.title || i.name || 'Озвучка',
                                subtitle: i.quality || i.voice || 'Нажми для запуска',
                                url: i.video || i.file || i.link
                            };
                        }),
                        onSelect: function(item) {
                            if (item.url) {
                                Lampa.Player.run(item);
                                Lampa.Player.playlist([item]);
                            } else {
                                Lampa.Noty.show('Королева: Ссылка на видео битая');
                            }
                        },
                        onBack: function() {
                            Lampa.Controller.toggle('full');
                        }
                    });
                } else {
                    Lampa.Noty.show('Королева: Vega прислала пустой пакет');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Ошибка разбора данных');
            }
        }, function() {
            Lampa.Noty.show('Королева: Vega заблокировала шлюз полностью');
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); start
