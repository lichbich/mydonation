
fetch('https://fdown.net/download.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
  },
  body: 'URLz=' + encodeURIComponent('https://www.facebook.com/reel/1868777077090574')
}).then(r => r.text()).then(t => console.log(t.includes('hdlink'), t.length)).catch(console.error);
