(function() {
    'use strict';

    // Твоя НОВАЯ ссылка
    var link = 'http://lampac.hdgo.me/online/js/f8lgdpq2';

    // Фразы
    var phrases = [
        'О.Д.: Бригада выехала...',
        'О.Д.: ВТБ спонсирует показ...',
        'О.Д.: Томми Оливер ищет файл...',
        'О.Д.: Загружаю в синий Lamborghini...',
        'О.Д.: Кэш посчитан. Жди...',
        'О.Д.: Райффайзен дал добро...'
    ];

    function start() {
        // Добавляем кнопку
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var btn = $('<div class="full-start__button selector view--online" style="background-color: #2b2b2b; color: #fff; margin-top: 10px;">👑 Моя Королева</div>');

                btn.on('hover:enter click', function() {
                    // 1. Показываем прикол
                    Lampa.Noty.show(phrases[Math.floor(Math.random() * phrases.length)]);

                    // 2. Формируем запрос
                    var element = e.object.movie;
                    var query = link + '?id=' + (element.imdb_id || element.kp_id || element.id) + '&serial=' + (element.number_of_seasons ? 1 : 0);
                    
                    // 3. Используем родной метод Лампы (Lampa.Network)
                    var network = new Lampa.Reguest();
                    network.silent(query, function(json) {
                        
                        // Пытаемся понять, что ответил сервер
                        var items = json;
                        if (json.results) items = json.results;
                        else if (json.playlist) items = json.playlist;
                        else if (json.items) items = json.items;
                        else if (!Array.isArray(json)) items = [json];

                        if (items.length) {
                            Lampa.Select.show({
                                title: '👑 Выбор Дона',
                                items: items,
                                onSelect: function(a) {
                                    Lampa.Player.play(a);
                                    Lampa.Player.playlist([a]);
                                }
                            });
                        } else {
                            Lampa.Noty.show('О.Д.: Пусто. Ссылка не дала видео.');
                        }
                    }, function(a, c) {
                        // Если ошибка
                        Lampa.Noty.show('О.Д.: Ошибка сети. Проверь HTTP/HTTPS!');
                    });
                });

                e.object.activity.render().find('.full-start__buttons').append(btn);
            }
        });
    }

    if (window.Lampa) start();
    else {
        var timer = setInterval(function() {
            if (window.Lampa) {
                clearInterval(timer);
                start();
            }
        }, 200);
    }
})();
