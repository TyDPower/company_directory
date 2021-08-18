import * as personnel from './common/personnel.js';
import * as departments from './common/deparments.js';
import * as locations from './common/locations.js';
import { filter } from './common/filter.js';

// HTTP TO HTTPS REdirect
//if (window.location.protocol == 'http:') {
//    window.location.href = window.location.href.replace('http:', 'https:');
//};

// Preloader
const preloader = () => {
    $('#preloader').fadeOut();
};

window.onload = preloader;

// Display personnel records as default
personnel.displayRecords(filter);


// Personnel Tab
$('#navEmp').on('click', ()=> {
    clearFilters(filter);
    $('.nav-link').removeClass('active');
    $('#navEmp').addClass(' active');
    personnel.displayRecords(filter);
});

// Departments Tab
$('#navDep').on('click', ()=> {
    clearFilters(filter);
    $('.nav-link').removeClass(' active');
    $('#navDep').addClass(' active');
    departments.displayRecords(filter);
});

// Locations Tab
$('#navLoc').on('click', ()=> {
    clearFilters(filter);
    $('.nav-link').removeClass(' active');
    $('#navLoc').addClass(' active');
    locations.displayRecords(filter);
});

// Events
$('#navAddNew').on('click', ()=> {
    switch(filter.directory) {
        case 'personnel':
            departments.getAllDepartments()
            .then((departments)=> personnel.newRecordModal(departments))
            .catch((err)=> console.error(err));
            break;
        case 'departments':
            locations.getAllLocations()
            .then((locations)=> departments.newRecordModal(locations))
            .catch((err)=> console.error(err));
            break;
        case 'locations':
            locations.newRecordModal(locations)
            break;
    };
});

$('#navFilter').on('click', ()=> {
    clearFilters(filter);
    switch (filter.directory) {
        case 'personnel':
            personnelFilterModal();
            break;
        case 'departments':
            deparmentFilterModal();
            break;
        case 'locations':
            locationFilterModal();
            break;
    };    
});

$('#searchBtn').on('click', ()=> {
    let val = $('#searchInput').val();
    let isNum = /\d/;

    if (val.includes('@')) {
        search('email', val)
        .then((d)=> personnel.displayAllPersonnel(d))
        .catch((e)=> console.error(e));
    } else if (isNum.test(val)) {
        search('num', parseInt(val))
        .then((d)=> personnel.displayAllPersonnel(d))
        .catch((e)=> console.error(e));
    } else {
        search('str', val)
        .then((d)=> personnel.displayAllPersonnel(d))
        .catch((e)=> console.error(e));
    };
});

