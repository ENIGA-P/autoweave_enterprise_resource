import fs from 'fs';
import https from 'https';
import path from 'path';

const modelsDir = path.join(process.cwd(), 'public', 'models');

if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const files = [
    'ssd_mobilenetv1_model-weights_manifest.json',
    'ssd_mobilenetv1_model-shard1',
    'ssd_mobilenetv1_model-shard2',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_recognition_model-shard2'
];

async function downloadFile(filename) {
    const url = baseUrl + filename;
    const dest = path.join(modelsDir, filename);

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function downloadAll() {
    console.log('Downloading face-api.js models to public/models...');
    for (const file of files) {
        console.log(`Downloading ${file}...`);
        try {
            await downloadFile(file);
            console.log(`Downloaded ${file}`);
        } catch (e) {
            console.error(`Error downloading ${file}:`, e.message);
        }
    }
    console.log('Finished downloading models.');
}

downloadAll();
