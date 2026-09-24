const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle Image Upload Endpoint: POST /api/upload
    if (req.method === 'POST' && req.url === '/api/upload') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(body);
            const contentType = req.headers['content-type'] || '';

            let fileName = `image_${Date.now()}.png`;
            let fileData = null;

            if (contentType.includes('multipart/form-data')) {
                const boundary = contentType.split('boundary=')[1];
                if (boundary) {
                    const parts = buffer.toString('binary').split('--' + boundary);
                    for (const part of parts) {
                        if (part.includes('filename=')) {
                            const match = part.match(/filename="([^"]+)"/);
                            if (match && match[1]) {
                                fileName = `${Date.now()}_${path.basename(match[1])}`;
                            }
                            const headerEndIndex = part.indexOf('\r\n\r\n');
                            if (headerEndIndex !== -1) {
                                const rawBody = part.substring(headerEndIndex + 4, part.lastIndexOf('\r\n'));
                                fileData = Buffer.from(rawBody, 'binary');
                                break;
                            }
                        }
                    }
                }
            }

            if (!fileData) {
                fileData = buffer;
            }

            const filePath = path.join(UPLOADS_DIR, fileName);
            fs.writeFile(filePath, fileData, err => {
                if (err) {
                    console.error('[Server Error]', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                    return;
                }
                const fileUrl = `/uploads/${fileName}`;
                console.log(`[Server Upload] File saved to: ${filePath}`);
                console.log(`[Server Upload] Returning image URL: ${fileUrl}`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    url: fileUrl,
                    location: fileUrl,
                    link: fileUrl
                }));
            });
        });
        return;
    }

    // Serve static files
    let rawPath = req.url === '/' ? '/RichEditor — Quill-powered.html' : req.url;
    let filePath = path.join(__dirname, decodeURIComponent(rawPath));

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`-----------------------------------------------------`);
    console.log(`RichEditor Server is running at http://localhost:${PORT}/`);
    console.log(`Image Upload API Endpoint: http://localhost:${PORT}/api/upload`);
    console.log(`-----------------------------------------------------`);
});
