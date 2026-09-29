const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const fmt = n => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
const items = [{ n: 'Adire throw pillow', p: 18500, q: 1 }, { n: 'Ankara tote bag', p: 24000, q: 1 }, { n: 'Shea butter set', p: 9800, q: 2 }];
const SHIP = 1500; let method = 'card', paying = false, total = 0;
const rev = [212, 248, 190, 265, 301, 278, 240, 322, 355, 310, 288, 341, 379, 300].map(x => x * 1000);
const stats = { orders: 58, card: 36, bank: 22, visits: 4200, cart: 310, checkout: 96 };
const last = v => v[v.length - 1];

function renderCart() {
    $('#items').innerHTML = items.map((it, i) => `<li><div><b>${it.n}</b><span>${fmt(it.p)}</span></div><div class="qty"><button aria-label="Remove one ${it.n}" data-i="${i}" data-d="-1">−</button><output aria-label="Quantity">${it.q}</output><button aria-label="Add one ${it.n}" data-i="${i}" data-d="1">+</button></div></li>`).join('');
    const sub = items.reduce((a, x) => a + x.p * x.q, 0), ship = sub ? SHIP : 0, t = sub + ship;
    $('#sub').textContent = fmt(sub); $('#ship').textContent = fmt(ship);
    const el = $('#total'); el.textContent = fmt(t); if (t !== total) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump') }
    total = t; const b = $('#pay'); b.disabled = !t || paying; b.textContent = t ? 'Pay ' + fmt(t) : 'Your cart is empty';
}
$('#items').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const it = items[b.dataset.i]; it.q = Math.max(0, it.q + +b.dataset.d); if (!it.q) items.splice(b.dataset.i, 1); renderCart() });

// tabs
function show(v) { $('#v1').classList.toggle('hide', v !== 1); $('#v2').classList.toggle('hide', v !== 2); $('#t1').setAttribute('aria-selected', v === 1); $('#t2').setAttribute('aria-selected', v === 2); if (v === 2) renderDash() }
$('#t1').onclick = () => show(1); $('#t2').onclick = () => show(2);
$$('.seg button').forEach(b => b.onclick = () => { method = b.dataset.m; $$('.seg button').forEach(x => x.setAttribute('aria-selected', x === b)); $('#cardBox').classList.toggle('hide', method !== 'card'); $('#bankBox').classList.toggle('hide', method !== 'bank') });

// live card preview + formatting
const num = $('#num'), exp = $('#exp'), cvv = $('#cvv'), c3d = $('#c3d');
num.oninput = () => { let d = num.value.replace(/\D/g, '').slice(0, 16); num.value = d.replace(/(.{4})/g, '$1 ').trim(); $('#pNum').textContent = (d.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim()); $('#brand').textContent = d[0] === '4' ? 'Visa' : d[0] === '5' ? 'Mastercard' : 'Card' };
exp.oninput = () => { let d = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; $('#pExp').textContent = exp.value || 'MM/YY' };
cvv.oninput = () => { cvv.value = cvv.value.replace(/\D/g, '').slice(0, 3); $('#pCvv').textContent = cvv.value.padEnd(3, '•') };
$('#name').oninput = e => $('#pName').textContent = e.target.value.toUpperCase() || 'FULL NAME';
cvv.onfocus = () => c3d.classList.add('flip'); cvv.onblur = () => c3d.classList.remove('flip');

// validation
const luhn = s => { let sum = 0, alt = false; for (let i = s.length - 1; i >= 0; i--) { let n = +s[i]; if (alt) { n *= 2; if (n > 9) n -= 9 } sum += n; alt = !alt } return sum % 10 === 0 };
const rules = {
    email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? '' : 'Enter an email like name@example.com.',
    name: v => v.trim().length >= 3 ? '' : 'Enter the name on your card.',
    num: v => { const d = v.replace(/\D/g, ''); return d.length === 16 && luhn(d) ? '' : 'Check your card number. It should be 16 digits.' },
    exp: v => { const m = +v.slice(0, 2), y = +v.slice(3); const now = new Date(), cy = now.getFullYear() % 100, cm = now.getMonth() + 1; return /^\d\d\/\d\d$/.test(v) && m >= 1 && m <= 12 && (y > cy || (y === cy && m >= cm)) ? '' : 'Enter a future date as MM/YY.' },
    cvv: v => v.length === 3 ? '' : 'Enter the 3 digits on the back.'
}
function check(id) { const i = $('#' + id), m = rules[id](i.value); i.setAttribute('aria-invalid', !!m); $(`[data-e=${id}]`).textContent = m; return !m }
Object.keys(rules).forEach(id => $('#' + id).addEventListener('blur', () => check(id)));

