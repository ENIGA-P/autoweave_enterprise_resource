// import fetch from 'node-fetch'; // Using global fetch

async function testReportGeneration() {
    try {
        const payload = {
            reportType: 'worker_attendance',
            startDate: '2024-01-01',
            endDate: '2026-12-31',
            format: 'pdf'
        };

        console.log('Testing PDF generation...');
        const responsePdf = await fetch('http://localhost:5000/api/reports/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!responsePdf.ok) {
            const err = await responsePdf.text();
            throw new Error(`PDF Generation failed: ${responsePdf.status} ${err}`);
        }

        const dataPdf = await responsePdf.json();
        console.log('PDF Generation Success:', dataPdf);

        console.log('Testing Excel generation...');
        payload.format = 'excel';
        const responseExcel = await fetch('http://localhost:5000/api/reports/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!responseExcel.ok) {
            const err = await responseExcel.text();
            throw new Error(`Excel Generation failed: ${responseExcel.status} ${err}`);
        }

        const dataExcel = await responseExcel.json();
        console.log('Excel Generation Success:', dataExcel);

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testReportGeneration();
