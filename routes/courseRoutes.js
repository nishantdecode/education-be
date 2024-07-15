const express = require("express");
const router = express.Router();
const multer = require("multer");
const courseController = require("../controllers/courseController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", courseController.create);
router.post("/import", upload.single('file'), courseController.importCourseData);
router.post("/all", courseController.getAllCourses);
router.post("/filter", courseController.getFilterData);
router.get("/:id", courseController.getCourseById);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
