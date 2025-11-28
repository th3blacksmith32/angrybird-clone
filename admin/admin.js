async function authHeader() {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

document.getElementById('btn-login').addEventListener('click', async () => {
  const res = await fetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@example.com', password: document.getElementById('admin-pass').value }) });
  const data = await res.json();
  if (data.token) { localStorage.setItem('adminToken', data.token); document.getElementById('dashboard').classList.remove('d-none'); }
});

document.getElementById('btn-refresh').addEventListener('click', async () => {
  const res = await fetch('/admin/users', { headers: { ...(await authHeader()) } });
  const data = await res.json();
  document.getElementById('users').innerText = JSON.stringify(data, null, 2);
});

document.getElementById('btn-send-ton').addEventListener('click', async () => {
  const body = { destinationWalletAddress: document.getElementById('ton-address').value, amount: Number(document.getElementById('ton-amount').value || 0) };
  await fetch('/admin/sendTon', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(await authHeader()) }, body: JSON.stringify(body) });
});
