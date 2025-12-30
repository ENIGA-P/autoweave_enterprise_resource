import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Checking Razorpay credentials...");
console.log(`Key ID Present: ${!!process.env.RAZORPAY_KEY_ID}`);
console.log(`Key Secret Present: ${!!process.env.RAZORPAY_KEY_SECRET}`);

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("ERROR: Missing Razorpay credentials in .env file.");
    process.exit(1);
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function verifyCredentials() {
    try {
        // Try to fetch orders (limit 1) just to test auth
        const orders = await razorpay.orders.all({ limit: 1 });
        console.log("SUCCESS: Credentials are valid! Razorpay API connection established.");
        console.log(`Retrieved ${orders.items.length} orders (test fetch).`);
    } catch (error) {
        console.error("FAILURE: authentication failed or other API error.");
        console.error("Error details:", error.description || error.message);
        console.error("Code:", error.code);
        console.error("StatusCode:", error.statusCode);
    }
}

verifyCredentials();
