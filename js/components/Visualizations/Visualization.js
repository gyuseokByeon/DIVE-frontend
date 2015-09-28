import React, { Component, PropTypes } from 'react';

import styles from './visualizations.sass';

require('plottable');

class InnerPlottable extends Component {
  componentWillReceiveProps (nextProps) {
    const { vizType, generatingProcedure, id, args } = nextProps.spec;

    const visualizationData = nextProps.data;
    const selector = `.spec-${id}`;

    var plot, dataset, xScale, yScale, xAxis, yAxis, xLabel, yLabel, xAccessor, yAccessor;

    if (vizType == "pie" || vizType == "tree") {
      var scale = new Plottable.Scales.Linear();

      var colorScale = new Plottable.Scales.InterpolatedColor();
      colorScale.range(["#BDCEF0", "#5279C7"]);

      var itemAccessor, valueAccessor;

      if(generatingProcedure == "val:count") {
        itemAccessor = 'value';
        valueAccessor = 'count';
      }
      if(generatingProcedure == "val:agg") {
        itemAccessor = 'value';
        valueAccessor = 'agg';
      }

      var valKeyCollection = [];
      visualizationData.forEach(function (d, i, dataset) {
        var newObj = {};

        var value = d[valueAccessor];
        newObj[valueAccessor] = value;
        valKeyCollection.push(newObj);
      });

      dataset = new Plottable.Dataset(valKeyCollection);
      plot = new Plottable.Plots.Pie();

      plot.addDataset(dataset)
        .sectorValue((d) => d[valueAccessor], scale)
        .attr('fill', (d) => d[valueAccessor], colorScale)
        .labelsEnabled(true)
        .renderTo(selector);
    
    } else if (vizType == "bar" || vizType == "hist") {

      if (generatingProcedure == 'val:count') {
        xAccessor = 'value';
        yAccessor = 'count';
        xLabel = args.fieldA.name;
        yLabel = 'count';
      } else if (generatingProcedure == 'bin:agg') {
        xAccessor = 'bin';
        yAccessor = 'value';
        xLabel = args.binningField.name;
        yLabel = args.aggFieldA.name;
      } if (generatingProcedure == 'val:val') {
        xAccessor = 'x';
        yAccessor = 'y';
        xLabel = args.fieldA.name;
        yLabel = args.fieldB.name;
      } if (generatingProcedure == 'val:agg') {
        xAccessor = 'value';
        yAccessor = 'agg';
        xLabel = args.groupedField.name;
        yLabel = args.aggField.name;
      }

      plot = new Plottable.Plots.Bar();

      const xDomain = visualizationData.map((d) => d[xAccessor]);
      xScale = new Plottable.Scales.Category().domain(xDomain);
      yScale = new Plottable.Scales.Linear();

      xAxis = new Plottable.Axes.Category(xScale, "bottom");
      yAxis = new Plottable.Axes.Numeric(yScale, "left");

      xLabel = new Plottable.Components.AxisLabel(xLabel);
      yLabel = new Plottable.Components.AxisLabel(yLabel, -90);

      dataset = new Plottable.Dataset(visualizationData);

      plot.addDataset(dataset)
        .x((d) => d[xAccessor], xScale)
        .y((d) => d[yAccessor], yScale)

      plot.animated(false);
      plot.renderTo(selector);

    } else if (vizType == "line") {
      if (generatingProcedure == 'ind:val') {
        xAccessor = 'index';
        yAccessor = 'value';
        xLabel = 'index';
        yLabel = args.fieldA.label;
      }

      plot = new Plottable.Plots.Line();

      xScale = new Plottable.Scales.Linear();
      yScale = new Plottable.Scales.Linear();

      xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
      yAxis = new Plottable.Axes.Numeric(yScale, "left");

      xLabel = new Plottable.Components.AxisLabel(xLabel);
      yLabel = new Plottable.Components.AxisLabel(yLabel, -90);

      dataset = new Plottable.Dataset(visualizationData);

      plot.addDataset(dataset)
        .x((d) => d[xAccessor], xScale)
        .y((d) => d[yAccessor], yScale);

      plot.animated(false);
      plot.renderTo(selector);
    }
    
  } 

  render() {
    return (
      <span></span>
    );
  }
}

InnerPlottable.propTypes = {
  spec: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default class Visualization extends Component {
  render() {
    const { data, spec, containerClassName } = this.props;
    return (
      <div className={ styles[containerClassName] }>
        <svg className={ `spec-${spec.id}` }></svg>
        <InnerPlottable spec={ spec } data={ data } />
      </div>
    );
  }
}

Visualization.propTypes = {
  spec: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  containerClassName: PropTypes.string.isRequired
};
