const quizzesResolvers = require('./quizzes');
const itemsResolvers = require('./items');
const platformsResolvers = require('./platforms');
const usersResolvers = require('./users');
const quizAttemptsResolvers = require('./quizattempts');

module.exports = [quizzesResolvers, itemsResolvers, platformsResolvers, usersResolvers, quizAttemptsResolvers];
