# Mongoose Project

Mongoose project. built this to practice working with MongoDB and Mongoose ODM, implementing all the required database operations.

## How to Set Up and Run

### Install Dependencies
```bash
npm install
```

### Run the Application
```bash
npm start
```

## What I Built

### 1. Mongoose Setup
I added MongoDB and Mongoose to my package.json, stored my MongoDB Atlas URI in the .env file, and connected to the database properly.

### 2. Person Schema
I created a Person schema with:
- **name**: String [required] 
- **age**: Number (with default value)
- **favoriteFoods**: Array of strings

### 3. Create and Save Function
My `createAndSavePerson()` function creates a new person and saves it using document.save()

### 4. Create Multiple Records
The `createManyPeople()` function creates several people at once using Model.create()

### 5. Search by Name
`findPeopleByName()` finds all people with a specific name using model.find()

### 6. Find One by Food
`findOneByFood()` finds one person who has a specific food in their favorites

### 7. Search by ID
`findPersonById()` finds a person using their unique _id

### 8. Update with Find-Edit-Save
`findEditThenSave()` finds a person, adds "hamburger" to their favorites, then saves

### 9. Update with findOneAndUpdate
`findAndUpdate()` finds a person by name and updates their age to 20

### 10. Delete One Person
`removeById()` deletes a person using their ID

### 11. Delete Multiple Records
`removeManyPeople()` deletes all people named "Mary"

### 12. Query Chaining
`queryChain()` finds burrito lovers, sorts them by name, limits to 2 results, and hides their age


## My Code Structure

```
mongooseProject/
├── index.js
├── package.json
├── .env
└── README.md
```

## Running Individual Functions

Each function is exported and can be tested individually. The main file includes example usage that runs when the application starts.
