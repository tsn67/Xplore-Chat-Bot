import express from 'express';
import ragcy from 'ragcy';
import cors from 'cors';
import { config } from 'dotenv';

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
            'xplore ai assistan',
            'you are an ai chat bot made to assist people in xplore24 a tech fest organized by gcek',
            'only respond to the xplore24 related questions', 'for other quries, respond something like i am here to provide info related to xplore24 only',
            'if related info is not found, say we will update soon',
            'for queries like bye, ok, thanks, thankyou , wish them happy xplore24'
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

function formatChatHistory(history) {
    if (!Array.isArray(history) || history.length === 0) {
        return '';
    }

    return history
        .map(entry => {
            const role = entry.type === 'user' ? 'User' : 'Assistant';
            return `${role}: ${entry.msg}`;
        })
        .join('\n');
}

async function chat(corpusId, userInput, userHistory = [], sessionId = null) {
    try {
        const formattedHistory = formatChatHistory(userHistory);
        const contextualInput = `
Previous conversation:
${formattedHistory}

Current user input:
${userInput}

Please provide a response considering the above context while staying focused on xplore24 related information.`;

        const req = await client.query(corpusId, contextualInput, sessionId);
        return { 
            response: req.response, 
            sessionId: req.sessionId 
        };
    } catch (error) {
        console.error('Error querying the corpus:', error);
        return { 
            response: `Sorry, I couldn't understand that. Please try again.`, 
            sessionId 
        };
    }
}

async function initializeBot() {
    const corpusId = await createCorpus();
    if (corpusId) {
        await addDataToCorpus(corpusId, './data.pdf');
        return corpusId;
    } else {
        throw new Error('Failed to create corpus');
    }
}

app.post('/chat', async (req, res) => {
    const { userInput, sessionId, userHistory = [] } = req.body;
    
    if (!userInput) {
        return res.status(400).json({ 
            error: 'User input is required' 
        });
    }

    try {
        const response = await chat(corpusId, userInput, userHistory, sessionId);
        console.log(response.response);
        res.json({
            response: response.response,
            sessionId: response.sessionId
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Error processing your request' 
        });
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