const express=require("express");
const router=express.Router();
const controller=require("../controllers/job");


router.post("/",controller.createJob);
router.get("/",controller.getAllJobs);
router.put("/:id",controller.updateJobs);
router.delete("/:id", controller.deleteJob);

module.exports=router;