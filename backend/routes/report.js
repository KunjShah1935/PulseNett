import express from "express";
import Report from "../models/Report.js";
import ActivityLog from "../models/ActivityLog.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const uploadPath = path.join(process.cwd(), "uploads");

// auto create folder
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
const router = express.Router();

 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // ✅ FIXED
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
router.post("/upload", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded ❌" });
    }

    const report = new Report({
      patientId: req.body.patientId,
      testName: req.body.testName,
      result: req.body.result,
      fileUrl: req.file.filename,
      status: "completed"
    });

    await report.save();

    await ActivityLog.create({
      action: "Lab report uploaded",
      user: "Lab",
      detail: `${req.body.testName} → Patient ${req.body.patientId}`
    });

    res.json({ message: "Report uploaded ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// 🟢 CREATE TEST (doctor)
router.post("/add", async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      status: "completed"
    });

    await report.save();

    await ActivityLog.create({
      action: "Lab test completed",
      user: req.body.doctorId || "Doctor",
      detail: `${req.body.testName} → Patient ${req.body.patientId}`
    });

    res.json({ message: "Report uploaded ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // 🟡 GET BY DOCTOR
// router.get("/doctor/:doctorId", async (req, res) => {
//   const data = await Report.find({ doctorId: req.params.doctorId });
//   res.json(data);
// });


// // 🔵 GET PENDING (lab dashboard)
// router.get("/pending", async (req, res) => {
//   const data = await Report.find({ status: "pending" });
//   res.json(data);
// });


// // 🟣 UPDATE RESULT (lab)
// router.put("/update/:id", async (req, res) => {
//   const updated = await Report.findByIdAndUpdate(
//     req.params.id,
//     {
//       result: req.body.result,
//       status: "completed"
//     },
//     { new: true }
//   );

//   res.json(updated);
// });


// 🔵 GET BY PATIENT
router.get("/patient/:patientId", async (req, res) => {
  const data = await Report.find({ patientId: req.params.patientId });
  res.json(data);
});

router.get("/", async (req, res) => {
  const data = await Report.find().sort({ createdAt: -1 });
  res.json(data);
}); 

export default router;