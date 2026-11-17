/* 檔案體驗箱線上任務：匿名紀錄送到後台（Google 試算表）
 * ENDPOINT 留空時完全不送出任何資料，頁面也會顯示「不會上傳」的說明。
 * 填上 Apps Script 網頁應用程式網址後：
 *  - 自動匿名記錄「開啟頁面、通關、成績」這類數字（不含任何文字或名字）
 *  - 故事、證書暱稱這類文字，只有體驗者自己勾選同意才會送出
 */
(function () {
  var ENDPOINT = '';

  var on = /^https:\/\/script\.google\.com\//.test(ENDPOINT);
  var page = (location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '').split('/').pop()) || 'home';
  if (page === 'archifile') page = 'home';

  function vid() {
    var k = 'archi_vid', v = null;
    try { v = localStorage.getItem(k); } catch (e) {}
    if (!v) {
      v = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      try { localStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }

  function post(o) {
    if (!on) return Promise.resolve(false);
    o.page = o.page || page; o.vid = vid(); o.ua = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? '手機/平板' : '電腦';
    var body = JSON.stringify(o);
    try {
      return fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body })
        .then(function () { return true; }, function () { return false; });
    } catch (e) {
      try { return Promise.resolve(navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))); } catch (e2) { return Promise.resolve(false); }
    }
  }

  var sentText = {};
  window.ARCHI = {
    on: on,
    // 匿名事件：event 例如 'open'、'clear'、'finish'；detail 只放數字或固定選項
    log: function (event, detail) { return post({ type: 'event', event: event, detail: detail || {} }); },
    // 使用者同意後才呼叫：kind 例如 'story'、'cert_name'
    share: function (kind, text, detail) {
      text = String(text || '').trim();
      if (!text || sentText[kind] === text) return Promise.resolve(false);
      sentText[kind] = text;
      return post({ type: 'text', event: kind, text: text.slice(0, 1000), detail: detail || {} });
    }
  };

  function ready() {
    document.querySelectorAll('[data-collect-on]').forEach(function (el) { el.hidden = !on; });
    document.querySelectorAll('[data-collect-off]').forEach(function (el) { el.hidden = on; });
    if (!on) return;
    var note = '本頁會匿名記錄開啟與通關次數，作為檔案體驗箱的展覽統計，不含姓名或任何個人資料。';
    var f = document.querySelector('footer');
    var s = document.createElement(f ? 'span' : 'p');
    s.textContent = note;
    s.style.cssText = f ? 'flex-basis:100%;font-size:12px;opacity:.75' : 'font-size:12px;color:#6b6257;text-align:center;margin:24px 16px';
    (f || document.body).appendChild(s);
    ARCHI.log('open');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
