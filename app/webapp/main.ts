import { DaprClient, HttpMethod } from '@dapr/dapr';
import express, { type Request, type Response } from 'express';

// Create a new express application instance
const app = express();

// Set the network port
const port = process.env.PORT || 3000;
const daprHost = process.env.DAPR_HOST || '127.0.0.1';
const daprPort = process.env.DAPR_PORT || '3500';

// Define the root path with a greeting message
app.get('/', async (req: Request, res: Response) => {
  const client = new DaprClient({ daprHost, daprPort });

  const serviceAppId = 'backend';
  const serviceMethod = 'hello-world';

  // GET Request
  const response = await client.invoker.invoke(serviceAppId, serviceMethod, HttpMethod.GET);

  res.json({
    message: 'Welcome to the Express + TypeScript Server!',
    response,
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
