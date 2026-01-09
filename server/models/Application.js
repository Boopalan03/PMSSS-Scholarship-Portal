const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // --- Personal Details ---
    studentName: { type: String, required: true },
    aadhaarNumber: { type: String, required: true },
    age: { type: Number, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },

    // --- Family Details ---
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    familyIncome: { type: Number, required: true },

    // --- Banking Details ---
    bankName: { type: String, required: true },
    bankBranch: { type: String, required: true },
    bankAccountNo: { type: String, required: true },
    bankIfsc: { type: String, required: true },

    // --- Academic & Community Details ---
    collegeName: { type: String, required: true },
    collegeLocation: { type: String, required: true },
    community: { type: String, required: true },
    caste: { type: String, required: true },
    isFirstGraduate: { type: String, enum: ['Yes', 'No'], required: true },

    // --- Documents ---
    aadhaarCard: { type: String, required: true },
    incomeCertificate: { type: String, required: true },
    bonafideCertificate: { type: String, required: true },
    firstGraduateCertificate: { type: String },

    // --- System Fields ---
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected', 'Disbursed'], // Added Disbursed
        default: 'Pending' 
    },
    remarks: { type: String, default: '' },
    disbursementAmount: { type: Number, default: 0 },
    disbursementDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);