/* Load a newer Supabase library (supports the new sb_publishable keys); it replaces the older copy loaded by index.html. */
document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.78.0"><\/script>');
/* net.js - RoomNet: real internet transport (Supabase Realtime Broadcast) replacing the claude.ai-only 'room' capability.
   Same API the game already uses: use() -> {join(name)} ; room.presence(patch), room.onPeers(cb), room.leave(), room.peers */
(function(){
'use strict';
var C=window.NET_CONFIG||{},sb=null,BY=null;
function rnd(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);}
try{BY=localStorage.getItem('fs-by');if(!BY){BY='u'+rnd();localStorage.setItem('fs-by',BY);}}catch(e){BY='u'+rnd();}
function ok(){return !!(window.supabase&&C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&C.SUPABASE_URL.indexOf('YOUR-')<0&&C.SUPABASE_ANON_KEY.indexOf('YOUR-')<0);}
function client(){if(!sb)sb=window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{realtime:{params:{eventsPerSecond:40}}});return sb;}
function say(m){try{if(window.mpSay)window.mpSay(m);}catch(e){}}
function join(name,o){
  var hb=(o&&o.hb)||1500;
  return new Promise(function(resolve,reject){
    if(!ok()){reject({code:'not-configured'});return;}
    var id=rnd(),mine={},peers={},subs=[],closed=false,pend=null,hbT=null,prT=null,settled=false,wasUp=false;
    var ch=client().channel('fs:'+name,{config:{broadcast:{self:false,ack:false}}});
    function list(){var a=[{peer:id,presence:mine,isMe:true,sameTab:true,by:BY}];for(var k in peers)a.push(peers[k]);return a;}
    function emit(){if(pend||closed)return;pend=setTimeout(function(){pend=null;var d={peers:list()};subs.slice().forEach(function(f){try{f(d);}catch(e){console.error(e);}});},0);}
    function send(x){if(closed)return;x.id=id;x.by=BY;try{ch.send({type:'broadcast',event:'p',payload:x});}catch(e){}}
    function full(h){send({full:1,patch:mine,hello:h?1:0});}
    function prune(){var now=Date.now(),lim=Math.max(4000,hb*2.5),ch2=false;for(var k in peers){if(now-peers[k].t>lim){delete peers[k];ch2=true;}}if(ch2)emit();}
    function cleanup(){closed=true;clearInterval(hbT);clearInterval(prT);try{client().removeChannel(ch);}catch(e){}}
    var room={
      get peers(){return list();},
      presence:function(patch){if(!closed&&patch){for(var k in patch)mine[k]=patch[k];send({patch:patch});emit();}return Promise.resolve();},
      onPeers:function(f){subs.push(f);emit();return function(){var i=subs.indexOf(f);if(i>=0)subs.splice(i,1);};},
      leave:function(){if(!closed){send({leave:1});cleanup();}return Promise.resolve();}
    };
    ch.on('broadcast',{event:'p'},function(m){
      var d=m&&m.payload;if(!d||!d.id||d.id===id||closed)return;
      var p=peers[d.id];
      if(d.leave){if(p){delete peers[d.id];emit();}return;}
      var isNew=!p;if(!p)p=peers[d.id]={peer:d.id,presence:{},isMe:false,by:d.by||null};
      p.t=Date.now();if(d.full)p.presence={};
      var pt=d.patch||{};for(var k in pt)p.presence[k]=pt[k];
      if(d.hello||isNew)full(0);
      emit();
    });
    ch.subscribe(function(st){
      if(st==='SUBSCRIBED'){
        if(!settled){settled=true;wasUp=true;hbT=setInterval(function(){full(0);},hb);prT=setInterval(prune,1000);full(1);resolve(room);emit();}
        else if(!wasUp){wasUp=true;say('Reconnected.');full(1);}
      }else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED'){
        if(!settled){settled=true;cleanup();reject({code:String(st).toLowerCase()});}
        else if(wasUp&&!closed){wasUp=false;say('Connection lost - reconnecting...');}
      }
    });
    setTimeout(function(){if(!settled){settled=true;cleanup();reject({code:'timeout'});}},9000);
  });
}
var gP=null;function glob(){return gP||(gP=join('lobby-global',{hb:4000}));}
var root={
  join:function(n){return join(n,{hb:n==='mp-public'?3000:1500});},
  presence:function(p){return glob().then(function(r){return r.presence(p);}).catch(function(){});},
  onPeers:function(f){var un=null,dead=false;glob().then(function(r){if(!dead)un=r.onPeers(f);}).catch(function(){});return function(){dead=true;if(un)un();};},
  peers:[]
};
window.RoomNet={configured:ok,globalOn:function(){return ok()&&C.ENABLE_ONLINE_LIST===true;},use:function(){return ok()?Promise.resolve(root):Promise.reject({code:'not-configured'});}};
window.cl1=function(v){v=+v||0;return v>1?1:v<-1?-1:v;};
window.mpBi=function(v){var n=(typeof TI!=='undefined'&&TI.length)||20;v=v|0;return v<0||v>=n?0:v;};
})();
