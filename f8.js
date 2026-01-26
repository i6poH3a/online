(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v29.0 Universal)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Взлом данных Vega... 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Получаю список переводов...');
                        loadData(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function loadData(movie) {
        var url = proxy + encodeURIComponent(base + '?id=' + movie.id + '&token=' + token + '&cb=' + Date.now());

        var network = new Lampa.Reguest();
        network.native(url, function(result) {
            try {
                var contents = result.contents ? (typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents) : result;
                
                // Если данные пришли в объекте (например, data.items), вытаскиваем массив
                var items = contents.items || contents.playlist || contents;

                if (items && Array.isArray(items) && items.length) {
                    // УНИВЕРСАЛЬНЫЙ МАППЕР (подгоняем под экран выбора)
                    var choices = items.map(function(it) {
                        return {
                            title: it.title || it.name || 'Вариант без названия',
                            subtitle: it.quality || it.voice || it.translation || 'Качество HD',
                            url: it.video || it.file || it.link, // Ссылка на сам фильм
                            quality: it.quality || 'HD'
                        };
                    });

                    Lampa.Select.show({
                        title: 'Выбор озвучки (Королева)',
                        items: choices,
                        onSelect: function(item) {
                            if (item.url) {
                                Lampa.Player.run(item);
                                Lampa.Player.playlist([item]);
                            } else {
                                Lampa.Noty.show('Королева: Ссылка на видео не найдена');
                            }
                        },
                        onBack: function() { Lampa.Controller.toggle('full'); }
                    });
                } else {
                    Lampa.Noty.show('Королева: Vega обнулила список (Пусто)');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Ошибка обработки данных');
            }
        }, function() {
            Lampa.Noty.show('Королева: Блокировка связи Vega');
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
