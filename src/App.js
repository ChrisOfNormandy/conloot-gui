import './styles/App.css';

// import { ConfigForm } from './components/ConfigGUI';
import { NavBar } from './components/NavBar';
import { TextureEditor } from './components/TextureEditor';

function App() {
  return (
    <div className="App">
      <header><NavBar /></header>
      <main>
        <TextureEditor />
        {/* <ConfigForm /> */}
        <div id='debug'></div>
      </main>
      <footer>
        <div>Built by ChrisOfNormandy.</div>
        <div>Join <a href='https://discord.gg/EW5JsGJfdt'>Discord</a></div>
      </footer>
    </div>
  );
}

export default App;
