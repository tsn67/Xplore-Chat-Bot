
import express from 'express'
import ragcy from 'ragcy'
import cors from 'cors'
import {config} from 'dotenv'
config();

const API_KEY = process.env.RAGCY_API_KEY;
const client = ragcy.init({ key: API_KEY });
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
  }));
app.use(express.json()); 


async function createCorpus() {
    try {
        const response = await client.createCorpus(
            'your name is xplore24chatbot',
            'you are an ai assistant for xplore24, you have to help people to enjoy the events?',
            'xplore24 ai assistant chat bot',
            'xplore24 tech festival chatbot',
            'Welcome to the chatbot!',
            'You are a helpful assistant for xplore24, tech festival conducted by gcek .',
            'Answer questions based on the provided information.',
            `don't provide unrelated info (other than xplore24 related)`
        );
        console.log('Corpus created:', response.corpus);
        return response.corpus.id;
    } catch (error) {
        console.error('Error creating corpus:', error);
        return null;
    }
}


async function addDataToCorpus(corpusId, filePath) {
    try {
        const result = await client.addDataSource(corpusId, filePath);
        console.log('Data source added:', result);
    } catch (error) {
        console.error('Error adding data source:', error);
    }
}


async function chat(corpusId, userInput, sessionId = null) {
    try {
        const req = await client.query(corpusId, userInput, sessionId);
        return { response: req.response, sessionId: req.sessionId };
    } catch (error) {
        console.error('Error querying the corpus:', error);
        return { response: 'Sorry, I couldn’t understand that.', sessionId };
    }
}


async function initializeBot() {
    const corpusId = await createCorpus();
    if (corpusId) {
        await addDataToCorpus(corpusId, './data.txt');
        return corpusId;
    } else {
        throw new Error('Failed to create corpus');
    }
}


app.post('/chat', async (req, res) => {
    const { userInput, sessionId } = req.body;
    if (!userInput) {
        return res.status(400).send({ error: 'User input is required' });
    }

    try {
        const response = await chat(corpusId, userInput, sessionId);
        res.json({ response: response.response, sessionId: response.sessionId });
    } catch (error) {
        res.status(500).send({ error: 'Error interacting with the bot' });
    }
});


let corpusId = null;
initializeBot()
    .then((id) => {
        corpusId = id;
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error initializing chatbot:', error);
});
