import express from 'express';
import Report from '../models/Report.js';
import pdfGenerator from '../services/pdfGenerator.js';
import excelGenerator from '../services/excelGenerator.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Generate new report
router.post('/generate', async (req, res) => {
    try {
        const { reportType, startDate, endDate, format } = req.body;

        // Validation
        if (!reportType || !startDate || !endDate || !format) {
            return res.status(400).json({
                error: 'Missing required fields: reportType, startDate, endDate, format'
            });
        }

        if (!['production', 'efficiency', 'defects', 'orders', 'worker_attendance'].includes(reportType)) {
            return res.status(400).json({ error: 'Invalid report type' });
        }

        if (!['pdf', 'excel'].includes(format)) {
            return res.status(400).json({ error: 'Invalid format. Must be pdf or excel' });
        }

        // Generate report
        let result;
        if (format === 'pdf') {
            result = await pdfGenerator.generateReport(reportType, startDate, endDate);
        } else {
            result = await excelGenerator.generateReport(reportType, startDate, endDate);
        }

        // Save metadata to database
        const report = new Report({
            reportType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            format,
            fileName: result.fileName,
            filePath: result.filePath,
            fileSize: result.fileSize
        });

        await report.save();

        res.json({
            success: true,
            report: {
                id: report._id,
                fileName: result.fileName,
                fileSize: result.fileSize,
                downloadUrl: `/api/reports/${report._id}/download`
            }
        });

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ error: 'Failed to generate report', details: error.message });
    }
});

// Get recent reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-filePath'); // Don't expose file system path

        const reportsWithUrls = reports.map(report => ({
            id: report._id,
            reportType: report.reportType,
            startDate: report.startDate,
            endDate: report.endDate,
            format: report.format,
            fileName: report.fileName,
            fileSize: report.fileSize,
            createdAt: report.createdAt,
            downloadUrl: `/api/reports/${report._id}/download`
        }));

        res.json(reportsWithUrls);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Download report
router.get('/:id/download', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        if (!fs.existsSync(report.filePath)) {
            return res.status(404).json({ error: 'Report file not found on server' });
        }

        res.download(report.filePath, report.fileName);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download report' });
    }
});

// Delete report (optional cleanup)
router.delete('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Delete file from filesystem
        if (fs.existsSync(report.filePath)) {
            fs.unlinkSync(report.filePath);
        }

        // Delete from database
        await Report.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete report' });
    }
});

export default router;
