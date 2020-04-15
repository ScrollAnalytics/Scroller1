// D3 LINE CHART MODULE IN .scroller NAMESPACE //
d3.scroller = {};

var format = d3.format('.2s');

d3.scroller.line = function module() {
    // DEFINE DEFAULT VARIABLES //
    var chart = d3.select('.chart'),
        margin = {
            top: 35,
            right: 10,
            bottom: 30,
            left: 35
        };

    function exports(_selection) {
        _selection.each(function(_data) {
            data = _data;
            console.log(data);
            var isThisYear = true;
            var chart = d3.select('.chart');
            chart.html('');

            var tooltip = d3.select("body").append("div").attr("class", "toolTip");

            var title = chart.append('div')
                .attr('class', 'chart-title')
                .html('<h3>Revenue by Date</h3>');

            //Create select box for filtering:
            var selectData = [];

            data.forEach(function(item) {
                selectData.push(item.key);
            })

            var select = d3.select('.chart').append('select')
                .attr('class', 'custom-select')
                .on('change', onchange);

            var options = select.selectAll('option')
                .data(selectData).enter()
                .append('option')
                .text(function(d) {
                    return d;
                });

            function onchange() {
                selectValue = d3.select('select').property('value')
                if (selectValue == '2018') {
                    createLineChart(_data[0].values)
                } else {
                    createLineChart(_data[1].values)
                }
            };
            //End select box creation

            function createLineChart(chartData) {
                data = chartData;
                d3.select('svg').remove();
                d3.select('#no-data').remove();

                var seed = [];
                data.forEach(function(d, i) {
                    var item = {
                        'key': '',
                        'value': 0
                    };
                    item.key = data[i].key;
                    seed.push(item);
                });

                var width = chart.node().getBoundingClientRect().width - margin.left - margin.right, //Calculated width based on browser size
                    height = chart.node().getBoundingClientRect().height - margin.top - margin.bottom - 50, //Calculated height based on browser size;
                    t = d3.transition().duration(750);

                var svg = chart.append('svg')
                    .attr('class', 'svg')
                    .attr('width', width)
                    .attr('height', height);

                var g = svg.append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var xScale = d3.scaleBand().rangeRound([0, width - margin.left - margin.right]).padding(1);
                var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

                var line = d3.line()
                    .x(function(d) {
                        return xScale(d.key);
                    })
                    .y(function(d) {
                        return yScale(d.value);
                    });

                xScale.domain(data.map(function(d) {
                    return d.key;
                }));
                yScale.domain([0, d3.max(data, function(d) {
                    return d.value;
                })]).nice();

                var xAxis = g.append("g")
                    .attr("class", "axis x")
                    .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
                    .call(d3.axisBottom(xScale))
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.9em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");

                var yAxis = g.append("g")
                    .attr("class", "axis y")
                    .call(d3.axisLeft(yScale)
                        .ticks(5)
                        .tickFormat(d3.format(".0s")));

                g.append("path")
                    .datum(seed)
                    .attr("class", "line")
                    .attr('id', 'path-interpolate')
                    .attr("d", line);

                d3.select('#path-interpolate')
                    .datum(data)
                    .transition()
                    .duration(1000)
                    .delay(200)
                    .attrTween('d', function(d) {
                        let previous = d3.select(this).attr('d')
                        let current = line(d)
                        return d3.interpolatePath(previous, current)
                    })

                var circles = g.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "circle")
                    .attr("cx", function(d) {
                        return xScale(d.key);
                    })
                    .attr("cy", height - margin.top - margin.bottom)
                    .attr("r", 4)
                    .on("mousemove", function(d) {
                        tooltip
                            .style("left", d3.event.pageX + 10 + "px")
                            .style("top", d3.event.pageY + 30 + "px")
                            .style("display", "inline-block")
                            .html(function() {
                                var text = '<p class="total">' + d.key + ' Total: <strong>' + format(d.value) + '</strong></p>';
                                return text;
                            });
                    })
                    .on("mouseout", function(d) {
                        tooltip.style("display", "none")
                    })
                    .transition().duration(1000).delay(200)
                    .attr("cx", function(d) {
                        return xScale(d.key);
                    })
                    .attr("cy", function(d) {
                        return yScale(d.value);
                    });

                var dynamicText2 = 'This is a line chart. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
                d3.select('.step2').select('p')
                    .html(dynamicText2);
            }
		
            function resize() {
                var chart = d3.select('.chart'),
                    t = d3.transition().duration(100),
                    t2 = d3.transition().duration(1000),
                    width = chart.node().getBoundingClientRect().width - margin.left - margin.right, //Calculated width based on browser size
                    height = chart.node().getBoundingClientRect().height - margin.top - margin.bottom - 50; //Calculated height based on browser size;

                var xScale = d3.scaleBand().rangeRound([0, width - margin.left - margin.right]).padding(1);
                var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

                var line = d3.line()
                    .x(function(d) {
                        return xScale(d.key);
                    })
                    .y(function(d) {
                        return yScale(d.value);
                    });

                xScale.domain(data.map(function(d) {
                    return d.key;
                }));
                yScale.domain([0, d3.max(data, function(d) {
                    return d.value;
                })]).nice();

                d3.select('.svg').attr("width", width).attr("height", height);

                d3.select('.x').transition(t2).attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")").call(d3.axisBottom(xScale));
                d3.select('.y').transition(t2).call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".0s")));

                d3.select('#path-interpolate')
                    .datum(data)
                    .transition(t)
                    .attrTween('d', function(d) {
                        let previous = d3.select(this).attr('d')
                        let current = line(d)
                        return d3.interpolatePath(previous, current)
                    })

                var circles = d3.selectAll(".circle").data(data);

                circles.transition(t)
                    .attr("cx", function(d) {
                        return xScale(d.key);
                    })
                    .attr("cy", function(d) {
                        return yScale(d.value);
                    });
            }
            // Redraw based on the new size whenever the browser window is resized.
            window.addEventListener("resize", resize);
            createLineChart(_data[0].values);
        });
    }

    // END MODULE //

    //----------------------------------------------------------------------------------------------------------------//

    // GETTERS AND SETTERS //

    exports.width = function(x) {
        if (!arguments.length) return width;
        width = x;
        return this;
    };

    exports.height = function(x) {
        if (!arguments.length) return height;
        height = x;
        return this;
    };
    return exports;
};

// END GETTERS AND SETTERS //

//----------------------------------------------------------------------------------------------------------------//

// CREATE VERTICAL BAR CHART INSTANCE //
var lineChart = d3.scroller.line();
