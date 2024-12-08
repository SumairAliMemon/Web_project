// sampleData.js
export const SAMPLE_HOSTELS = [
    {
      _id: "1",
      name: "Seaside Hostel",
      location: "Miami, Florida",
      description: "A peaceful hostel near the beach.",
      rating: 4.5,
      amenities: ["WiFi", "Air conditioning", "Swimming pool"],
      categories: ["Beachfront", "Budget"],
      rooms: [
        { roomNumber: "101", roomType: "Single", pricePerMonth: 500, availability: true },
        { roomNumber: "102", roomType: "Double", pricePerMonth: 750, availability: false },
      ],
    },
    {
      _id: "2",
      name: "Mountain Retreat",
      location: "Colorado Springs, Colorado",
      description: "Stay with a view of the mountains.",
      rating: 4.8,
      amenities: ["WiFi", "Spa", "Hot tub"],
      categories: ["Mountain", "Luxury"],
      rooms: [
        { roomNumber: "201", roomType: "Single", pricePerMonth: 600, availability: true },
        { roomNumber: "202", roomType: "Suite", pricePerMonth: 1000, availability: true },
      ],
    },
    {
      _id: "3",
      name: "City Center Hostel",
      location: "New York City, New York",
      description: "Located in the heart of the city with easy access to major attractions.",
      rating: 4.2,
      amenities: ["WiFi", "Gym", "Restaurant"],
      categories: ["Urban", "Budget"],
      rooms: [
        { roomNumber: "301", roomType: "Shared", pricePerMonth: 300, availability: true },
        { roomNumber: "302", roomType: "Single", pricePerMonth: 700, availability: true },
      ],
    },
    {
      _id: "4",
      name: "Forest Escape",
      location: "Asheville, North Carolina",
      description: "A peaceful retreat in the forest, perfect for nature lovers.",
      rating: 4.7,
      amenities: ["WiFi", "Hiking trails", "Fire pit"],
      categories: ["Forest", "Eco-friendly"],
      rooms: [
        { roomNumber: "401", roomType: "Cabin", pricePerMonth: 800, availability: true },
        { roomNumber: "402", roomType: "Tent", pricePerMonth: 400, availability: true },
      ],
    },
  ];
  