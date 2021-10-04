import ConfigForm from './components/ConfigGUI';
import TextureEditor from './components/editor/TextureEditor';
import ModBuilder from './components/ModBuilder';

import './styles/sections.css';

function App() {
    return (
        <div 
            className='App'
            onDrop={(e) => e.preventDefault()}
        >
            <div id='sect_paint' className='primary-sect hidden'>
                <TextureEditor />
            </div>

            <div id='sect_config' className='primary-sect hidden'>
                <ConfigForm />
            </div>

            <div id='sect_builder' className='primary-sect'>
                <ModBuilder />
            </div>
        </div>
    );
}

export default App;
