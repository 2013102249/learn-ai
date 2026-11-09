/* ═══════════════════════════════════════════════════════════
   taste.js —— 专题篇章「审美工程」共用交互组件
   背景：本章多页反复用到「A/B 对决找茬」和「点选题」两种玩法，
   逐页手写会复制大量事件绑定代码并各自漂移。
   设计意图：只抽真正跨页复用的两个组件；页面独有的滑块、
   开关类演示留在各页 <script> 里，避免过度抽象。
   约束：依赖 taste.css 的 .duel / .quiz-* 类名；
   必须在 DOM 就绪后调用（各页脚本置于 </main> 之后天然满足）。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 判词与标签走 i18n，否则英韩译文页一交互就冒出中文。
     i18n.js 未加载时按中文兜底，与 build.js / lesson.js 同一套口径。 */
  function T(key, zh) {
    var i18n = window.XUEAI_I18N;
    return i18n ? i18n.t(key) : zh;
  }

  /* A/B 对决：两块内容选出更好的那块。
     背景：识别美的教学模式是「先动手判断，再听理论」（沿用 zero-3 找茬），
     本章四个抓手页每页至少一局。
     设计意图：答案揭晓后不锁死页面，双方标签换成「更好/欠佳」并给判词，
     选错也给判词但语气区分——教学目标是看懂差异，不是考倒读者。
     约束：cfg.winner 为更好一侧的索引（0 左 1 右）；
     verdictWin / verdictMiss 支持 HTML；onDone 可选，用于页内进度统计。 */
  window.tasteDuel = function (rootId, cfg) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var duel = root.querySelector('.duel');
    var verdict = root.querySelector('.duel-verdict');
    var badge = root.querySelector('.toy-badge');
    var sides = duel.querySelectorAll('.duel-side');
    duel.addEventListener('click', function (e) {
      var side = e.target.closest('.duel-side');
      if (!side || duel.classList.contains('done')) return;
      var idx = Array.prototype.indexOf.call(sides, side);
      duel.classList.add('done');
      sides[cfg.winner].classList.add('win');
      sides[1 - cfg.winner].classList.add('lose');
      sides[cfg.winner].querySelector('.duel-tag').textContent = T('tasteBetter', '✓ 更好');
      sides[1 - cfg.winner].querySelector('.duel-tag').textContent = T('tasteWorse', '✗ 欠佳');
      var hit = idx === cfg.winner;
      verdict.className = 'duel-verdict show ' + (hit ? 'good' : 'miss');
      verdict.innerHTML = (hit
        ? T('tasteDuelHit', '<b>眼力不错。</b>')
        : T('tasteDuelMiss', '<b>这局看走眼了，正常，学完这节回来就能看出来。</b>')) + cfg.verdict;
      if (badge) { badge.textContent = T('tasteRevealed', '✓ 已揭晓'); badge.classList.add('solved'); }
      if (typeof cfg.onDone === 'function') cfg.onDone(hit);
    });
  };

  /* 点选题：多个选项挑一个对的。
     背景：审美词汇、提示词写法这类知识点，选一次比读三遍记得牢。
     设计意图：选错立即标红并给「为什么不对」，允许继续选直到命中，
     命中后整题锁定——试错本身就是教学过程。
     约束：容器内选项需带 data-k（0 起）；cfg.answer 为正确索引；
     cfg.why 数组给每个选项的判词，支持 HTML。 */
  window.tasteQuiz = function (rootId, cfg) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var fb = root.querySelector('.quiz-fb');
    var badge = root.querySelector('.toy-badge');
    root.addEventListener('click', function (e) {
      var opt = e.target.closest('.quiz-opt');
      if (!opt || root.classList.contains('done')) return;
      var k = +opt.dataset.k;
      if (k === cfg.answer) {
        root.classList.add('done');
        opt.classList.add('right');
        fb.className = 'quiz-fb show good';
        fb.innerHTML = T('tasteQuizRight', '<b>对。</b>') + cfg.why[k];
        if (badge) { badge.textContent = T('tasteSolved', '✓ 已解决'); badge.classList.add('solved'); }
        if (typeof cfg.onDone === 'function') cfg.onDone();
      } else if (!opt.classList.contains('wrong')) {
        opt.classList.add('wrong');
        fb.className = 'quiz-fb show miss';
        fb.innerHTML = cfg.why[k] + T('tasteQuizRetry', ' 再挑一个。');
      }
    });
  };
})();


/* ─────────────────────────────────────────────────────────────
   镜像站点定制层（幂等）：课程免登录 + 隐藏扫码关注
   注入到各共享脚本尾部；任一脚本被页面加载即生效，iframe 内同样生效
   ───────────────────────────────────────────────────────────── */
;(function () {
  if (window.__XA_MIRROR_FREE__) return;
  window.__XA_MIRROR_FREE__ = 1;
  var CSS_ID = 'xa-mirror-free-css';
  var RULES = "/* ── 镜像站点定制：隐藏扫码关注 / 二维码 / 登录与右上角操作栏 ── */\n.qr-bar,.sidebar-qr,#partnerSidebarSlot,.qr-section,.qr-chan,.qr-hint,\n.gongyi-qr,.gongyi-qrcap,.gongyi-qrsub,\nimg[alt*=\"二维码\"],img[alt*=\"QR\"],[class*=\"qrcode\"],[id*=\"qrcode\"],\n.xa-group,.xa-slot,.xa-login-btn,.xa-account-btn,.xa-account-menu,\n.xa-scrim,.xa-modal,.xa-gate,.xa-note,#xueai-sp-overlay\n{display:none!important;visibility:hidden!important;}\n/* 右上角整排按钮：分享 / 主题 / 语言 / 伴学计划 / 交流群 / 账号 */\n#shareLesson,.share-lesson-btn,#themeBtn,.theme-btn,#langSwitcher,\n.lang-switcher,.lang-dd,#lang-switcher,#authSlot,.xa-group,.xa-slot\n{display:none!important;}\n/* 登录墙兜底：即便 xa-locked 被再次加上，正文仍保持可见 */\nhtml.xa-locked .paywall-locked:not(.xa-peek){display:block!important;}\nhtml.xa-locked .xa-peek{max-height:none!important;overflow:visible!important;\n-webkit-mask-image:none!important;mask-image:none!important;\npointer-events:auto!important;user-select:auto!important;}\n.lesson-item.locked::after,.lesson-item.locked .lock-ico{display:none!important;}";
  function injectCss() {
    if (document.getElementById(CSS_ID)) return;
    var st = document.createElement('style');
    st.id = CSS_ID;
    st.textContent = RULES;
    (document.head || document.documentElement).appendChild(st);
  }
  function unlock() {
    try { localStorage.setItem('xa_auth', '1'); } catch (e) {}
    var h = document.documentElement;
    if (h && h.classList && h.classList.contains('xa-locked')) h.classList.remove('xa-locked');
  }
  function sweep() {
    injectCss();
    unlock();
    try {
      var locks = document.querySelectorAll('.lesson-item.locked');
      Array.prototype.forEach.call(locks, function (el) {
        el.classList.remove('locked');
        el.removeAttribute('title');
      });
    } catch (e) {}
  }
  sweep();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sweep);
  window.addEventListener('load', sweep);
  if (window.MutationObserver) {
    try {
      new MutationObserver(function () { unlock(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {}
  }
  var n = 0;
  var timer = setInterval(function () { sweep(); if (++n > 25) clearInterval(timer); }, 800);
})();
