// MongoDB Playground

// Define the database and collection
const database = 'WebProject';
const collection = 'dummy';

// Use the database
db = db.getSiblingDB(database);

// Create a new collection
db.createCollection(collection);

print(`Database "${database}" and collection "${collection}" created successfully!`);
