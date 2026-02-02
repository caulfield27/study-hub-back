const express = require('express');
const {globalSearch} = require('../controllers/global.controller');
const router = express.Router();

router.get('/', globalSearch);

module.exports = router;