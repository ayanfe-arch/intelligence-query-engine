const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');

router.get('/', controller.getProfiles);
router.get('/search', controller.searchProfiles);

module.exports = router;