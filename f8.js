(function() {
    'use strict';
    // Lampa Plugin: i6poH3a "Королева" (Anti-DPI Edition)
    var token = 'f8lgdpq2';
    
    // Список рабочих зеркал и прокси
    var mirrors = [
        'https://corsproxy.io/?https://lampac.hdgo.me/',
        'https://api.codetabs.com/v1/proxy?quest=https://lampac.hdgo.me/',
        'https://lampa.stream/proxy/https://lampac.hdgo.me/'
    ];

    function startPlugin() {
        window.hdgo_plugin = true;

        Lampa.Component.add('hdgo', function(object) {
            var network = new Lampa.Reguest();
            var scroll  = new Lampa.Scroll({mask: true, over: true});
            var files   = new Lampa.Explorer(object);
            var _this   = this;

            this.create = function() {
                Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
                this.tryConnect(0); // Начинаем с первого зеркала
                return files.render();
            };

            this.tryConnect = function(index) {
                if (index >= mirrors.length) {
                    Lampa.Noty.show('Королева: Все каналы заблокированы');
                    return;
                }

                var url = mirrors[index] + 'lite/events?id=' + object.movie.id + '&token=' + token + '&cb=' + Math.random();

                network.native(url, function(json) {
                    if (json && json.length) {
                        Lampa.Noty.show('Королева: Канал ' + (index + 1) + ' открыт!');
                        files.append(json);
                        _this.start();
                    } else {
                        _this.tryConnect(index + 1);
                    }
                }, function() {
                    _this.tryConnect(index + 1);
                });
            };

            this.render = function() { return files.render(); };
            this.start = function() {
                Lampa.Controller.add('content', {
                    toggle: function() {
                        Lampa.Controller.collectionSet(scroll.render());
                        Lampa.Controller.collectionFocus(scroll.render().find('.selector').eq(0), scroll.render());
                    },
                    left: function() { Lampa.Activity.backward(); },
                    back: function() { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('content');
            };
            this.pause = function() {}; this.stop = function() {};
            this.destroy = function() { network.clear(); scroll.destroy(); files.destroy(); };
        });

        // Отрисовка той самой фиолетовой кнопки со звездой
        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
                var render = e.object.activity.render();
                if (!render.find('.lampac--button').length) {
                    var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important; color: #fff !important; display: flex; align-items: center; justify-content: center; margin-top: 10px; border-radius: 5px; height: 3.5em; width: 14em; cursor: pointer;">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 12px;">' +
                        '<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>' +
                        '<span style="font-weight: bold; font-size: 1.3em;">Королева</span></div>');

                    btn.on('hover:enter', function() {
                        Lampa.Activity.push({ title: 'Королева', component: 'hdgo', movie: e.data.movie });
                    });

                    var target = render.find('.view--torrent');
                    if (target.length) target.after(btn);
                    else render.find('.full-start__buttons').append(btn);
                }
