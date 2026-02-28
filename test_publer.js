
fetch('https://publer.io/api/v1/media/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0'
  },
  body: JSON.stringify({ url: 'https://www.facebook.com/reel/1868777077090574' })
}).then(r => r.json()).then(console.log).catch(console.error);
