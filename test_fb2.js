
fetch('https://mbasic.facebook.com/reel/1868777077090574', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36'
  }
}).then(r => r.text()).then(t => console.log(t.substring(0, 500), t.length, t.includes('video'))).catch(console.error);
