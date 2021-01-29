import React from 'react';
import Button from 'react-bootstrap/Button';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { ipcRenderer } = window.require('electron');

class SettingsPane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      sources: {},
      options: {},
    };
  }

  componentDidMount = () => {
    const { sources, options } = ipcRenderer.sendSync('get-settings');

    this.setState({ sources, options });
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
  }

  restoreDefaultSettings = () => {
    console.log('Restore Default Settings');
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
        <div key={source} className={sourceIsSupported.toString()}>
          <span>{source}
            <Button id={source} className={sourceStatus} size="sm" onClick={this.updateSource} disabled={disabled}>{sourceStatus}</Button>
          </span>
        </div>
      );
    });

    const optionsState = Object.entries(this.state.options).map(([option, status]) => {
      const optionStatus = status === true
        ? 'enabled'
        : 'disabled';

      return (
        <div key={option}>
          <span>{option}
            <Button id={option} className={optionStatus} size="sm" onClick={this.updateOption}>{optionStatus}</Button>
          </span>
        </div>
      );
    });

    return {
      sourcesState,
      optionsState,
    };
  }

  renderContent() {
    const { sourcesState, optionsState } = this.processSettings();

    return this.props.isValid
      ? (<div className="settings-pane">
          <div className="settings-controls">
            <FontAwesomeIcon icon={faUndo} title="Restore Defaults" id="restoreDefaultSettings" className="save-icon" onClick={this.restoreDefaultSettings} />
            <FontAwesomeIcon icon={faSave} title="Save Settings" id="saveSettings" className="save-icon" onClick={this.saveSettings} />
          </div>
          <h4 className="settings-heading">Sources</h4>
          {sourcesState}
          <br />
          <h4 className="settings-heading">Options</h4>
          {optionsState}
        </div>)
      : null;
  }

  render() {
    return this.renderContent();
  }
}

export default SettingsPane;
