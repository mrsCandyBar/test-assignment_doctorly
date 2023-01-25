import React from 'react';
import '../../assets/css/App.css';
import AutoComplete from '../../components/autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AutoComplete />
      </header>
    </div>
  );
}

export default App;
