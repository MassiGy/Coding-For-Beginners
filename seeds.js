const mongoose = require('mongoose');
const Feedback = require('./public/Modals/feedbacks')
const Signup = require('./public/Modals/signup')

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connection enabled at port 27017')
    })
    .catch((ERROR) => {
        console.log(ERROR)
    })




// let seedednewUser = new Signup({ "postedFeedbacks": [], "username": "MassiGy", "email": "ghernaoutmassi@gmail.com", "password": "massigy", })
// let seededfeedback = new Feedback({ username: 'MassiGy', email: 'ghernaoutmassi@gmail.com', password: 'massigy', feedbackText: 'mass', userSatisfied: 'Yes', websiteProblem: 'The content was general' })

let formater = async(modal) => await modal.deleteMany({});
formater(Signup);
formater(Feedback);
