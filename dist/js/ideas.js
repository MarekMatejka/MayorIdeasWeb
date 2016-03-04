$(document).ready(function() {

    //checkLoggedIn();

    $('#dataTable_wrapper').hide();

    var table;

    $("[data-hide]").on("click", function() {
        $("." + $(this).attr("data-hide")).hide();
    });

    $("#ideas").on("click", ".bold", function(event){
        var row = table.row($(this));
        var idea = row.data();

        sessionStorage.setItem("id", idea.id);

        window.location = "./idea_details.html";
    });

    loadTable();

    function loadTable() {
        $.get(url+"/idea/all/", function(data) {
            //var aes = new AesUtil();
            var ideas = JSON.parse(data); //aes.decrypt(data)
            table = $('#ideas').DataTable( {
                data : ideas,
                columns : [
                    {"data": "title", "title" : "Idea Title"},
                    {"data": "categoryName", "title" : "Category", "class" : "cell-centered"},
                    {"data": "dateCreated", "title" : "Added on"},
                    {"data": "ideaState", "title" : "Idea State", "class" : "cell-centered"},
                    {"data": "score", "title" : "Score", "class" : "cell-centered"},
                    {"data": "numOfComments", "title" : "# of Comments", "class" : "cell-centered"},
                    {"data": "numOfVotes", "title" : "# of Votes", "class" : "cell-centered"}
                ],
                columnDefs: [
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
                order: [[2, 'desc'], [4, 'desc']],
                destroy: true
            } );            
            $('#loadingTableGroup').hide();
            $('#dataTable_wrapper').show();
        }, "text");
    }
});
