const express = require('express');
const { authenticate, authorize } = require('../../middlewares/auth');
const { register, login,getUsers,logOut } = require('../../controllers/AuthController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logOut);
router.get('/getUsers', 
  authenticate, 
  authorize('patient'),
  getUsers
);

module.exports = router;