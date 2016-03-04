$(document).ready(function() {

	checkLoggedIn();
	checkPrivilegesAtLeast(100);

	var dataCHR, dataHTS;

	$.get(url+"/stats/index/3", function(data) {
		dataCHR = data;
		$('#panelCHR').html('Champion Hill Residence - '+dataCHR.totalUncollectedParcels);
		createChart('Day', data.parcelsByDate, 'CHR');
		enableButtons('CHR');	
		$('#dayCHR').addClass('active');
    }, "json");

    $.get(url+"/stats/index/4", function(data) {
		dataHTS = data;
		$('#panelHTS').html('Hult Tower & Studios - '+dataHTS.totalUncollectedParcels);
		createChart('Day', data.parcelsByDate, 'HTS');
		enableButtons('HTS');	
		$('#dayHTS').addClass('active');
    }, "json");

    $.get(url+"/stats/index/5", function(data) {
		dataHCR = data;
		$('#panelHCR').html('Hult Campus Reception - '+dataHCR.totalUncollectedParcels);
		createChart('Day', data.parcelsByDate, 'HCR');
		enableButtons('HCR');	
		$('#dayHCR').addClass('active');
    }, "json");

	$("#dayCHR").on("click", function(event) {
		day('#dayCHR', dataCHR, 'CHR');
    });

    $("#weekdayCHR").on("click", function(event) {
    	weekday('#weekdayCHR', dataCHR, 'CHR')
    });

    $("#monthCHR").on("click", function(event) {
    	month('#monthCHR', dataCHR, 'CHR');
    });

    $("#dayHTS").on("click", function(event) {
		day('#dayHTS', dataHTS, 'HTS');
    });

    $("#weekdayHTS").on("click", function(event) {
    	weekday('#weekdayHTS', dataHTS, 'HTS')
    });

    $("#monthHTS").on("click", function(event) {
    	month('#monthHTS', dataHTS, 'HTS');
    });

    $("#dayHCR").on("click", function(event) {
		day('#dayHCR', dataHTS, 'HCR');
    });

    $("#weekdayHCR").on("click", function(event) {
    	weekday('#weekdayHCR', dataHTS, 'HCR')
    });

    $("#monthHTS").on("click", function(event) {
    	month('#monthHCR', dataHTS, 'HCR');
    });

    function day (button, data, property) {
    	if (!$(button).hasClass('active')) {
			removeActiveClass(property);
	        $(button).addClass('active');
	        createChart('Day', data.parcelsByDate, property);
	    }
    }

    function weekday(button, data, property) {
    	if (!$(button).hasClass('active')) {
	    	removeActiveClass(property);
	        $(button).addClass('active');
	        createChart('Day of the Week', data.parcelsByDayOfWeek, property);
	    }
    }

    function month(button, data, property) {
    	if (!$(button).hasClass('active')) {
	    	removeActiveClass(property);
	        $(button).addClass('active');
	        createChart('Month', data.parcelsByMonth, property);
	    }
    }

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

	function createChart(title, data, property) {
		var reverseData = title === 'Day';
		var seriesData = generateChartData(data, reverseData);
		var labels = extractLabels(data, reverseData);
		$('#chart'+property).highcharts({
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

	function removeActiveClass(property) {
		$('#day'+property).removeClass('active');
		$('#weekday'+property).removeClass('active');
		$('#month'+property).removeClass('active');
	}

	function enableButtons(property) {
		$('#day'+property).removeClass('disabled');
		$('#weekday'+property).removeClass('disabled');
		$('#month'+property).removeClass('disabled');
	}
});