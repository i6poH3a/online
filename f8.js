(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (v5.0 Triple-Proxy)
    var token = 'f8lgdpq2';
    var base  = 'https://lampac.hdgo.me/lite/events?id=';

    // Список "ходов", которые мы будем пробовать по очереди
    var gateways = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest='
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
                    Lampa.Noty.show('Королева: Все каналы Vega заблокировала (Смени DNS!)');
                    return;
                }

                var targetUrl = base + object.movie.id + '&token=' + token;
                var finalUrl  = gateways[index] + encodeURIComponent(targetUrl);

                Lampa.Noty.show('Королева: Пробую канал ' + (index + 1));

                network.native(finalUrl, function(json) {
                    if (json && json.length) {
                        Lampa.Noty.show('Королева: Канал пробит! Загружаю...');
                        files.append(json);
                        _this.start();
                    } else {
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
                    left: function() { Lampa.Activity.backward(); },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('content');
            };
            this.pause = function() {}; this.stop = function() {};
            this.destroy = function() { network.clear(); files.destroy(); };
        });

        // Кнопка "Королева" (фиолетовая, со звездой)
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 5px; height: 3.5em; width: 14em;">' +
                        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 12px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight: bold; font-size: 1.2em;">Королева</span></div>');

                    btn.on('hover
