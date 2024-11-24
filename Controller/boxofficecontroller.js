const BoxOffice = require('../models/boxoffice'); // Import BoxOffice model

// Create box office data for a movie
exports.createBoxOfficeData = async (req, res) => {
  try {
    const { movieId, openingWeekendEarnings, totalEarnings, internationalRevenue } = req.body;

    if (!movieId || openingWeekendEarnings === undefined || totalEarnings === undefined || internationalRevenue === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const boxOfficeData = new BoxOffice({
      movieId,
      openingWeekendEarnings,
      totalEarnings,
      internationalRevenue,
    });

    await boxOfficeData.save();
    return res.status(201).json({ message: 'Box office data created successfully', boxOfficeData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating box office data' });
  }
};

// Get box office data for a specific movie
exports.getBoxOfficeData = async (req, res) => {
  try {
    const { movieId } = req.params; // Get movieId from route parameters
    const { skip, limit } = req.pagination || { skip: 0, limit: 10 }; // Get pagination values

    // Query database with skip and limit
    const boxOfficeData = await BoxOffice.find({ movieId })
      .skip(skip)
      .limit(limit);

    // Check if no data is found for the given page
    if (boxOfficeData.length === 0) {
      return res.status(200).json({
        message: 'No box office data found for the given page.',
        data: [],
      });
    }

    // Return the paginated data
    return res.status(200).json(boxOfficeData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching box office data' });
  }
};

// Update box office data for a specific movie
exports.updateBoxOfficeData = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { openingWeekendEarnings, totalEarnings, internationalRevenue } = req.body;

    if (openingWeekendEarnings === undefined || totalEarnings === undefined || internationalRevenue === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedBoxOfficeData = await BoxOffice.findOneAndUpdate(
      { movieId },
      { openingWeekendEarnings, totalEarnings, internationalRevenue, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedBoxOfficeData) {
      return res.status(404).json({ message: 'Box office data not found for this movie' });
    }

    return res.status(200).json({ message: 'Box office data updated successfully', updatedBoxOfficeData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating box office data' });
  }
};
