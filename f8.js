(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v10.0 Diamond Bypass)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events';

    // Список "штурмовых" прокси-шлюзов
    var gateways = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://thingproxy.freeboard.io/fetch/',
        'https://lampa.stream/proxy/'
    ];

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                this.tryGateway(0); 
                return files.render();
            };

            this.tryGateway = function(index) {
                if (index >= gateways.length) {
                    Lampa.Noty.show('Королева: Все шлюзы Vega заблокированы. Нужен VPN на роутере.');
                    return;
                }

                var targetUrl = base + '?id=' + object.movie.id + '&token=' + token + '&cb=' + Math.random();
                var finalUrl  = gateways[index] + encodeURIComponent(targetUrl);

                Lampa.Noty.show('Королева: Штурм канала ' + (index + 1) + '...');

                network.native(finalUrl, function(result) {
                    try {
                        // Распаковка данных (разные прокси отдают по-разному)
                        var data = result.contents ? (typeof result.contents === 'string' ? JSON.parse(result.contents) : result.contents) : (typeof result === 'string' ? JSON.parse(result) : result);
                        
                        if (data && data.length) {
                            Lampa.Noty.show('Королева: ПРОРЫВ! Загружаю...');
                            files.append(data);
                            _this.start();
                        } else {
                            _this.tryGateway(index + 1);
                        }
                    } catch(e) {
                        _this.tryGateway(index + 1);
                    }
                }, function() {
                    _this.tryGateway(index + 1);
                });
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

        // Создаем ту самую кнопку "Королева"
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: linear-gradient(45deg, #7b1fa2, #4a148c) !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 8px; height: 3.8em; width: 14em; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 12px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight: bold; font-size: 1.3em; letter-spacing: 1px;">Королева</span></div>');

                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({ title: 'Королева', component: 'hdgo', movie: e.data.movie });
                    });

                    var target = render.find('.view--torrent');
                    if (target.length) target.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
            }
        });
    }

    var wait = setInterval(function() {
        if (window.Lampa && Lampa.Component) { clearInterval(wait); startPlugin(); }
    }, 100);
})();
