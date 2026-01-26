(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v37.0 Armageddon)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 10px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Штурм начался...');
                        
                        var url = proxy + encodeURIComponent(base + '?id=' + e.data.movie.id + '&token=' + token + '&cb=' + Date.now());

                        // Используем системный метод Lampa, который Vega сложнее отследить
                        var network = new Lampa.Reguest();
                        network.native(url, function(result) {
                            try {
                                var res = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                                var items = res.items || res.playlist || res;

                                if (items && items.length) {
                                    Lampa.Select.show({
                                        title: 'Озвучка (Королева)',
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
                                    Lampa.Noty.show('Vega обнулила данные. Смени DNS на 1.1.1.1!');
                                }
                            } catch(e) {
                                Lampa.Noty.show('Ошибка: Vega блокирует ответ');
                            }
                        }, function() {
                            Lampa.Noty.show('Канал заблокирован провайдером');
                        });
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    var wait = setInterval(function() {
        if (window && window.Lampa) { clearInterval(wait); startPlugin(); }
    }, 500);
})();
