import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workers';

async function testWorkerFlow() {
    try {
        console.log('--- Starting Worker API Test ---');

        // 1. Create a worker
        console.log('1. Creating Worker...');
        const workerData = {
            name: 'John Doe',
            contact: '1234567890',
            shiftRate: 750
        };
        const createRes = await axios.post(API_URL, workerData);
        if (createRes.status !== 201) throw new Error('Failed to create worker');
        const workerId = createRes.data._id;
        console.log('Worker created:', createRes.data.name, 'ID:', workerId);

        // 2. Add a shift
        console.log('2. Adding Shift...');
        const shiftRes = await axios.post(`${API_URL}/${workerId}/shifts`);
        if (shiftRes.status !== 201) throw new Error('Failed to add shift');
        console.log('Shift added. Updated Worker:', shiftRes.data.shifts.length, 'shifts');

        // 3. Verify Salary
        console.log('3. Verifying Salary Calculation...');
        const listRes = await axios.get(API_URL);
        const worker = listRes.data.find(w => w._id === workerId);
        if (!worker) throw new Error('Worker not found in list');

        console.log('Worker Details from List:', worker);
        if (worker.totalSalary !== 750) throw new Error(`Expected salary 750, got ${worker.totalSalary}`);

        console.log('--- Test Passed ---');
    } catch (error) {
        console.error('--- Test Failed ---');
        console.error(error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

testWorkerFlow();
