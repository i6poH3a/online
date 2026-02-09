(function () {
    'use strict';

    // --- НАСТРОЙКИ ---
    var _url = 'http://api.spotfy.biz/lam/f8lgdpq2'; // Твоя ссылка
    
    // Фразы, которые будут меняться при каждом нажатии
    var _phrases = [
        'О.Д.: Бригада выехала...',
        'О.Д.: ВТБ спонсирует показ...',
        'О.Д.: Томми Оливер взламывает сервер...',
        'О.Д.: Деньги любят тишину. Загружаю...',
        'О.Д.: Загружаю в синий Lamborghini...',
        'О.Д.: Райффайзен переводит средства...',
        'О.Д.: Связь с космосом установлена...'
    ];

    function start() {
        // Следим за открытием карточки фильма
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                // Ищем блок с кнопками (Смотреть, Трейлер и т.д.)
                var buttons = e.object.activity.render().find('.full-start__buttons');

                // Если блока кнопок нет (очень редкий случай) - выходим
                if (!buttons.length) return;

                // Проверка: если наша кнопка уже есть, не дублируем
                if (buttons.find('.btn-queen').length) return;

                // Создаем кнопку. Используем родные классы Лампы (selector view--online), чтобы работал пульт
                var btn = $('<div class="full-start__button selector view--online btn-queen">' +
                    '<span style="color: #a370db;">👑 Моя Королева</span>' + // Фиолетовый текст
                    '</div>');

                // Обработка нажатия (Клик мышкой или Enter на пульте)
                btn.on('hover:enter click', function () {
                    
                    // 1. Показываем случайную фразу
                    var random_text = _phrases[Math.floor(Math.random() * _phrases.length)];
                    Lampa.Noty.show(random_text);

                    // 2. Получаем ID фильма (KP или IMDB)
                    var id = e.data.movie.imdb_id || e.data.movie.kp_id || e.data.movie.id;
                    
                    // 3. Делаем запрос на твой сервер
                    $.ajax({
                        url: _url + '?id=' + id,
                        type: 'GET',
                        dataType: 'json',
                        timeout: 10000, // Ждем 10 секунд
                        success: function (json) {
                            // Если пришел ответ
                            var items = json.items || json.playlist || (Array.isArray(json) ? json : [json]);

                            if (items.length && items[0]) {
                                // Показываем меню выбора
                                Lampa.Select.show({
                                    title: '👑 Выбор Дона',
                                    items: items.map(function (item) {
                                        return {
                                            title: item.title || item.name || 'Смотреть',
                                            url: item.video || item.link || item.url,
                                            stream: item.video || item.link || item.url,
                                            quality: item.quality || 'MAX'
                                        };
                                    }),
                                    onSelect: function (a) {
                                        Lampa.Player.play(a);
                                        Lampa.Player.playlist([a]);
                                    }
                                });
                            } else {
                                Lampa.Noty.show('О.Д.: Пусто. Касса закрыта.');
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            // Если ошибка сети
                            if(jqXHR.status == 404) Lampa.Noty.show('О.Д.: Файл не найден');
                            else Lampa.Noty.show('О.Д.: Ошибка сети. Мельницы победили.');
                        }
                    });
                });

                // Добавляем кнопку в конец списка
                buttons.append(btn);
            }
        });
    }

    // Запуск скрипта только когда Лампа готова
    if (window.Lampa) start();
    else {
        var timer = setInterval(function () {
            if (window.Lampa) {
                clearInterval(timer);
                start();
            }
        }, 200);
    }

})();
