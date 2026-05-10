// run with: node seed/seedQuestions.js
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const User = require('../models/User');

async function main(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to mongo for seeding');

  await Question.deleteMany({});
  await User.deleteMany({});

  const qs = [
    { text: 'Translate: Good morning', choices: ['Guten Morgen','Gute Nacht'], answer: 'Guten Morgen', uiType:'flipcard', difficultyRating: 1000 },
    { text: '2 + 2 = ?', choices: ['2','3','4','5'], answer: '4', uiType:'mcq', difficultyRating: 900 },
    { text: 'Reorder to form: "I / go / to / school"', choices: ['I','go','to','school'], answer: ['I','go','to','school'], uiType:'dragdrop', difficultyRating: 1100 },
    { text: 'What is the capital of France?', choices:['Paris','London','Rome','Berlin'], answer:'Paris', uiType:'mcq', difficultyRating: 1300 }
  ];

  await Question.insertMany(qs);

  const user = new User({ name: 'Test User', email: 'test@example.com', skill: 1200, currentLevel: 1 });
  await user.save();
  console.log('Seed complete. User id:', user._id.toString());

  await mongoose.disconnect();
}

main().catch(err => console.error(err));
