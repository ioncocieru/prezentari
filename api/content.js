// Funcție Vercel: salvează/încarcă textele editate. Necesită o bază Upstash Redis (vezi CITESTE-ma.txt).
const URL_=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;
const TOK=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
const PASS=process.env.EDIT_PASSWORD||'ion123';
async function cmd(c){const r=await fetch(URL_,{method:'POST',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(c)});return (await r.json()).result}
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  try{
    const page=String((req.query||{}).page||'').replace(/[^A-Za-z0-9_-]/g,'');
    if(req.method==='POST'){
      const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
      if(b.password!==PASS)return res.status(401).json({error:'parola'});
      if(b.action==='check')return res.json({ok:1});
      if(!URL_)return res.status(503).json({error:'storage'});
      const p=String(b.page||page).replace(/[^A-Za-z0-9_-]/g,'');
      if(!p)return res.status(400).json({error:'page'});
      const s=JSON.stringify(b.data||{});
      if(s.length>900000)return res.status(413).json({error:'mare'});
      await cmd(['SET','prez:'+p,s]);return res.json({ok:1});
    }
    if(req.method==='GET'){
      if(!URL_)return res.status(503).json({error:'storage'});
      if(!page)return res.status(400).json({error:'page'});
      const v=await cmd(['GET','prez:'+page]);return res.json({data:v?JSON.parse(v):{}});
    }
    res.status(405).end();
  }catch(e){res.status(500).json({error:'server'})}
};
