// Lampa Plugin
(function() {
  'use strict';
  var Defined = {
    api: 'lampac',
    // Обязательно https!
    localhost: 'https://lampac.hdgo.me/', 
    apn: 'https://warp.cfhttp.top/'
  };
  
  // Все системные ссылки внутри тоже меняем на https
  var hostkey = 'lampac.hdgo.me';
  
  // Твой токен
  var token = 'f8lgdpq2'; 

  // В этой строке я тоже заменил http на https
  function rchRun(json, call) {
    if (typeof NativeWsClient == 'undefined') {
      Lampa.Utils.putScript(["https://lampac.hdgo.me/js/nws-client-es5.js?v18112025"], function() {}, false, function() {
        rchInvoke(json, call);
      }, true);
    } else {
      rchInvoke(json, call);
    }
  }
  
  // ... дальше вставь остаток своего кода, НО проверь через поиск (Ctrl+F), 
  // чтобы нигде не осталось "http://lampac.hdgo.me" — везде должно быть "https"
})();
