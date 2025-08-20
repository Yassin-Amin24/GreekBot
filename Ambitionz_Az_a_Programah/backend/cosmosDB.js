const { CosmosClient } = require('@azure/cosmos');

// Initialize Cosmos DB client
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || 'greekbot-db';
const containerId = process.env.COSMOS_CONTAINER || 'chat-history';

let client;
let database;
let container;

// Initialize Cosmos DB connection
function initializeCosmosDB() {
  try {
    if (!endpoint || !key) {
      console.log('Cosmos DB credentials not found. Running without database.');
      return false;
    }

    client = new CosmosClient({ endpoint, key });
    database = client.database(databaseId);
    container = database.container(containerId);
    
    console.log('Cosmos DB initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Cosmos DB:', error);
    return false;
  }
}

// Get chat history for a user
async function get_data(userId) {
  try {
    if (!container) {
      if (!initializeCosmosDB()) {
        return null;
      }
    }

    const querySpec = {
      query: 'SELECT * FROM c WHERE c.userId = @userId',
      parameters: [{ name: '@userId', value: userId }]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    
    if (resources.length > 0) {
      return resources[0].chatHistory || [];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting data from Cosmos DB:', error);
    return null;
  }
}

// Save chat history for a user
async function post_data(userId, chatHistory) {
  try {
    if (!container) {
      if (!initializeCosmosDB()) {
        return false;
      }
    }

    const item = {
      id: userId,
      userId: userId,
      chatHistory: chatHistory,
      timestamp: new Date().toISOString()
    };

    await container.item(userId, userId).replace(item);
    console.log('Chat history saved successfully for user:', userId);
    return true;
  } catch (error) {
    console.error('Error saving data to Cosmos DB:', error);
    return false;
  }
}

module.exports = {
  get_data,
  post_data,
  initializeCosmosDB
};
