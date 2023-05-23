const mongoose = require('mongoose');
const Feedback = require('./public/Modals/feedbacks')
const Signup = require('./public/Modals/signup')


// to seed the local databse
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connection enabled at port 27017')
    })
    .catch((ERROR) => {
        console.log(ERROR)
    })


let formater = async(modal) => await modal.deleteMany({});
formater(Signup);
formater(Feedback);
