d3.csv('../../uploads/sales_data.csv',function(data) {
	console.log(data);
	console.log(data.columns)
	
	revenueByProduct = d3.nest()
		.key(function(d) { return d.product; })
		.rollup(function(v) { return d3.sum(v, function(d) { return d.total_price; }) }).entries(data);

	revenueBySalesPerson = d3.nest()
		.key(function(d) { return d.sales_person; })
		.rollup(function(v) { return d3.sum(v, function(d) { return d.total_price; }) }).entries(data);
	
	//Invoice by Month Metrics:
	invoicedByDate = d3.nest().key(function(d) { return d.order_year; }).key(function(d) { return d.order_month_name; }).rollup(function(v) { return d3.sum(v, function(d) { return d.total_price; }); }).entries(data);
	lastYear = invoicedByDate[0].values;
	thisYear = invoicedByDate[1].values;

	console.log(invoicedByDate);
	function sortDates(year) {
		var result = [];
		year.forEach(function(item) {
			switch(item.key) {
			  case 'Jan': result[0] = { key: 'Jan', id: 1, value: item.value };	break;
			  case 'Feb': result[1] = { key: 'Feb', id: 2, value: item.value }; break;
			  case 'Mar': result[2] = { key: 'Mar', id: 3, value: item.value }; break;
			  case 'Apr': result[3] = { key: 'Apr', id: 4, value: item.value }; break;
			  case 'May': result[4] = { key: 'May', id: 5, value: item.value }; break;
			  case 'Jun': result[5] = { key: 'Jun', id: 6, value: item.value }; break;
			  case 'Jul': result[6] = { key: 'Jul', id: 7, value: item.value }; break;
			  case 'Aug': result[7] = { key: 'Aug', id: 8, value: item.value }; break;
			  case 'Sep': result[8] = { key: 'Sep', id: 9, value: item.value }; break;
			  case 'Oct': result[9] = { key: 'Oct', id: 10, value: item.value }; break;
			  case 'Nov': result[10] = { key: 'Nov', id: 11, value: item.value }; break;
			  case 'Dec': result[11] = { key: 'Dec', id: 12, value: item.value }; break;
			}
		});
		return result;
	}
	
	sortedInvoicedByDate = [];
	sortedInvoicedByDate[0] = { key: invoicedByDate[0].key, values: sortDates(lastYear) };
	sortedInvoicedByDate[1] = { key: invoicedByDate[1].key, values: sortDates(thisYear) };

})