(function () {
    'use strict';
	
    var timer = setInterval(function(){
        if(typeof Lampa !== 'undefined'){
            clearInterval(timer);
  
            Lampa.Utils.putScriptAsync(["http://lampac.hdgo.me/online/js/f8lgdpq2","http://lampac.hdgo.me/sisi/js/f8lgdpq2"], function() {});
        }
    },200);
})();
