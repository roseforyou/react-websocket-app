import React from 'react';

class CommonInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputChange = this.inputChange.bind(this);
  }

  inputChange(e) {
    this.props.onInputChange(e.target.value, this.props.label);
  }

  render() {
    return (
      <div className="field">
        <label className="label">{this.props.label}:</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder={this.props.placeholder}
            value={this.props.value}
            disabled={this.props.disabled || false}
            onChange={this.inputChange}
          />
        </div>
      </div>
    );
  }
}

export default CommonInput;
