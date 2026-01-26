(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v25.0)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        
        // Кнопка в карточке фильма
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Пробиваюсь сквозь Vega...');
                        
                        var url = proxy + encodeURIComponent(base + '?id=' + e.data.movie.id + '&token=' + token + '&cb=' + Date.now());

                        // Используем системный запрос Lampa
                        var network = new Lampa.Reguest();
                        network.native(url, function(result) {
                            try {
                                var data = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                                
                                if (data && data.length) {
                                    // ОТКРЫВАЕМ СИСТЕМНОЕ МЕНЮ ВЫБОРА
                                    Lampa.Select.show({
                                        title: 'Выбор озвучки (Королева)',
                                        items: data,
                                        onSelect: function(item) {
                                            Lampa.Player.run(item);
                                            Lampa.Player.playlist([item]);
                                        },
                                        onBack: function() {
                                            Lampa.Controller.toggle('full');
                                        }
                                    });
                                } else {
                                    Lampa.Noty.show('Королева: Vega блокирует ответ (Пусто)');
                                }
                            } catch(err) {
                                Lampa.Noty.show('Королева: Ошибка шлюза');
                            }
                        }, function() {
                            Lampa.Noty.show('Королева: Vega полностью закрыла проход');
                        });
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    // Запуск
    var wait = setInterval(function() {
        if (window && window.Lampa) {
            clearInterval(wait);
            startPlugin();
        }
    }, 500);
})();
