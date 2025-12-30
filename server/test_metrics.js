
import http from 'http';

const updateData = JSON.stringify({
    activeMachines: 123,
    efficiency: 99
});

const putOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/metrics',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': updateData.length
    }
};

const req = http.request(putOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('PUT Response:', body);

        // Now GET to verify persistence
        http.get('http://localhost:5000/api/metrics', (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log('GET Response:', body);
            });
        });
    });
});

req.write(updateData);
req.end();
