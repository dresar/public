// Perilaku umum panel: sidebar mobile, konfirmasi hapus, tombol salin
document.addEventListener('DOMContentLoaded', () => {
  // Toggle sidebar di layar kecil
  document.querySelectorAll('[data-toggle-sidebar]').forEach((el) => {
    el.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
  });

  // Konfirmasi sebelum aksi hapus
  document.querySelectorAll('form[data-confirm]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      if (!window.confirm(form.dataset.confirm || 'Yakin ingin menghapus data ini?')) e.preventDefault();
    });
  });

  // Tombol salin (data-copy berisi teks yang disalin)
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const old = btn.innerHTML;
      btn.innerHTML = '✓ Tersalin';
      btn.classList.add('btn-success');
      setTimeout(() => { btn.innerHTML = old; btn.classList.remove('btn-success'); }, 1600);
    });
  });
});
