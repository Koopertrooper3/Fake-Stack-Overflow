// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

const bcrypt = require('bcrypt');
const UserModel = require('./models/users');

const createAdminUser = async () => {
    try {
        const [,, adminUsername, adminPassword] = process.argv;
        if (!adminUsername || !adminPassword) {
            console.error('Admin username and password must be provided');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
        const adminUser = new UserModel({
            username: adminUsername,
            email: `${adminUsername.toLowerCase()}@fake_so.com`,
            passwordHash: hashedPassword,
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user created successfully.');
    } catch(error) {
        console.error('Error creating admin user:', error);
    }
};
createAdminUser();