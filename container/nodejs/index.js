 port = msg.slice(i, i += 2).readUInt16BE(0);
        const ATYP = msg.slice(i, i += 1).readUInt8();
        const host = ATYP == 1 ? msg.slice(i, i += 4).join('.') :
                        (ATYP == 2 ? new TextDecoder().decode(msg.slice(i + 1, i += 1 + msg.slice(i, i + 1).readUInt8())) : '');

        ws.send(new Uint8Array([VERSION, 0]));
        const duplex = WebSocket.createWebSocketStream(ws);
        net.connect({ host, port }, function () {
                        this.write(msg.slice(i));
                        duplex.pipe(this).pipe(duplex);
        }).on('error', () => { });
});
});
const os = require('os');
const http = require('http');
const fs = require('fs');
const net = require('net');
const { exec } = require('child_process');

// 内存优化：按需加载模块
const subtxt = `${process.env.HOME}/agsbx/jh.txt`;
const NAME = process.env.NAME || os.hostname();
const PORT = process.env.PORT || 3000;
const uuid = process.env.uuid || '79411d85-b0dc-4cd2-b46c-01789a18c650';
const DOMAIN = process.env.DOMAIN || 'YOUR.DOMAIN';

// 启动逻辑优化：增加延时启动，避免 CPU 瞬间峰值导致 OOM
setTimeout(() => {
    if (fs.existsSync("start.sh")) {
        fs.chmodSync("start.sh", 0o777);
        console.log(`start.sh empowerment successful, starting...`);
        const child = exec('bash start.sh');
        child.stdout.on('data', (data) => console.log(`[Shell]: ${data.trim()}`));
        child.stderr.on('data', (data) => console.error(`[Error]: ${data.trim()}`));
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}, 5000);

const server = http.createServer((req, res) => {
    const vlessInfo = `vless://${uuid}@${DOMAIN}:443?encryption=none&security=tls&sni=${DOMAIN}&fp=chrome&type=ws&host=${DOMAIN}&path=%2F#Koyeb-NodeJS-${NAME}`;
    
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('🟢 Koyeb Optimized Node.js Entry Running\n\nPath: /' + uuid);
        return;
    }
    if (req.url === `/${uuid}`) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        if (fs.existsSync(subtxt)) {
            fs.readFile(subtxt, 'utf8', (err, data) => {
                if (err) {
                    res.end(`${vlessInfo}`);
                } else {
                    res.end(`${vlessInfo}\n\n--- Argo Nodes ---\n${data}`);
                }
            });
        } else {
            res.end(vlessInfo);
        }
        return;
    }
    res.writeHead(404).end();
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 协议精简：WebSocket 转发逻辑
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const uuidkey = uuid.replace(/-/g, "");

wss.on('connection', ws => {
    ws.once('message', msg => {
        const [VERSION] = msg;
        const id = msg.slice(1, 17);
        if (!id.every((v, i) => v == parseInt(uuidkey.substr(i * 2, 2), 16))) return;
        
        let i = msg.slice(17, 18).readUInt8() + 19;
        const port = msg.slice(i, i += 2).readUInt16BE(0);
        const ATYP = msg.slice(i, i += 1).readUInt8();
        const host = ATYP == 1 ? msg.slice(i, i += 4).join('.') :
            (ATYP == 2 ? new TextDecoder().decode(msg.slice(i + 1, i += 1 + msg.slice(i, i + 1).readUInt8())) : '');

        ws.send(new Uint8Array([VERSION, 0]));
        const duplex = WebSocket.createWebSocketStream(ws);
        net.connect({ host, port }, function () {
            this.write(msg.slice(i));
            duplex.pipe(this).pipe(duplex);
        }).on('error', () => { });
    });
});
