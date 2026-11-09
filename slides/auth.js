/**
 * 镜像站点：免登录版本 —— 保留 window.XueaiAuth 接口供 learn.html / home.html
 * / challenge.js 调用，但不再请求 /auth/* 后端、不再渲染账号与登录入口。
 * isFree() 恒为 true，使侧栏所有章节都不显示锁标记。
 */
;(function () {
  var state = { loggedIn: false, nickname: '', avatarUrl: '' };
  window.XueaiAuth = {
    ready: Promise.resolve(state),
    get state() { return state; },
    isFree: function () { return true; },
    openLoginModal: function () {},
    goLogin: function () {},
    openGroupModal: function () {},
    mount: function (el) { if (el) { el.classList.add('xa-slot'); el.textContent = ''; } }
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
