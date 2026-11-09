/* ═══════════════════════════════════════════════════════════
   lesson.js —— 课程子页统一交互助手
   核心原则：内容随滚动自然展现，无需点击"下一步"。
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 滚动渐入：页面上所有 .reveal 元素进入视野时自动加 .show。
     无需任何配置，引入本文件即生效。 */
  function initReveal() {
    var els = document.querySelectorAll('.reveal:not(.show)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach ? els.forEach(function (el) { el.classList.add('show'); })
                  : Array.prototype.forEach.call(els, function (el) { el.classList.add('show'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('show');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* 进入视野触发一次回调（用于自动播放演示动画）。
     用法：lessonOnView(document.getElementById('demo'), function(){ playDemo(); }); */
  window.lessonOnView = function (el, cb, threshold) {
    if (!el || typeof cb !== 'function') return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.disconnect(); cb(); }
      });
    }, { threshold: typeof threshold === 'number' ? threshold : 0.35 });
    io.observe(el);
  };

  function initQrBar() {
    if (sessionStorage.getItem('qr_bar_closed')) return;
    var i18n = window.XUEAI_I18N;
    var qrText = i18n ? i18n.t('qrText') : '扫码关注 <b>洛小山</b> 公众号，获取更多 AI 实战干货';
    var closeLabel = i18n ? i18n.t('close') : '关闭';
    var bar = document.createElement('div');
    bar.className = 'qr-bar';
    bar.innerHTML = '<img src="images/brand/qrcode.jpg" alt="QR">'
      + '<span class="qr-text">' + qrText + '</span>'
      + '<button class="qr-close" aria-label="' + closeLabel + '">&times;</button>';
    document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector('.qr-close').addEventListener('click', function() {
      bar.remove();
      sessionStorage.setItem('qr_bar_closed', '1');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initReveal(); });
  } else {
    initReveal();
  }
})();


/* ─────────────────────────────────────────────────────────────
   镜像站点定制层（幂等）：课程免登录 + 隐藏扫码关注
   注入到各共享脚本尾部；任一脚本被页面加载即生效，iframe 内同样生效
   ───────────────────────────────────────────────────────────── */
;(function () {
  if (window.__XA_MIRROR_FREE__) return;
  window.__XA_MIRROR_FREE__ = 1;
  var CSS_ID = 'xa-mirror-free-css';
  var RULES = "/* ── 镜像站点定制：隐藏扫码关注 / 二维码 / 登录与右上角操作栏 ── */\n.qr-bar,.sidebar-qr,#partnerSidebarSlot,.qr-section,.qr-chan,.qr-hint,\n.gongyi-qr,.gongyi-qrcap,.gongyi-qrsub,\nimg[alt*=\"二维码\"],img[alt*=\"QR\"],[class*=\"qrcode\"],[id*=\"qrcode\"],\n.xa-group,.xa-slot,.xa-login-btn,.xa-account-btn,.xa-account-menu,\n.xa-scrim,.xa-modal,.xa-gate,.xa-note,#xueai-sp-overlay,\n.ch-entry,.ch-entry--cta,.ch-coin\n{display:none!important;visibility:hidden!important;}\n/* 右上角整排按钮：分享 / 主题 / 语言 / 伴学计划 / 交流群 / 账号 */\n#shareLesson,.share-lesson-btn,#themeBtn,.theme-btn,#langSwitcher,\n.lang-switcher,.lang-dd,#lang-switcher,#authSlot,.xa-group,.xa-slot\n{display:none!important;}\n/* 登录墙兜底：即便 xa-locked 被再次加上，正文仍保持可见 */\nhtml.xa-locked .paywall-locked:not(.xa-peek){display:block!important;}\nhtml.xa-locked .xa-peek{max-height:none!important;overflow:visible!important;\n-webkit-mask-image:none!important;mask-image:none!important;\npointer-events:auto!important;user-select:auto!important;}\n.lesson-item.locked::after,.lesson-item.locked .lock-ico{display:none!important;}";
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
