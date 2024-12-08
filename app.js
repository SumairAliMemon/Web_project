const mongoose = require('mongoose');
const Announcement = require('./models/announcement'); // Adjust path if needed
const User = require('./models/Users'); // Assuming you have a User model

// Connect to MongoDB (adjust the URI as needed)
mongoose.connect('mongodb://localhost:27017/Project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Function to create an announcement
const createAnnouncement = async (managerId, title, content, targetAudience, customerIds) => {
  try {
    // Check if manager exists in the system (optional)
    const manager = await User.findById(managerId);
    if (!manager) {
      console.log('Manager not found');
      return;
    }

    // Prepare announcement object
    const announcementData = {
      managerId,
      title,
      content,
      targetAudience,
    };

    if (targetAudience === 'specific_customers' && customerIds && customerIds.length > 0) {
      // Ensure customerIds exist in the system
      const customers = await User.find({ '_id': { $in: customerIds } });
      if (customers.length !== customerIds.length) {
        console.log('One or more customers not found');
        return;
      }
      announcementData.customerIds = customerIds;
    }

    // Create new Announcement
    const newAnnouncement = new Announcement(announcementData);
    await newAnnouncement.save();

    console.log('Announcement created successfully:', newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
  }
};

// Example usage
const managerId = '675481e1cbde32e998bcc82f'; // Replace with actual manager ID
const title = 'New Hostel Discount';
const content = 'Get a 20% discount on all bookings this week!';
const targetAudience = 'specific_customers'; // or 'all_customers'
const customerIds = ['675481e1cbde32e998bcc830']; // Replace with actual customer IDs

createAnnouncement(managerId, title, content, targetAudience, customerIds);
