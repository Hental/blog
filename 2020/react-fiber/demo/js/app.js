let { createElement: h } = React;

class MyButton extends React.Component {
  render() {
    return h(
      "div",
      null,
      h(
        "button",
        {
          onClick: this.props.onPlus,
        },
        "+"
      ),
      h("span", null, this.props.num),
      h(
        "button",
        {
          onClick: this.props.onMinus,
        },
        "-"
      ),
      h(
        "button",
        {
          onClick: () => {
            setTimeout(() => {
              this.props.onChange(parseInt(String(Math.random() * 100)), 10);
            }, null);
          },
        },
        "lazy update"
      )
    );
  }
}

class MyApp extends React.Component {
  state = {
    num: 0,
  };

  UNSAFE_componentWillReceiveProps() {
    console.log("call componentWillReceiveProps");
  }

  UNSAFE_componentWillUpdate() {
    console.log("call componentWillUpdate");
  }

  UNSAFE_componentWillMount() {
    console.log("call componentWillMount");
  }

  componentDidUpdate() {
    console.log("call componentDidUpdate");
    console.log("current number:", this.state.num);
  }

  componentDidMount() {
    console.log("call componentDidMount");
  }

  minus = () => {
    this.setState({ num: -100 });
    this.setState((state) => {
      console.log('call setState callback');
      return { num: state.num - 1 };
    });
  };

  plus = () => {
    this.setState({ num: 100 });
    this.setState((state) => {
      console.log('call setState callback');
      return { num: state.num + 1 };
    });
  };

  change = v => {
    this.setState({ num: v })
  }

  render() {
    return h(MyButton, {
      num: this.state.num,
      onPlus: this.plus,
      onMinus: this.minus,
      onChange: this.change,
    });
  }
}

let element = h(MyApp);

export { element, MyApp };