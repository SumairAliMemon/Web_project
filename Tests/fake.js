const mongoose = require('mongoose');
const Actor = require('./models/actor'); // Adjust path as necessary

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/A03', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Data to add
const actorsData = [
  {
    name: 'Leonardo DiCaprio',
    biography: 'An American actor known for his roles in movies such as Titanic, Inception, and The Revenant.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [], // Array of movie ObjectIds will be added later
    photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  },
  {
    name: 'Meryl Streep',
    biography: 'An American actress with numerous awards and nominations.',
    awards: ['Oscar', 'BAFTA'],
    filmography: [], // Array of movie ObjectIds will be added later
    photos: ['https://example.com/photo3.jpg', 'https://example.com/photo4.jpg'],
  },
  {
    name: 'Brad Pitt',
    biography: 'An American actor and producer, known for his roles in Fight Club, World War Z, and Once Upon a Time in Hollywood.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo5.jpg', 'https://example.com/photo6.jpg'],
  },
  {
    name: 'Scarlett Johansson',
    biography: 'An American actress known for her roles in the Marvel Cinematic Universe as Black Widow.',
    awards: ['BAFTA', 'Tony Award'],
    filmography: [],
    photos: ['https://example.com/photo7.jpg', 'https://example.com/photo8.jpg'],
  },
  {
    name: 'Denzel Washington',
    biography: 'An American actor, director, and producer, known for his roles in Training Day and Malcolm X.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo9.jpg', 'https://example.com/photo10.jpg'],
  },
  {
    name: 'Emma Stone',
    biography: 'An American actress known for her roles in La La Land, Easy A, and The Favourite.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo11.jpg', 'https://example.com/photo12.jpg'],
  },
  {
    name: 'Morgan Freeman',
    biography: 'An American actor, known for his distinctive voice and roles in films like The Shawshank Redemption and Bruce Almighty.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo13.jpg', 'https://example.com/photo14.jpg'],
  },
  {
    name: 'Kate Winslet',
    biography: 'An English actress known for her roles in Titanic, Eternal Sunshine of the Spotless Mind, and Steve Jobs.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo15.jpg', 'https://example.com/photo16.jpg'],
  },
  {
    name: 'Tom Hanks',
    biography: 'An American actor known for his roles in Forrest Gump, Cast Away, and Saving Private Ryan.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo17.jpg', 'https://example.com/photo18.jpg'],
  },
  {
    name: 'Julia Roberts',
    biography: 'An American actress known for her roles in Pretty Woman, Runaway Bride, and Erin Brockovich.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo19.jpg', 'https://example.com/photo20.jpg'],
  },
  {
    name: 'Will Smith',
    biography: 'An American actor known for his roles in Men in Black, The Pursuit of Happyness, and Independence Day.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo21.jpg', 'https://example.com/photo22.jpg'],
  },
  {
    name: 'Johnny Depp',
    biography: 'An American actor and producer known for his role as Captain Jack Sparrow in the Pirates of the Caribbean franchise.',
    awards: ['Golden Globe', 'Screen Actors Guild Award'],
    filmography: [],
    photos: ['https://example.com/photo23.jpg', 'https://example.com/photo24.jpg'],
  },
  {
    name: 'Charlize Theron',
    biography: 'A South African-American actress known for her roles in Mad Max: Fury Road, Monster, and The Italian Job.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo25.jpg', 'https://example.com/photo26.jpg'],
  },
  {
    name: 'Robert Downey Jr.',
    biography: 'An American actor known for his role as Iron Man in the Marvel Cinematic Universe.',
    awards: ['Golden Globe', 'BAFTA'],
    filmography: [],
    photos: ['https://example.com/photo27.jpg', 'https://example.com/photo28.jpg'],
  },
  {
    name: 'Angelina Jolie',
    biography: 'An American actress known for her roles in Girl, Interrupted, Maleficent, and as a humanitarian.',
    awards: ['Oscar', 'Golden Globe'],
    filmography: [],
    photos: ['https://example.com/photo29.jpg', 'https://example.com/photo30.jpg'],
  }
];

// Insert actors into the database
Actor.insertMany(actorsData)
  .then((actors) => {
    console.log('Actors added:', actors);
    mongoose.connection.close(); // Close the connection after insertion
  })
  .catch((err) => {
    console.error('Error adding actors:', err);
    mongoose.connection.close();
  });
