import React from 'react';
import Header from './components/Header';
import InstallLocator from './components/InstallLocator';
import MainControls from './components/MainControls';
import Footer from './components/Footer';
import './App.css';

const { ipcRenderer } = window.require('electron');
class App extends React.Component {
  constructor(props) {
    super(props);

    this.setInstallPath = this.setInstallPath.bind(this);
    this.state = { installIsValid: false, installPath: '', supportedSources: [] };
  }

  setInstallPath() {
    let { isValid, selectedPath } = ipcRenderer.sendSync('get-install-path');
    this.setState({ installIsValid: isValid, installPath: selectedPath });
  }

  componentDidMount() {
    ipcRenderer.on('init-config', (_e, config) => {
      console.log(config)
      this.setState(config);
    });
  }

  render() {
    const installIsValid = this.state.installIsValid;
    const installPath = this.state.installPath;
    const supportedSources = this.state.supportedSources;

    console.log(supportedSources)

    return (
      <div className="App">
        <Header></Header>
        <hr />
        <div className="main">
          <InstallLocator isValid={installIsValid} path={installPath} onPathChange={this.setInstallPath}></InstallLocator>
          <MainControls isValid={installIsValid} supportedSources={supportedSources}></MainControls>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}
export default App;
