document.getElementById('btn-login').addEventListener('click', async () => {
  const telegramId = Math.floor(Math.random() * 10000);
  const username = 'demo_user';
  const res = await fetch('/auth/telegramLogin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telegramId, username }) });
  const data = await res.json();
  document.body.insertAdjacentHTML('beforeend', `<p>Token: ${data.token}</p>`);
});