// Functions
const personnelFilterModal = () => {
    $('#filterModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='filterModalTitle'class="modal-title">Directory Filter/Sort</h5>
                    <button id='filterModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='filterModalBody' class="modal-body">
                    <div class="d-grid gap-2">
                        <h5>Filter by</h5>
                        <button class="btn btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#depFilter"aria-expanded="false" aria-controls="collapseExample">
                            Department
                        </button>
                        <div class="collapse" id="depFilter">
                            <div id='depFilterOptions' class="card card-body">
                            </div>
                            <div class='btn-container'>
                                <button id='depAll' type="button" class="btn btn-outline-dark">Select All</button>
                                <button id='depClr' type="button" class="btn btn-outline-dark">Clear All</button>
                            </div>
                        </div>

                        <button class="btn btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#locFilter"aria-expanded="false" aria-controls="collapseExample">
                            Location
                        </button>
                        <div class="collapse" id="locFilter">
                            <div id='locFilterOptions' class="card card-body">
                            </div>
                            <div class='btn-container'>
                                <button id='locAll' type="button" class="btn btn-outline-dark">Select All</button>
                                <button id='locClr' type="button" class="btn btn-outline-dark">Clear All</button>
                            </div>
                        </div>

                        <h5>Sort by</h5>
                        <select id='orderBy' class="form-select">
                            <option value="lastName" selected>Last Name</option>
                            <option value="firstName">First Name</option>
                            <option value="department">Department</option>
                            <option value="location">Location</option>
                        </select>

                        <select id='ascOrDsc' class="form-select">
                            <option value="ASC" selected>Ascending Order</option>
                            <option value="DESC">Descending Order</option>
                        </select>


                    </div>
                </div>
                <div class="modal-footer">
                    <button id='filterModalFilter' type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                    <button id='filterModalReset' type="button" class="btn btn-dark"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `);

    $('#filterModal').show();

    $('#locFilterOptions').html(`<ul id='locFilterLocations' class="list-group"></ul>`);
    locations.getAllRecords(false)
    .then((locs)=> {
        $.each(locs, (i, l)=> {
            $('#locFilterLocations').append(`
                <li class="list-group-item">
                    <input type='checkbox' name='locations' id=${l.id} value=${l.id}>
                    <label for=${l.id}>${l.name}</label>
                </li>
            `);
        });
    })
    .catch((err)=> console.error(err));

    $('#depFilterOptions').html(`<ul id='depFilterDepartments' class="list-group"></ul>`);
    departments.getAllRecords(false)
    .then((locs)=> {
        $.each(locs, (i, l)=> {
            $('#depFilterDepartments').append(`
                <li class="list-group-item">
                    <input type='checkbox' name='departments' id=${l.id} value=${l.id}>
                    <label for=${l.id}>${l.name}</label>
                </li>
            `);
        });
    })
    .catch((err)=> console.error(err));

    $('select').addClass("form-control");

    $('#filterModalReset').on('click', ()=> {
        filter.isFiltered = false;
        $('#filterModal').hide();
    });

    $('#depClr').on('click', ()=> {
        $("input[name='departments']").each(function(){
            this.checked = false;
        });
    });

    $('#depAll').on('click', ()=> {
        $("input[name='departments']").each(function(){
            this.checked = true;
        });
    });

    $('#locClr').on('click', ()=> {
        $("input[name='locations']").each(function(){
            this.checked = false;
        });
    });

    $('#locAll').on('click', ()=> {
        $("input[name='locations']").each(function(){
            this.checked = true;
        });
    });

    $('#filterModalFilter').on('click', ()=> {

        $("input:checkbox[name=locations]:checked").each(function(){
            filter.locations.push($(this).val());
        });

        $("input:checkbox[name=departments]:checked").each(function(){
            filter.departments.push($(this).val());
        });

        filter.isFiltered = true;
        filter.orderBy = $('#orderBy').val();
        filter.ascOrDsc = $('#ascOrDsc').val();

        filterDirectory(filter);        
        $('#filterModal').hide();
    });

    $('#filterModalClose').on('click', ()=> {
        $('#filterModal').hide();
    });
};

const deparmentFilterModal = () => {
    $('#filterModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='filterModalTitle'class="modal-title">Directory Filter/Sort</h5>
                    <button id='filterModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='filterModalBody' class="modal-body">
                    <div class="d-grid gap-2">
                        <h5>Filter by</h5>
                        <button class="btn btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#locFilter"aria-expanded="false" aria-controls="collapseExample">
                            Locations
                        </button>
                        <div class="collapse" id="locFilter">
                            <div id='locFilterOptions' class="card card-body">
                            </div>
                            <div class='btn-container'>
                                <button id='locAll' type="button" class="btn btn-outline-dark">Select All</button>
                                <button id='locClr' type="button" class="btn btn-outline-dark">Clear All</button>
                            </div>
                        </div>

                        <h5>Sort by</h5>
                        <select id='orderBy' class="form-select">
                            <option value="name">Department Name</option>
                            <option value="location">Location</option>
                        </select>

                        <select id='ascOrDsc' class="form-select">
                            <option value="ASC" selected>Ascending Order</option>
                            <option value="DESC">Descending Order</option>
                        </select>


                    </div>
                </div>
                <div class="modal-footer">
                    <button id='filterModalFilter' type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                    <button id='filterModalReset' type="button" class="btn btn-dark"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `);

    $('#filterModal').show();

    $('#locFilterOptions').html(`<ul id='locFilterLocations' class="list-group"></ul>`);
    locations.getAllRecords(false)
    .then((locs)=> {
        $.each(locs, (i, l)=> {
            $('#locFilterLocations').append(`
                <li class="list-group-item">
                    <input type='checkbox' name='locations' id=${l.id} value=${l.id}>
                    <label for=${l.id}>${l.name}</label>
                </li>
            `);
        });
    })
    .catch((err)=> console.error(err));

    $('select').addClass("form-control");

    $('#locClr').on('click', ()=> {
        $("input[name='locations']").each(function(){
            this.checked = false;
        });
    });

    $('#locAll').on('click', ()=> {
        $("input[name='locations']").each(function(){
            this.checked = true;
        });
    });

    $('#filterModalReset').on('click', ()=> {
        filter.isFiltered = false;
        $('#filterModal').hide();
    });

    $('#filterModalFilter').on('click', ()=> {

        $("input:checkbox[name=locations]:checked").each(function(){
            filter.locations.push(parseInt($(this).val()));
        });

        filter.isFiltered = true;
        filter.orderBy = $('#orderBy').val();
        filter.ascOrDsc = $('#ascOrDsc').val();

        filterDirectory(filter);        
        $('#filterModal').hide();
    });

    $('#filterModalClose').on('click', ()=> {
        $('#filterModal').hide();
    });
};

