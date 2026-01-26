(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v56.0)
    var api_url = 'http://api.spotfy.biz/lam/f8lgdpq2';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Моя Королева: Слушаю и повинуюсь 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #311b92 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; border: 1px solid #7b1fa2;">' +
                        '<span style="font-weight:bold; font-size:1.1em; color: #fff; text-transform: uppercase; letter-spacing: 2px;">Моя Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('О.Д.: Загружаю переводы...');
                        
                        // Формируем ссылку точно так же, как ты вводил вручную
                        var id = e.data.movie.imdb_id || e.data.movie.id;
                        var final_url = api_url + '?id=' + id;

                        // Используем системный загрузчик, который работает "напрямую"
                        $.ajax({
                            url: final_url,
                            method: 'GET',
                            dataType: 'json',
                            success: function(data) {
                                var items = data.items || data.playlist || (Array.isArray(data) ? data : []);
                                if (items.length) {
                                    Lampa.Select.show({
                                        title: 'Озвучка — Моя Королева',
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
                                    Lampa.Noty.show('О.Д.: В API пусто');
                                }
                            },
                            error: function() {
                                Lampa.Noty.show('О.Д.: Ошибка загрузки списка');
                            }
                        });
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    var wait = setInterval(function() {
        if (window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
