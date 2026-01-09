const express=require("express");
const router=express.Router();
const controller=require("../controllers/location");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");


router.post("/",auth,requireRole("ADMIN"),controller.createLocation);
router.get("/",controller.getAllLocations);
router.put("/:id",auth,requireRole("ADMIN"),controller.updateLocation);
router.delete("/:id",auth,requireRole("ADMIN"), controller.deleteLocation);

module.exports=router;