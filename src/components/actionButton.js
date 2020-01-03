/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.clickEvent = this.clickEvent.bind(this);
  }

  clickEvent() {
    if (!this.props.disabled) {
      this.props.action();
    }
  }

  render() {
    this.btnClass = this.props.btnClass ? ` ${this.props.btnClass}` : '';
    this.isLoading = this.props.isLoading ? ` is-loading` : '';

    this.pointerEvent = this.props.isLoading
      ? {
          pointerEvent: 'none',
        }
      : {
          pointerEvent: 'auto',
        };
    return (
      <div className="control">
        <a
          className={`button${this.btnClass}${this.isLoading}`}
          disabled={this.props.disabled}
          onClick={this.clickEvent}
          style={this.pointerEvent}
        >
          {this.props.text}
        </a>
      </div>
    );
  }
}

export default ActionButton;
