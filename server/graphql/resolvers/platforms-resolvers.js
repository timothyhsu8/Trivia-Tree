const Platform = require('../../models/Platform');
// const Quiz = require('../../models/Quiz');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
	Query: {
		async getPlatforms() {
			try {
				const platforms = await Platform.find()
				return platforms;
			} catch (err) {
				throw new Error(err);
			}
		},
	},

	Mutation: {
		async createPlatform(
            _,
            { platformInput: { name } },
            context
        ) {
            if (name.trim() === '') {
                throw new Error('Platform name cannot be blank');
            }

            // const valid = questions.forEach((question) => {
            //     if (question.question.trim() === '') {
            //         throw new Error('A question cannot be blank');
            //     }
            //     let answerMatch = false;

            //     question.answer.forEach((answer) => {
            //         if (answer.trim() === '') {
            //             throw new Error('An answer cannot be blank');
            //         }
            //     });

            //     if (question.answerChoices.length <= 1) {
            //         throw new Error(
            //             'A question must have at least two choices'
            //         );
            //     }
            //     question.answerChoices.forEach((choice) => {
            //         if (choice.trim() === '') {
            //             throw new Error('An answer choice cannot be blank');
            //         }

            //         question.answer.forEach((answer) => {
            //             if (choice.trim() === answer.trim()) {
            //                 answerMatch = true;
            //             }
            //         });
            //     });
            //     if (!answerMatch) {
            //         throw new Error(
            //             'A question must have an answer choice that matches the answer'
            //         );
            //     }
            // });

            // let numQuestions = questions.length;
            // let numFavorites = 0;
            // let numAttempts = 0;
			
			let tamzidID = "6172d9fed71c6185f410226f"
            const newPlatform = new Platform({
                user: tamzidID,
                name,
                // questions,
                // description,
                // quizTimer,
                // numQuestions,
                // numFavorites,
                // numAttempts,
            });

            const platform = await newPlatform.save();

            return platform;
        }
	}
};
