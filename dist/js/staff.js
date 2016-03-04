$(document).ready(function() {

    checkLoggedIn();
    checkPrivilegesAtLeast(10);

    $('#dataTable_wrapper').hide();
    $('[data-toggle="popover"]').popover();

    var table;

    $.get(url+"/staff/all/"+getCurrentPropertyID(), function(data) {
        var aes = new AesUtil();
        var staff = JSON.parse(aes.decrypt(data));
        table = $('#staffMembersTable').DataTable( {
            data : staff,
            columnDefs: [ {
                "targets": -1,
                "data": null
            } ],
            columns : [
                {"data" : "name", title:"Name"},
                {"data" : "property.name", title:"Property"},
                {"data" : "privilegeName", title:"Privileges"}
            ],	
	        order: [[ 0, "asc" ]],
            destroy: true
        } );
        
        $('#loadingChartGroup').hide();
        $('#dataTable_wrapper').show();
    }, "text");

    $("#staffMembersTable").on("click", "td", function(event){
        var row = table.row($(this).parents('tr'));
        var staff = row.data();

        createModal(staff, row);
        $('#staffOverview').modal('show');
    });

    function createModal(staff, row) {
        $('#staffOverview').on('show.bs.modal', function (event) {
            $('#staffResetPasswordResult').html("");

            var modal = $(this);
            modal.find('#staffName').html("Name: <b>"+staff.name+"</b>");
            modal.find('#staffPrivileges').html("Privileges: <b>"+staff.privilegeName+"</b>");
            modal.find('#staffProperty').html("Residence: <b>"+staff.property.name+"</b>");

            if (staff.privileges >= 10) {
                modal.find('#managerToggle').button("toggle");
            } else {
                modal.find('#userToggle').button("toggle");
            } 

            setupPrivilegesToggle(staff, row);
            setupStaffPasswordReset(staff);
            setupDeleteStaffButton(staff, row);
        });
    };

    $('.toggle-listener').click(function() {
        $(this).toggleClass('active');
    });

    function setupPrivilegesToggle(staff, row) {
        $('.auto-update').click(function() {
            var privilegeName = $(this).text();
            var privileges = getUserPrivilegesFromText(privilegeName);
            if (privileges != staff.privileges) {
                $.get(url+"/staff/privs/"+staff.ID+"?p="+privileges, function(data) {
                    if (data === 'true') {
                        console.log("privileges updated successfully for "+staff.ID);
                        staff.privileges = privileges;
                        staff.privilegeName = privilegeName;
                        row.data(staff);
                    } else {
                        console.log("privileges NOT updated successfully for "+staff.ID);
                    }
                });
            }
        })
    };

    function setupStaffPasswordReset(staff) {
        $('#staffResetPassword').click(function() {
            $('#staffResetPassword').html('<i class="fa fa-undo fa-spin-reverse"></i> Reseting Password');
            $.get(url+"/staff/reset/"+staff.ID, function(data) {
                $('#staffResetPassword').html('<i class="fa fa-undo"></i> Reset Password');
                if (data === 'true') {
                    $('#staffResetPassword').html("<i class='fa fa-check'></i> Password reset successful.");
                } else {
                    $('#staffResetPassword').html("<i class='fa fa-times'></i> Password reset unsuccessful. Please, try again.");
                }               
            });
        })
    };

    function setupDeleteStaffButton(staff, row) {
        $('#deleteStaffButton').html("<i class='fa fa-trash'></i> Delete staff");
        $('#deleteStaffButton').click(function() {
            BootstrapDialog.confirm({
                title: 'Delete staff?',
                message: 'Do you really want to delete this staff member?',
                type: BootstrapDialog.TYPE_DANGER,
                closable: true,
                draggable: false,
                btnCancelLabel: 'Do not delete',
                btnOKLabel: 'Delete!',
                btnOKClass: 'btn-danger',
                callback: function(result) {
                    // result will be true if button was click, while it will be false if users close the dialog directly.
                    $('#deleteStaffButton').html("<i class='fa fa-circle-o-notch fa-spin'></i> Deleting Staff");
                    if(result) {
                        $.get(url+"/staff/disable/"+staff.ID, function(response) {
                            if (response === 'true') {
                                $('#deleteStaffButton').html("<i class='fa fa-check'></i> Staff delete successful.");
                                row.remove().draw();
                                $('#staffOverview').modal('hide');
                            } else {
                                console.log("error disabling staff "+staff.ID);
                                $('#deleteStaffButton').html("<i class='fa fa-times'></i> Staff delete unsuccessful.");
                            }
                        });
                    }
                }
            });
        });
    };

    function getUserPrivilegesFromText(buttonText) {
        buttonText = buttonText.trim(); 
        if (buttonText === 'Manager') {
            return 10;
        } else {
            return 1;
        }
    };

    function getNewUserPrivilegesButtonText() {
        if ($('#newManagerToggle').hasClass('active')) {
            return 'Manager';
        } else {
            return 'User';
        }
    }

    $('#staffForm').on('show.bs.modal', function (event) {
        $('#staffNameGroup').removeClass('has-error');

        var modal = $(this);
        modal.find('#staffProperty').val(getCurrentProperty());
        modal.find('#staffProperty').prop('disabled', true);
        modal.find('#newUserToggle').button('toggle');
    });

    $('#staffForm').off('click').on('click', '#addStaffButton', function() {
        var privilegeName = getNewUserPrivilegesButtonText();
        var privileges = getUserPrivilegesFromText(privilegeName);
        var staffName = $('#staffName').val().toLowerCase();

        if (validateNewStaff(staffName)) {
            var aes = new AesUtil();
            var staff = createNewStaff(staffName, privileges);
            var data = aes.encrypt(JSON.stringify(staff));
            $.ajax({
                "url" : url+"/staff/add",
                "type" : "POST",
                "data" : data,
                "contentType" : "text/plain; charset=utf-8",
                "dataType" : "json",    
                "success" : function(response) {
                    if (response != '-1') {
                        staff.privilegeName = privilegeName;
                        staff.property = {};
                        staff.property.ID = getCurrentPropertyID();
                        staff.property.name = getCurrentProperty();

                        table.row.add(staff).draw();

                        showSuccessAlert(staff);
                    } else {
                        console.log("error adding new staff!");
                    }
                },
                "error": function(httpRequest, textStatus, errorThrown) {
                    console.log("ERROR");
                    console.log(textStatus);
                }
            });
        }
    });

    function createNewStaff(staffName, staffPrivileges) {
        return {
                "name" : staffName,
                "propertyID" : getCurrentPropertyID(), 
                "privileges" : staffPrivileges
            }; 
    }

    function validateNewStaff(staffName) {
        var nameRegex = /(([a-z])*)+/;
        if (staffName.length < 3 || !nameRegex.test(staffName)) {
            $('#staffNameGroup').addClass('has-error');
            return false;
        } else {
            $('#staffNameGroup').removeClass('has-error');
            return true;
        }
    }

    function showSuccessAlert(staff) {
        var message = '<span><strong>'+staff.name+'</strong> was successfully added as a new staff member.</span>';

        $('#staffForm').modal('hide');
        $('#notifications').html(
            '<div class="alert alert-success alert-dismissable" style="margin-top=10px">'+
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                message+
            '</div>');
    }
});	