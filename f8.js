(function () {
    'use strict';

    // --- ТВОИ ФРАЗЫ ---
    var queen_phrases = [
        'Слушаю и повинуюсь, Ваше Величество...'  ];

    var timer = setInterval(function(){
        if(typeof Lampa !== 'undefined'){
            clearInterval(timer);
  
            // 1. Загружаем твои оригинальные ссылки
            Lampa.Utils.putScriptAsync(["http://lampac.hdgo.me/online/js/f8lgdpq2","http://lampac.hdgo.me/sisi/js/f8lgdpq2"], function() {});

            // 2. Добавляем "слушателя" на кнопки
            // $('body').on(...) означает, что мы ловим клик на любой кнопке .view--online, 
            // даже если она появится через 5 секунд после загрузки.
            $('body').on('click', '.view--online', function() {
                var random_text = queen_phrases[Math.floor(Math.random() * queen_phrases.length)];
                Lampa.Noty.show('👑 ' + random_text);
            });

            // Уведомление при старте
            Lampa.Noty.show('👑 Моя Королева: Система готова');
        }
    },200);
})();
