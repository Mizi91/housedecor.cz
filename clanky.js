
(function () {
  'use strict';
  var qs = function (sel, ctx) { return (ctx || document).querySelector(sel); };

  function moveArticlesUnderNewsletter() {
    var articles = qs('.homepage-blog-wrapper.row.blog-wrapper');
    var newsletter =
      qs('div.custom-footer__newsletter') ||
      qs('.custom-footer__newsletter.container');
    if (!articles || !newsletter) return false;             
    if (articles.dataset.moved === '1') return true;

    var wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper container moved-articles-wrapper';
    wrapper.appendChild(articles);
    newsletter.insertAdjacentElement('afterend', wrapper);
    articles.dataset.moved = '1';
    return true;
  }

  function bootstrap() {
    if (moveArticlesUnderNewsletter()) return;

    var tries = 0;
    var maxTries = 60;                 // ~12 s
    var timer = setInterval(function () {
      tries++;
      if (moveArticlesUnderNewsletter() || tries >= maxTries) {
        clearInterval(timer);
      }
    }, 200);

    var mo = new MutationObserver(function () {
      moveArticlesUnderNewsletter();
    });
    try {
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      console.warn('MutationObserver nelze spustit:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();