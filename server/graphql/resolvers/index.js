const quizzesResolvers = require('./quizzes-resolvers');
const itemsResolvers = require('./items-resolvers');
const platformsResolvers = require('./platforms-resolvers');
const usersResolvers = require('./users-resolvers');
const quizAttemptsResolvers = require('./quizattempts-resolvers');

module.exports = [
    quizzesResolvers,
    itemsResolvers,
    platformsResolvers,
    usersResolvers,
    quizAttemptsResolvers,
];
