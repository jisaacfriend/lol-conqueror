import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { ipcRenderer } = window.require('electron');

class MainControls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      sources: {},
      options: {},
      isImporting: false,
      isDeleting: false,
    };
  }

  componentDidMount = () => {
    const { sources, options, champions } = ipcRenderer.sendSync('get-settings');

    this.setState({ sources, options, champions });
  }

  updateSource = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    const currentStatus = this.state.sources[e.target.id];
    this.setState({ sources: { ...this.state.sources, [e.target.id]: !currentStatus }});
  }

  updateOption = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    const currentStatus = this.state.options[e.target.id];
    this.setState({ options: { ...this.state.options, [e.target.id]: !currentStatus }});
  }

  saveSettings = () => {
    console.log('Save Settings');
    ipcRenderer.invoke('save-settings', { sources: this.state.sources, options: this.state.options })
      .then((res) => console.log(res));
  }

  restoreDefaultSettings = () => {
    console.log('Restore Default Settings');
    ipcRenderer.invoke('restore-options')
      .then(({ sources, options }) => this.setState({ sources, options }));
  }

  simRequest = () => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  importPages = () => {
    this.setState({ isImporting: true });
    // this.simRequest().then(() => this.setState({ isImporting: false }));
    ipcRenderer.invoke('import-pages', { sources: this.state.sources, options: this.state.options })
      .then((res) => {
        console.log(res);
        this.setState({ isImporting: false });
      });
  }

  showChampSelector = () => {
    this.setState({ showModal: true });
  }

  processChampOptions = () => {
    this.setState({ showModal: false });
  }

  deletePages = () => {
    this.setState({ isDeleting: true });
    // this.simRequest().then(() => this.setState({ isDeleting: false }));
    ipcRenderer.invoke('delete-pages', { sources: this.state.sources, options: this.state.options })
      .then((res) => {
        console.log(res);
        this.setState({ isDeleting: false });
      });
  }

  processSettings = () => {
    const sourcesState = Object.entries(this.state.sources).map(([source, status]) => {
      const sourceIsSupported = this.props.supportedSources.includes(source)
        ? 'supported'
        : 'unsupported';

      const sourceStatus = status === true
        ? 'enabled'
        : 'disabled';

      const disabled = sourceIsSupported === 'unsupported';

      return (
        <div key={source} className={`settings-line ${sourceIsSupported.toString()}`}>
          <p>{source}</p>
          <Button id={source} className={`settings-toggle ${sourceStatus}`} size="sm" onClick={this.updateSource} disabled={disabled}>{sourceStatus}</Button>
        </div>
      );
    });

    const optionsState = Object.entries(this.state.options).map(([option, status]) => {
      const optionStatus = status === true
        ? 'enabled'
        : 'disabled';

      return (
        <div className="settingsLine" key={option}>
          <p>{option}</p>
          <Button id={option} className={`settings-toggle ${optionStatus}`} size="sm" onClick={this.updateOption}>{optionStatus}</Button>
        </div>
      );
    });

    return {
      sourcesState,
      optionsState,
    };
  }

  renderModal = () => {
    return (
      <Modal show={this.state.showModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.processChampOptions}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  renderContent() {
    const { sourcesState, optionsState } = this.processSettings();
    const champSelectModal = this.renderModal();

    return this.props.isValid
      ? (<>
          {champSelectModal}
          <div className="main-controls">
            <div className="settings-pane">
              <div className="settings-controls">
                <FontAwesomeIcon icon={faUndo} title="Restore Last Saved Settings" className="control-icon" onClick={this.restoreDefaultSettings} />
                <FontAwesomeIcon icon={faSave} title="Save Settings" className="control-icon" onClick={this.saveSettings} />
              </div>
              <h4 className="settings-heading">Sources</h4>
              {sourcesState}
              <br />
              <h4 className="settings-heading">Options</h4>
              {optionsState}
              <div className="champion-selector">
                <Button
                  className="champion-select"
                  disabled={this.state.isImporting || this.state.isDeleting}
                  onClick={this.showChampSelector}
                >
                  Select Champions
                </Button>
              </div>
            </div>
            <div className="control-buttons">
              <Button
                disabled={this.state.isImporting || this.state.isDeleting}
                onClick={this.importPages}
              >
                {this.state.isImporting ? <Spinner as="span" animation="border" size="sm" role="status" /> : 'Import Items'}
              </Button>
              <Button
                className="delete-button"
                disabled={this.state.isImporting || this.state.isDeleting}
                onClick={this.deletePages}
              >
                {this.state.isDeleting ? <Spinner as="span" animation="border" size="sm" role="status" /> : 'Delete Items'}
              </Button>
            </div>
          </div>
        </>)
      : null;
  }

  render() {
    return this.renderContent();
  }
}

export default MainControls;
