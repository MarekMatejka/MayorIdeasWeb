$(document).ready(function() {

    checkLoggedIn();

    $('#dataTable_wrapper').hide();

	var id = sessionStorage.getItem("id");
    var name = sessionStorage.getItem("name");
   	var email = sessionStorage.getItem("email");
    var roomNumber = sessionStorage.getItem("roomNumber");
    var property = sessionStorage.getItem("recipientProperty");

    var table;

    $('#name').html(" "+name);
    $('#email').html(" <a href='mailto:#'>"+email+"</a>");
    $('#room').html(" "+roomNumber);
    $('#property').html(" "+property);

    $.get(url+"/parcel/all/"+id, function(data) {
        var aes = new AesUtil();
        var parcels = JSON.parse(aes.decrypt(data));
        table = $('#recipientParcels').DataTable( {
            data : parcels,
            columns : [
                {"data" : "alterID", title:"ID"},
                {"data" : "parcelColor", title:"Color"},
                {"data" : "parcelType", title:"Type"},
                {"data" : "parcelLocation", title: "Location", "defaultContent": "<i>Undefined</i>"},
                {"data" : "dateReceived", title:"Date Received"}
            ],
            createdRow: function ( row, data, index ) {
	            if (data.dateCollected != undefined ) {
	            	$('td', row).addClass('collected');
	            }
	        },	
	        order: [[ 0, "desc" ]],
            destroy: true
        } );
        $('#loadingChartGroup').hide();
        $('#dataTable_wrapper').show();
    }, "text");

    $("#recipientParcels").on("click", "td", function(event){
        var row = table.row($(this).parents('tr'));
        var parcel = row.data();

        createModal(parcel);
        $('#parcelOverview').modal('show');
    });

    function createModal(parcel) {
        $('#parcelOverview').on('show.bs.modal', function (event) {

        	console.log(parcel);

            var modal = $(this);
            modal.find('#parcelModalTitle').html("Parcel Overview - <b>"+parcel.alterID+"</b>");
            modal.find('#recipientName').html("Name: <b>"+parcel.recipient.name+"</b>");
            modal.find('#recipientRoom').html("Room number: <b>"+parcel.recipient.roomNumber+"</b>");
            modal.find('#recipientProperty').html("Residence: <b>"+getCurrentProperty()+"</b>");

            modal.find('#dateReceived').html("Received on: <b>"+parcel.dateReceived+"</b>");
            modal.find('#loggedInByStaff').html("Logged by: <b>"+parcel.loggedInBy.name+"</b>");
            modal.find('#parcelColor').html("Color: <b>"+parcel.parcelColor+"</b>");
            modal.find('#parcelType').html("Type: <b>"+parcel.parcelType+"</b>");

            if(parcel.parcelLocation != null) {
                modal.find('#parcelLocation').show();
                modal.find('#parcelLocation').html("Location: <b>"+parcel.parcelLocation+"</b>");
            } else {
                modal.find('#parcelLocation').hide();
            }
            

            if (parcel.dateCollected != undefined) {
            	modal.find('#collectedSection').show();
                modal.find('#dateCollected').html("Collected on: <b>"+parcel.dateCollected+"</b>");
                modal.find('#staff').html("Staff sign off by: <b>"+parcel.staffSignOff.name+"</b>");

                if (parcel.forceCollectReason != undefined) {
                    modal.find('#signatureSection').hide();
                    modal.find('#forceCollectedSection').show();

                    modal.find('#reason').html("Reason for forced sign-out: <b>"+parcel.forceCollectReason+"</b>");
                } else {
                    modal.find('#signatureSection').show();
                    modal.find('#forceCollectedSection').hide();

                    modal.find('#signature').html("<img style='width: 100%' src='"+(url+"/signature/get/"+parcel.signatureID)+"'>");
                }
	        } else {
	        	modal.find('#collectedSection').hide();
                modal.find('#forceCollectedSection').hide();
            	modal.find('#signatureSection').hide();
	        }
        });
    }
});	