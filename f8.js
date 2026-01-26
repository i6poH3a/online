(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v15.0 Turbo)
    var token = 'f8lgdpq2';
    // Используем шлюз, который Vega не может отличить от обычного сайта
    var proxy = 'https://api.allorigins.win/get?url=';
    var base  = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;
        
        // Магическое уведомление при старте
        setTimeout(function(){ 
            Lampa.Noty.show('Королева: Канал связи активен! 👑'); 
        }, 3000);

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // Двойное шифрование адреса запроса
                var url = proxy + encodeURIComponent(base + '?id=' + object.movie.id + '&token=' + token) + '&ts=' + Date.now();

                network.native(url, function(result) {
                    try {
                        var data = result.contents;
                        if (typeof data === 'string') data = JSON.parse(data);
                        
                        if (data && data.length) {
                            files.append(data);
                            _this.start();
                        } else {
                            Lampa.Noty.show('Королева: Сервер пуст (Vega блокирует)');
                        }
                    } catch(e) {
                        Lampa.Noty.show('Королева: Ошибка декодирования');
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Сеть заблокирована');
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

        // Кнопка "Королева" с улучшенным дизайном
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.view--online').length) {
                    var btn = $('<div class="full-start__button selector view--online" style="background: #7b1fa2 !important; border-radius: 8px; font-weight: bold;"><span>Королева 👑</span></div>');
                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({ title: 'Королева', component: 'hdgo', movie: e.data.movie });
                    });
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    if (window.Lampa) startPlugin();
    else {
        var wait = setInterval(function() {
            if (window.Lampa) { clearInterval(wait); startPlugin(); }
        }, 500);
    }
})();
