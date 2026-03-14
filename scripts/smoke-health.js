// Simple smoke test: fetch API health endpoint
const http = require('http');
const https = require('https');

function fetch(url){
  return new Promise((res, rej)=>{
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, r=>{
      let b=''; r.on('data', c=>b+=c); r.on('end', ()=>res({status: r.statusCode, body: b}));
    }).on('error', rej);
  });
}

(async ()=>{
  const host = process.env.BASE_URL || 'http://localhost:3000';
  try{
    const r = await fetch(host + '/api/health');
    console.log('status', r.status);
    console.log(r.body);
  }catch(e){ console.error('fetch failed', e); process.exit(2); }
})();
