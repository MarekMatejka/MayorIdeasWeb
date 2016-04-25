$(document).ready(function() {

	checkLoggedIn();
	var table;

	$.get(url+"/stats/weekly/", function(data) {

        $("#newIdeasNumber").html('<p class="weekly-stats-number">'+data.newIdeasPerWeek+'</p>');
        $("#newIdeasTrend").html(createTrend(data.newIdeasTrend));

		$("#inProgressIdeasNumber").html('<p class="weekly-stats-number">'+data.inProgressIdeasPerWeek+'</p>');
        $("#inProgressIdeasTrend").html(createTrend(data.inProgressIdeasTrend));

        $("#closedIdeasNumber").html('<p class="weekly-stats-number">'+data.closedIdeasPerWeek+'</p>');
        $("#closedIdeasTrend").html(createTrend(data.closedIdeasTrend));

        $("#interactionsNumber").html('<p class="weekly-stats-number">'+data.interactionsPerWeek+'</p>');
        $("#interactionsTrend").html(createTrend(data.interactionsTrend));

    }, "json");

    function createTrend(trend) {
    	if (trend > 0) {
    		return '<i class="material-icons" style="color:green; font-size:40px;">trending_up</i>';
    	} else if (trend < 0) {
    		return '<i class="material-icons" style="color:red; font-size:40px;">trending_down</i>';
    	} else {
    		return '<i class="material-icons" style="color:black; font-size:40px;">trending_flat</i>';
    	}
    }

    $.get(url+"/stats/overall/", function(data) {

        $("#openIdeasCount").html(data.totalOpenIdeas);
        $("#inProgressIdeasCount").html(data.totalInProgressIdeas);
		$("#closedIdeasCount").html(data.totalClosedIdeas);

    }, "json");

    $.get(url+"/idea/trending?user_id=-1", function(data) {
    	//var ideas = JSON.parse(data); //aes.decrypt(data)
        table = $('#trendingIdeas').DataTable( {
            data : data,
            columns : [
                {"data": "title", "title" : "Idea Title"},
                {"data": "categoryName", "title" : "Category", "class" : "cell-centered"},
                {"data": "dateCreated", "title" : "Added on"},
                {"data": "ideaState", "title" : "Idea State", "class" : "cell-centered"},
                {"data": "score", "title" : "Score", "class" : "cell-centered"}
            ],
            columnDefs: 
            [
	            {
	                targets: 3,
	                createdCell: function (td, cellData, rowData, row, col) {
	                    if (cellData == 'OPEN') {
	                        $(td).addClass('state-open');
	                    } else if (cellData == 'IN_PROGRESS') {
	                        $(td).addClass('state-inprogress');
	                    } else if (cellData == 'RESOLVED') {
	                        $(td).addClass('state-closed');
	                    }
	                }
	            },
	            {
	                targets: 4,
	                createdCell: function (td, cellData, rowData, row, col) {
		                if (cellData > 0) {
		                    $(td).css('color', '#99cc00');
		                } else if (cellData < 0) {
		                    $(td).css('color', 'red');
		                } else {
		                    $(td).css('color', 'black');
		                }
		            }
		        }
            ],
            createdRow: function ( row, data, index ) {
                $(row).addClass('bold');
            },
            order: [[4, 'desc']],
            destroy: true
        } );  

        $('#loadingTableGroup').hide();
        $('#dataTable_wrapper').show();
    }, "json");

    $("#trendingIdeas").on("click", ".bold", function(event){
        var row = table.row($(this));
        var idea = row.data();

        sessionStorage.setItem("id", idea.id);

        window.location = "./idea_details.html";
    });

});