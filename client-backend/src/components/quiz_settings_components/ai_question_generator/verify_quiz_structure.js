function correctDefectsInQuizObject(quizObject) {
    let newQuizObject = { ...quizObject };
    newQuizObject = correctDefectsInAnswerArray(newQuizObject)
    return newQuizObject
}

function correctDefectsInAnswerArray(quizObject) {
    let optionKeys = new Set(Object.keys(quizObject.options));
    let answers = new Set(quizObject.answer);
    if (!isSuperSet(optionKeys, answers)) {
        //TODO: handle when answers has a longer length than options

        quizObject = fixOptionValueUsedAsAnswer(quizObject);

        //TODO: Remove duplicates from answer array
    }
    return quizObject
}

function fixOptionValueUsedAsAnswer(quizObject) {
    let optionKeys = Object.keys(quizObject.options);
    let optionValues = Object.values(quizObject.options);
    for (const answer of quizObject.answer) {
        if (answerIsOptionValue(optionKeys, optionValues, answer)) {
            let correctOptionKey = getObjectKeyByValue(quizObject.options, answer);
            // remove deformed answer from answer array
            var newAnswerArray = quizObject.answer.filter(function (goodAnswer) { return goodAnswer !== answer })
            newAnswerArray.push(correctOptionKey);
            quizObject.answer = [...new Set(newAnswerArray)];
        }
    }
    return quizObject;
}

// helper functions
function isSuperSet(parentSet, childSet) {
    for (const item of childSet.values()) {
        if (!parentSet.has(item)) {
            return false;
        }
    }
    return true;
}

function answerIsOptionValue(optionKeys, optionValues, answer) {
    return (optionValues.includes(answer) && !optionKeys.includes(answer));
}

function getObjectKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export default correctDefectsInQuizObject;