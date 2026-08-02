/* ------------------------------------------------------------------
   Sunny Home Loans — shared site behavior
   Every page includes, in this order:
     <div id="site-header"></div>
     ...page content...
     <div id="site-modal"></div>   (landing pages & blog posts only)
     <div id="site-footer"></div>
     <script src="/assets/site.js"></script>
   Landing pages set window.LEAD_FORM = { action, loanType } BEFORE this script tag.
------------------------------------------------------------------- */

async function loadPartial(elementId, path) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load ' + path);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error('Partial load error:', err);
  }
}

async function initSite() {
  await Promise.all([
    loadPartial('site-header', '/header.html'),
    document.getElementById('site-modal') ? loadPartial('site-modal', '/modal.html') : Promise.resolve(),
    loadPartial('site-footer', '/footer.html')
  ]);

  setupNav();
  setupModalForm();
}

document.addEventListener('DOMContentLoaded', initSite);

/* ---------- Nav: hide anchor links that don't exist on this page,
   and make the CTA open the modal instead of scrolling on pages
   that have no #contact section ---------- */
function setupNav() {
  document.querySelectorAll('[data-anchor="true"]').forEach(link => {
    const targetId = link.getAttribute('href');
    if (!document.querySelector(targetId)) link.style.display = 'none';
  });

  const navCta = document.querySelector('[data-scroll-cta="true"]');
  if (navCta && !document.querySelector('#contact')) {
    navCta.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  }

  const hamburger = document.getElementById('hamburgerToggle');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.getElementById('navList').classList.toggle('open');
    });
  }
}

/* ---------- Modal ---------- */
function openModal(loanType) {
  const modal = document.getElementById('appModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const cfg = window.LEAD_FORM || {};
  const preselect = loanType || cfg.loanType;
  if (preselect) {
    const sel = document.getElementById('f-type');
    if (sel) {
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === preselect) { sel.selectedIndex = i; break; }
      }
    }
  }
  const formWrap = document.getElementById('formWrap');
  const formSuccess = document.getElementById('formSuccess');
  if (formWrap) formWrap.style.display = 'block';
  if (formSuccess) formSuccess.style.display = 'none';
}

function closeModal() {
  const modal = document.getElementById('appModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', function (e) {
  const overlay = document.getElementById('appModal');
  if (overlay && e.target === overlay) closeModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

/* Wires up the modal's form submit once the modal partial has loaded */
function setupModalForm() {
  const form = document.getElementById('appForm');
  if (!form) return;

  const cfg = window.LEAD_FORM || {};
  const action = cfg.action; // e.g. "https://formspree.io/f/xeewndrb" — set per page

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!action) {
      console.error('window.LEAD_FORM.action is not set for this page.');
      return;
    }
    const btn = document.getElementById('submitBtn');
    const errEl = document.getElementById('formError');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    errEl.classList.remove('visible');

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        document.getElementById('formWrap').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      errEl.classList.add('visible');
      btn.disabled = false;
      btn.textContent = 'Send My Inquiry to Harout →';
    }
  });
}

/* ---------- FAQ accordion ---------- */
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  item.parentElement.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
