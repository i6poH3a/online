(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v32.0 Final)
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
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%) !important; border-radius: 10px; margin-top:12px; height:3.8em; display:flex; align-items:center; justify-content:center; width:100%; box-shadow: 0 4px 15px rgba(0,0,0,0.4); transition: transform 0.2s;">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="white" style="margin-right:12px;"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight:bold; font-size:1.2em; letter-spacing:1px; text-transform:uppercase;">Королева 👑</span></div>');
                    
                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({
                            title: 'Королева: ' + e.data.movie.title,
                            component: 'queen_engine',
                            movie: e.data.movie,
                            page: 1
                        });
                    });
                    
                    render.find('.view--torrent').after(btn);
                }
            }
        });

        // Двигатель отображения списка
        Lampa.Component.add('queen_engine', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // СРАЗУ показываем надпись загрузки
                files.append([{
                    title: '🛰 Идет штурм серверов Vega...',
                    quality: 'INFO',
                    info: 'Пробуем пробить блокировку в Днепре'
                }]);

                var url = proxy + encodeURIComponent(base + '?id=' + object.movie.id + '&token=' + token + '&v=' + Math.random());

                network.native(url, function(result) {
                    files.clear();
                    try {
                        var raw = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                        var items = raw.items || raw.playlist || raw;

                        if (items && items.length) {
                            Lampa.Noty.show('Королева: Переводы загружены!');
                            files.append(items); // Добавляем реальный список
                        } else {
                            files.append([{title: '❌ Провайдер Vega обнулил ответ', quality: 'DPI'}]);
                        }
                    } catch(e) {
                        files.append([{title: '❌ Ошибка в данных (Json Error)', quality: 'ERR'}]);
                    }
                    _this.start();
                }, function() {
                    files.clear();
                    files.append([{title: '❌ Vega заблокировала вход полностью', quality: 'BLOCK'}]);
                    _this.start();
                });

                return files.render();
            };

            this.render = function() { return files.render(); };
            this.start = function() {
                Lampa.Controller.add('content', {
                    toggle: function() {
                        Lampa.Controller.collectionSet(files.render());
                        Lampa.Controller.collectionFocus(files.render().find('.selector').eq(0), files.render());
                    },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('content');
            };
            this.pause = function() {}; this.stop = function() {};
            this.destroy = function() { network.clear(); files.destroy(); };
        });
    }

    if (window.Lampa) startPlugin();
    else {
        var wait = setInterval(function() {
            if (window.Lampa) { clearInterval(wait); startPlugin(); }
        }, 500);
    }
})();
