import { setTimeout } from 'timers';

const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class CustomD3Component extends D3Component {

  initialize(node, props) {
    const svg = this.svg = d3.select(node).append('svg').attr('width', 500).attr('height', 500);
    this.text = svg.append('text').style('font-size', 30).style('fill', 'blue').attr('dx', 100).attr('dy', 100).text(props.index);
  }

  update(props) {

    if (props.playing) {
      setTimeout(() => {
        this.props.updateProps({ index: props.index + 1 })
      }, 250);

    } else {

    }

    this.text.text(props.index);
  }
}

module.exports = CustomD3Component;
