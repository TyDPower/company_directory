var employee = {};

const getPersonnelByID = (id) => {

    return new Promise((res, rej)=> {

        $.ajax({
            url: "./libs/php/getPersonnelByID.php",
            type: "post",
            dataType: "json",
            data: {
                id: id
            },

            success: (resp)=> {
                res(resp.data)
            },

            error: (err)=> {
                rej(err);
            }
        })
    })
};

const getDepartmentByID = () => {

    return new Promise((res, rej)=> {

        $.ajax({
            url: "./libs/php/getDepartmentByID.php",
            type: "post",
            dataType: "json",
            data: {
                id: 1
            },

            success: (resp)=> {
                res(resp)
            },

            error: (err)=> {
                rej(err);
            }
        })
    })
};

const getAllPersonnel = () => {
    $.ajax({
        url: "./libs/php/getAllPersonnel.php",
        type: "post",
        dataType: "json",
        success: (resp)=> {
            $.each(resp.data, (i, d)=> {
                $("#directory").append(`
                    <li id="emID${d.id}" value=${d.id} class="list-group-item directory-items"><i class="far fa-id-card"></i>&nbsp${d.lastName + ", " + d.firstName}</li>
                `)
            })
        },
        error: (err)=> {
            console.error(err)
        }
    })
};

const getDepartments = (depName) => {

    $.ajax({
        url: './libs/php/getAllDepartments.php',
        type: 'post',
        dataType: 'json',

        success: (res)=> {
            $.each(res.data, (i, dep)=> {
                $('#depSlc').append(
                    $('<option>', {
                        value: dep.id,
                        text: dep.name
                    })
                )

                let sel = $('#depSlc')
                for (let i=0; i<sel[0].length; i++) {
                    if (sel[0][i].text === depName) {
                        sel[0][i].defaultSelected = true;
                    }
                }
            })
        },

        error: (err)=> {
            console.error(err);
        }
    })
};

const editPersonnel = (obj) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "./libs/php/editPersonnel.php",
            type: "post",
            dataType: "json",
            data: {
                data: obj
            },

            success: (res)=> {
                resolve(res);
            },

            error: (err)=> {
                reject(err)
            }
        })
    })
};

const validStr = (str) => {
    if (str.length > 0) {
        if (/\d/.test(str)) {
            return false;
        }
        return true;
    }
};

const validEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email.toLowerCase())) {
        return true;
    }
    return false;
};

const disableBtn = (btn, state) => {
    $('#'+btn).prop('disabled', state);
};

getAllPersonnel();

setTimeout(()=> {
    $(".directory-items").click(function() {
        let id = $(this).val();
        $.ajax({
            url: "./libs/php/getPersonnelByID.php",
            type: "post",
            dataType: "json",
            data: {
                id: id
            },

            success: (res)=> {
                let em = res.data[0];
                employee = {
                    id: em.id,
                    fname: em.firstName,
                    lname: em.lastName,
                    email: em.email,
                    jobTitle: em.jobTitle,
                    location: em.location,
                    department: em.department,
                    departmentID: em.departmentID
                }
                $("#employeeModal").show();
                $("#employeeSubmit").hide();

                $("#employeeName").html(`${em.firstName} ${em.lastName}`)
                $("#employeeInfo").html(`
                    <table class="table table-striped">
                        <tr>
                            <td>Employee ID</td>
                            <td class="floatRight">${em.id}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td class="floatRight">${em.email}</td>
                        </tr>
                        <tr>
                            <td>Job Title</td>
                            <td class="floatRight">${em.jobTitle}</td>
                        </tr>
                        <tr>
                            <td>Department</td>
                            <td class="floatRight">${em.department}</td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td class="floatRight">${em.location}</td>
                        </tr>
                    </table>
                `)

            },

            error: (err)=> {
                console.error(err);
            }
        })
    })
}, 100);

