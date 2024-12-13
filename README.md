# THF Labs Component Library Demo App

This React application demonstrates the usage of THF Labs component library, showcasing real-world examples of components and services integration.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your THF API key:
```
REACT_APP_THF_API_KEY=your-api-key-here
```

3. Start the development server:
```bash
npm start
```

## Example Usage

### Dealer Gamma Data Table

This example shows how to fetch and display dealer gamma data using the THFtable component and DealerGammaService:

```jsx
import { useState, useEffect } from 'react';
import { 
  ApiClient,
  DealerGammaService,
  THFtable
} from 'thf-labs';

// Initialize API client (do this once in your app)
const apiClient = ApiClient.getInstance();
apiClient.setApiKey(process.env.REACT_APP_THF_API_KEY);

const GammaDataComponent = () => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dealerGammaService = DealerGammaService.getInstance();

  // Define sortable columns
  const columns = [
    { key: 'symbol', header: 'Symbol', sortable: true },
    { key: 'zerogex', header: 'Zero GEX', sortable: true },
    { key: 'strike', header: 'Strike', sortable: true },
    { key: 'gamma', header: 'Gamma', sortable: true }
  ];

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await dealerGammaService.getGammaData('SPY');
        const formattedData = dealerGammaService.transformGammaDataForTable(response);
        setTableData(formattedData);
        setError(null);
      } catch (error) {
        setError(error.message || 'Failed to fetch gamma data');
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Gamma Data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Render table with data
  return (
    <THFtable 
      data={tableData} 
      columns={columns}
      pageSize={15}
      title="SPY Gamma Data"
    />
  );
};

export default GammaDataComponent;
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder





