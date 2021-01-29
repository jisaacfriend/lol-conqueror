import React from 'react';
import Button from 'react-bootstrap/Button';

class InstallLocator extends React.Component {
  clickHandler() {
    this.props.onPathChange();
  }

  renderContent() {
    if (this.props.isValid) return (
      <div className="install-success">
        <h3 className="text-success">League Client Install Found!</h3>
        <p className="text-white">{this.props.path}</p>
      </div>
    );

    if (this.props.path) return (
      <div className="install-invalid">
        <h3 className="install-error-message">Invalid application selected!</h3>
        <p className="">Please select your League of Legends app.</p>
        <br />
        <Button
          variant="primary"
          onClick={this.props.onPathChange}
          size="lg"
          block
        >
          Select Install Location
        </Button>
      </div>
    );

    return (
      <Button
        variant="primary"
        onClick={this.props.onPathChange}
        size="lg"
        block
      >
          Select Install Location
      </Button>
    );
  }

  render() {
    return (<div className="install-locator">{this.renderContent()}</div>);
  }
}

export default InstallLocator;