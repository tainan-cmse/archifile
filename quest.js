/* 檔案國家隊線上任務：主線「我的檔案任務」＋四箱護照（只存在瀏覽器，不上傳）
 * 學生帶著一個問題來，配到一份能回答它的檔案選手，
 * 箱一看它入選、箱二看它入住、箱三看它被修好、箱四親手申請它、用它做出作品。
 */
(function () {
  var Q = [
    { k: 'home',   q: '我家鄉以前長什麼樣子？',       a: '老地圖',           t: '紙質', kw: ['（你的鄉鎮名）地圖', '都市計畫', '地籍'],     ic: 'map' },
    { k: 'school', q: '我的學校是怎麼成立的？',       a: '設校公文',         t: '紙質', kw: ['（學校名）', '設校', '校舍興建'],             ic: 'doc' },
    { k: 'quake',  q: '921 地震後，家鄉怎麼重建？',   a: '災後重建照片',     t: '攝影', kw: ['九二一', '震災', '災後重建'],                 ic: 'photo' },
    { k: 'road',   q: '每天走的高速公路怎麼蓋起來？', a: '十大建設藍晒圖',   t: '紙質', kw: ['十大建設', '中山高速公路', '工程計畫'],       ic: 'blue' },
    { k: 'news',   q: '1987 年解嚴那天，新聞怎麼報？', a: '新聞錄影帶',       t: '電子媒體', kw: ['解除戒嚴', '1987', '新聞'],               ic: 'tape' }
  ];
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  window.QUEST = {
    list: Q,
    get: function () { var k = get('archi_quest'); for (var i = 0; i < Q.length; i++) if (Q[i].k === k) return Q[i]; return null; },
    set: function (k) { set('archi_quest', k); },
    stamp: function (box) { set('archi_stamp_' + box, '1'); },
    stamps: function () {
      var s = []; for (var b = 1; b <= 4; b++) s.push(get('archi_stamp_' + b) === '1');
      if (get('box1_lv1') === '1' && get('box1_lv2') === '1' && get('box1_lv3') === '1') s[0] = true;
      return s;
    },
    // 在箱一、箱三頁面上方放一條「我的檔案任務」提示
    mount: function (box) {
      var q = this.get(); if (!q) return;
      var line = { 1: '這一箱，看看像它這樣的檔案，怎麼通過層層選拔成為國家檔案。', 3: '這一箱，看看檔案受損時，修護師怎麼把它救回來。原件修好了，大家才能一直申請使用它。' }[box] || '';
      var el = document.createElement('div');
      el.style.cssText = 'max-width:980px;margin:0 auto 14px;background:#fff;border:3px solid #1b1714;box-shadow:4px 4px 0 #1b1714;padding:8px 14px;font:700 14px/1.6 "Noto Sans TC",sans-serif;color:#1b1714';
      el.innerHTML = '<span style="background:#1b1714;color:#f3e03b;padding:0 8px;margin-right:6px">我的檔案任務</span>' + q.q +
        '　你的檔案選手：<b style="color:#c8322a">' + q.a + '</b><br><span style="font-weight:500">' + line + '</span>' +
        ' <a href="https://tainan-cmse.github.io/archifile/#mission" style="color:#c8322a">看四箱護照 ›</a>';
      var w = document.querySelector('.wrap') || document.body;
      w.parentNode.insertBefore(el, w);
    },
    plan: function (o) { if (o === undefined) { try { return JSON.parse(get('archi_plan') || 'null'); } catch (e) { return null; } } set('archi_plan', JSON.stringify(o)); }
  };
})();
