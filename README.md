## Purpose of this project

To learn about MongoDB, Mongoose and to get comfortable creating automated tests using Mocha and Supertest. Things I have learned include:

### Postman

I used Postman to manually test requests during the development process. It improved my productivity by allowing me to save a particular request route, with particular body & header params. I also like how you can easily configure Postman to save different routes to different Environments - although I never made much use of it this project as I chose not to deploy to heroku.

### Bcrypt - Password Hashing and Salting

I used Bcrypt to generate a salt and then hash the password using the salt and save it as the users password. A hashed password is a one-way algorithm that converts a password into a longer jumbled string. This is a precaution against a hacker getting access to a users password.

However if a hacker were to guess the hashing algorithm used by us then he could potentially decode the hash. Therefore we need a salt which is a randomly generated string that is added the password along with the cost factor before being hashed. This ensures that any likely words in a hackers dictionary will not match against bcrypts hashes.

To mitigate the risk of a dictionary attack by entering a number of salt rounds which increase the cost factor of the request. By purposefully slowing down the request a user will find it difficult to make many requests at a time to crack a password.

### Pre and Post Hooks
