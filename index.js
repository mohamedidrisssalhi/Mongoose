const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB Atlas database
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Check database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas successfully!');
});

// Create Person Schema with required prototype
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true  // Name is required field
  },
  age: {
    type: Number,
    default: 0  // Default age value
  },
  favoriteFoods: {
    type: [String],  // Array of strings for favorite foods
    default: []      // Default empty array
  }
});

// Create Person model from schema
const Person = mongoose.model('Person', personSchema);

// Function 1: Create and Save a Record of a Model
async function createAndSavePerson(done) {
  try {
    // Create a new person document instance
    const person = new Person({
      name: "John Doe",
      age: 25,
      favoriteFoods: ["pizza", "pasta", "salad"]
    });

    // Save the person using modern async/await syntax
    const data = await person.save();
    console.log('Person saved successfully:', data);
    done(null, data);  // Success callback
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 2: Create Many Records with model.create()
async function createManyPeople(arrayOfPeople, done) {
  try {
    // Create multiple people at once using Model.create()
    const data = await Person.create(arrayOfPeople);
    console.log('Multiple people created successfully:', data);
    done(null, data);  // Success callback
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 3: Use model.find() to Search Your Database
async function findPeopleByName(personName, done) {
  try {
    // Find all people with the given name
    const data = await Person.find({ name: personName });
    console.log('People found by name:', data);
    done(null, data);  // Return array of people
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 4: Use model.findOne() to Return a Single Matching Document
async function findOneByFood(food, done) {
  try {
    // Find one person who has the specified food in favorites
    const data = await Person.findOne({ favoriteFoods: food });
    console.log('Person found by favorite food:', data);
    done(null, data);  // Return single person
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 5: Use model.findById() to Search Your Database By _id
async function findPersonById(personId, done) {
  try {
    // Find person by their unique _id
    const data = await Person.findById(personId);
    console.log('Person found by ID:', data);
    done(null, data);  // Return single person
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 6: Perform Classic Updates by Running Find, Edit, then Save
async function findEditThenSave(personId, done) {
  try {
    // Find person by ID, add "hamburger" to favorites, then save
    const person = await Person.findById(personId);
    
    if (!person) {
      return done(new Error('Person not found'));
    }

    // Add "hamburger" to the favoriteFoods array
    person.favoriteFoods.push("hamburger");
    
    // Mark the field as modified (important for Mixed type arrays)
    person.markModified('favoriteFoods');
    
    // Save the updated person
    const updatedPerson = await person.save();
    console.log('Person updated and saved:', updatedPerson);
    done(null, updatedPerson);  // Return updated person
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 7: Perform New Updates on a Document Using model.findOneAndUpdate()
async function findAndUpdate(personName, done) {
  try {
    // Find person by name and update age to 20
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },           // Search criteria
      { age: 20 },                    // Update operation
      { new: true }                   // Return updated document
    );
    console.log('Person found and updated:', updatedPerson);
    done(null, updatedPerson);  // Return updated person
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 8: Delete One Document Using model.findByIdAndRemove
async function removeById(personId, done) {
  try {
    // Remove person by their _id (using findByIdAndDelete for modern Mongoose)
    const removedPerson = await Person.findByIdAndDelete(personId);
    console.log('Person removed by ID:', removedPerson);
    done(null, removedPerson);  // Return removed person
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 9: MongoDB and Mongoose - Delete Many Documents with model.remove()
async function removeManyPeople(done) {
  try {
    // Remove all people with name "Mary" (using deleteMany for modern Mongoose)
    const result = await Person.deleteMany({ name: "Mary" });
    console.log('People removed:', result);
    done(null, result);  // Return operation result
  } catch (err) {
    done(err);  // Handle error
  }
}

// Function 10: Chain Search Query Helpers to Narrow Search Results
async function queryChain(done) {
  try {
    // Find people who like burritos, sort by name, limit to 2, hide age
    const data = await Person.find({ favoriteFoods: "burritos" })  // Find people who like burritos
      .sort({ name: 1 })                         // Sort by name ascending
      .limit(2)                                  // Limit results to 2 documents
      .select('-age')                            // Hide age field (exclude it)
      .exec();                                   // Execute the query
    
    console.log('Query chain result:', data);
    done(null, data);  // Return filtered results
  } catch (err) {
    done(err);  // Handle error
  }
}

// Example usage and testing functions
async function runExamples() {
  try {
    console.log('=== Starting Mongoose Checkpoint Examples ===\n');

    // Example data for testing
    const arrayOfPeople = [
      { name: "Alice Johnson", age: 28, favoriteFoods: ["burritos", "tacos"] },
      { name: "Bob Smith", age: 32, favoriteFoods: ["pizza", "burritos"] },
      { name: "Mary Wilson", age: 24, favoriteFoods: ["sushi", "pasta"] },
      { name: "Mary Brown", age: 29, favoriteFoods: ["salad", "soup"] }
    ];

    // Test create and save person
    console.log('1. Creating and saving a person...');
    await new Promise((resolve, reject) => {
      createAndSavePerson((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Test create many people
    console.log('\n2. Creating multiple people...');
    await new Promise((resolve, reject) => {
      createManyPeople(arrayOfPeople, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Wait a moment for database operations to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test find by name
    console.log('\n3. Finding people by name "Mary"...');
    await new Promise((resolve, reject) => {
      findPeopleByName("Mary Wilson", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Test find one by food
    console.log('\n4. Finding one person who likes burritos...');
    await new Promise((resolve, reject) => {
      findOneByFood("burritos", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    // Test query chain
    console.log('\n5. Testing query chain for burrito lovers...');
    await new Promise((resolve, reject) => {
      queryChain((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    console.log('\n=== All examples completed successfully! ===');
    
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export functions for testing (if needed)
module.exports = {
  Person,
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain
};

// Run examples when file is executed directly
if (require.main === module) {
  // Wait for database connection before running examples
  db.once('open', () => {
    setTimeout(runExamples, 1000);  // Give connection time to stabilize
  });
}
