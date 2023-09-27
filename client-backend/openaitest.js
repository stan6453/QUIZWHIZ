const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
});



async function queryOpenAi() {
    try {

        const chatCompletion = await openai.chat.completions.create({
            messages: [{role:'system', content: process.argv[2] }],
            model: 'gpt-3.5-turbo',
        });

        console.log(chatCompletion.choices);
    }
    catch (e) {
        console.log(e)
        console.log(e.message)
        console.log(e.data)
    }
}

queryOpenAi();