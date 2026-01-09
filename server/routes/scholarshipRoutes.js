const express = require('express');
const router = express.Router();
const multer = require('multer');
const Application = require('../models/Application');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Student Apply ---
router.post('/apply', protect, upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'income', maxCount: 1 },
    { name: 'bonafide', maxCount: 1 },
    { name: 'firstGraduate', maxCount: 1 }
]), async (req, res) => {
    try {
        const appData = {
            studentId: req.user.id,
            ...req.body, 
            aadhaarCard: req.files['aadhaar'][0].path,
            incomeCertificate: req.files['income'][0].path,
            bonafideCertificate: req.files['bonafide'][0].path,
        };

        if (req.body.isFirstGraduate === 'Yes') {
            if (req.files['firstGraduate']) {
                appData.firstGraduateCertificate = req.files['firstGraduate'][0].path;
            } else {
                return res.status(400).json({ error: 'First Graduate Certificate is required' });
            }
        }

        const newApp = new Application(appData);
        await newApp.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Student Status ---
router.get('/status', protect, async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.user.id });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Admin Get All ---
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        const apps = await Application.find().populate('studentId', 'name email');
        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Admin Action (Approve / Disburse / Reject) ---
router.put('/admin/action/:id', protect, adminOnly, async (req, res) => {
    try {
        const { status, remarks } = req.body;
        
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'App not found' });

        const updateData = { status };
        if (remarks) updateData.remarks = remarks;
        
        // STEP 1: APPROVED (Calculate Amount, but don't set date)
        if (status === 'Approved') {
            const comm = application.community;
            if (comm === 'BC') updateData.disbursementAmount = 5000;
            else if (comm === 'MBC' || comm === 'DNC') updateData.disbursementAmount = 8000;
            else if (comm === 'SC' || comm === 'ST') updateData.disbursementAmount = 12000;
            else updateData.disbursementAmount = 0;
        }

        // STEP 2: DISBURSED (Set Date)
        if (status === 'Disbursed') {
            updateData.disbursementDate = new Date();
        }

        const updatedApp = await Application.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedApp);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;