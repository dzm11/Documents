  // Theme toggle
  (function () {
    var btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  })();

  // Persistent checklist with progress counter
  (function () {
    var cbs = document.querySelectorAll('.checklist .cb');
    var progress = document.getElementById('cl-progress');
    var resetBtn = document.querySelector('[data-action="reset"]');
    if (!cbs.length) return;
    var total = cbs.length;

    function updateProgress() {
      var done = 0;
      cbs.forEach(function (cb) { if (cb.checked) done++; });
      if (progress) {
        progress.innerHTML = '<strong>' + done + '</strong> / ' + total + ' ready';
      }
    }

    // restore state
    cbs.forEach(function (cb) {
      var key = cb.getAttribute('data-key');
      try {
        if (localStorage.getItem(key) === '1') cb.checked = true;
      } catch (e) {}
      cb.addEventListener('change', function () {
        try {
          localStorage.setItem(key, cb.checked ? '1' : '0');
        } catch (e) {}
        updateProgress();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        cbs.forEach(function (cb) {
          cb.checked = false;
          try { localStorage.removeItem(cb.getAttribute('data-key')); } catch (e) {}
        });
        updateProgress();
      });
    }

    updateProgress();
  })();

  // Active-section highlighting in TOC
  (function () {
    var links = document.querySelectorAll('.toc a[href^="#"]');
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var t = document.getElementById(id);
      if (t) map[id] = a;
    });
    if (!('IntersectionObserver' in window)) return;
    var current = null;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (current) current.classList.remove('active');
          current = map[e.target.id];
          if (current) current.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  })();
