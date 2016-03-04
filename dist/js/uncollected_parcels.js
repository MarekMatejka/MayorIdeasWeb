$(document).ready(function() {

    checkLoggedIn();

    $('#dataTable_wrapper').hide();

    var table;

    $.get(url+"/parcel/uncollected/"+getCurrentPropertyID(), function(data) {
        var aes = new AesUtil();
        var parcels = JSON.parse(aes.decrypt(data));
        table = $('#uncollectedParcels').DataTable( {
            data : parcels,
            columnDefs: [ {
                "targets": -1,
                "data": null
            } ],
            columns : [
                {"data" : "alterID", title:"Parcel ID"},
                {"data" : "recipient.name", title:"Recipient Name"},
                {"data" : "recipient.roomNumber", title:"Room Number"},
                {"data" : "parcelColor", title:"Color"},
                {"data" : "parcelSize", title:"Size"},
                {"data" : "parcelLocation", title: "Location", "defaultContent": "<i>Undefined</i>"},
                {"data" : "dateReceived", title:"Date Received"}
            ],	
            buttons: [
                {
                    extend: 'csv',
                    title: 'uncollected_parcels'
                },
                'print'
            ],
	        order: [[ 0, "desc" ]],
            destroy: true
        } );

        $('.row:eq(0)', table.table().container() ).before('<div class="row"></row>');
        table.buttons().container().prependTo( $('.row:eq(0)', table.table().container() ) );
        $('.dt-buttons:eq(0)').addClass('table-buttons');

        $('#loadingChartGroup').hide();
        $('#dataTable_wrapper').show();
    }, "text");

    $("#uncollectedParcels").on("click", "td", function(event){
        var row = table.row($(this).parents('tr'));
        var parcel = row.data();

        createModal(parcel, row);
        $('#parcelOverview').modal('show');
    });

    function createModal(parcel, row) {
        $('#parcelOverview').on('show.bs.modal', function (event) {

            var modal = $(this);
            modal.find('#parcelModalTitle').html("Parcel Overview - <b>"+parcel.alterID+"</b>");
            modal.find('#recipientName').html("Name: <b>"+parcel.recipient.name+"</b>");
            modal.find('#recipientRoom').html("Room number: <b>"+parcel.recipient.roomNumber+"</b>");
            modal.find('#recipientProperty').html("Residence: <b>"+getCurrentProperty()+"</b>");

            modal.find('#dateReceived').html("Received on: <b>"+parcel.dateReceived+"</b>");
            modal.find('#loggedInByStaff').html("Logged by: <b>"+parcel.loggedInBy.name+"</b>");
            modal.find('#parcelColor').html("Color: <b>"+parcel.parcelColor+"</b>");
            modal.find('#parcelSize').html("Size: <b>"+parcel.parcelSize+"</b>");

            if(parcel.parcelLocation != null) {
                modal.find('#parcelLocation').show();
                modal.find('#parcelLocation').html("Location: <b>"+parcel.parcelLocation+"</b>");
            } else {
                modal.find('#parcelLocation').hide();
            }

            setupOnForceCollectButton(modal, parcel, row);
        });
    }

    function setupOnForceCollectButton(modal, parcel, row) {
        if (getPrivileges() >= 10) { //is a manager+
            modal.find("#forceSignOutButton").show();

            $('#forceSignOutButton').off("click").on("click", function(event) {
                setupForceCollectModal(parcel, row, modal);
                $("#forceCollectModal").modal('show');
            });
        } else {
            modal.find("#forceSignOutButton").hide();
        }
    }

    function setupForceCollectModal(parcel, row, parentModal) {
        $('#forceCollectModal').on('show.bs.modal', function (event) {
            var modal = $(this);
            modal.find('#forceCollectModalTitle').html("Force collecting parcel #"+parcel.alterID);
            modal.find('#forceCollectReason').val('');
            
            $('#forceSignOutConfirmButton').html("<i class='fa fa-ban'></i> Force sign-out");
            $('#forceSignOutConfirmButton').off("click").on("click", function(event) {
                var reason = modal.find('#forceCollectReason').val();
                if (reason.length > 0 && reason != undefined) {
                    $('#forceSignOutConfirmButton').html('<i class="fa fa-circle-o-notch fa-spin"></i> Processing');
                    forceCollectParcel(createForceCollectPOSTGson(parcel.ID, reason), row, modal, parentModal);
                }
            });
        });
    }

    function forceCollectParcel(parcelGson, row, confirmationModal, parentModal) {
        var aes = new AesUtil();
        var data = aes.encrypt(JSON.stringify(parcelGson));
        $.ajax({
                "url" : url+"/parcel/force",
                "type" : "POST",
                "data" : data,
                "contentType" : "text/plain; charset=utf-8",
                "success" : function(response) {
                    if (response) {
                        $('#forceSignOutConfirmButton').html("<i class='fa fa-check'></i> Success");
                        setTimeout(function() {
                            row.remove().draw();
                            confirmationModal.modal('hide');
                            parentModal.modal('hide');
                        }, 1500);
                    } else {
                        $('#forceSignOutConfirmButton').html("<i class='fa fa-times'></i> Error, please try again");
                    }
                },
                "error": function(httpRequest, textStatus, errorThrown) {
                    $('#forceSignOutConfirmButton').html("<i class='fa fa-times'></i> Error, please try again");
                    console.log("ERROR");
                    console.log(textStatus);
                    console.log(httpRequest);
                    console.log(errorThrown);
                }
            });
    }

    function createForceCollectPOSTGson(parcelID, reason) {
        return {
            "parcelID" : parcelID,
            "reason" : reason,
            "staffID" : getCurrentStaffID(),
            "dateCollected" : getCurrentTimestamp(),
            "propertyID" : getCurrentPropertyID()
        };
    }

});	