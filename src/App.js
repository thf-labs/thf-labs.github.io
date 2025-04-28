import { useState, useEffect } from 'react';
import { ApiClient,
  DealerGammaService,
  THFtable
} from '@texashighfrequency/thf-labs';
import './css/App.css';

// Import THF styles if not already imported elsewhere
// Note: These styles might already be included in the THF components

const apiClient = ApiClient.getInstance();
apiClient.setApiKey('your-api-key'); // Optional: Set API key if required

// Initialize service once outside the component
const dealerGammaService = DealerGammaService.getInstance();

const GammaDataComponent = () => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [symbol, setSymbol] = useState('SPY'); // Default symbol


  // Function to fetch data that can be called from useEffect or refresh button
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await dealerGammaService.getGammaData(symbol);
      const formattedData = dealerGammaService.transformGammaDataForTable(response);
      setTableData(formattedData);
      setError(null);
    } catch (error) {
      console.error(`Failed to fetch gamma data for ${symbol}:`, error);
      setError(error.message || `Failed to fetch gamma data for ${symbol}. Please try again later.`);
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchData();
  }, [symbol]); // Re-fetch when symbol changes
  
  // Handler for manual refresh
  const handleRefresh = () => {
    fetchData();
  };

  const columns = [
    { 
      key: 'symbol', 
      header: 'Symbol', 
      sortable: true,
      className: 'symbol-column'
    },
    { 
      key: 'zerogex', 
      header: 'Zero GEX', 
      sortable: true,
      className: 'numeric-column',
      formatter: (value) => typeof value === 'number' ? value.toFixed(2) : value
    },
    { 
      key: 'strike', 
      header: 'Strike', 
      sortable: true,
      className: 'numeric-column',
      formatter: (value) => typeof value === 'number' ? value.toFixed(2) : value
    },
    { 
      key: 'gamma', 
      header: 'Gamma', 
      sortable: true,
      className: 'numeric-column',
      formatter: (value) => typeof value === 'number' ? value.toFixed(4) : value
    }
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Gamma Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="gamma-data-container">
      <div className="controls">
        <select 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)}
          className="symbol-selector"
          disabled={isLoading}
        >
          <option value="SPY">SPY</option>
        </select>
        <button 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="refresh-button"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      <THFtable 
        data={tableData} 
        columns={columns}
        striped={true}
        bordered={true}
        hover={true}
        responsive={true}
        size="md"
        className="thf-gamma-table"
        headerClassName="thf-table-header"
        rowClassName="thf-table-row"
      />
    </div>
  );
};


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GammaDataComponent />
        <p>
          THF Component Lib Example App.
        </p>
      </header>
    </div>
  );
}

export default App;
