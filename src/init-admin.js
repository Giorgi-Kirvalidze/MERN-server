const User = require('../src/models/User')

const user = {
    firstName: 'giorgi',
    lastName: 'kirvalidze',
    email: 'giorgikirvalidzee@gmail.com',
    role: 'admin',
    password: 'giorgi1001',
    contactNumber: '579160627',
}

User.create(user, function (e) {
    if (e) {
        throw e;
    }
});