$("#employeeEdit").on("click", ()=> {
    getDepartments(employee.department);
    $('#employeeEdit').hide();
    $('#employeeSubmit').show();
    $("#employeeName").html(`Edit Employee: ${employee.fname} ${employee.lname}`)
    $("#employeeInfo").html(`
        <table class="table table-striped">
            <tr>
                <td>Employee ID</td>
                <td class="floatRight">${employee.id}</td>
            </tr>
            <tr>
                <td>First name</td>
                <td id="firstNameCont" class="floatRight">
                    <input type="text" id="firstName" name="firstName" value="${employee.fname}">
                </td>
            </tr>
            <tr>
                <td>Last name</td>
                <td id="lastNameCont" class="floatRight">
                    <input type="text" id="lastName" name="lastName" value="${employee.lname}">
                </td>
            </tr>
            <tr>
                <td>Email</td>
                <td id="emailCont" class="floatRight">
                    <input type="email" id="email" name="eamil" value="${employee.email}">
                </td>
            </tr>
            <tr>
                <td>Job Title</td>
                <td id="jobTitleCont" class="floatRight">
                    <input type="text" id="jobTitle" name="jobTitle" value="${employee.jobTitle}">
                </td>
            </tr>
            <tr>
                <td>Department</td>
                <td class="floatRight">
                    <select id="depSlc"></select>
                </td>
            </tr>
            <tr>
                <td>Location</td>
                <td id='depLoc' class='floatRight'>${employee.location}</td>
            </tr>
        </table
    `);

    $('#depSlc').on('change', ()=> {
        let id = $('#depSlc').val();
        $.ajax({
            url: './libs/php/getLocationByDepID.php',
            type: 'post',
            dataType: 'json',
            data: {
                id: id
            },
    
            success: (res)=> {
                employee.departmentID = id;
                $('#depLoc').html(`${res.data[0].name}`)
                id = null;
            },
    
            error: (err)=> {
                console.error(err);
                id = null;
            }
        })
    });

    let vldName = 'Please enter a valid name without numbers...';
    let vldEmail = 'Please enter a valid email...'

    $('#firstName').on('change', ()=> {
        let str = $('#firstName').val();
        if (!validStr(str)) {
            disableBtn('employeeSubmit', true);
            $('#firstNameCont').append(`<br><span id='nvfn' class='invalidText'>${vldName}</span>`);
            return;
        }
        $('#nvfn').html('');
        disableBtn('employeeSubmit', false);
        employee.fname = $('#firstName').val();
        return;
    })

    $('#lastName').on('change', ()=> {
        let str = $('#lastName').val();
        if (!validStr(str)) {
            $('#lastNameCont').append(`<br><span id='nvln' class='invalidText'>${vldName}</span>`);
            disableBtn('employeeSubmit', true);
            return;
        }
        $('#nvln').html('');
        disableBtn('employeeSubmit', false);
        employee.lname = $('#lastName').val();
        return;
    })

    $('#jobTitle').on('change', ()=> {
        let str = $('#jobTitle').val();
        if (!validStr(str)) {
            disableBtn('employeeSubmit', true);
            $('#jobTitleCont').append(`<br><span id='nvjt' class='invalidText'>${vldName}</span>`);
            return;
        }
        $('#nvjt').html('');
        disableBtn('employeeSubmit', false);
        employee.jobTitle = $('#jobTitle').val();
        return;
    })

    $('#email').on('change', ()=> {
        let str = $('#email').val();
        if (!validEmail(str)) {
            disableBtn('employeeSubmit', true);
            $('#emailCont').append(`<br><span id='nve' class='invalidText'>${vldEmail}</span>`);
            return;
        }
        $('#nve').html('');
        disableBtn('employeeSubmit', false);
        employee.email = $('#email').val();
        return;
    })

    $('#employeeSubmit').on('click', ()=> {
        $("#saveConfirmation").show();
        $("#employeeModal").hide();
    })

    $("#saveChanges").on("click", ()=> {
        $("#saveConfirmation").hide();
        $.ajax({
            url: './libs/php/updatePersonnel.php',
            type: 'post',
            dataType: 'json',
            data: {
                data: employee
            },

            success: (res)=> {
                if (res.status.name == "ok") {
                    $('#employeeEdit').show();
                    $('#updateStatus').show();
                    $(`#emID${employee.id}`).html(`
                        <i class="far fa-id-card"></i>&nbsp${employee.lname + ", " + employee.fname}</li>
                    `)
                    $('#statusBody').html('Your changes were successful.')
                    setTimeout(()=> {
                        $('#updateStatus').hide();
                        employee = null;
                    }, 1500);
                }
            },

            error: (err)=> {
                console.error(err);
            }
        })
    })
});


$('.employee-modal-close-btn').on("click", ()=> {
    $("#employeeModal").hide();
    $('#employeeEdit').show();
});

$('#updateStatusClsBtn').on('click', ()=> {
    $('#updateStatus').hide();
    $('#employeeEdit').show();
});