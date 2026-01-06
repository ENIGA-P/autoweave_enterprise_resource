import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import Machine from '../models/Machine.js';
import Production from '../models/Production.js';
import Order from '../models/Order.js';
import Worker from '../models/Worker.js';

class ExcelGenerator {
    constructor() {
        this.reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    async generateReport(reportType, startDate, endDate) {
        const fileName = `${reportType}_${startDate}_to_${endDate}_${Date.now()}.xlsx`;
        const filePath = path.join(this.reportsDir, fileName);

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'AutoWeave ERP';
        workbook.created = new Date();

        // Generate content based on report type
        switch (reportType) {
            case 'production':
                await this.generateProductionReport(workbook, startDate, endDate);
                break;
            case 'efficiency':
                await this.generateEfficiencyReport(workbook, startDate, endDate);
                break;
            case 'defects':
                await this.generateDefectsReport(workbook, startDate, endDate);
                break;
            case 'orders':
                await this.generateOrdersReport(workbook, startDate, endDate);
                break;
            case 'worker_attendance':
                await this.generateWorkerAttendanceReport(workbook, startDate, endDate);
                break;
        }

        await workbook.xlsx.writeFile(filePath);

        const stats = fs.statSync(filePath);
        return { fileName, filePath, fileSize: stats.size };
    }

    async generateProductionReport(workbook, startDate, endDate) {
        const worksheet = workbook.addWorksheet('Production Report');

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const productions = await Production.find({
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        // Title
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = 'Daily Production Report';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = `Period: ${startDate} to ${endDate}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Summary
        const totalOutput = productions.reduce((sum, p) => sum + p.output, 0);
        const totalDefects = productions.reduce((sum, p) => sum + p.defects, 0);
        const defectRate = totalOutput > 0 ? ((totalDefects / totalOutput) * 100).toFixed(2) : 0;

        worksheet.getCell('A4').value = 'Summary Statistics';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A5').value = 'Total Output (meters):';
        worksheet.getCell('B5').value = totalOutput;
        worksheet.getCell('A6').value = 'Total Defects:';
        worksheet.getCell('B6').value = totalDefects;
        worksheet.getCell('A7').value = 'Defect Rate (%):';
        worksheet.getCell('B7').value = parseFloat(defectRate);
        worksheet.getCell('A8').value = 'Number of Records:';
        worksheet.getCell('B8').value = productions.length;

        // Table headers
        const headerRow = worksheet.getRow(10);
        headerRow.values = ['Date', 'Machine ID', 'Output (meters)', 'Defects', 'Defect Rate (%)'];
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0F2F1' }
        };

        // Data rows
        productions.forEach((prod, index) => {
            const row = worksheet.getRow(11 + index);
            const rate = prod.output > 0 ? ((prod.defects / prod.output) * 100).toFixed(2) : 0;
            row.values = [
                new Date(prod.date).toLocaleDateString(),
                prod.machineId,
                prod.output,
                prod.defects,
                parseFloat(rate)
            ];
        });

        // Column widths
        worksheet.columns = [
            { width: 15 },
            { width: 20 },
            { width: 18 },
            { width: 12 },
            { width: 18 }
        ];
    }

    async generateEfficiencyReport(workbook, startDate, endDate) {
        const worksheet = workbook.addWorksheet('Efficiency Analysis');

        const machines = await Machine.find({});

        // Title
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').value = 'Machine Efficiency Analysis';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        worksheet.mergeCells('A2:F2');
        worksheet.getCell('A2').value = `Period: ${startDate} to ${endDate}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Summary
        const avgEfficiency = machines.length > 0
            ? machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length
            : 0;
        const runningMachines = machines.filter(m => m.status === 'running').length;

        worksheet.getCell('A4').value = 'Summary';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A5').value = 'Total Machines:';
        worksheet.getCell('B5').value = machines.length;
        worksheet.getCell('A6').value = 'Running Machines:';
        worksheet.getCell('B6').value = runningMachines;
        worksheet.getCell('A7').value = 'Average Efficiency (%):';
        worksheet.getCell('B7').value = parseFloat(avgEfficiency.toFixed(2));

        // Table headers
        const headerRow = worksheet.getRow(9);
        headerRow.values = ['Machine Name', 'Status', 'Efficiency (%)', 'Uptime', 'Power (kW)', 'Current Order'];
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE1BEE7' }
        };

        // Data rows
        machines.forEach((machine, index) => {
            const row = worksheet.getRow(10 + index);
            row.values = [
                machine.name,
                machine.status,
                machine.efficiency,
                machine.uptime,
                machine.powerConsumption,
                machine.currentOrder
            ];
        });

        // Column widths
        worksheet.columns = [
            { width: 20 },
            { width: 15 },
            { width: 15 },
            { width: 12 },
            { width: 12 },
            { width: 20 }
        ];
    }

    async generateDefectsReport(workbook, startDate, endDate) {
        const worksheet = workbook.addWorksheet('Defect Summary');

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const productions = await Production.find({
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        // Title
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').value = 'Defect Rate Summary';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        worksheet.mergeCells('A2:D2');
        worksheet.getCell('A2').value = `Period: ${startDate} to ${endDate}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Summary
        const totalOutput = productions.reduce((sum, p) => sum + p.output, 0);
        const totalDefects = productions.reduce((sum, p) => sum + p.defects, 0);
        const avgDefectRate = totalOutput > 0 ? ((totalDefects / totalOutput) * 100).toFixed(2) : 0;

        worksheet.getCell('A4').value = 'Overall Summary';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A5').value = 'Total Production (meters):';
        worksheet.getCell('B5').value = totalOutput;
        worksheet.getCell('A6').value = 'Total Defects:';
        worksheet.getCell('B6').value = totalDefects;
        worksheet.getCell('A7').value = 'Average Defect Rate (%):';
        worksheet.getCell('B7').value = parseFloat(avgDefectRate);

        // Group by machine
        const byMachine = {};
        for (const prod of productions) {
            if (!byMachine[prod.machineId]) {
                byMachine[prod.machineId] = { output: 0, defects: 0 };
            }
            byMachine[prod.machineId].output += prod.output;
            byMachine[prod.machineId].defects += prod.defects;
        }

        // Table headers
        worksheet.getCell('A9').value = 'Defects by Machine';
        worksheet.getCell('A9').font = { bold: true };

        const headerRow = worksheet.getRow(10);
        headerRow.values = ['Machine ID', 'Output (meters)', 'Defects', 'Defect Rate (%)'];
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFCCBC' }
        };

        // Data rows
        let rowIndex = 11;
        for (const [machineId, data] of Object.entries(byMachine)) {
            const row = worksheet.getRow(rowIndex++);
            const rate = data.output > 0 ? ((data.defects / data.output) * 100).toFixed(2) : 0;
            row.values = [
                machineId,
                data.output,
                data.defects,
                parseFloat(rate)
            ];
        }

        // Column widths
        worksheet.columns = [
            { width: 20 },
            { width: 18 },
            { width: 12 },
            { width: 18 }
        ];
    }

    async generateOrdersReport(workbook, startDate, endDate) {
        const worksheet = workbook.addWorksheet('Order Fulfillment');

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end }
        }).sort({ createdAt: -1 });

        // Title
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = 'Order Fulfillment Status';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = `Period: ${startDate} to ${endDate}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Summary
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        worksheet.getCell('A4').value = 'Order Summary';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A5').value = 'Total Orders:';
        worksheet.getCell('B5').value = orders.length;

        let summaryRow = 6;
        for (const [status, count] of Object.entries(statusCounts)) {
            worksheet.getCell(`A${summaryRow}`).value = `${status.charAt(0).toUpperCase() + status.slice(1)}:`;
            worksheet.getCell(`B${summaryRow}`).value = count;
            summaryRow++;
        }

        // Table headers
        const headerRow = worksheet.getRow(summaryRow + 1);
        headerRow.values = ['Customer', 'Product', 'Quantity', 'Deadline', 'Status'];
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC5CAE9' }
        };

        // Data rows
        orders.forEach((order, index) => {
            const row = worksheet.getRow(summaryRow + 2 + index);
            row.values = [
                order.customer,
                order.product,
                order.quantity,
                order.deadline ? new Date(order.deadline).toLocaleDateString() : 'N/A',
                order.status
            ];
        });

        // Column widths
        worksheet.columns = [
            { width: 25 },
            { width: 20 },
            { width: 15 },
            { width: 15 },
            { width: 15 }
        ];
    }

    async generateWorkerAttendanceReport(workbook, startDate, endDate) {
        const worksheet = workbook.addWorksheet('Worker Attendance');

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const workers = await Worker.find({});

        // Title
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = 'Worker Attendance Report';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = `Period: ${startDate} to ${endDate}`;
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Process data
        const processedWorkers = workers.map(worker => {
            const relevantShifts = worker.shifts.filter(shift => {
                const shiftDate = new Date(shift.date);
                return shiftDate >= start && shiftDate <= end;
            });

            const totalShifts = relevantShifts.length;
            const totalHours = relevantShifts.reduce((sum, shift) => sum + (shift.hours || 0), 0);
            const totalPay = relevantShifts.reduce((sum, shift) => sum + shift.amount, 0);

            return {
                name: worker.name,
                contact: worker.contact,
                totalShifts,
                totalHours,
                totalPay
            };
        }).filter(w => w.totalShifts > 0 || true);

        const activeWorkers = processedWorkers.filter(w => w.totalShifts > 0);

        // Summary
        const totalShiftsOverall = activeWorkers.reduce((sum, w) => sum + w.totalShifts, 0);
        const totalPayout = activeWorkers.reduce((sum, w) => sum + w.totalPay, 0);

        worksheet.getCell('A4').value = 'Summary';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A5').value = 'Total Active Workers:';
        worksheet.getCell('B5').value = activeWorkers.length;
        worksheet.getCell('A6').value = 'Total Shifts Worked:';
        worksheet.getCell('B6').value = totalShiftsOverall;
        worksheet.getCell('A7').value = 'Total Payout (Estimate):';
        worksheet.getCell('B7').value = `₹${totalPayout}`;

        // Table headers
        const headerRow = worksheet.getRow(9);
        headerRow.values = ['Worker Name', 'Contact', 'Shifts', 'Total Hours', 'Amount (₹)'];
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE1BEE7' } // Light purple matching other reports
        };

        // Data rows
        processedWorkers.forEach((worker, index) => {
            const row = worksheet.getRow(10 + index);
            row.values = [
                worker.name,
                worker.contact,
                worker.totalShifts,
                worker.totalHours,
                worker.totalPay
            ];
        });

        // Column widths
        worksheet.columns = [
            { width: 25 },
            { width: 20 },
            { width: 10 },
            { width: 15 },
            { width: 15 }
        ];
    }
}

export default new ExcelGenerator();
