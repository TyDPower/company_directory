import * as personnel from './common/personnel.js';
import { filter } from './common/filter.js';
import { getAllDepartments } from './common/deparments.js';
//---------------- New Functions --------------------\\

// Display personnel records as default
personnel.displayRecords(filter);


// Personnel Tab
$('#navEmp').on('click', ()=> {
    $('.nav-link').removeClass('active');
    $('#navEmp').addClass(' active');
    personnel.displayRecords(filter);
});

// Departments Tab

// Locations Tab

// Events
$('#navAddNew').on('click', ()=> {
    switch(filter.directory) {
        case 'personnel':
            getAllDepartments()
            .then((deps)=> personnel.newRecordModal(deps))
            .catch((err)=> console.error(err));
            break;
        //case 'departments':
        //    department.newRecordModal(record);
        //    break;
        //case 'locations':
        //    location.newRecordModal(record);
        //    break;
    };
});

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

const getAllDepAndLoc = (filter) => {

    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/getAllDepAndLoc.php',
            type: 'post',
            dataType: 'json',
            data: {
                filter: filter
            },

            success: (res)=> {
                if (res.status.name == "ok") {
                    resolve(res.data);
                }

                reject(res.status);
            },

            error: (err)=> {
                reject(err);
            }
        });
    });
};

$('#navDep').on('click', ()=> {
    $('.nav-link').removeClass(' active');
    $('#navDep').addClass(' active');
    /*getAllDepartments()
    .then((data)=> {
        $("#directory").html('');
            $.each(data, (i, d)=> {
                $("#directory").append(`
                    <li value=${d.id} class="list-group-item directory-items"><i class="fas fa-building"></i>&nbsp${d.name}</li>
                `)
            })

    })
    .catch((err)=> console.error(err));*/
    $('#directoryTable').html('');
});

$('#navLoc').on('click', ()=> {
    $('.nav-link').removeClass(' active');
    $('#navLoc').addClass(' active');
    getAllLocations();
});

$('#sortLast').on('click', ()=> {
    listState.sort = 'lastName';
    personnelList(listState.sort);
});

$('#sortFirst').on('click', ()=> {
    listState.sort = 'firstName';
    personnelList(listState.sort);    
});

$('#sortID').on('click', ()=> {
    listState.sort = 'ID';
    personnelList(listState.sort);
});

$('#sortDep').on('click', ()=> {
    listState.sort = 'department';
    personnelList(listState.sort);
});

$('#sortLoc').on('click', ()=> {
    listState.sort = 'location';
    personnelList(listState.sort);
});

$('#filterLoc').on('click', ()=> {
    listState.filter = 'location';

    getAllDepAndLoc(listState.filter)
    .then((data)=> {
        $('#filterModalTitle').html('Filter by Location')
        $('#filterModalBody').html('')
        $.each(data, (i, loc)=> {
            $('#filterModalBody').append(`
                <li class="list-group-item directory-items">
                    <input type='checkbox' id=${loc.name} name='location' value=${loc.id}>
                    <lable for=${loc.name}>${loc.name}</lable><br>
                </li>
            `)

        })
        $('#filterModal').show();
    })
    .catch((err)=> console.error(err));

    //$('#filterModalTitle').html("Filter by Location");
    //let ids = [];
    //$.each($("input[name='filterDep']:checked"), function() //{
    //    ids.push($(this).val());
    //});
    //
    //filterByLoc(ids)
    //.then((data)=> console.log(data))
    //.catch((err)=> console.error(err));
});

const filterBy = (filter) => {
    let arrIDs = [];
    $.each($(`input[name=${filter}]:checked`), function() {
        arrIDs.push($(this).val());
    });
    console.log(arrIDs);

    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/filterBy.php',
            type: 'post',
            dataType: 'json',
            data: {
                arrIDs: arrIDs,
                filter: filter
            },

            success: (res)=> {
                if (res.status.name == 'ok') {
                    resolve(res.data);
                }

                reject(res.status);
            },

            error: (err)=> {
                reject(err);
            }
        })
    })
}

$('#filterModalSubmit').on('click', ()=> {
    filterBy(listState.filter)
    .then((data)=> {
        $('#directory').html('');
        $.each(data, (i, d)=> {
            $('#directory').append(`

            `)
        })
    })
    .catch((err)=> console.error(err));
});

$('#filterDep').on('click', ()=> {
    listState.filter = 'department';

    getAllDepAndLoc(listState.filter)
    .then((data)=> {
        $('#filterModalTitle').html('Filter by Department')
        $('#filterModalBody').html('')
        $.each(data, (i, dep)=> {
            $('#filterModalBody').append(`
                <li class="list-group-item directory-items">
                    <input type='checkbox' id=${dep.name} name='department' value=${dep.id}>
                    <lable for=${dep.name}>${dep.name}</lable><br>
                </li>
            `)

        })
        $('#filterModal').show();
    })
    .catch((err)=> console.error(err));

    //$('#filterModalTitle').html("Filter by Location");
    //let ids = [];
    //$.each($("input[name='filterDep']:checked"), function() //{
    //    ids.push($(this).val());
    //});
    //
    //filterByLoc(ids)
    //.then((data)=> console.log(data))
    //.catch((err)=> console.error(err));
});

//---- NEW Events END ----//