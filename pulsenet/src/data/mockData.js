export const patients = [
  { id: 'PT-20041', name: 'Aarav Mehta', age: 34, gender: 'Male', room: '302-A', bed: '1', doctor: 'Dr. Rohan Verma', bloodGroup: 'B+', contact: '+91 98765 43210', admitted: '2025-04-05', diagnosis: 'Acute Appendicitis', status: 'Admitted' },
  { id: 'PT-20042', name: 'Neha Gupta', age: 28, gender: 'Female', room: '205-B', bed: '2', doctor: 'Dr. Anjali Nair', bloodGroup: 'O+', contact: '+91 91234 56789', admitted: '2025-04-07', diagnosis: 'Dengue Fever', status: 'Admitted' },
  { id: 'PT-20043', name: 'Ramesh Joshi', age: 52, gender: 'Male', room: '410-C', bed: '3', doctor: 'Dr. Rohan Verma', bloodGroup: 'A-', contact: '+91 97654 32109', admitted: '2025-04-03', diagnosis: 'Type 2 Diabetes', status: 'Admitted' },
  { id: 'PT-20044', name: 'Kavya Reddy', age: 22, gender: 'Female', room: '101-A', bed: '1', doctor: 'Dr. Suresh Nair', bloodGroup: 'AB+', contact: '+91 99887 65432', admitted: '2025-04-08', diagnosis: 'Migraine', status: 'Observation' },
  { id: 'PT-20045', name: 'Mohan Das', age: 67, gender: 'Male', room: '501-B', bed: '2', doctor: 'Dr. Anjali Nair', bloodGroup: 'O-', contact: '+91 88765 43210', admitted: '2025-04-01', diagnosis: 'Cardiac Arrhythmia', status: 'Critical' },
];

export const vitals = [
  { id: 'V001', patientId: 'PT-20041', patientName: 'Aarav Mehta', spo2: '98%', temp: '98.6°F', bp: '120/80', heartRate: '72 bpm', time: '08:00 AM', date: '2025-04-10', nurse: 'Priya Sharma' },
  { id: 'V002', patientId: 'PT-20042', patientName: 'Neha Gupta', spo2: '96%', temp: '101.2°F', bp: '110/70', heartRate: '88 bpm', time: '08:00 AM', date: '2025-04-10', nurse: 'Priya Sharma' },
  { id: 'V003', patientId: 'PT-20043', patientName: 'Ramesh Joshi', spo2: '97%', temp: '99.1°F', bp: '140/90', heartRate: '80 bpm', time: '09:00 AM', date: '2025-04-10', nurse: 'Priya Sharma' },
  { id: 'V004', patientId: 'PT-20045', patientName: 'Mohan Das', spo2: '94%', temp: '100.4°F', bp: '150/95', heartRate: '95 bpm', time: '09:00 AM', date: '2025-04-10', nurse: 'Anita Rao' },
];

