import './build.mjs';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{
  try { const url=new URL(req.url,'http://localhost'); const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname)); if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;} const data=await readFile(file); res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data); } catch {res.writeHead(404);res.end('Not found');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port is in use. Set $env:PORT=3001 and try again.':error.message);process.exitCode=1;});
server.listen(Number(process.env.PORT||3000),()=>console.log(`Preview: http://localhost:${process.env.PORT||3000}`));
