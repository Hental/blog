import React from 'react';

class App extends React.Component<any, { num: number }> {
  state = {
    num: 0,
  };

  setState: React.Component<any, { num: number }>['setState'] = (arg: any) => {
    console.log('set state', arg);
    console.log('instance', this);
    return super.setState(arg);
  }

  UNSAFE_componentWillReceiveProps() {
    console.log('call componentWillReceiveProps');
  }

  UNSAFE_componentWillUpdate() {
    console.log('call componentWillUpdate');
  }

  UNSAFE_componentWillMount() {
    console.log('call componentWillMount');
  }

  componentDidUpdate() {
    console.log('call componentDidUpdate');
  }

  componentDidMount() {
    console.log('call componentDidMount');
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState(state => ({ num: state.num + 1 }))}>+</button>
        <span>{this.state.num}</span>
        <button onClick={() => this.setState(state => ({ num: state.num - 1 }))}>-</button>
      </div>
    );
  }
}

export default App;
