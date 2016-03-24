$(document).ready(function() {

    //checkLoggedIn();

    $('#dataTable_wrapper').hide();

	var id = sessionStorage.getItem("id");
    //var id = 11;

    $.get(url+"/image/get/idea/"+id, function(data) {
        var ideaImageIds = JSON.parse(data);
        for (var i = 0; i < ideaImageIds.length; i++) {
            $("#carousel").append(  "<div class='col-lg-"+(12/ideaImageIds.length)+"'>"+
                                        "<img src='"+(url+"/image/get/"+ideaImageIds[i])+"' height='300px'></img>"+
                                    "</div>")
        }
    }, "text");

    var commentCounter = 0;
    var comments = undefined;
    $.get(url+"/comment/idea/"+id, function(data) {
        comments = JSON.parse(data);
        addNComments(comments, 3);
    }, "text");

    $.get(url+"/idea/"+id+"?user_id="+getCurrentID(), function(data) {
        var idea = JSON.parse(data);
        $("#idea_name").html(idea.title);
        setupCategory(idea.categoryID, idea.categoryName);
        setupScore(idea.score);
        setupComments(idea.numOfComments);
        setupState(idea.ideaState);
        setupIdeaDetails(idea);
        setupMap(idea);
        createChangeStateModal(idea);
        createLeaveCommentModal(idea);
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
        if (state == "OPEN") {
            $("#state").html('<i class="fa fa-lg state-open">OPEN</i>');
        } else if (state == "IN_PROGRESS") {
            $("#state").html('<i class="fa fa-lg state-inprogress">IN PROGRESS</i>');
        } else {
            $("#state").html('<i class="fa fa-lg state-closed">RESOLVED</i>');
        }
    }

    function setupIdeaDetails(idea) {
        var aes = new AesUtil();
        $("#ideaDetails").append("<p style='color: #757575'>by "+aes.decrypt(idea.authorName)+", "+idea.dateCreated+"</p>");
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
                    'Show '+showCount+' more comment(s)'+
                '</button>';
    }

    function setupShowMoreCommentsButtonOnClick (comments, showCount) {
        $("#showMoreComments").off("click").on("click", function(event) {
            $('#showMoreComments').remove();
            addNComments(comments, showCount);
        });
    }

    function createComment(comment) {
        var aes = new AesUtil();
        var commentType = comment.isByCitizen ? "citizenComment" : "governmentComment";
        return '<div class="panel panel-default">'+
                    '<div class="panel-body">'+
                        '<p>"'+comment.text+'"</p>'+
                    '</div>'+
                    '<div class="panel-footer '+commentType+'">'+
                        aes.decrypt(comment.userName)+', '+comment.dateCreated+
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

    var currentState = null;
    function createChangeStateModal(idea) {
        $('#changeState').on('show.bs.modal', function (event) {

            var modal = $(this);
            if (idea.ideaState == "OPEN") {
                currentState = modal.find('#stateOpen');
                currentState.addClass('active');
            } else if (idea.ideaState == "IN_PROGRESS") {
                currentState = modal.find('#stateInProgress');
                currentState.addClass('active');
            } else if (idea.ideaState == "RESOLVED") {
                currentState = modal.find('#stateResolved');
                currentState.addClass('active');
            }

            $(".state").click(function() {
                if (currentState != null) {
                    currentState.removeClass('active');
                }
                currentState = $(this);
                $(this).addClass('active');
            });

            $("#confirmState").off("click").on("click", function() {
                $.ajax({
                    url: url+"/idea/state?idea_id="+idea.id+"&state="+getCurrentStateValue(),
                    type: 'PUT',
                    success: function(response) {
                        idea.ideaState = getCurrentStateValue();
                        setupState(getCurrentStateValue());
                        modal.modal('hide');
                        currentState.removeClass('active');
                    }
                });
            });
        });
    }

    function createLeaveCommentModal(idea) {
        $('#leaveComment').on('show.bs.modal', function (event) {

            var modal = $(this);
            $('#commentText').val("");

            $("#addCommentModalBtn").off("click").on("click", function() {
                var newComment = {userID: getCurrentID(), ideaID: idea.id, commentText: $('#commentText').val().trim()};
                $.ajax({
                    "url" : url+"/comment/add",
                    "type" : "POST",
                    "data" : JSON.stringify(newComment),
                    "contentType" : "application/json; charset=utf-8",
                    "dataType" : "json",    
                    "success" : function(response) {
                        if (response > 0) {
                            idea.numOfComments++;
                            setupComments(idea.numOfComments);
                            var commentToAdd = {
                                text: $('#commentText').val().trim(),
                                isByCitizen: false,
                                userName: getCurrentName(),
                                dateCreated: getCurrentTimestamp()
                            };
                            $('#comments').html('');
                            commentCounter = 0;
                            comments.unshift(commentToAdd);
                            addNComments(comments, 3);
                            modal.modal('hide');
                        } else {
                            //ERRROR
                            console.log("ERROR adding comment");
                        }
                    }
                });
            });
        });
    }

    function getCurrentStateValue() {
        return currentState.text().trim().replace(' ', '_').toUpperCase();
    }
});	