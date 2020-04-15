// D3 VERTICAL BAR CHART MODULE IN .scroller  NAMESPACE //
d3.scroller = {};

var format = d3.format('.0s');

d3.scroller.verticalBar = function module() {
    function exports(_selection) {
        _selection.each(function(_data) {
            var data = _data;
            var isProgramLength = true;
            var chart = d3.select('.chart');
            chart.html("");

            var tooltip = d3.select("body").append("div").attr("class", "toolTip");

            var title = chart.append('div')
                .attr('class', 'chart-title')
                .html('<h3>Revenue by Product Type</h3>');

            //Create select box for filtering:
            var selectData = ["Revenue by Product Type", "Revenue by Sales Agent"];

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
                selectValue = d3.select('select').property('value');
                if (selectValue == 'Revenue by Product Type') {
                    createVerticalBarChart(revenueByProduct);
                } else {
                    createVerticalBarChart(revenueBySalesPerson);
                }
            };
            //End select box creation



            function createVerticalBarChart(chartData) {
                data = chartData;
                if (typeof data != 'undefined') {
                    d3.select('svg').remove();
                    d3.select('#no-data').remove();

                    var t = d3.transition().duration(750),
                        width = chart.node().getBoundingClientRect().width - 20, //Calculated width based on browser size
                        height = chart.node().getBoundingClientRect().height - 110; //Calculated width based on browser size

                    var margin = {
                            top: 40,
                            right: 50,
                            bottom: 30,
                            left: 40
                        },
                        width = width - margin.left - margin.right,
                        height = height - margin.top - margin.bottom;

                    var svg = d3.select(".chart").append("svg")
                        .attr('class', 'svg')
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom);

                    var group = svg.append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var xScale = d3.scaleBand().range([0, width]).padding(0.3);
                    var yScale = d3.scaleLinear().rangeRound([height, 0]).nice();

                    xScale.domain(chartData.map(function(d) {
                        return d.key;
                    }));
                    yScale.domain([0, d3.max(chartData, function(d) {
                        return d.value;
                    })]).nice();

                    // append the rectangles for the bar chart
                    var bars = group.selectAll(".bar")
                        .data(chartData)
                        .enter().append("rect")
                        .attr('class', 'bar')
                        .attr('x', function(d) {
                            return xScale(d.key);
                        })
                        .attr('width', xScale.bandwidth())
                        .attr('y', height)
                        .attr("height", 0)
                        .on("mousemove", function(d) {
                            tooltip
                                .style("left", d3.event.pageX + 10 + "px")
                                .style("top", d3.event.pageY + 30 + "px")
                                .style("display", "inline-block")
                                .html('<p class="total">' + d.key + ': <strong>$' + format(d.value) + '</strong></p>')
                        })
                        .on("mouseout", function(d) {
                            tooltip.style("display", "none")
                        });

                    // add the x Axis
                    group.append("g")
                        .attr('class', 'axis x')
                        .attr('transform', 'translate(0,' + height + ')')
                        .call(d3.axisBottom(xScale));

                    // add the y Axis
                    group.append("g").attr('class', 'axis y').call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".0s")));

                    bars.transition(t).delay(function(d, i) {
                            return i * 100
                        })
                        .attr("y", function(d) {
                            return yScale(d.value);
                        }) //THIS IS CORRECT
                        .attr('height', function(d) {
                            return height - yScale(d.value);
                        })
                        .attr('x', function(d) {
                            return xScale(d.key);
                        })
                        .attr('width', xScale.bandwidth());

                    var dynamicText1 = 'This is a vertical bar chart. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
                    d3.select('.step1').select('p')
                        .html(dynamicText1);

                } else {
                    d3.select('svg').remove();
                    var noData = chart.append('div')
                        .attr('id', 'no-data')
                        .attr('width', width)
                        .attr('height', height);

                    noData.html('<p>No Data</p>');

                    var dynamicText2 = genericErrorText;
                    d3.select('.step2').select('p')
                        .html(dynamicText2);
                }
            }

            function resize() {
                var resizeData = data;

                if (data != 'undefined') {
                    var chart = d3.select('.chart'),
                        t = d3.transition().duration(100),
                        t2 = d3.transition().duration(50),
                        width = chart.node().getBoundingClientRect().width - 20, //Calculated width based on browser size
                        height = chart.node().getBoundingClientRect().height - 50; //Calculated width based on browser size

                    var margin = {
                        top: 40,
                        right: 50,
                        bottom: 90,
                        left: 40
                    };
                    width = width - margin.left - margin.right,
                        height = height - margin.top - margin.bottom;

                    var bars = d3.selectAll('.bar').data(resizeData);

                    var xScale = d3.scaleBand().range([0, width]).padding(0.3);
                    var yScale = d3.scaleLinear().rangeRound([height, 0]);

                    xScale.domain(resizeData.map(function(d) {
                        return d.key;
                    }));
                    yScale.domain([0, d3.max(resizeData, function(d) {
                        return d.value;
                    })]);

                    d3.select('svg').transition(t)
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom);

                    d3.select('.x').transition(t).attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(xScale));
                    d3.select('.y').transition(t).call(d3.axisLeft(yScale).tickFormat(d3.format(".0s")));

                    bars.transition(t)
                        .attr("y", function(d) {
                            return yScale(d.value);
                        }) //THIS IS CORRECT
                        .attr('height', function(d) {
                            return height - yScale(d.value);
                        })
                        .attr('x', function(d) {
                            return xScale(d.key);
                        })
                        .attr('width', xScale.bandwidth());
                }
            }

            // Redraw based on the new size whenever the browser window is resized.
            window.addEventListener("resize", resize);
            createVerticalBarChart(data)
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
var verticalBarChart = d3.scroller.verticalBar();
