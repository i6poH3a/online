(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v46.0 Platinum)
    // Твой личный API адрес
    var my_api = 'http://api.spotfy.biz/lam/f8lgdpq2';
    var proxy  = 'https://api.allorigins.win/get?url='; // Шлюз для обхода блокировок

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Моя Королева: К службе готова! 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    // Создаем кнопку в стиле "Королева"
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #880e4f 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; box-shadow: 0 4px 20px rgba(123, 31, 162, 0.5); border: 1px solid #ce93d8;">' +
                        '<span style="font-weight:bold; font-size:1.2em; color: #fff; text-transform: uppercase; letter-spacing: 1.5px;">Моя Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Noty.show('Королева: Ищу лучшее для Вас...');
                        runQueenLogic(e.data.movie);
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    function runQueenLogic(movie) {
        // Формируем запрос к твоему личному API
        var targetUrl = my_api + '?id=' + (movie.imdb_id || movie.id) + '&cb=' + Math.random();
        var finalUrl  = proxy + encodeURIComponent(targetUrl);

        var network = new Lampa.Reguest();
        network.native(finalUrl, function(result) {
            try {
                // Разбор ответа от spotfy.biz
                var res = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                var items = res.items || res.playlist || res;

                if (items && items.length) {
                    Lampa.Select.show({
                        title: 'Моя Королева: ' + movie.title,
                        items: items.map(function(i) {
                            return {
                                title: i.title || i.name || 'Вариант озвучки',
                                subtitle: i.quality || 'Качество HD',
                                url: i.video || i.file || i.link
                            };
                        }),
                        onSelect: function(item) {
                            Lampa.Player.run(item);
                            Lampa.Player.playlist([item]);
                        },
                        onBack: function() {
                            Lampa.Controller.toggle('full');
                        }
                    });
                } else {
                    Lampa.Noty.show('Королева: В Вашем API пока пусто по этому фильму');
                }
            } catch(e) {
                Lampa.Noty.show('Королева: Vega блокирует Ваш личный канал');
            }
        }, function
