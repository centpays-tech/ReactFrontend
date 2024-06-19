import React, { Component } from 'react';
import '../../style/main.css'; 

class CopyToClipboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copySuccess: '',
      isZooming: false
    };
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.props.text);
      this.setState({ isZooming: true });

      setTimeout(() => {
        this.setState({ isZooming: false });
      }, 500);
    } catch (err) {
      this.setState({ copySuccess: 'Failed to copy!' });
    }
  }

  handleAnimationEnd() {
    this.setState({ isZooming: false });
  }

  render() {
    const { isZooming } = this.state;
    const textClass = isZooming ? 'zoom' : '';

    return (
      <div>
        <p
          onClick={this.copyToClipboard}
          className={textClass}
          style={{ cursor: 'pointer', fontWeight: '500', fontSize:'14px', margin:'0', padding:'0' }}
          onAnimationEnd={this.handleAnimationEnd}
        >
          {this.props.text}
        </p>
        {this.state.copySuccess && <span>{this.state.copySuccess}</span>}
      </div>
    );
  }
}

export default CopyToClipboard;
