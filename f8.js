(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v30.0 Tactical)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    // Меняем прокси на более редкий
    var proxy = 'https://corsproxy.io/?';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Попытка №30. Иду на прорыв! 👑');

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // ТЕСТОВАЯ КНОПКА: Если ты её видишь, значит экран работает
                files.append([{
                    title: '⏳ Связь с Vega...',
                    quality: 'CHECK',
                    info: 'Если список не обновится - смени DNS на 1.1.1.1'
                }]);

                var targetUrl = base + '?id=' + object.movie.id + '&token=' + token + '&v=' + Math.random();
                var finalUrl  = proxy + encodeURIComponent(targetUrl);

                network.native(finalUrl, function(json) {
                    files.clear();
                    if (json && json.length) {
                        Lampa.Noty.show('Королева: Данные получены!');
                        files.append(json);
                    } else {
                        files.append([{title: '❌ Провайдер Vega прислал пустоту', quality: 'DPI'}]);
                    }
                    _this.start();
                }, function() {
                    files.clear();
                    files.append([{title: '❌ Vega заблокировала шлюз полностью', quality: 'BLOCK'}]);
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

        // Рисуем кнопку "Королева"
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.btn--queen').length) {
                    var btn = $('<div class="full-start__button selector view--online btn--queen" style="background: #7b1fa2 !important; border-radius: 8px; margin-top:10px; height:3.5em; display:flex; align-items:center; justify-content:center; width:100%">' +
                        '<span style="font-weight:bold;">Королева 👑</span></div>');
                    
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
