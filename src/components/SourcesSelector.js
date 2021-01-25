import { ipcRenderer } from 'electron';
import React from 'react';
import Form from 'react-bootstrap/Form';

class Sources extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const sources = ipcRenderer.sendSync('get-sources');

    this.setState({ sources });

    console.log(this.state)
  }

  renderContent() {
    console.log(this.props.sources);

    // const sources = Object.entries(this.state.sources).map(([source, status]) => {
    //   return (
    //     <Form.Check
    //       inline
    //       key={source}
    //       type="checkbox"
    //       id={source}
    //       label={source}
    //       defaultChecked={status}
    //     />
    //   );
    // });

    const sources = 'foo';

    return this.props.isValid
      ? (
          <div className="sources-selector">
            <h4 className="text-center sources-title">Sources</h4>
            <div className="sources-selector-contents">
              <Form>
                {sources}
              </Form>
            </div>
          </div>
        )
      : <p>Please select a valid League of Legends install!</p>
  }

  render() {
    return this.renderContent();
  }
}

export default Sources;
