const {Router} = require('express');

const {search} = require('../controllers/search');

const router = new Router();

//ROUTE SEARCH
router.get('/:collection/:termino', 
    search);

module.exports = router;