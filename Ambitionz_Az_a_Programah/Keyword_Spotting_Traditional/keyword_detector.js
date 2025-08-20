require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');

let cosmosClient = null;
let database = null;
let container = null;

function initializeCosmosClient() {
    if (!cosmosClient) {
        const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
        const COSMOS_KEY = process.env.COSMOS_KEY;
        const COSMOS_DB_ID = process.env.COSMOS_DB_ID;

        if (!COSMOS_ENDPOINT || !COSMOS_KEY || !COSMOS_DB_ID) {
            console.error('Missing Cosmos DB environment variables');
            return false;
        }

        cosmosClient = new CosmosClient({
            endpoint: COSMOS_ENDPOINT,
            key: COSMOS_KEY
        });

        database = cosmosClient.database(COSMOS_DB_ID);
        container = database.container('mythology-kb');
    }
    return true;
}

async function loadKnowledgeBase() {
    try {

        if (!initializeCosmosClient()) {
            console.error('Failed to initialize Cosmos DB client');
            return {};
        }

        const querySpec = {
            query: "SELECT * FROM c WHERE c.type = 'mythology_entry'"
        };

        const { resources: documents } = await container.items.query(querySpec).fetchAll();
        

        const knowledgeBase = {};
        documents.forEach(doc => {
            knowledgeBase[doc.id] = {
                keywords: doc.keywords,
                response: doc.response
            };
        });

        console.log(`Loaded ${Object.keys(knowledgeBase).length} entries from Cosmos DB`);
        return knowledgeBase;
    } catch (error) {
        console.error('Error loading knowledge base from Cosmos DB:', error);
        return {};
    }
}


function findBestMatch(userInput, knowledgeBase) {
    if (!userInput || typeof userInput !== 'string') {
        return null;
    }

    const input = userInput.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;


    for (const [entryName, entry] of Object.entries(knowledgeBase)) {
        const keywords = entry.keywords;


        let score = 0;
        for (const keyword of keywords) {
            if (input.includes(keyword.toLowerCase())) {
                score += keyword.length;
            }
        }


        if (input === entryName.toLowerCase()) {
            score += 100;
        }


        const inputWords = input.split(/\s+/);
        for (const word of inputWords) {
            if (word.length > 2 && entryName.toLowerCase().includes(word)) {
                score += 10;
            }
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = entryName;
        }
    }


    return highestScore > 2 ? bestMatch : null;
}

async function getResponse(userInput) {
    const knowledgeBase = await loadKnowledgeBase();



    const greetingPatterns = ['hello', 'hi', 'hey', 'greetings', 'welcome'];
    const isGreeting = greetingPatterns.some(pattern =>
        userInput.toLowerCase().includes(pattern)
    );

    if (isGreeting) {
        return "Welcome, DR WÖLFL ANDREAS! You now walk among the legends of Olympus, where curiosity feeds the mind and stories shape fate.";
    }


    const goodbyePatterns = ['bye', 'goodbye', 'farewell', 'see you', 'exit'];
    const isGoodbye = goodbyePatterns.some(pattern =>
        userInput.toLowerCase().includes(pattern)
    );

    if (isGoodbye) {
        return " It was great talking to you, DR Wölfl Andreas. If you liked this chat, thank my creators and make them pass your subject haha😉. Talk to you later!" 
    }

    const thankPatterns = ['thank', 'thanks', 'appreciate'];
    const isThank = thankPatterns.some(pattern =>
        userInput.toLowerCase().includes(pattern)
    );

    if (isThank) {
        return "You're welcome! Glad to help.";
    }


    const matchedEntry = findBestMatch(userInput, knowledgeBase);

    if (matchedEntry) {
        return knowledgeBase[matchedEntry].response;
    }


    return "Sorry, I didn't quite understand that. Try asking about a specific god, hero, creature, or story from Greek mythology.";
}


async function getSuggestions(userInput) {
    const knowledgeBase = await loadKnowledgeBase();
    const input = userInput.toLowerCase().trim();

    const suggestions = [];


    for (const [entryName, entry] of Object.entries(knowledgeBase)) {
        const keywords = entry.keywords;
        let relevance = 0;

        for (const keyword of keywords) {
            if (input.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(input)) {
                relevance += 1;
            }
        }

        if (relevance > 0 && suggestions.length < 3) {
            suggestions.push(entryName);
        }
    }

    if (suggestions.length > 0) {
        return `You might also be interested in: ${suggestions.join(', ')}`;
    }

    return "Try asking about gods like Zeus or Athena, heroes like Hercules or Achilles, or creatures like the Minotaur or Medusa.";
}

module.exports = {
    getResponse,
    getSuggestions,
    findBestMatch,
    loadKnowledgeBase
}; 