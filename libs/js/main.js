var employee = {};

var sortState;

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

const sortPersonnelByFirst = () => {
    $.ajax({
        url: "./libs/php/getAllPersonnelSortByFirst.php",
        type: "post",
        dataType: "json",
        success: (resp)=> {
            sortState = 'firstName';
            $("#directory").html('');
            for (let i=0; i<26; i++) {
                var chr = String.fromCharCode(65 + i);
                $("#directory").append(`
                        <li id='${chr}' class="list-group-item directory-items">${chr}</li>
                    `)
                $.each(resp.data, (i, d)=> {
                    if (d.firstName.charAt(0).toUpperCase() == chr) {
                        $("#directory").append(`
                        <li value=${d.id} class="list-group-item directory-items"><i class="far fa-id-card"></i>&nbsp${d.firstName + ", " + d.lastName}</li>
                    `)
                    }                    
                })
            }
        },
        error: (err)=> {
            console.error(err)
        }
    })
    
};

const sortPersonnelByID = () => {
    $.ajax({
        url: "./libs/php/getAllPersonnelSortByID.php",
        type: "post",
        dataType: "json",
        success: (res)=> {
            sortState = 'ID';
            $("#directory").html('');
            $.each(res.data, (i, d)=> {
                $("#directory").append(`
                    <li value=${d.id} class="list-group-item directory-items"><i class="far fa-id-card"></i>&nbsp${d.id + " " + d.firstName + " " + d.lastName}</li>
                `)                   
            })
        },
        error: (err)=> {
            console.error(err)
        }
    })
    
};

const sortPersonnelByDep = () => {

    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/getAllPersonnelSortByDep.php',
            type: 'post',
            dataType: 'json',
    
            success: (res)=> {
                sortState = 'department';
                res.headArr = [];
                $("#directory").html('');

                let depProm = () => {
                    return new Promise((resolve, reject)=> {
                        $.each(res.data, (i, d)=> {
                            if (!res.headArr.includes(d.department)) {
                                res.headArr.push(d.department)
                            };
                        });

                        if (res.headArr.length <= 0) {
                            reject("No headers in the header array!");
                        }

                        resolve();
                    })
                };

                depProm()
                .then(()=> {
                    $.each(res.headArr, (i, dep)=> {
                        $("#directory").append(`
                            <li id='${dep}' class="list-group-item directory-items">${dep}</li>
                        `)
            
                        $.each(res.data, (i, d)=> {
                            if (d.department == dep) {
                                $("#directory").append(`
                                <li value=${d.id} class="list-group-item directory-items"><i class="far fa-id-card"></i>&nbsp${d.lastName + ", " + d.firstName}</li>
                            `)
                            }                    
                        })
            
                    });
                })
                .then(()=> resolve())
                .catch((err)=> console.error(err))
            },
    
            error: (err)=> {
                reject(err);
            }
        });  
    })
}

const sortPersonnelByLoc = () => {

    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/getAllPersonnelSortByDep.php',
            type: 'post',
            dataType: 'json',
    
            success: (res)=> {
                sortState = 'location';
                res.headArr = [];
                $("#directory").html('');

                let newProm = () => {
                    return new Promise((resolve, reject)=> {
                        $.each(res.data, (i, d)=> {
                            if (!res.headArr.includes(d.location)) {
                                res.headArr.push(d.location)
                            };
                        })

                        if (res.headArr.length <= 0) {
                            reject("No headers in the header array!");
                        }

                        resolve();
                    })
                };

                newProm()
                .then(()=> {
                    $.each(res.headArr, (i, loc)=> {
                        $("#directory").append(`
                            <li id='${loc}' class="list-group-item directory-items">${loc}</li>
                        `)
            
                        $.each(res.data, (i, d)=> {
                            if (d.location == loc) {
                                $("#directory").append(`
                                <li value=${d.id} class="list-group-item directory-items"><i class="far fa-id-card"></i>&nbsp${d.lastName + ", " + d.firstName}</li>
                            `)
                            }                    
                        })
            
                    })
                })
                .then(()=> resolve())
                .catch((err)=> console.error(err))    
            },
    
            error: (err)=> {
                reject(err);
            }
        });  
    })
}

