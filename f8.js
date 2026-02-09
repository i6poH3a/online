(function() {
    'use strict';

    // --- НАСТРОЙКИ ---
    var api_link = 'http://api.spotfy.biz/lam/f8lgdpq2'; // Твоя ссылка
    var button_name = '👑 Моя Королева';
    
    // Фразы, которые пишет система при нажатии (Рандом)
    var phrases = [
        'О.Д.: Бригада выехала за кассетой...',
        'О.Д.: ВТБ спонсирует этот просмотр...',
        'О.Д.: Томми Оливер ищет файл...',
        'О.Д.: Загружаю в синий Lamborghini...',
        'О.Д.: Считаем кэш, жди...',
        'О.Д.: Райффайзен одобряет этот выбор...',
        'О.Д.: Слушаю и повинуюсь, Ваше Величество...'
    ];

    function startPlugin() {
        if (window.queen_plugin_init) return;
        window.queen_plugin_init = true;

        // Сообщаем, что плагин на месте
        setTimeout(function() {
            Lampa.Noty.show('👑 Бригада на связи');
        }, 1000);

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                
                // Если кнопки еще нет - рисуем
                if (!render.find('.queen-btn').length) {
                    
                    // Стиль кнопки: Градиент фиолетово-синий, жирный текст
                    var btn = $(
                        '<div class="full-start__button selector view--online queen-btn" style="background: linear-gradient(90deg, #512da8 0%, #1a237e 100%); border: 1px solid #7c4dff; border-radius: 8px; margin-top: 10px; width: 100%; display: flex; justify-content: center; align-items: center; text-align: center;">' +
                        '<span style="font-weight: 800; font-size: 1.1em; color: white; text-transform: uppercase; text-shadow: 0px 2px 4px rgba(0,0,0,0.6);">' + button_name + '</span>' +
                        '</div>'
                    );

                    // Нажатие (Клик или Enter с пульта)
                    btn.on('hover:enter click', function() {
                        var random_text = phrases[Math.floor(Math.random() * phrases.length)];
                        Lampa.Noty.show(random_text); // Показываем прикол

                        // Берем ID (KP или IMDB)
                        var id = e.data.movie.imdb_id || e.data.movie.kp_id || e.data.movie.id;
                        var req_url = api_link + '?id=' + id;

                        // Делаем запрос
                        var network = new Lampa.Reguest();
                        network.silent(req_url, function(json) {
                            
                            // Проверяем, есть ли видео внутри
                            if (json) {
                                var items = [];
                                
                                // Пытаемся понять формат ответа (массив или объект)
                                if(Array.isArray(json)) items = json;
                                else if(json.items) items = json.items;
                                else if(json.playlist) items = json.playlist;
                                else if(json.link || json.url) items = [json];

                                if (items.length) {
                                    Lampa.Select.show({
                                        title: '👑 Выбор для Элиты',
                                        items: items.map(function(i) {
                                            return {
                                                title: i.title || i.name || 'Смотреть',
                                                subtitle: i.quality || 'FullHD',
                                                url: i.video || i.link || i.url,
                                                stream: i.video || i.link || i.url
                                            };
                                        }),
                                        onSelect: function(item) {
                                            Lampa.Player.play(item);
                                            Lampa.Player.playlist([item]);
                                        }
                                    });
                                } else {
                                    Lampa.Noty.show('О.Д.: Пусто, братан. Банкомат пустой.');
                                }
                            } else {
                                Lampa.Noty.show('О.Д.: Ответ сервера пустой');
                            }
                        }, function() {
                            Lampa.Noty.show('О.Д.: Ошибка сети. Мельницы победили.');
                        });
                    });

                    // Вставляем кнопку в общий ряд кнопок
                    render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    // Запуск (Ждем пока загрузится Лампа)
    if (window.Lampa) {
        startPlugin();
    } else {
        var wait_load = setInterval(function() {
            if (window.Lampa) {
                clearInterval(wait_load);
                startPlugin();
            }
        }, 500);
    }

})();
