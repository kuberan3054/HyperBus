const express = require('express');
const { PostUser, PostAdmin } = require('../controllers/RoleController');
const router = express.Router(); 

router.route('/user').post(PostUser);
router.route('/admin').post(PostAdmin);

module.exports = router;