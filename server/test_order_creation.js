import axios from 'axios';

async function testCreateOrder() {
    try {
        // First, get a worker
        const workersResponse = await axios.get('http://localhost:5000/api/workers');
        const workers = workersResponse.data;

        if (workers.length === 0) {
            console.log("No workers found. Please add a worker first.");
            return;
        }

        const worker = workers[0];
        console.log(`Testing order creation for worker: ${worker.name} (ID: ${worker._id})`);
        console.log(`Total salary due: Rs ${worker.totalSalary || 0}`);

        if (!worker.totalSalary || worker.totalSalary <= 0) {
            console.log("Worker has no pending salary. Add some shifts first.");
            return;
        }

        // Try to create an order
        console.log("\nAttempting to create Razorpay order...");
        const orderResponse = await axios.post(`http://localhost:5000/api/workers/${worker._id}/create-order`);

        console.log("\n✅ SUCCESS! Order created:");
        console.log(JSON.stringify(orderResponse.data, null, 2));

    } catch (error) {
        console.log("\n❌ FAILED! Error details:");
        console.log("Status:", error.response?.status);
        console.log("Message:", error.response?.data?.message);
        console.log("Details:", error.response?.data?.details);
        console.log("Full response:", JSON.stringify(error.response?.data, null, 2));
    }
}

testCreateOrder();
