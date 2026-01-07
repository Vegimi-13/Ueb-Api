const express=require("express");
const router=express.Router();
const controller=require("../controllers/job");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");



router.post("/",auth,requireRole("EMPLOYER","ADMIN"),controller.createJob);
router.get("/",controller.getAllJobs);
router.put("/:id",auth,controller.updateJobs);
router.delete("/:id",auth, controller.deleteJob);
router.get("/:id",controller.jobById);

module.exports=router;