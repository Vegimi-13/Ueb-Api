const express=require("express");
const router=express.Router();
const controller=require("../controllers/location");


router.post("/",controller.createLocation);
router.get("/",controller.getAllLocations);
router.put("/:id",controller.updateLocation);
router.delete("/:id", controller.deleteLocation);

module.exports=router;