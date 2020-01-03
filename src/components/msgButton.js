/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

class MsgButton extends React.Component {
  constructor(props) {
    super(props);
    this.setMessage = this.setMessage.bind(this);
  }

  setMessage() {
    this.props.receiveMsg(this.props.value);
  }

  render() {
    return (
      <div className="control">
        <a className={`button quick-input ${this.props.btnClass}`} onClick={this.setMessage}>
          {this.props.value}
        </a>
      </div>
    );
  }
}

export default MsgButton;
