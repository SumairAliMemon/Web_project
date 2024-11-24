const express = require('express');
const router = express.Router();
const customListController = require('../Controller/customlistcontoller');
const {authMiddleware} = require('../middleware/middleware');
const{paginationMiddleware} = require('../middleware/pagenation');

// Create a Custom List
router.post('/', authMiddleware,customListController.createCustomList);


router.get('/',authMiddleware ,paginationMiddleware,customListController.getUserCustomLists);

// Share a Custom List (Retrieve by List ID)
router.get('/:id', authMiddleware,customListController.getCustomListById);

router.put('/:id', authMiddleware,customListController.updateCustomList);

// Delete custom list by ID
router.delete('/:id', authMiddleware,customListController.deleteCustomList);



router.post('/follow/:id', authMiddleware,customListController.followCustomList);


//router.post('/custom_movie', authMiddleware,customListController.addMovieToCustomList);

module.exports = router;