// pay
$('#pay').onclick = () => {
    const ids = method === 'card' ? ['email', 'name', 'num', 'exp', 'cvv'] : ['email', 'name'];
    const bad = ids.filter(id => !check(id)); if (bad.length) { $('#' + bad[0]).focus(); return }
    paying = true; const b = $('#pay'); b.disabled = true; b.innerHTML = '<span class="spin"></span> Processing…';
    setTimeout(() => {
        rev[rev.length - 1] += total; stats.orders++; stats[method]++; stats.checkout++;
        const ref = 'KC-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        $('#formArea').innerHTML = `<div class="done"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" pathLength="1"/><path d="M26 43l11 11 21-23" pathLength="1"/></svg><h2 style="margin-top:12px">Payment received</h2><p style="color:var(--mute)">${fmt(total)} paid by ${method === 'card' ? 'card' : 'bank transfer'}. Order ${ref}.</p><button class="pay" style="max-width:280px;margin:16px auto 0" id="seeDash">See it on the dashboard</button></div>`;
        $('#seeDash').onclick = () => show(2); paying = false; items.length = 0; renderCart();
    }, 1600);
};

// dashboard
function renderDash() {
    const sum = rev.reduce((a, b) => a + b, 0), conv = (stats.orders / stats.visits * 100).toFixed(1);
    $('#kpis').innerHTML = [['Revenue (14 days)', fmt(sum)], ['Orders', stats.orders], ['Conversion', conv + '%'], ['Average order', fmt(Math.round(sum / stats.orders))]].map(k => `<div class="kpi"><small>${k[0]}</small><b>${k[1]}</b></div>`).join('');
    const W = 600, H = 220, P = 28, max = Math.max(...rev) * 1.1, x = i => P + i * (W - 2 * P) / (rev.length - 1), y = v => H - P - (v / max) * (H - 2 * P);
    const pts = rev.map((v, i) => [x(i), y(v)]), d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const day = i => { const t = new Date(); t.setDate(t.getDate() - (rev.length - 1 - i)); return t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) };
    $('#chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart of daily revenue over 14 days">
 ${[0, .5, 1].map(f => `<line x1="${P}" x2="${W - P}" y1="${y(max / 1.1 * f)}" y2="${y(max / 1.1 * f)}" stroke="var(--line)"/><text class="axis" x="0" y="${y(max / 1.1 * f) + 4}">${Math.round(max / 1.1 * f / 1000)}k</text>`).join('')}
 <path class="area" d="${d} L${x(rev.length - 1)} ${H - P} L${x(0)} ${H - P}Z"/><path class="line" pathLength="1" d="${d}"/>
 ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="var(--card)" stroke="var(--teal)" stroke-width="2"><title>${day(i)}: ${fmt(rev[i])}</title></circle>`).join('')}
 <text class="axis" x="${P}" y="${H - 6}">${day(0)}</text><text class="axis" x="${W - P}" y="${H - 6}" text-anchor="end">Today</text></svg>`;
    const tot = stats.card + stats.bank;
    $('#methods').innerHTML = [['Card', stats.card], ['Bank transfer', stats.bank]].map(m => `<div class="bar"><div><span>${m[0]}</span><b>${Math.round(m[1] / tot * 100)}%</b></div><div class="track"><div class="fill" data-w="${m[1] / tot * 100}" style="width:0"></div></div></div>`).join('');
    $('#funnel').innerHTML = [['Visited', stats.visits], ['Added to cart', stats.cart], ['Reached checkout', stats.checkout], ['Paid', stats.orders]].map((f, i) => `<div class="bar"><div><span>${f[0]}</span><b>${f[1].toLocaleString()}</b></div><div class="track"><div class="fill sun" data-w="${f[1] / stats.visits * 100}" style="width:0"></div></div></div>`).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => $$('.fill').forEach(f => f.style.width = f.dataset.w + '%')));
}
renderCart();