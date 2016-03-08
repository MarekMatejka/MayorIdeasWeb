$(document).ready(function() {

	//checkLoggedIn();

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
});