const http = require('http');
const net = require('net');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const uuid = (process.env.uuid || '79411d85-b0dc-4cd2-b46c-01789a18c650').replace(/-/g, "");

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🟢 Ultra Minimal Proxy Running');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.once('message', msg => {
        const [VERSION] = msg;
        const id = msg.slice(1, 17);
        if (!id.every((v, i) => v == parseInt(uuid.substr(i * 2, 2), 16))) return;
        
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

server.listen(PORT, () => console.log(`Proxy on port ${PORT}`));
