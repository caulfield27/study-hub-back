const {Router} = require('express');
const { getCourses } = require('../controllers/courses.controller');
const router = Router();

router.get('/', getCourses);

module.exports = router;