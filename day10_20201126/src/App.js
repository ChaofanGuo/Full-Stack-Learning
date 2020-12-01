import logo from './logo.svg';
import './App.css';
import FormTest from "./form/formTest";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FormTest />
      </header>
    </div>
  );
}

export default App;
