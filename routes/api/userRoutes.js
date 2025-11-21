const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllDoctors
} = require('../../controllers/userController');
// const { getAllUsers, } = require('../../controllers/userController');
router.get('/',getAllUsers);
router.get('/doctors',getAllDoctors);
// export default router;
module.exports = router;