export const medications = [
  { id: 'M001', patientId: 'PT-20041', patientName: 'Aarav Mehta', medicine: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', time: '08:00 AM', nurse: 'Priya Sharma', status: 'Given' },
  { id: 'M002', patientId: 'PT-20042', patientName: 'Neha Gupta', medicine: 'Paracetamol', dosage: '650mg', frequency: 'Every 6hrs', time: '08:00 AM', nurse: 'Priya Sharma', status: 'Given' },
  { id: 'M003', patientId: 'PT-20043', patientName: 'Ramesh Joshi', medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '09:00 AM', nurse: 'Anita Rao', status: 'Pending' },
  { id: 'M004', patientId: 'PT-20045', patientName: 'Mohan Das', medicine: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', time: '10:00 AM', nurse: 'Priya Sharma', status: 'Pending' },
];

export const prescriptions = [
  { id: 'RX001', patientId: 'PT-20041', patientName: 'Aarav Mehta', doctor: 'Dr. Rohan Verma', date: '2025-04-08', medicines: [{ name: 'Amoxicillin', dosage: '500mg', instructions: 'After food, twice daily for 7 days' }, { name: 'Ibuprofen', dosage: '400mg', instructions: 'After food, thrice daily' }], status: 'Active' },
  { id: 'RX002', patientId: 'PT-20042', patientName: 'Neha Gupta', doctor: 'Dr. Anjali Nair', date: '2025-04-07', medicines: [{ name: 'Paracetamol', dosage: '650mg', instructions: 'Every 6 hours, as needed' }, { name: 'ORS', dosage: '1 sachet', instructions: 'In 200ml water after each loose stool' }], status: 'Active' },
  { id: 'RX003', patientId: 'PT-20043', patientName: 'Ramesh Joshi', doctor: 'Dr. Rohan Verma', date: '2025-04-03', medicines: [{ name: 'Metformin', dosage: '500mg', instructions: 'With meals, twice daily' }, { name: 'Glipizide', dosage: '5mg', instructions: 'Before breakfast' }], status: 'Active' },
];

export const testRequests = [
  { id: 'LB001', patientId: 'PT-20041', patientName: 'Aarav Mehta', doctor: 'Dr. Rohan Verma', test: 'Complete Blood Count', priority: 'Urgent', status: 'Pending', date: '2025-04-10' },
  { id: 'LB002', patientId: 'PT-20042', patientName: 'Neha Gupta', doctor: 'Dr. Anjali Nair', test: 'Dengue NS1 Antigen', priority: 'Urgent', status: 'In Progress', date: '2025-04-10' },
  { id: 'LB003', patientId: 'PT-20043', patientName: 'Ramesh Joshi', doctor: 'Dr. Rohan Verma', test: 'HbA1c', priority: 'Normal', status: 'Completed', date: '2025-04-09' },
  { id: 'LB004', patientId: 'PT-20045', patientName: 'Mohan Das', doctor: 'Dr. Anjali Nair', test: 'ECG', priority: 'Urgent', status: 'Completed', date: '2025-04-09' },
];

export const inventory = [
  { id: 'INV001', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 1200, unit: 'Tablets', reorder: 200, expiry: '2026-03-01', status: 'In Stock' },
  { id: 'INV002', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 450, unit: 'Capsules', reorder: 100, expiry: '2025-12-01', status: 'In Stock' },
  { id: 'INV003', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 85, unit: 'Tablets', reorder: 100, expiry: '2026-06-01', status: 'Low Stock' },
  { id: 'INV004', name: 'Ibuprofen 400mg', category: 'NSAID', stock: 600, unit: 'Tablets', reorder: 150, expiry: '2025-10-01', status: 'In Stock' },
  { id: 'INV005', name: 'ORS Sachet', category: 'Electrolyte', stock: 12, unit: 'Sachets', reorder: 50, expiry: '2026-01-01', status: 'Critical' },
];

export const bills = {
  patient: [
    { id: 'BL001', patientId: 'PT-20041', patientName: 'Aarav Mehta', items: [{ desc: 'Room Charges (302-A) × 5 days', amount: 7500 }, { desc: 'Amoxicillin 500mg × 14', amount: 560 }, { desc: 'Ibuprofen 400mg × 21', amount: 315 }, { desc: 'CBC Test', amount: 450 }, { desc: 'Consultation Fee', amount: 1000 }], total: 9825, paid: 5000, status: 'Partial' },
  ]
};

export const rooms = [
  { number: '101-A', type: 'General', beds: 4, occupied: 2, status: 'Available' },
  { number: '205-B', type: 'Semi-Private', beds: 2, occupied: 2, status: 'Full' },
  { number: '302-A', type: 'General', beds: 4, occupied: 3, status: 'Available' },
  { number: '410-C', type: 'Private', beds: 1, occupied: 1, status: 'Full' },
  { number: '501-B', type: 'ICU', beds: 2, occupied: 1, status: 'Available' },
  { number: '605-D', type: 'Private', beds: 1, occupied: 0, status: 'Available' },
];

export const staff = [
  { id: 'DR-1045', name: 'Dr. Rohan Verma', role: 'Doctor', dept: 'General Surgery', status: 'Active', joined: '2020-03-15' },
  { id: 'DR-1046', name: 'Dr. Anjali Nair', role: 'Doctor', dept: 'Internal Medicine', status: 'Active', joined: '2019-07-01' },
  { id: 'DR-1047', name: 'Dr. Suresh Nair', role: 'Doctor', dept: 'Neurology', status: 'Active', joined: '2021-01-10' },
  { id: 'NR-3082', name: 'Priya Sharma', role: 'Nurse', dept: 'Ward 3', status: 'Active', joined: '2022-08-20' },
  { id: 'NR-3083', name: 'Anita Rao', role: 'Nurse', dept: 'ICU', status: 'Active', joined: '2021-11-05' },
  { id: 'PH-2031', name: 'Karan Patel', role: 'Pharmacist', dept: 'Pharmacy', status: 'Active', joined: '2023-02-14' },
];

export const charges = [
  { id: 'CH001', type: 'Room', name: 'General Ward (per day)', amount: 1500 },
  { id: 'CH002', type: 'Room', name: 'Semi-Private (per day)', amount: 2500 },
  { id: 'CH003', type: 'Room', name: 'Private Room (per day)', amount: 4000 },
  { id: 'CH004', type: 'Room', name: 'ICU (per day)', amount: 8000 },
  { id: 'CH005', type: 'Test', name: 'Complete Blood Count', amount: 450 },
  { id: 'CH006', type: 'Test', name: 'Dengue NS1 Antigen', amount: 800 },
  { id: 'CH007', type: 'Test', name: 'HbA1c', amount: 600 },
  { id: 'CH008', type: 'Test', name: 'ECG', amount: 350 },
  { id: 'CH009', type: 'Consultation', name: 'Doctor Consultation', amount: 1000 },
];
export const USERS = [
  { username:"patient.user",  password:"patient123",  role:"patient",    name:"Arjun Nair",       id:"PN-2024-0042" },
  { username:"doctor.arjun",  password:"doctor123",   role:"doctor",     name:"Dr. Arjun Mehta",  id:"DR-2024-0011", dept:"Internal Medicine", specialization:"Infectious Diseases" },
  { username:"nurse.kavita",  password:"nurse123",    role:"nurse",      name:"Nurse Kavita Rao", id:"NR-2024-0023", shift:"Morning Shift · 07:00 – 15:00" },
  { username:"pharmacy.raj",  password:"pharma123",   role:"pharmacy",   name:"Raj Pharmacist",   id:"PH-2024-0005" },
  { username:"lab.priya",     password:"lab123",      role:"lab", name:"Priya Lab Tech",   id:"LB-2024-0008" },
    { username:"billing.admin", password:"billing123",  role:"admin",    name:"admin",    id:"BL-2024-0003" },
  ];
