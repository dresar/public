// Interaksi halaman undangan: buka sampul, musik, countdown, reveal, lightbox, salin
(function () {
  'use strict';

  var cover = document.getElementById('cover');
  var content = document.getElementById('content');
  var openBtn = document.getElementById('openBtn');
  var musicBtn = document.getElementById('musicBtn');
  var music = document.getElementById('music');
  var qs = new URLSearchParams(location.search);
  var storageKey = 'undangan-opened:' + location.pathname;

  function revealInit() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  }

  function startMusic() {
    if (!music) return;
    musicBtn.hidden = false;
    music.play().then(function () {
      musicBtn.classList.add('playing');
    }).catch(function () { /* autoplay diblokir browser */ });
  }

  function openInvitation(withMusic) {
    if (!cover) return;
    cover.classList.add('open');
    content.hidden = false;
    try { sessionStorage.setItem(storageKey, '1'); } catch (e) {}
    if (withMusic) startMusic();
    revealInit();
  }

  if (openBtn) {
    openBtn.addEventListener('click', function () { openInvitation(true); });
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', function () {
      if (!music) return;
      if (music.paused) {
        music.play().then(function () { musicBtn.classList.add('playing'); }).catch(function () {});
      } else {
        music.pause();
        musicBtn.classList.remove('playing');
      }
    });
  }

  // Tamu yang sudah pernah membuka (mis. setelah kirim RSVP) langsung masuk — musik via tombol.
  var alreadyOpened = false;
  try { alreadyOpened = sessionStorage.getItem(storageKey) === '1'; } catch (e) {}
  if (alreadyOpened && cover && !qs.get('page')) {
    cover.classList.add('open');
    content.hidden = false;
    if (music) musicBtn.hidden = false;
    revealInit();
  }

  // Countdown menuju hari-H
  var cd = document.getElementById('countdown');
  if (cd) {
    var target = new Date(cd.dataset.target).getTime();
    var el = {
      d: document.getElementById('cd-d'), h: document.getElementById('cd-h'),
      m: document.getElementById('cd-m'), s: document.getElementById('cd-s')
    };
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        el.d.textContent = '0'; el.h.textContent = '00'; el.m.textContent = '00'; el.s.textContent = '00';
        return;
      }
      el.d.textContent = String(Math.floor(diff / 86400000));
      el.h.textContent = pad(Math.floor(diff / 3600000) % 24);
      el.m.textContent = pad(Math.floor(diff / 60000) % 60);
      el.s.textContent = pad(Math.floor(diff / 1000) % 60);
      setTimeout(tick, 1000);
    };
    tick();
  }

  // Lightbox galeri
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('[data-lightbox]').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightbox.hidden = false;
    });
  });
  if (lightbox) {
    lightbox.addEventListener('click', function () { lightbox.hidden = true; });
  }

  // Tombol salin nomor rekening / alamat
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.dataset.copy;
      var done = function () {
        var old = btn.innerHTML;
        btn.innerHTML = '✓ Tersalin';
        setTimeout(function () { btn.innerHTML = old; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text); done();
        });
      } else {
        fallbackCopy(text); done();
      }
    });
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
  }
})();
