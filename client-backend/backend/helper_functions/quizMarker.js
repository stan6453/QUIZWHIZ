function markQuiz(questionsWithRightAnswer, answeredQuestions) {
  return getNumOfRightAnswers(questionsWithRightAnswer, answeredQuestions)
}

function getNumOfRightAnswers(questionsWithRightAnswer, answeredQuestions) {
  let numOfRightAnswers = 0;

  for (let i = 0; i < questionsWithRightAnswer.length; i++) {
    if (bothAnswersAreEmpty(questionsWithRightAnswer[i], answeredQuestions[i])) {
      numOfRightAnswers++;
    } else if (bothAnswersHaveDifferentLength(questionsWithRightAnswer[i], answeredQuestions[i])) {
      continue;
    } else if (bothAnswersAreEquivalent(questionsWithRightAnswer[i], answeredQuestions[i])) {
      numOfRightAnswers++;
    }
  }
  return numOfRightAnswers
}

function bothAnswersAreEmpty(correctAnswer, submittedAnswer) {
  return (
    correctAnswer.answer.length === 0 &&
    (submittedAnswer.myanswer?.length === 0 || submittedAnswer.myanswer?.length === undefined))
}

function bothAnswersHaveDifferentLength(correctAnswer, submittedAnswer){
  return (correctAnswer.answer.length !== submittedAnswer.myanswer?.length)
}

function bothAnswersAreEquivalent(correctAnswer, submittedAnswer){
  return (isSubSet(correctAnswer.answer, submittedAnswer.myanswer) && isSubSet(submittedAnswer.myanswer, correctAnswer.answer))
}

function isSubSet(superset, subset) {
  for (let i = 0; i < subset.length; i++) {
    if (!superset.includes(subset[i])) {
      return false;
    }
  }
  return true;
}

module.exports = { markQuiz, isSubSet }