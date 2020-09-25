import * as fx from 'simple-fxtrade';

const run = async () => {
 
    // Configure api key, you can set env: OANDA_API_KEY instead and remove this call
    fx.configure({
        apiKey: 'your-api-key-per-oanda-docs',
    });
   
    // Get accounts for authorized user (using OANDA_API_KEY env var)
    const {accounts: [{id}]} = await fx.accounts()
   
    // Set the id context for all future api calls
    fx.setAccount(id);
   
    // Get the instruments for the account
    const {instruments} = await fx.instruments();
   
    console.log(instruments); // [...] logs many instruments
  }
   
  // Call the above function. Included to reduce any possible confusion
  run();