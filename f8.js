(function() {
  'use strict';
  // Lampa Plugin i6poH3a
  var Defined = {
    api: 'lampac',
    localhost: 'https://lampac.hdgo.me/', // Сменил на HTTPS
    apn: 'https://warp.cfhttp.top/'
  };
  
  var hostkey = 'lampac.hdgo.me';
  if (!window.rch_nws) window.rch_nws = {};
  window.rch_nws[hostkey] = {
    type: 'cors',
    token: 'f8lgdpq2'
  };

  // Исправленная функция загрузки скрипта
  function rchRun(json, call) {
    if (typeof NativeWsClient == 'undefined') {
      Lampa.Utils.putScript(["https://lampac.hdgo.me/js/nws-client-es5.js?v26012026"], function() {}, false, function() {
        rchInvoke(json, call);
      }, true);
    } else {
      rchInvoke(json, call);
    }
  }

  // Весь остальной твой код... (просто убедись, что ссылки на hdgo.me теперь только через https)
})();
