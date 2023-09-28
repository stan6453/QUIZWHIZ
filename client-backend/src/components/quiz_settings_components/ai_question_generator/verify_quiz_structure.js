function validateAndFixQuizStructure(quizObject) {
    let newQuizObject = { ...quizObject };
    //validate answers
    let options = quizObject.options;
    let answers = quizObject.answer;

    let optionKeys = new Set(Object.keys(options));
    answers = new Set(answers);

    //TODO: handle when answers has a longer length than options

    if (!isSuperSet(optionKeys, answers)) {
        newQuizObject = fixOptionValueUsedAsAnswer(newQuizObject);
    }
    return newQuizObject
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

function fixOptionValueUsedAsAnswer(quizObject) {
    let optionKeys = Object.keys(quizObject.options);
    let optionValues = Object.values(quizObject.options);
    for (const answer of quizObject.answer) {
        if (optionValues.includes(answer) && !optionKeys.includes(answer)) {
            let rightOptionKey = getObjectKeyByValue(quizObject.options, answer)
            // remove answer from answer array
            var newAnswerArray = quizObject.answer.filter(function (e) { return e !== answer })
            newAnswerArray.push(rightOptionKey);
            quizObject.answer = [...new Set(newAnswerArray)];
        }
    }
    return quizObject;
}

function getObjectKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export default validateAndFixQuizStructure;