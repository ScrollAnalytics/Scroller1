//console.log(data);

var steps = [
	function step0() {
		d3.select('.chart')
			.datum(revenueByProduct)
			.call(verticalBarChart);
	},
	function step1() {
		d3.select('.chart')
			.datum(sortedInvoicedByDate)
			.call(lineChart);
	}
];

// update our chart
function update(step) {
	steps[step].call()
}
	
	
