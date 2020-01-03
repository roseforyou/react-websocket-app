import 'bulma/css/bulma.css';
import React from 'react';
import CommonInput from './components/commonInput';
import MsgButton from './components/msgButton';
import ActionButton from './components/actionButton';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.inputChangeHandle = this.inputChangeHandle.bind(this);
    this.receiveMsgHandle = this.receiveMsgHandle.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.clearLogs = this.clearLogs.bind(this);
    this.socketHandle = this.socketHandle.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.addLog = this.addLog.bind(this);

    this.ws = null;

    this.state = {
      token: '',
      roomID: '',
      message: '',
      logs: '',
      connectBtnDisabled: true,
      disconnectBtnDisabled: true,
      sendBtnDisabled: true,
      connectIsLoading: false,
      disconnectIsLoading: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem('wsToken')) {
      this.inputChangeHandle(localStorage.getItem('wsToken'), 'Token');
    }

    if (localStorage.getItem('wsRoomID')) {
      this.inputChangeHandle(localStorage.getItem('wsRoomID'), 'RoomID');
    }
  }

  buttonsStatus() {
    if (this.state.disconnectBtnDisabled && this.state.token && this.state.roomID) {
      this.setState({ connectBtnDisabled: false });
    } else {
      this.setState({ connectBtnDisabled: true });
    }
  }

  inputChangeHandle(value, label) {
    if (label === 'Token') {
      this.setState({ token: value }, () => {
        this.buttonsStatus();
        localStorage.setItem('wsToken', this.state.token);
      });
    } else if (label === 'RoomID') {
      this.setState({ roomID: value }, () => {
        this.buttonsStatus();
        localStorage.setItem('wsRoomID', this.state.roomID);
      });
    } else if (label === 'Message') {
      this.setState({
        message: value,
        sendBtnDisabled: !(value && !this.state.disconnectBtnDisabled),
      });
    }
  }

  receiveMsgHandle(message) {
    this.inputChangeHandle(message, 'Message');
  }

  socketHandle() {
    this.ws.onopen = () => {
      this.sendMsg(`I'm coming!`);
      this.setState({
        connectBtnDisabled: true,
        disconnectBtnDisabled: false,
        sendBtnDisabled: false,
        connectIsLoading: false,
      });
    };
    this.ws.onclose = () => {
      this.addLog('DISCONNECTED');
      this.setState({
        connectBtnDisabled: false,
        disconnectBtnDisabled: true,
        sendBtnDisabled: true,
        disconnectIsLoading: false,
      });
    };
    this.ws.onmessage = event => {
      this.addLog('Received: ' + event.data);
    };
    this.ws.onerror = event => {
      this.addLog('Error: ' + event.data);
    };
  }

  connect() {
    this.setState({
      connectIsLoading: true,
    });
    this.ws = new WebSocket(
      `wss://connect.websocket.in/v2/${this.state.roomID}?token=${this.state.token}`
    );
    this.socketHandle();
  }

  disconnect() {
    this.setState({
      disconnectIsLoading: true,
    });
    this.ws.close();
  }

  sendMsg(msg) {
    const txt = msg ? msg : this.state.message;
    if (txt.trim()) {
      this.ws.send(txt);
      this.addLog(`Emitted: ${txt}`);
    }
  }

  addLog(txt) {
    this.setState({
      logs: `${this.state.logs ? `${this.state.logs}\r\n> ${txt}` : `> ${txt}`}`,
    });
  }

  clearLogs() {
    this.setState({
      logs: '> Console cleared',
    });
  }

  render() {
    return (
      <div className="App">
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">WebSocket</h1>
              <h2 className="subtitle">To test websocket!</h2>
              <CommonInput
                label="Token"
                placeholder="Token"
                value={this.state.token}
                onInputChange={this.inputChangeHandle}
              ></CommonInput>

              <CommonInput
                label="RoomID"
                placeholder="RoomID"
                value={this.state.roomID}
                onInputChange={this.inputChangeHandle}
              ></CommonInput>
              <div className="field is-grouped">
                <ActionButton
                  text="Connect"
                  disabled={this.state.connectBtnDisabled}
                  isLoading={this.state.connectIsLoading}
                  action={this.connect}
                ></ActionButton>
                <ActionButton
                  text="Disconnect"
                  disabled={this.state.disconnectBtnDisabled}
                  isLoading={this.state.disconnectIsLoading}
                  action={this.disconnect}
                ></ActionButton>
              </div>

              <div className="field">
                <label className="label">Quick Msg:</label>
                <div className="field is-grouped is-grouped-multiline">
                  <MsgButton
                    btnClass="is-link"
                    value="Are you online"
                    receiveMsg={this.receiveMsgHandle}
                  ></MsgButton>
                  <MsgButton
                    btnClass="is-info"
                    value="Please open url"
                    receiveMsg={this.receiveMsgHandle}
                  ></MsgButton>
                  <MsgButton
                    btnClass="is-success"
                    value="Please get page info"
                    receiveMsg={this.receiveMsgHandle}
                  ></MsgButton>
                </div>
              </div>

              <CommonInput
                label="Message"
                placeholder="Message"
                value={this.state.message}
                onInputChange={this.inputChangeHandle}
              ></CommonInput>

              <div className="field is-grouped">
                <ActionButton
                  text="Send"
                  btnClass="is-primary"
                  disabled={this.state.sendBtnDisabled}
                  action={this.sendMsg}
                ></ActionButton>
              </div>

              <div className="field">
                <label className="label">Log:</label>
                <div className="control">
                  <textarea
                    className="textarea log is-info"
                    rows="10"
                    readOnly
                    value={this.state.logs}
                  ></textarea>
                </div>
              </div>

              <div className="field is-grouped">
                <ActionButton
                  text="Clear log"
                  disabled={false}
                  action={this.clearLogs}
                ></ActionButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
