import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Machine from '../models/Machine.js';
import Production from '../models/Production.js';
import Order from '../models/Order.js';
import Worker from '../models/Worker.js';

class PDFGenerator {
    constructor() {
        this.reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    async generateReport(reportType, startDate, endDate) {
        const fileName = `${reportType}_${startDate}_to_${endDate}_${Date.now()}.pdf`;
        const filePath = path.join(this.reportsDir, fileName);

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add header
        this.addHeader(doc, reportType, startDate, endDate);

        // Generate content based on report type
        switch (reportType) {
            case 'production':
                await this.generateProductionReport(doc, startDate, endDate);
                break;
            case 'efficiency':
                await this.generateEfficiencyReport(doc, startDate, endDate);
                break;
            case 'defects':
                await this.generateDefectsReport(doc, startDate, endDate);
                break;
            case 'orders':
                await this.generateOrdersReport(doc, startDate, endDate);
                break;
            case 'worker_attendance':
                await this.generateWorkerAttendanceReport(doc, startDate, endDate);
                break;
        }

        doc.end();

        return new Promise((resolve, reject) => {
            stream.on('finish', () => {
                const stats = fs.statSync(filePath);
                resolve({ fileName, filePath, fileSize: stats.size });
            });
            stream.on('error', reject);
        });
    }

    addHeader(doc, reportType, startDate, endDate) {
        const reportTitles = {
            production: 'Daily Production Report',
            efficiency: 'Machine Efficiency Analysis',
            defects: 'Defect Rate Summary',
            orders: 'Order Fulfillment Status',
            worker_attendance: 'Worker Attendance Report'
        };

        doc.fontSize(20).font('Helvetica-Bold').text('AutoWeave ERP', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(16).text(reportTitles[reportType], { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').text(`Period: ${startDate} to ${endDate}`, { align: 'center' });
        doc.fontSize(8).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);
    }

    async generateProductionReport(doc, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const productions = await Production.find({
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        if (productions.length === 0) {
            doc.fontSize(12).text('No production data available for the selected period.', { align: 'center' });
            return;
        }

        // Summary statistics
        const totalOutput = productions.reduce((sum, p) => sum + p.output, 0);
        const totalDefects = productions.reduce((sum, p) => sum + p.defects, 0);
        const defectRate = totalOutput > 0 ? ((totalDefects / totalOutput) * 100).toFixed(2) : 0;

        doc.fontSize(12).font('Helvetica-Bold').text('Summary Statistics');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total Output: ${totalOutput} meters`);
        doc.text(`Total Defects: ${totalDefects}`);
        doc.text(`Defect Rate: ${defectRate}%`);
        doc.text(`Number of Records: ${productions.length}`);
        doc.moveDown(1);

        // Table header
        doc.fontSize(12).font('Helvetica-Bold').text('Production Details');
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const colWidths = { date: 100, machine: 120, output: 80, defects: 80, rate: 80 };
        let yPos = tableTop;

        // Draw table header
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Date', 50, yPos, { width: colWidths.date });
        doc.text('Machine ID', 150, yPos, { width: colWidths.machine });
        doc.text('Output (m)', 270, yPos, { width: colWidths.output });
        doc.text('Defects', 350, yPos, { width: colWidths.defects });
        doc.text('Defect %', 430, yPos, { width: colWidths.rate });
        yPos += 20;

        doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).stroke();

        // Draw table rows
        doc.font('Helvetica').fontSize(8);
        for (const prod of productions) {
            if (yPos > 700) {
                doc.addPage();
                yPos = 50;
            }

            const rate = prod.output > 0 ? ((prod.defects / prod.output) * 100).toFixed(1) : 0;
            const dateStr = new Date(prod.date).toLocaleDateString();

            doc.text(dateStr, 50, yPos, { width: colWidths.date });
            doc.text(prod.machineId, 150, yPos, { width: colWidths.machine });
            doc.text(prod.output.toString(), 270, yPos, { width: colWidths.output });
            doc.text(prod.defects.toString(), 350, yPos, { width: colWidths.defects });
            doc.text(`${rate}%`, 430, yPos, { width: colWidths.rate });
            yPos += 18;
        }
    }

    async generateEfficiencyReport(doc, startDate, endDate) {
        const machines = await Machine.find({});

        if (machines.length === 0) {
            doc.fontSize(12).text('No machine data available.', { align: 'center' });
            return;
        }

        // Summary
        const avgEfficiency = machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length;
        const runningMachines = machines.filter(m => m.status === 'running').length;

        doc.fontSize(12).font('Helvetica-Bold').text('Efficiency Summary');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total Machines: ${machines.length}`);
        doc.text(`Running Machines: ${runningMachines}`);
        doc.text(`Average Efficiency: ${avgEfficiency.toFixed(2)}%`);
        doc.moveDown(1);

        // Table
        doc.fontSize(12).font('Helvetica-Bold').text('Machine Details');
        doc.moveDown(0.5);

        let yPos = doc.y;
        const colWidths = { name: 120, status: 80, efficiency: 80, uptime: 80, power: 80 };

        // Header
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Machine', 50, yPos, { width: colWidths.name });
        doc.text('Status', 170, yPos, { width: colWidths.status });
        doc.text('Efficiency', 250, yPos, { width: colWidths.efficiency });
        doc.text('Uptime', 330, yPos, { width: colWidths.uptime });
        doc.text('Power (kW)', 410, yPos, { width: colWidths.power });
        yPos += 20;

        doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).stroke();

        // Rows
        doc.font('Helvetica').fontSize(8);
        for (const machine of machines) {
            if (yPos > 700) {
                doc.addPage();
                yPos = 50;
            }

            doc.text(machine.name, 50, yPos, { width: colWidths.name });
            doc.text(machine.status, 170, yPos, { width: colWidths.status });
            doc.text(`${machine.efficiency}%`, 250, yPos, { width: colWidths.efficiency });
            doc.text(machine.uptime, 330, yPos, { width: colWidths.uptime });
            doc.text(machine.powerConsumption.toString(), 410, yPos, { width: colWidths.power });
            yPos += 18;
        }
    }

    async generateDefectsReport(doc, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const productions = await Production.find({
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        if (productions.length === 0) {
            doc.fontSize(12).text('No defect data available for the selected period.', { align: 'center' });
            return;
        }

        const totalOutput = productions.reduce((sum, p) => sum + p.output, 0);
        const totalDefects = productions.reduce((sum, p) => sum + p.defects, 0);
        const avgDefectRate = totalOutput > 0 ? ((totalDefects / totalOutput) * 100).toFixed(2) : 0;

        doc.fontSize(12).font('Helvetica-Bold').text('Defect Summary');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total Production: ${totalOutput} meters`);
        doc.text(`Total Defects: ${totalDefects}`);
        doc.text(`Average Defect Rate: ${avgDefectRate}%`);
        doc.moveDown(1);

        // Group by machine
        const byMachine = {};
        for (const prod of productions) {
            if (!byMachine[prod.machineId]) {
                byMachine[prod.machineId] = { output: 0, defects: 0 };
            }
            byMachine[prod.machineId].output += prod.output;
            byMachine[prod.machineId].defects += prod.defects;
        }

        doc.fontSize(12).font('Helvetica-Bold').text('Defects by Machine');
        doc.moveDown(0.5);

        let yPos = doc.y;

        // Header
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Machine ID', 50, yPos, { width: 150 });
        doc.text('Output (m)', 200, yPos, { width: 100 });
        doc.text('Defects', 300, yPos, { width: 100 });
        doc.text('Defect Rate', 400, yPos, { width: 100 });
        yPos += 20;

        doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).stroke();

        // Rows
        doc.font('Helvetica').fontSize(8);
        for (const [machineId, data] of Object.entries(byMachine)) {
            if (yPos > 700) {
                doc.addPage();
                yPos = 50;
            }

            const rate = data.output > 0 ? ((data.defects / data.output) * 100).toFixed(2) : 0;

            doc.text(machineId, 50, yPos, { width: 150 });
            doc.text(data.output.toString(), 200, yPos, { width: 100 });
            doc.text(data.defects.toString(), 300, yPos, { width: 100 });
            doc.text(`${rate}%`, 400, yPos, { width: 100 });
            yPos += 18;
        }
    }

    async generateOrdersReport(doc, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end }
        }).sort({ createdAt: -1 });

        if (orders.length === 0) {
            doc.fontSize(12).text('No orders found for the selected period.', { align: 'center' });
            return;
        }

        // Summary
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        doc.fontSize(12).font('Helvetica-Bold').text('Order Summary');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total Orders: ${orders.length}`);
        for (const [status, count] of Object.entries(statusCounts)) {
            doc.text(`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`);
        }
        doc.moveDown(1);

        // Table
        doc.fontSize(12).font('Helvetica-Bold').text('Order Details');
        doc.moveDown(0.5);

        let yPos = doc.y;

        // Header
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Customer', 50, yPos, { width: 120 });
        doc.text('Product', 170, yPos, { width: 100 });
        doc.text('Quantity', 270, yPos, { width: 80 });
        doc.text('Deadline', 350, yPos, { width: 90 });
        doc.text('Status', 440, yPos, { width: 80 });
        yPos += 20;

        doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).stroke();

        // Rows
        doc.font('Helvetica').fontSize(8);
        for (const order of orders) {
            if (yPos > 700) {
                doc.addPage();
                yPos = 50;
            }

            const deadlineStr = order.deadline ? new Date(order.deadline).toLocaleDateString() : 'N/A';

            doc.text(order.customer, 50, yPos, { width: 120 });
            doc.text(order.product, 170, yPos, { width: 100 });
            doc.text(order.quantity, 270, yPos, { width: 80 });
            doc.text(deadlineStr, 350, yPos, { width: 90 });
            doc.text(order.status, 440, yPos, { width: 80 });
            yPos += 18;
        }
    }

    async generateWorkerAttendanceReport(doc, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Fetch all workers and their shifts
        // Note: Filter shifts within the date range in memory or via aggregate
        const workers = await Worker.find({});

        if (workers.length === 0) {
            doc.fontSize(12).text('No worker data found.', { align: 'center' });
            return;
        }

        // Process data
        const processedWorkers = workers.map(worker => {
            const relevantShifts = worker.shifts.filter(shift => {
                const shiftDate = new Date(shift.date);
                return shiftDate >= start && shiftDate <= end;
            });

            const totalShifts = relevantShifts.length;
            const totalHours = relevantShifts.reduce((sum, shift) => sum + (shift.hours || 0), 0);
            const totalPay = relevantShifts.reduce((sum, shift) => sum + shift.amount, 0);

            // Determine if active in period (optional threshold)
            return {
                name: worker.name,
                contact: worker.contact,
                totalShifts,
                totalHours,
                totalPay,
                shiftRate: worker.shiftRate
            };
        }).filter(w => w.totalShifts > 0 || true); // Keep even if 0 shifts? Maybe just those with shifts? Let's keep all for attendance report.

        const activeWorkers = processedWorkers.filter(w => w.totalShifts > 0);

        // Summary
        const totalShiftsOverall = activeWorkers.reduce((sum, w) => sum + w.totalShifts, 0);
        const totalPayout = activeWorkers.reduce((sum, w) => sum + w.totalPay, 0);

        doc.fontSize(12).font('Helvetica-Bold').text('Attendance Summary');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Total Active Workers: ${activeWorkers.length}`);
        doc.text(`Total Shifts Worked: ${totalShiftsOverall}`);
        doc.text(`Total Payout (Estimate): ₹${totalPayout}`);
        doc.moveDown(1);

        // Table
        doc.fontSize(12).font('Helvetica-Bold').text('Worker Details');
        doc.moveDown(0.5);

        let yPos = doc.y;

        // Header
        const colWidths = { name: 120, contact: 100, shifts: 80, hours: 80, amount: 100 };
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Worker Name', 50, yPos, { width: colWidths.name });
        doc.text('Contact', 170, yPos, { width: colWidths.contact });
        doc.text('Shifts', 270, yPos, { width: colWidths.shifts });
        doc.text('Total Hours', 350, yPos, { width: colWidths.hours });
        doc.text('Amount (₹)', 430, yPos, { width: colWidths.amount });
        yPos += 20;

        doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).stroke();

        // Rows
        doc.font('Helvetica').fontSize(8);
        for (const worker of processedWorkers) {
            if (yPos > 700) {
                doc.addPage();
                yPos = 50;
            }

            doc.text(worker.name, 50, yPos, { width: colWidths.name });
            doc.text(worker.contact, 170, yPos, { width: colWidths.contact });
            doc.text(worker.totalShifts.toString(), 270, yPos, { width: colWidths.shifts });
            doc.text(worker.totalHours.toString(), 350, yPos, { width: colWidths.hours });
            doc.text(worker.totalPay.toString(), 430, yPos, { width: colWidths.amount });
            yPos += 18;
        }
    }
}

export default new PDFGenerator();
