const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);



async function queryOpenAi() {
    let completion;
    console.log(process.argv[2])
    try {
         completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: process.argv[2],
            max_tokens: 64,
        });

        console.log(completion.data);
    }
    catch (e) {
        console.log(e)
        console.log(e.message)
        console.log(e.data)
        console.log()
        console.log()
        console.log()
        console.log(completion)



    }
}

queryOpenAi();