const locationFilterModal = () => {
    $('#filterModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='filterModalTitle'class="modal-title">Directory Sort</h5>
                    <button id='filterModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='filterModalBody' class="modal-body">
                    <div class="d-grid gap-2">
                        <h5>Sort by</h5>
                        <select id='ascOrDsc' class="form-select">
                            <option value="ASC" selected>Ascending Order</option>
                            <option value="DESC">Descending Order</option>
                        </select>


                    </div>
                </div>
                <div class="modal-footer">
                    <button id='filterModalFilter' type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                    <button id='filterModalReset' type="button" class="btn btn-dark"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `);

    $('#filterModal').show();

    $('#locFilterOptions').html(`<ul id='locFilterLocations' class="list-group"></ul>`);
    locations.getAllRecords(false)
    .then((locs)=> {
        $.each(locs, (i, l)=> {
            $('#locFilterLocations').append(`
                <li class="list-group-item">
                    <input type='checkbox' id=${l.id} value=${l.id} checked>
                    <label from=${l.id}>${l.name}</label>
                </li>
            `);
        });
    })
    .catch((err)=> console.error(err));

    $('#depFilterOptions').html(`<ul id='depFilterDepartments' class="list-group"></ul>`);
    departments.getAllRecords(false)
    .then((locs)=> {
        $.each(locs, (i, l)=> {
            $('#depFilterDepartments').append(`
                <li class="list-group-item">
                    <input type='checkbox' id=${l.id} value=${l.id} checked>
                    <label from=${l.id}>${l.name}</label>
                </li>
            `);
        });
    })
    .catch((err)=> console.error(err));

    $('select').addClass("form-control");

    $('#filterModalReset').on('click', ()=> {});

    $('#filterModalFilter').on('click', ()=> {
        filter.isFiltered = true;
        filter.orderBy = $('#orderBy').val();
        filter.ascOrDsc = $('#ascOrDsc').val();

        filterDirectory(filter);        
        $('#filterModal').hide();
    });

    $('#filterModalClose').on('click', ()=> {
        $('#filterModal').hide();
    });
};

const filterDirectory = (dir) => {

    switch (dir.directory) {
        case 'personnel':
            personnel.displayRecords(filter);
            break;
        case 'departments':
            departments.displayRecords(filter);
            break;
        case 'locations':
            locations.displayRecords(filter);
            break;
    }
};

const clearFilters = (obj) => {
    obj.isFiltered = false;
    obj.departments = [];
    obj.locations = [];
};

const search = (searchType, searchVal) => {

    let url;

    if (searchType === 'email') {
        url = './libs/php/personnel/searchAllPersonnelByEmail.php';
    } else if (searchType === 'num') {
        url = './libs/php/personnel/searchAllPersonnelByID.php';
    } else {
        url = './libs/php/personnel/searchAllPersonnelByLastName.php';
    };

    return new Promise((resolve, reject) => {
        if (id) {
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: {
                    searchVal: searchVal
                },
            
                success: (res)=> {
                    if (res.status.name == 'ok') {
                        resolve(res.data);
                    };
                    reject(res.status);
                },
            
                error: (err)=> {
                    reject(err);
                }
            })
        } 
    })

};