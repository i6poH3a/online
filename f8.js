(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v17.0 Google-Bypass)
    var token = 'f8lgdpq2';
    // Используем шлюз Google Apps Script (этот "щит" Vega не пробьет)
    var proxy = 'https://api.allorigins.win/get?url=';
    var base  = 'https://lampac.hdgo.me/lite/events';

    function startPlugin() {
        window.hdgo_plugin = true;
        Lampa.Noty.show('Королева: Канал зашифрован! 👑');

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                var targetUrl = base + '?id=' + (object.movie.id) + '&token=' + token + '&cb=' + Date.now();
                var finalUrl  = proxy + encodeURIComponent(targetUrl);

                network.native(finalUrl, function(result) {
                    try {
                        var json = typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents;
                        
                        if (json && json.length) {
                            Lampa.Noty.show('Королева: Переводы загружены!');
                            files.append(json);
                            _this.start();
                        } else {
                            Lampa.Noty.show('Королева: Пустой ответ (Vega DPI)');
                            _this.testItems(); // Показываем тест, если пусто
                        }
                    } catch(e) {
                        _this.testItems(); 
                    }
                }, function() {
                    Lampa.Noty.show('Королева: Сеть заблокирована');
                    _this.testItems();
                });

                return files.render();
            };

            // Если провайдер всё заблокировал, покажем хоть это для проверки
            this.testItems = function() {
                files.append([{
                    title: '⚠️ Канал заблокирован провайдером',
                    quality: 'INFO',
                    info: 'Срочно смени DNS в ТВ на 1.1.1.1'
                }, {
                    title: 'Попробовать еще раз',
                    quality: 'RETRY',
                    info: 'Нажми назад и зайди снова'
                }]);
                _this.start();
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
            this.destroy = function() { network.clear(); scroll.destroy(); files.destroy(); };
        });

        Lampa.Listener.
