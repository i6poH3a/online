(function() {
  'use strict';
  // Lampa Plugin: i6poH3a "Королева" Edition
  var token = 'f8lgdpq2';
  var proxy = 'https://api.allorigins.win/raw?url=';
  var base  = 'https://lampac.hdgo.me/';

  function init() {
    if (window.Lampa) {
      Lampa.Component.add('hdgo', function(object) {
        var network = new Lampa.Reguest();
        var files   = new Lampa.Explorer(object);
        
        this.create = function() { return files.render(); };

        this.start = function() {
          var _this = this;
          Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
          
          // Магический запрос через прокси-шлюз
          var url = base + 'lite/events?id=' + object.movie.id + '&token=' + token;
          var proxiedUrl = proxy + encodeURIComponent(url);

          network.native(proxiedUrl, function(json) {
            if (json && json.length) {
              // Если сервер ответил - показываем список
              Lampa.Noty.show('Королева нашла фильмы!');
              // (Здесь должна быть отрисовка списка, но для начала проверим коннект)
            } else {
              Lampa.Noty.show('Поиск не дал результатов (Vega всё еще сопротивляется)');
            }
          }, function() {
            Lampa.Noty.show('Ошибка заклинания (Сеть заблокирована)');
          });
        };
      });

      // Создаем ту самую кнопку "Королева"
      Lampa.Listener.follow('full', function(e) {
        if (e.type == 'complite') {
          if (!e.render.find('.lampac--button').length) {
            // Вот тут мы меняем название на "Королева"
            var btn = $('<div class="full-start__button selector view--online lampac--button" style="background: #7b1fa2 !important;"><span>Королева</span></div>');
            
            btn.on('hover:enter', function() {
              Lampa.Activity.push({
                title: 'Королева', // Заголовок внутри тоже меняем
                component: 'hdgo',
                movie: e.data.movie
              });
            });
            
            // Вставляем кнопку после Торрентов
            e.render.find('.view--torrent').after(btn);
          }
        }
      });
    } else {
      setTimeout(init, 100);
    }
  }
  init
