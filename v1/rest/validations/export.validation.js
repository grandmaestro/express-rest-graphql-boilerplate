// const { body, query, param, header, check } = require('express-validator');



// const validateFilterParams = () => {
//   // Validate body of filter requests
//   return [
//     check('limit')
//       .exists()
//       .withMessage(messages.api.content.limitRequired)
//       .isNumeric()
//       .withMessage(messages.api.content.numberType),

//     check('offset')
//       .exists()
//       .withMessage(messages.api.content.offsetRequired)
//       .isNumeric()
//       .withMessage(messages.api.content.numberType)
//     ,
//     check('releaseDate', 'releaseDate should have start & end attribute').custom(releaseDate => {
//       let valid = true;
//       if (releaseDate) {
//         if (!releaseDate.start || !releaseDate.end) {
//           valid = false;
//         }
//       }
//       return valid;
//     }),
//     check('content_createdOn', 'content_createdOn should have start & end attribute').custom(content_createdOn => {
//       let valid = true;
//       if (content_createdOn) {
//         if (!content_createdOn.start || !content_createdOn.end) {
//           valid = false;
//         }
//       }
//       return valid;
//     }),
//     check('content_modifiedOn', 'content_modifiedOn should have start & end attribute').custom(content_modifiedOn => {
//       let valid = true;
//       if (content_modifiedOn) {
//         if (!content_modifiedOn.start || !content_modifiedOn.end) {
//           valid = false;
//         }
//       }
//       return valid;
//     }),
//     check('match_createdOn', 'match_createdOn should have start & end attribute').custom(match_createdOn => {
//       let valid = true;
//       if (match_createdOn) {
//         if (!match_createdOn.start || !match_createdOn.end) {
//           valid = false;
//         }
//       }
//       return valid;
//     })
//   ];
// }

// module.exports = {
//   validateFilterParams
// }