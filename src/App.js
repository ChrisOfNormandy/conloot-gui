import './styles/App.css';

// import { ConfigForm } from './components/ConfigGUI';
import { TextureEditor } from './components/editor/TextureEditor';

function App() {
  return (
    <div className="App">
      <TextureEditor />
      {/* <ConfigForm /> */}
      <div
        id='debug'
      />
    </div>
  );
}

export default App;
