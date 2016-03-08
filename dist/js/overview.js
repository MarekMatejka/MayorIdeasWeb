$(document).ready(function() {

	//checkLoggedIn();

	$('#chartGroup').hide();
	$('#title').html("Overview of "+getCurrentProperty());
	shouldShowStaff();

	var currentData;

	$.get(url+"/stats/index/"+getCurrentPropertyID(), function(data) {

		currentData = data;

        $("#numOfUncollectedParcels").html(data.totalUncollectedParcels);
		$("#numOfRecipients").html(data.totalRecipients);
		$("#numOfStaff").html(data.totalStaff);
		
		createChart('Day', data.parcelsByDate);
		enableButtons();	
		$('#day').addClass('active');
		$('#loadingChartGroup').hide();
		$('#chartGroup').show();
    }, "json");

	$("#day").on("click", function(event) {
		if (!$('#day').hasClass('active')) {
			removeActiveClass();
	        $('#day').addClass('active');
	        createChart('Day', currentData.parcelsByDate);
	    }
    });

    $("#weekday").on("click", function(event) {
    	if (!$('#weekday').hasClass('active')) {
	    	removeActiveClass();
	        $('#weekday').addClass('active');
	        createChart('Day of the Week', currentData.parcelsByDayOfWeek);
	    }
    });

    $("#month").on("click", function(event) {
    	if (!$('#month').hasClass('active')) {
	    	removeActiveClass();
	        $('#month').addClass('active');
	        createChart('Month', currentData.parcelsByMonth);
	    }
    });

	function extractLabels(data, reverseData) {
		var labels = [];
		if (reverseData) {
			for (var i = data.length-1; i >= 0; i--) {
				labels.push(data[i].type);
			}
		} else {
			for (var i = 0; i < data.length; i++) {
				labels.push(data[i].type);
			}
		}
		return labels;
	}

	function extractDataCol1(data, reverseData) {
		console.log(data);
		var values = [];
		if (reverseData) {
			for (var i = data.length-1; i >= 0; i--) {
				values.push(data[i].numReceivedParcels);
			}
		} else {
			for (var i = 0; i < data.length; i++) {
				values.push(data[i].numReceivedParcels);
			}
		}
		return values;
	}

	function extractDataCol2(data, reverseData) {
		var values = [];
		if (reverseData) {
			for (var i = data.length-1; i >= 0; i--) {
				values.push(data[i].numCollectedParcels);
			}
		} else {
			for (var i = 0; i < data.length; i++) {
				values.push(data[i].numCollectedParcels);
			}
		}
		return values;
	}

	function generateChartData(data, reverseData) {
		return [{
	            name: 'Parcels Received',
	            data: extractDataCol1(data, reverseData)

	        }, {
	            name: 'Parcels Collected',
	            data: extractDataCol2(data, reverseData)

	        }];
	}

	function createChart(title, data) {
		var reverseData = title === 'Day';
		var seriesData = generateChartData(data, reverseData);
		var labels = extractLabels(data, reverseData);
		$('#overviewChart').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: 'Parcels by ' + title
	        },
	        xAxis: {
	            categories: labels,
	            crosshair: true
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: '# of Parcels'
	            }
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: seriesData
	    });
	}

	function removeActiveClass() {
		$('#day').removeClass('active');
		$('#weekday').removeClass('active');
		$('#month').removeClass('active');
	}

	function enableButtons() {
		$('#day').removeClass('disabled');
		$('#weekday').removeClass('disabled');
		$('#month').removeClass('disabled');
	}

	function shouldShowStaff() {
		if (getPrivileges() >= 10) {
			$('#staffPanel').show();
		} else {
			$('#staffPanel').hide();
		}
	}
});