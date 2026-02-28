
fetch('https://www.facebook.com/reel/1868777077090574', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}).then(r => r.text()).then(t => console.log(t.substring(0, 500), t.length, t.includes('playable_url_quality_hd'))).catch(console.error);
