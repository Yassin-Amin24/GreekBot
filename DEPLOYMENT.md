# Azure Deployment Guide for GreekBot

## Prerequisites

1. Azure App Service with Node.js 20.x runtime
2. Azure Cosmos DB account
3. OpenAI API key

## Environment Variables

Set the following environment variables in your Azure App Service Configuration:

### Required Environment Variables:
- `COSMOS_ENDPOINT`: Your Azure Cosmos DB endpoint
- `COSMOS_KEY`: Your Azure Cosmos DB primary key
- `COSMOS_DATABASE`: Your Cosmos DB database name
- `COSMOS_CONTAINER`: Your Cosmos DB container name
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to "production"

### Optional Environment Variables:
- `PORT`: Port number (default: 8080)

## Deployment Steps

1. **Fork/Clone the Repository**: Ensure you have access to the repository

2. **Set up GitHub Secrets**: In your GitHub repository settings, add the following secret:
   - `AZUREAPPSERVICE_PUBLISHPROFILE_93DBFCBB34A645CABBDD78DD505D0DC6`: Your Azure App Service publish profile

3. **Configure Azure App Service**:
   - Create an Azure App Service with Node.js 20.x runtime
   - Set the environment variables listed above
   - Configure the startup command: `node server.js`

4. **Deploy**: Push to the main branch to trigger automatic deployment

## File Structure After Deployment

The deployment process will create the following structure in Azure:
```
/
├── server.js          # Main server file
├── package.json       # Node.js dependencies
├── web.config         # Azure IIS configuration
├── public/            # React build files
│   ├── index.html
│   ├── static/
│   └── ...
└── node_modules/      # Installed dependencies
```

## Troubleshooting

1. **Build Failures**: Check the GitHub Actions logs for build errors
2. **Runtime Errors**: Check Azure App Service logs
3. **Environment Variables**: Ensure all required environment variables are set in Azure
4. **Port Issues**: Azure App Service automatically sets the PORT environment variable

## Monitoring

- Use Azure Application Insights for monitoring
- Check Azure App Service logs for debugging
- Monitor GitHub Actions for deployment status
