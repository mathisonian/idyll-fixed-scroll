import React from 'react';
import ReactDOM from 'react-dom';

class Content extends React.PureComponent {
  render () {
    return <div>
      {this.props.children}
    </div>
  }
}

class Step extends React.PureComponent {
  render () {
    return <div className="step" style={this.props.style}>
      {this.props.children}
    </div>
  }
}

let id = 0;
class Feature extends React.PureComponent {
  constructor (props) {
    super(props)
    this.setFeature = this.setFeature.bind(this);
    this.setRoot = this.setRoot.bind(this);
    this.id = id++;
    this.state = {
      bottom: false,
      sticky: false
    };

    this.downCount = 0;
    this.upCount = 0;
  }

  setRoot (c) {
    this.rootEl = c;
    this.initialize();
  }

  setFeature (c) {
    this.featureEl = c;
    this.initialize();
  }

  handleResize () {
  }

  handleStepEnter({ index }) {
    this.props.updateProps({ index });
  }

  handleContainerEnter(response) {
    this.setState({
      sticky: true,
      bottom: false
    })
  }

  handleContainerExit(response) {
    console.log('response direction', response.direction);
    console.log(response);
    if (response.direction === 'down') {
      this.downCount++;
    } else {
      this.upCount++;
    }
    this.setState({
      sticky: false,
      bottom: (this.upCount > 0 || this.downCount > 0) ? (this.upCount > this.downCount ? false : true) : response.direction === 'down'
    })
  }

  getId() {
    return `feature-${this.id}`;
  }

  initialize () {
    if (!this.rootEl || !this.featureEl) return;
    setInterval(() => {
      this.downCount = 0;
      this.upCount = 0;
    }, 500);
    const scrollama = require('scrollama');
    const scroller = scrollama();
    this.handleResize();

    // $graphic.classed('is-fixed', true);
    // $graphic.classed('is-bottom', false);
    // 2. setup the scrollama instance
    // 3. bind scrollama event handlers (this can be chained like below)
    const id = `#${this.getId()}`;
    scroller
      .setup({
        container: id, // our outermost scrollytelling element
        graphic: `${id} .content`, // the graphic
        text: `${id} .step-container`, // the step container
        step: `${id} .step-container .step`
      })
      .onStepEnter(this.handleStepEnter.bind(this))
      .onContainerEnter(this.handleContainerEnter.bind(this))
      .onContainerExit(this.handleContainerExit.bind(this));

    // setup resize event
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  unwrapChild(c) {
    if (c => c.type.name && c.type.name.toLowerCase() === 'wrapper') {
      return c.props.children[0];
    }
    return c;
  }

  unwrapChildren() {
    return this.props.children.map((c) => this.unwrapChild(c));
  }

  splitFeatureChildren() {
    const unwrapped = this.unwrapChildren();
    return React.Children.toArray(this.props.children).reduce((memo, child, i) => {
      const c = unwrapped[i];
      if (!c.type) {
        memo[1] = memo[1].concat([child]);
        return memo;
      }
      if ((c.type.name && c.type.name.toLowerCase() === 'content') || c.type.prototype instanceof Content) {
        memo[0] = child;
      } else {
        memo[1] = memo[1].concat([child]);
      }
      return memo;
    }, [undefined, []]);
  }

  render () {
    let feature;
    // let ps = this.state.scrollState;
    // let featureStyles = {
    //   width: 'calc(100vw - 15px)',
    //   overflowX: 'hidden',
    //   height: '100vh',
    //   marginLeft: ps === 1 ? 0 : (this.state.featureMarginLeft + 'px'),
    //   position: ps >= 1 ? 'fixed' : 'absolute',
    //   bottom: ps === 2 ? 0 : 'auto',
    //   zIndex: -1
    // };

    // if (ps === 1) {
    //   featureStyles.top = 0;
    //   featureStyles.right = 0;
    //   featureStyles.bottom = 0;
    //   featureStyles.left = 0;
    // }

    // let rootStyles = {
    //   position: 'relative',
    //   marginLeft: 0,
    //   marginRight: 0,
    //   maxWidth: 'none'
    // };

    const [ featureChild, nonFeatureChildren ] = this.splitFeatureChildren();

    if (featureChild) {
      const unwrapped = this.unwrapChild(featureChild);
      if (featureChild !== unwrapped) {
        // React.Children.only(featureChild.props.children);
        feature = React.cloneElement(featureChild, {
          children: React.cloneElement(React.Children.toArray(featureChild.props.children)[0], {
            // style: featureStyles,
            ref: (ref) => this.setFeature(ref)
          })
        });
      } else {
        feature = React.cloneElement(featureChild, {
          // style: featureStyles,
          ref: (ref) => this.setFeature(ref)
        });
      }
    }


    return (
      <div
        className="feature-container"
        id={`feature-${this.id}`}
        ref={(ref) => { return this.setRoot(ref) }} >
        <div className={`content ${this.state.sticky ? 'is-fixed' : ''} ${this.state.bottom ? 'is-bottom' : ''}`}>
          {feature}
        </div>
        <div className="step-container">
          {nonFeatureChildren}
        </div>
      </div>
    );
  }
}

Feature.defaultProps = {
  children: []
};

export { Content, Step, Feature as default };
