import { useState, useEffect } from 'react';
import { ApiClient,
  DealerGammaService,
  THFtable
} from 'thf-labs';
import './css/App.css';

const apiClient = ApiClient.getInstance();
apiClient.setApiKey('your-api-key'); // Optional: Set API key if required


const GammaDataComponent = () => {
  const [tableData, setTableData] = useState([]);
  const dealerGammaService = DealerGammaService.getInstance();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dealerGammaService.getGammaData('SPY');
        const formattedData = dealerGammaService.transformGammaDataForTable(response);
        setTableData(formattedData);
      } catch (error) {
        console.error('Failed to fetch gamma data:', error);
      }
    };

    fetchData();
  }, [dealerGammaService]);

  const columns = [
    { key: 'symbol', header: 'Symbol', sortable: true },
    { key: 'zerogex', header: 'Zero GEX', sortable: true },
    { key: 'strike', header: 'Strike', sortable: true },
    { key: 'gamma', header: 'Gamma', sortable: true }
  ];

  return <THFtable data={tableData} columns={columns} />;
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
