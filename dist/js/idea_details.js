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

    var commentCounter = 0;
    $.get(url+"/comment/idea/"+id, function(data) {
        var comments = JSON.parse(data);
        console.log(comments);
        addNComments(comments, 5);
    }, "text");

    $.get(url+"/idea/"+id+"?user_id="+getCurrentID(), function(data) {
        var idea = JSON.parse(data);
        console.log(idea);
        $("#idea_name").html(idea.title);
        setupCategory(idea.categoryID, idea.categoryName);
        setupScore(idea.score);
        setupComments(idea.numOfComments);
        setupState(idea.ideaState);
        setupIdeaDetails(idea);
        setupMap(idea);
    }, "text");

    function setupCategory(categoryID, categoryName) {
        $("#category").html(getCategory(categoryID));
        $("#categoryName").html(categoryName)
    }

    function setupScore(score) {
        if (score > 0) {
            $("#thumbs").html('<i class="fa fa-thumbs-up fa-lg thumbs-up" style="align: center;"> '+score+'</i>');
        } else if (score < 0) {
            $("#thumbs").html('<i class="fa fa-thumbs-down fa-lg thumbs-down" style="align: center;"> '+score+'</i>');
        } else {
            $("#thumbs").html('<i class="fa fa-minus fa-lg" style="align: center;"> '+score+'</i>');
        }
    }

    function setupComments(numOfComments) {
        $("#commentsCount").html('<i class="fa fa-comment fa-lg comments" style="align: center;"> '+numOfComments+'</i>');
    }

    function setupState(state) {
        console.log(state);
        if (state == "OPEN") {
            $("#state").html('<i class="fa fa-lg state-open">OPEN</i>');
        } else if (state == "IN_PROGRESS") {
            $("#state").html('<i class="fa fa-lg state-inprogress">IN PROGRESS</i>');
        } else {
            $("#state").html('<i class="fa fa-lg state-closed">RESOLVED</i>');
        }
    }

    function setupIdeaDetails(idea) {
        $("#ideaDetails").append("<p style='color: #757575'>by "+idea.authorName+", "+idea.dateCreated+"</p>");
        $("#ideaDetails").append("<p><b>Description:</b> "+idea.description+"</p>");
    }

    function getCategory(categoryID) {
        switch (categoryID) {
            case 1: return '<i class="fa fa-leaf fa-lg thumbs-up" style="align: center;"></i>';
            case 2: return '<i class="material-icons" style="color:#8D6E63">palette</i>';
            case 3: return '<i class="material-icons" style="color:#5f8dd3">directions_bus</i>';
            case 4: return '<i class="fa fa-road fa-lg" style="align: center;color:#757575"></i>';
            default: return '<i class="fa fa-leaf fa-lg" style="align: center;"></i>';
        } 
    }

    function addNComments(comments, showCommentsCount) {
        var showAddMore = false;
        var end = 0;
        if ((comments.length-commentCounter) > showCommentsCount) {
            end = commentCounter+showCommentsCount;
            showAddMore = true;
        } else {
            end = comments.length;
            showAddMore = false;
        }


        for (var i = commentCounter; i < end; i++) {
            $('#comments').append(createComment(comments[i]));
            commentCounter++;
        }

        if (showAddMore) {
            var commentsLeft = comments.length-commentCounter;
            var showCount = commentsLeft >= showCommentsCount ? showCommentsCount : commentsLeft;
            $('#comments').append(createShowMoreCommentsButton(showCount));
            setupShowMoreCommentsButtonOnClick(comments, showCount);
        }

        if (comments.length == 0) {
            $('#comments').append('<p style="text-align: center">No comments added for this idea</p>');   
        }
    }

    function createShowMoreCommentsButton(showCount) {
        return '<button id="showMoreComments" type="button" class="btn btn-link" style="width: 100%">'+
                    'Show '+showCount+' more comments'+
                '</button>';
    }

    function setupShowMoreCommentsButtonOnClick (comments, showCount) {
        $("#showMoreComments").off("click").on("click", function(event) {
            $('#showMoreComments').remove();
            addNComments(comments, showCount);
        });
    }

    function createComment(comment) {
        var footerColor = comment.isByCitizen ? "#5f8dd3" : "#FFD54F";
        var footerTextColor = comment.isByCitizen ? "white" : "black";
        return '<div class="panel panel-default">'+
                    '<div class="panel-body">'+
                        '<p>"'+comment.text+'"</p>'+
                    '</div>'+
                    '<div class="panel-footer" style="background-color: '+footerColor+'; color: '+footerTextColor+'">'+
                        comment.userName+', '+comment.dateCreated+
                    '</div>'+
                '</div>'
    }

    function setupMap(idea) {
        var map = new GMaps({
          div: '#map',
          lat: idea.latitude,
          lng: idea.longitude,
          zoom: 16  
        });
        map.addMarker({
          lat: idea.latitude,
          lng: idea.longitude,
          infoWindow: {
            content: '<p>'+idea.title+'</p>'
          }
        });
    }
});	