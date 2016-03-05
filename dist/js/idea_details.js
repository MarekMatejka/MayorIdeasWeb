$(document).ready(function() {

    //checkLoggedIn();

    $('#dataTable_wrapper').hide();

	//var id = sessionStorage.getItem("id");
    var id = 10;

    $.get(url+"/image/get/idea/"+id, function(data) {
        var ideaImageIds = JSON.parse(data);
        console.log(ideaImageIds);
        for (var i = 0; i < ideaImageIds.length; i++) {
            console.log("adding picture "+i);
            $("#carousel").append(  "<div class='col-lg-"+(12/ideaImageIds.length)+"'>"+
                                        "<img src='"+(url+"/image/get/"+ideaImageIds[i])+"' height='300px'></img>"+
                                    "</div>")
        }
    }, "text");

});	