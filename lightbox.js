// Otvaranje fotografije preko celog ekrana, sa strelicama i Esc.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('a.zoom'));
  if (!links.length) return;
  var box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Fotografija');
  box.hidden = true;
  box.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Zatvori">×</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Prethodna">‹</button>' +
    '<figure class="lb-fig"><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Sledeća">›</button>';
  document.body.appendChild(box);
  var img = box.querySelector('img'), cap = box.querySelector('figcaption');
  var i = 0, last = null;

  function show(n) {
    i = (n + links.length) % links.length;
    var a = links[i], t = a.querySelector('img');
    img.src = a.getAttribute('href');
    img.alt = t ? t.alt : '';
    cap.textContent = a.getAttribute('data-caption') || '';
  }
  function open(n) {
    last = document.activeElement;
    show(n);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
    if (last) last.focus();
  }
  links.forEach(function (a, n) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(n); });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(i - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(i + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(i - 1);
    else if (e.key === 'ArrowRight') show(i + 1);
  });
  // Ako se stigne linkom sa kontaktnog lista (#f-7068), otvori tu fotografiju.
  var h = location.hash.replace('#', '');
  if (h) links.forEach(function (a, n) { if (a.id === h) open(n); });
})();