const getAllPersonnel = () => {
    $.ajax({
        url: "./libs/php/getAllPersonnel.php",
        type: "post",
        dataType: "json",
        success: (resp)=> {
            $("#directory").html('');
            sortState = 'lastName';
            for (let i=0; i<26; i++) {
                var chr = String.fromCharCode(65 + i);
                $("#directory").append(`
                        <li id='${chr}' class="list-group-item directory-items">${chr}</li>
                    `)
                $.each(resp.data, (i, d)=> {
                    if (d.lastName.charAt(0).toUpperCase() == chr) {
                        $("#directory").append(`
                        <li value=${d.id} class="list-group-item directory-items"><i class="far fa-id-card"></i>&nbsp${d.lastName + ", " + d.firstName}</li>
                    `)
                    }                    
                })
            }
        },
        error: (err)=> {
            console.error(err)
        }
    })
};

const getAllDepartments = () => {
    $.ajax({
        url: "./libs/php/getAllDepartments.php",
        type: "post",
        dataType: "json",
        success: (res)=> {
            $("#directory").html('');
            $.each(res.data, (i, d)=> {
                $("#directory").append(`
                    <li value=${d.id} class="list-group-item directory-items"><i class="fas fa-building"></i>&nbsp${d.name}</li>
                `)
            })
        },
        error: (err)=> {
            console.error(err)
        }
    })
};

const getAllLocations = () => {
    $.ajax({
        url: "./libs/php/getAllLocations.php",
        type: "post",
        dataType: "json",
        success: (res)=> {
            $("#directory").html('');
            $.each(res.data, (i, d)=> {
                $("#directory").append(`
                    <li value=${d.id} class="list-group-item directory-items"><i class="fas fa-map-marked-alt"></i>&nbsp${d.name}</li>
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

const dirItemDetails = () => {
    $(".directory-items").click(function() {
        let id = $(this).val();
        console.log(id)
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
};

const sortStateTog = (sort) => {

    switch(sort) {
        case 'lastName':
            getAllPersonnel();
            break;
        case 'firstName':
            sortPersonnelByFirst();
            break;
        case 'ID':
            sortPersonnelByID();
            break;
        case 'department':
            sortPersonnelByDep();
            break;
        case 'location':
            sortPersonnelByLoc();
            break;
        default:
            getAllPersonnel();
    }
};

getAllPersonnel();
setTimeout(()=> {
    dirItemDetails();
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
                    $('#directory').html('');
                    sortStateTog(sortState);
                    $('#employeeEdit').show();
                    $('#updateStatus').show();
                    $('#statusBody').html('Your changes were successful.')
                    setTimeout(()=> {
                        dirItemDetails();
                    }, 100);
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

$('#navEmp').on('click', ()=> {
    $('.nav-link').removeClass('active');
    $('#navEmp').addClass(' active');
    getAllPersonnel();
});

$('#navDep').on('click', ()=> {
    $('.nav-link').removeClass(' active');
    $('#navDep').addClass(' active');
    getAllDepartments();
});

$('#navLoc').on('click', ()=> {
    $('.nav-link').removeClass(' active');
    $('#navLoc').addClass(' active');
    getAllLocations();
});

$('#sortLast').on('click', ()=> {
    getAllPersonnel();
    setTimeout(()=> {
        dirItemDetails();
    }, 100);
})

$('#sortFirst').on('click', ()=> {
    sortPersonnelByFirst();
    setTimeout(()=> {
        dirItemDetails();
    }, 100);
    
})

$('#sortID').on('click', ()=> {
    sortPersonnelByID();
    setTimeout(()=> {
        dirItemDetails();
    }, 100)
})

$('#sortDep').on('click', ()=> {
    sortPersonnelByDep()
    .then(()=> dirItemDetails())
    .catch((err)=> console.error(err));
})

$('#sortLoc').on('click', ()=> {
    sortPersonnelByLoc()
    .then(()=> dirItemDetails())
    .catch((err)=> console.error(err));
})

