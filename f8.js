(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v19.0 Debug)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';
    var proxy = 'https://api.allorigins.win/get?url=';

    function startPlugin() {
        window.hdgo_plugin = true;
        
        Lampa.Noty.show('Королева: Скрипт активен! 👑');

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                
                // ШАГ 1: Сразу рисуем кнопки, не дожидаясь интернета!
                files.append([{
                    title: '⏳ Проверка связи с Vega...',
                    quality: 'LOG',
                    info: 'Если эта надпись есть - плагин работает!'
                }]);

                var targetUrl = base + '?id=' + object.movie.id + '&token=' + token + '&cb=' + Date.now();
                var finalUrl  = proxy + encodeURIComponent(targetUrl);

                // ШАГ 2: Пытаемся стянуть реальные переводы
                network.native(finalUrl, function(result) {
                    files.clear();
                    try {
                        var data = result.contents;
                        if (typeof data === 'string') data = JSON.parse(data);
                        
                        if (data && data.length) {
                            Lampa.Noty.show('Королева: Переводы найдены!');
                            files.append(data);
                        } else {
                            files.append([{title: '❌ Провайдер вернул пустой ответ', quality: 'DPI'}]);
                        }
                    } catch(e) {
                        files.append([{title: '❌ Ошибка расшифровки данных', quality: 'ERR'}]);
                    }
                    _this.start();
                }, function() {
                    files.clear();
                    files.append([{
                        title: '❌ Vega полностью заблокировала прокси',
                        quality: 'BLOCK',
                        info: 'Нужно сменить DNS в настройках ТВ на 1.1.1.1'
                    }]);
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
            this.destroy = function() { network.clear(); scroll.destroy(); files.destroy(); };
        });

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.view--online').length) {
                    var btn = $('<div class="full-start__button selector view--online" style="background: #7b1fa2 !important; border-radius: 8px;"><span>Королева 👑</span></div>');
                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({ title: 'Королева', component: 'hdgo', movie: e.data.movie });
                    });
                    render.find('.view--torrent').after(btn);
                }
            }
        });
    }

    if (window
