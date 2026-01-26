(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v54.0)
    var api_1 = 'http://api.spotfy.biz/lam/f8lgdpq2';
    var api_2 = 'http://api.forkplay.me/lam/f8lgdpq2';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Моя Королева: К службе готова 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #311b92 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; border: 1px solid #7b1fa2;">' +
                        '<span style="font-weight:bold; font-size:1.1em; color: #fff; text-transform: uppercase; letter-spacing: 2px;">Моя Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('О.Д.: Загружаю переводы...');
                        
                        var id = e.data.movie.imdb_id || e.data.movie.id;
                        // Пробуем первый API
                        sendRequest(api_1 + '?id=' + id, e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function sendRequest(url, movie) {
        $.ajax({
            url: url,
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
                // Если первый сдох, пробуем второй (forkplay)
                if (url.indexOf('spotfy') !== -1) {
                    Lampa.Noty.show('О.Д.: spotfy не ответил, пробую forkplay...');
                    var id = movie.imdb_id || movie.id;
                    sendRequest(api_2 + '?id=' + id, movie);
                } else {
                    Lampa.Noty.show('О.Д.: Оба сервера молчат. Проверь DNS!');
                }
            }
        });
    }

    var wait = setInterval(function() {
        if (window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
