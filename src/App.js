import React from 'react';
import Header from './components/Header';
import InstallLocator from './components/InstallLocator';
import Footer from './components/Footer';
import './App.css';

const { ipcRenderer } = window.require('electron');
class App extends React.Component {
  constructor(props) {
    super(props);

    this.setInstallPath = this.setInstallPath.bind(this);
    this.state = {};
  }

  setInstallPath() {
    let { isValid, selectedPath } = ipcRenderer.sendSync('get-install-path');
    this.setState({ installIsValid: isValid, installPath: selectedPath });
  }

  componentDidMount() {
    ipcRenderer.on('init-config', (_e, config) => {
      this.setState(config);
    });
  }

  render() {
    const installIsValid = this.state.installIsValid;
    const installPath = this.state.installPath;

    return (
      <div className="App">
        <Header></Header>
        <hr />
        <div className="main">
          <InstallLocator isValid={installIsValid} path={installPath} onPathChange={this.setInstallPath}></InstallLocator>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}
export default App;
