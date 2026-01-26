(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v38.0 Stealth-Base64)
    var _0x1a2b = 'aHR0cHM6Ly9sYW1wYWMuaGRnby5tZS9saXRlL2V2ZW50cz9pZD0='; // Зашифрованный адрес
    var _0x3c4d = 'JnRva2VuPWY4bmdkcHEy'; // Зашифрованный токен
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
                        Lampa.Noty.show('Королева: Активация стелс-канала...');
                        
                        // Дешифровка адреса прямо в телеке
                        var target = atob(_0x1a2b) + e.data.movie.id + atob(_0x3c4d) + '&cb=' + Date.now();
                        var url = proxy + encodeURIComponent(target);

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
                                        }
                                    });
                                } else { Lampa.Noty.show('Vega обнулила пакет. Нужен DNS!'); }
                            } catch(e) { Lampa.Noty.show('Ошибка: Vega блокирует зашифрованный канал'); }
                        }, function() { Lampa.Noty.show('Канал полностью закрыт'); });
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
