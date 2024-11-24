const CustomList = require('../models/customlist');
const User = require('../models/User');

// Create a Custom List
exports.createCustomList = async (req, res) => {
  const { title, description, movies, isPublic } = req.body;
  const userId = req.user.id; // Get the user ID from the decoded JWT token

  try {
    const customList = new CustomList({ title, description, userId, movies, isPublic });
    await customList.save();
    res.status(201).json(customList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error creating custom list' });
  }
};

// Get Custom List by ID (without pagination for movies)
exports.getCustomListById = async (req, res) => {
  try {
    const { id } = req.params; // Get custom list ID from request parameters
    const userId = req.user.id; // Get user ID from the authenticated user

    // Fetch the custom list by ID with populated movies
    const customList = await CustomList.findById(id).populate('movies');

    // Validate if the list exists and access control
    if (!customList || (!customList.isPublic && customList.userId.toString() !== userId)) {
      return res.status(404).json({ msg: 'List not found or access denied' });
    }

    res.json(customList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error retrieving custom list' });
  }
};

// Get Custom Lists for a User (with pagination)
exports.getUserCustomLists = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the decoded JWT token
    const { page = 1, limit = 10 } = req.query; // Use page and limit from query params

    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    // Calculate skip based on the current page and limit
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch paginated custom lists for the user
    const customLists = await CustomList.find({ userId })
      .skip(skip) // Skip the appropriate number of records
      .limit(parseInt(limit)); // Limit the number of records per page

    // Fetch the total count of custom lists for the user
    const totalCount = await CustomList.countDocuments({ userId });

    res.json({
      customLists,
      totalCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit)), // Calculate total pages
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error retrieving custom lists' });
  }
};

// Follow a Custom List
exports.followCustomList = async (req, res) => {
  try {
    const { id } = req.params; // Get the custom list ID from the URL parameters
    const userId = req.user.id; // Get the authenticated user's ID

    // Check if the custom list exists
    const customList = await CustomList.findById(id);
    if (!customList) {
      return res.status(404).json({ msg: 'Custom list not found' });
    }

    // Check if the user is already following the list
    if (customList.followers.includes(userId)) {
      return res.status(400).json({ msg: 'User is already following this list' });
    }

    // Add the user to the followers array of the custom list
    customList.followers.push(userId);
    await customList.save();

    res.json({ msg: 'Successfully followed the custom list', customList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error following the custom list' });
  }
};

// Update a Custom List
exports.updateCustomList = async (req, res) => {
  try {
    const { title, description, movies, isPublic } = req.body;
    const customListId = req.params.id; // Get custom list ID from request parameters

    // Find the custom list by ID
    const customList = await CustomList.findById(customListId);

    // Check if the list exists and if the user is the owner
    if (!customList) {
      return res.status(404).json({ msg: 'Custom list not found' });
    }

    if (customList.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to edit this list' });
    }

    // Update the custom list with new data
    customList.title = title || customList.title;
    customList.description = description || customList.description;
    customList.movies = movies || customList.movies;
    customList.isPublic = isPublic !== undefined ? isPublic : customList.isPublic;

    // Save the updated custom list
    await customList.save();

    res.json({ msg: 'Custom list updated successfully', customList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error updating custom list' });
  }
};

// Delete a Custom List
exports.deleteCustomList = async (req, res) => {
  try {
    const customListId = req.params.id; // Get custom list ID from request parameters

    // Find the custom list by ID
    const customList = await CustomList.findById(customListId);

    // Check if the list exists and if the user is the owner
    if (!customList) {
      return res.status(404).json({ msg: 'Custom list not found' });
    }

    if (customList.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to delete this list' });
    }

    // Delete the custom list
    await customList.remove();

    res.json({ msg: 'Custom list deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error deleting custom list' });
  }
};

// Add a Movie to a Custom List
exports.addMovieToCustomList = async (req, res) => {
  try {
    const { listId, movieId } = req.body; // Get listId and movieId from request body

    // Validate the listId and movieId to ensure they're ObjectIds
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ msg: 'Invalid Custom List ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ msg: 'Invalid Movie ID' });
    }

    // Find the custom list by the listId
    const customList = await CustomList.findById(listId);
    if (!customList) {
      return res.status(404).json({ msg: 'Custom list not found' });
    }

    // Add the movieId to the movies array
    customList.movies.push(movieId);

    // Save the updated custom list
    await customList.save();

    res.json({ msg: 'Movie added to the custom list successfully!', customList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error adding movie to custom list' });
  }
};
