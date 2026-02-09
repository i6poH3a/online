(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Моя Королева" (v57.0 Fixed)
    
    // Исправлено: адаптивный протокол (будет работать и на http, и на https)
    // Если api.spotfy.biz не поддерживает HTTPS, браузер может блокировать запрос.
    var api_url = 'http://api.spotfy.biz/lam/f8lgdpq2'; 

    function startPlugin() {
        window.hdgo_plugin = true;
        
        // Добавляем стили для анимации
        $('body').append('<style>.queen-loading { opacity: 0.5; pointer-events: none; }</style>');
        
        Lampa.Noty.show('Моя Королева: Плагин активен 👑');

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                
                // Проверка, чтобы не дублировать кнопку
                if (render.find('.btn--queen').length) return;

                // Кнопка
                var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #311b92 100%) !important; border-radius: 12px; margin-top:10px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; border: 1px solid #7b1fa2; box-shadow: 0 0 10px rgba(123, 31, 162, 0.5);">' +
                    '<span style="font-weight:bold; font-size:1.1em; color: #fff; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">Моя Королева 👑</span></div>');

                // Логика нажатия (и клик, и пульт)
                btn.on('hover:enter click', function() {
                    var _this = $(this);
                    
                    // Анимация загрузки
                    _this.addClass('queen-loading');
                    _this.find('span').text('Загружаю...');

                    // Получаем ID (IMDB или KP)
                    var id = e.data.movie.imdb_id || e.data.movie.id; // KP ID часто лежит просто в id
                    var final_url = api_url + '?id=' + id;
                    
                    console.log('Queen Request:', final_url); // Для отладки в консоли

                    $.ajax({
                        url: final_url,
                        method: 'GET',
                        dataType: 'json',
                        timeout: 10000, // Таймаут 10 сек
                        success: function(data) {
                            _this.removeClass('queen-loading');
                            _this.find('span').text('Моя Королева 👑');

                            // Проверка разных вариантов ответа API
                            var items = data.items || data.playlist || (Array.isArray(data) ? data : []);
                            
                            if (items.length) {
                                Lampa.Select.show({
                                    title: 'Озвучка — Моя Королева',
                                    items: items.map(function(i) {
                                        return {
                                            title: i.title || i.name || 'Смотреть',
                                            subtitle: i.quality || 'HD',
                                            url: i.video || i.file || i.link,
                                            stream: i.video || i.file || i.link // Lampa иногда ищет stream
                                        };
                                    }),
                                    onSelect: function(item) {
                                        Lampa.Player.run(item);
                                        Lampa.Player.playlist([item]);
                                    }
                                });
                            } else {
                                Lampa.Noty.show('О.Д.: В базе пусто для этого фильма');
                            }
                        },
                        error: function(jqXHR, textStatus) {
                            _this.removeClass('queen-loading');
                            _this.find('span').text('Ошибка');
                            setTimeout(function(){ _this.find('span').text('Моя Королева 👑'); }, 2000);
                            
                            Lampa.Noty.show('О.Д.: Ошибка сети: ' + textStatus);
                        }
                    });
                });

                // ИСПРАВЛЕНИЕ: Вставляем кнопку в правильное место (блок кнопок), а не после торрентов
                if (render.find('.full-start__buttons').length) {
                    render.find('.full-start__buttons').append(btn);
                } else {
                    // Резервный вариант, если блока кнопок нет (редко)
                    render.find('.full-start__poster').after(btn);
                }
            }
        });
    }

    // Запуск с проверкой загрузки Lampa
    if (window.Lampa) {
        startPlugin();
    } else {
        var wait = setInterval(function() {
            if (window.Lampa) {
                clearInterval(wait);
                startPlugin();
            }
        }, 500);
    }
})();
