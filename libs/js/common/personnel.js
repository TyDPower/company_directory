import { getAllDepartments } from './deparments.js';
import { filter } from '../common/filter.js';
import * as utils from '../utils/utils.js';

var record = {
    id: null,
    fname: null,
    lname: null,
    email: null,
    jobTitle: null,
    depID: null,
    locID: null,
    department: null,
    location: null
};

export const newRecordModal = (deps) => {

    $('#directoryModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-user"></i> New Personnel Record</h5>
                    <button type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                        <tr>
                            <td>First name</td>
                            <td id="firstNameCont" class="floatRight">
                                <input type="text" id="firstName" name="firstName">
                            </td>
                        </tr>
                        <tr>
                            <td>Last name</td>
                            <td id="lastNameCont" class="floatRight">
                                <input type="text" id="lastName" name="lastName">
                            </td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td id="emailCont" class="floatRight">
                                <input type="email" id="email" name="eamil">
                            </td>
                        </tr>
                        <tr>
                            <td>Job Title</td>
                            <td id="jobTitleCont" class="floatRight">
                                <input type="text" id="jobTitle" name="jobTitle">
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
                            <td id='depLoc' class='floatRight'></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button id="directoryModalSubmit" type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                    <button type="button" class="btn btn-dark directory-modal-close"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `)

    $('#depSlc').html(`<option>Select Department</option>`);
    $.each(deps, (i, dep)=> {
        $('#depSlc').append(`<option value=${dep.id}>${dep.name}</option>`);
    });

    $('#depSlc').on('change', ()=> {
            let id = $('#depSlc').val();
            $.ajax({
                url: './libs/php/locations/getLocationByDepID.php',
                type: 'post',
                dataType: 'json',
                data: {
                    id: id
                },
            
                success: (res)=> {
                    record.depID = parseInt(id);
                    $('#depLoc').html(`${res.data[0].name}`)
                },
            
                error: (err)=> {
                    console.error(err);
                }
            })
    });

    $('#firstName').on('change', ()=> {
        record.fname = $('#firstName').val();
        if (!utils.validStr(record.fname)) {
            validationModal('name');
        }
    });
    $('#lastName').on('change', ()=> {
        record.lname = $('#lastName').val();
        if (!utils.validStr(record.lname)) {
            validationModal('name');
        }
    });
    $('#jobTitle').on('change', ()=> {
        record.jobTitle = $('#jobTitle').val();
        if (!utils.validStr(record.jobTitle)) {
            validationModal('name');
        }
    });
    $('#email').on('change', ()=> {
        record.email = $('#email').val();
        if (!utils.validEmail(record.email)) {
            validationModal('email');
        }
    });

    $('#directoryModal').show();

    $('input').addClass("form-control");
    $('select').addClass("form-control");

    $('#directoryModalSubmit').on('click', ()=> {
        let dep = $('#depSlc').val()
        let isValid;
        if (record.fname && record.lname && record.email && record.jobTitle) {
            if (utils.validStr(record.fname) && utils.validStr(record.lname) && utils.validStr(record.jobTitle) && utils.validEmail(record.email) && dep !== 'Select Department') {
                isValid = true;
                confirmNewRecordModal(isValid)
            } else {
                isValid = false;
                confirmNewRecordModal(isValid)
            }
        } else {
            isValid = false;
            confirmNewRecordModal(isValid)
        };

    });

    $('.directory-modal-close').on('click', ()=> {
        $('#directoryModal').hide();
    });

};

export const displayRecords = (filterObj) => {
    getAllRecords(filterObj)
    .then((data)=> displayAllPersonnel(data))
    .catch((err)=> console.error(err));
};

const getRecord = (id) => {
    return new Promise((resolve, reject) => {
        if (id) {
            $.ajax({
                url: './libs/php/personnel/getAllPersonnelInfo.php',
                type: "post",
                dataType: "json",
                data: {
                    id: id
                },
            
                success: (res)=> {
                    if (res.status.name == 'ok') {
                        let em = res.data[0];
                        record.id = em.id
                        record.fname = em.firstName,
                        record.lname = em.lastName,
                        record.email = em.email,
                        record.jobTitle = em.jobTitle,
                        record.depID = em.depID,
                        record.locID = em.locID,
                        record.department = em.department,
                        record.location = em.location
                        resolve(record);
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

const displayModal = (obj) => {
    $('#directoryModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-user"></i> Employee Record</h5>
                    <button type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                    <tr>
                        <td>First Name</td>
                        <td class="floatRight">${obj.fname}</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td class="floatRight">${obj.lname}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td class="floatRight">${obj.email}</td>
                    </tr>
                    <tr>
                        <td>Job Title</td>
                        <td class="floatRight">${obj.jobTitle}</td>
                    </tr>
                    <tr>
                        <td>Department</td>
                        <td class="floatRight">${obj.department}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td class="floatRight">${obj.location}</td>
                    </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button id="directoryModalEdit" type="button" class="btn btn-dark"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-dark directory-modal-close"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `);

    $('#directoryModal').show();

    $('.directory-modal-close').on('click', ()=> {
        $('#directoryModal').hide();
    });

    $('#directoryModalEdit').on('click', ()=> {
        getAllDepartments()
        .then((data)=> editModal(data, record))
        .catch((err)=> console.error(err));
    })
};

const editModal = (deps, obj) => {
    $('#directoryModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-user"></i> Edit ${obj.fname} ${obj.lname}</h5>
                    <button id='directoryModalClose' type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                        <tr>
                            <td>First name</td>
                            <td id="firstNameCont" class="floatRight">
                                <input type="text" id="firstName" name="firstName" value="${obj.fname}">
                            </td>
                        </tr>
                        <tr>
                            <td>Last name</td>
                            <td id="lastNameCont" class="floatRight">
                                <input type="text" id="lastName" name="lastName" value="${obj.lname}">
                            </td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td id="emailCont" class="floatRight">
                                <input type="email" id="email" name="eamil" value="${obj.email}">
                            </td>
                        </tr>
                        <tr>
                            <td>Job Title</td>
                            <td id="jobTitleCont" class="floatRight">
                                <input type="text" id="jobTitle" name="jobTitle" value="${obj.jobTitle}">
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
                            <td id='depLoc' class='floatRight'>${obj.location}</td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button id="directoryModalSubmit" type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                    <button type="button" class="btn btn-dark directory-modal-close"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `);

    $.each(deps, (i, dep)=> {
            $('#depSlc').append(`<option value=${dep.id}>${dep.name}</option>`);
            let sel = $('#depSlc')
            for (let i=0; i<sel[0].length; i++) {
                if (sel[0][i].text === obj.department) {
                    sel[0][i].defaultSelected = true;
                }
            };
    });

    $('#depSlc').on('change', ()=> {
            let id = $('#depSlc').val();
            $.ajax({
                url: './libs/php/locations/getLocationByDepID.php',
                type: 'post',
                dataType: 'json',
                data: {
                    id: id
                },
            
                success: (res)=> {
                    obj.depID = parseInt(id);
                    $('#depLoc').html(`${res.data[0].name}`)
                },
            
                error: (err)=> {
                    console.error(err);
                }
            })
    });

    $('#firstName').on('change', ()=> {
        obj.fname = $('#firstName').val();
        if (!utils.validStr(obj.fname)) {
            validationModal('name');
        }
    });
    $('#lastName').on('change', ()=> {
        obj.lname = $('#lastName').val();
        if (!utils.validStr(obj.lname)) {
            validationModal('name');
        }
    });
    $('#jobTitle').on('change', ()=> {
        obj.jobTitle = $('#jobTitle').val();
        if (!utils.validStr(obj.jobTitle)) {
            validationModal('name');
        }
    });
    $('#email').on('change', ()=> {
        obj.email = $('#email').val();
        if (!utils.validEmail(obj.email)) {
            validationModal('email');
        }
    });

    $('input').addClass("form-control");
    $('select').addClass("form-control");

    $('#directoryModal').show();

    $('.directory-modal-close').on('click', ()=> {
        $('#directoryModal').hide();
    });

    $('#directoryModalSubmit').on('click', ()=> {
        let isValid;
        if (utils.validStr(record.fname) && utils.validStr(record.lname) && utils.validStr(record.jobTitle) && utils.validEmail(record.email)) {
            isValid = true;
            confirmUpdateModal(isValid)
        } else {
            isValid = false;
            confirmUpdateModal(isValid)
        }
    });
};

const validationModal = (type) => {

    let vldName = 'Please enter a valid name. No numbers or special characters...';
    let vldEmail = 'Please enter a valid email...';

    $('#validationModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="validationModalTitle" class="modal-title">Invail Entry</h5>
                    <button id='validationModalClose' type="button" class="btn-close conf-modal-close-btn"></button>
                </div>
                <div id="validationModalBody" class="modal-body">
                </div>
                <div class="modal-footer">
                </div>
            </div>
        </div>
    `);

    if (type === 'email') {
        $('#validationModalBody').html(vldEmail)
        $('#validationModal').show();
    } else {
        $('#validationModalBody').html(vldName)
        $('#validationModal').show();
    };

    $('#validationModalClose').on('click', ()=> {
        $('#validationModal').hide();
    });
    
};

const confirmUpdateModal = (valid) => {

    $('#confirmUpdateModal').show();

    $('#confirmUpdateModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 id='confirmUpdateModalTitle' class="modal-title"></h5>
                <button id='confirmUpdateModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id='confirmUpdateModalBody' class="modal-body">
            </div>
            <div class="modal-footer">
                <button id='confirmUpdateModalSave' type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                <button id='confirmUpdateModalCancel' type="button" class="btn btn-dark" data-bs-dismiss="modal"><i class="fas fa-ban"></i></button>
            </div>
            </div>
        </div>
    `)

    if (valid) {
        $('#confirmUpdateModalTitle').html('Save Confirmmation');
        $('#confirmUpdateModalBody').html('<p>Do you wish to save your changes?</p>');
        $('#confirmUpdateModalSave').show();
    } else {
        $('#confirmUpdateModalTitle').html('Invalid Entry');
        $('#confirmUpdateModalBody').html('<p>Invalid entry/entries detected...</p>');
        $('#confirmUpdateModalSave').hide();
        $('#confirmUpdateModalCancel').hide();
    }

    $('#confirmUpdateModalCancel').on('click', ()=> {
        $('#confirmUpdateModal').hide();
        getAllDepartments()
        .then((data)=> editModal(data, record))
        .catch((err)=> console.error(err));
    });

    $('#confirmUpdateModalSave').on('click', ()=> {
        updateRecord(record)
        .then(()=> displayRecords(filter))
        .catch((err)=> console.error(err));
        $('#confirmUpdateModalTitle').html('Personnel Record Updated');
        $('#confirmUpdateModalBody').html('<p>Your changes have been updated.</p>');
        $('#confirmUpdateModalSave').hide();
        $('#confirmUpdateModalCancel').hide();
        setTimeout(()=> {
            $('#confirmUpdateModal').hide();
            $('#directoryModal').hide();
        }, 2000);
    });

    $('#confirmUpdateModalClose').on('click', ()=> {
        $('#confirmUpdateModal').hide();
    });

};
     
const updateRecord = (obj) => {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/personnel/updatePersonnel.php',
            type: 'post',
            dataType: 'json',
            data: {
                obj: obj
            },
            success: (res)=> {
                if (res.status.name == 'ok') {
                    resolve();
                }
                reject(res.status);
            },
            error: (err)=> {
                reject(err);
            }
        })
    })
};

const deleteRecord = (obj) => {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/personnel/deletePersonnelByID.php',
            type: 'post',
            dataType: 'json',
            data: {
                id: obj.id
            },
            success: (res)=> {
                if (res.status.name == 'ok') {
                    resolve();
                }
                reject(res.status);
            },
            error: (err)=> {
                reject(err);
            }
        });
    });
};

const newRecord = (obj) => {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/personnel/insertPersonnel.php',
            type: 'post',
            dataType: 'json',
            data: {
                person: obj
            },
            success: (res)=> {
                if (res.status.name == 'ok') {
                    resolve();
                }
                reject(res.status);
            },
            error: (err)=> {
                reject(err);
            }
        })
    })
};

const confirmNewRecordModal = (valid) => {
    $('#confirmUpdateModal').show();

    $('#confirmUpdateModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 id='confirmUpdateModalTitle' class="modal-title"></h5>
                <button id='confirmUpdateModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id='confirmUpdateModalBody' class="modal-body">
            </div>
            <div class="modal-footer">
                <button id='confirmUpdateModalSave' type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                <button id='confirmUpdateModalCancel' type="button" class="btn btn-dark" data-bs-dismiss="modal"><i class="fas fa-ban"></i></button>
            </div>
            </div>
        </div>
    `)

    if (valid) {
        $('#confirmUpdateModalTitle').html('Save Confirmmation');
        $('#confirmUpdateModalBody').html('<p>Do you wish to save your changes?</p>');
        $('#confirmUpdateModalSave').show();
    } else {
        $('#confirmUpdateModalTitle').html('Invalid Entry');
        $('#confirmUpdateModalBody').html('<p>Invalid entry/entries detected...</p>');
        $('#confirmUpdateModalSave').hide();
        $('#confirmUpdateModalCancel').hide();
    }

    $('#confirmUpdateModalCancel').on('click', ()=> {
        $('#confirmUpdateModal').hide();
        getAllDepartments()
        .then((deps)=> newRecordModal(deps))
        .catch((err)=> console.error(err));
    });

    $('#confirmUpdateModalSave').on('click', ()=> {
        newRecord(record)
        .then(()=> displayRecords(filter))
        .catch((err)=> console.error(err));
        $('#confirmUpdateModalTitle').html('New Personnel Record Created');
        $('#confirmUpdateModalBody').html(`<p>Record for ${record.fname} ${record.lname} has been created.</p>`);
        $('#confirmUpdateModalSave').hide();
        $('#confirmUpdateModalCancel').hide();
        setTimeout(()=> {
            $('#confirmUpdateModal').hide();
            $('#directoryModal').hide();
        }, 2000);
    });

    $('#confirmUpdateModalClose').on('click', ()=> {
        $('#confirmUpdateModal').hide();
    });
};

const confirmDeleteModal = (obj) => {
    $('#confirmDeleteModal').show();

    $('#confirmDeleteModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 id='confirmDeleteModalTitle' class="modal-title">Comfirm Delete Record</h5>
                <button id='confirmDeleteModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id='confirmDeleteModalBody' class="modal-body">
                <p>Do you wish to procced with deleting record <span class='boldText'>${obj.lname}, ${obj.fname}?</span> This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button id='confirmDeleteModalDelete' type="button" class="btn btn-dark"><i class="fas fa-trash-alt"></i></button>
                <button id='confirmDeleteModalCancel' type="button" class="btn btn-dark" data-bs-dismiss="modal"><i class="fas fa-ban"></i></button>
            </div>
            </div>
        </div>
    `);

    $('#confirmDeleteModalDelete').on('click', ()=> {
        deleteRecord(obj)
        .then(()=> displayRecords(filter))
        .catch((err)=> console.error(err));
        $('#confirmDeleteModalTitle').html('Personnel Record Deleted');
        $('#confirmDeleteModalBody').html(`<p>${obj.lname}, ${obj.fname} has been deleted.</p>`);
        $('#confirmDeleteModalDelete').hide();
        $('#confirmDeleteModalCancel').hide();
        setTimeout(()=> {
            $('#confirmDeleteModal').hide();
            $('#directoryModal').hide();
        }, 2000);
    });

    $('#confirmDeleteModalCancel').on('click', ()=> {
        $('#confirmDeleteModal').hide();
    });

    $('#confirmDeleteModalClose').on('click', ()=> {
        $('#confirmDeleteModal').hide();
    });
};

const getAllRecords = (filterObj) => {

    return new Promise((resolve, reject)=> {

        let url;

        if (filterObj.isFiltered) {       
            if (filterObj.locations.length > 0 && filterObj.departments.length > 0) {
                url = './libs/php/personnel/filterPersonnelByDepAndLoc.php';
            } else if (filterObj.locations.length > 0) {
                url = './libs/php/personnel/filterPersonnelByLoc.php';
            } else if (filterObj.departments.length > 0) {
                url = './libs/php/personnel/filterPersonnelByDep.php';
            } else {
                url = './libs/php/personnel/sortPersonnelBy.php';
            }
        } else {
            url = './libs/php/personnel/getAllPersonnel.php';
        };


        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {
                filter: filterObj
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

};

export const displayAllPersonnel = (data) => {

    filter.directory = 'personnel';

    $('#directoryTable').html(`
        <thead class='sticky-header'>
            <tr>
                <th scope='col' class='id'>ID</th>
                <th scope='col' class='d-lg-table-cell'>Last Name</th>
                <th scope='col' class='d-lg-table-cell'>First Name</th>
                <th scope='col' class='d-none d-lg-table-cell'>Email</th>
                <th scope='col' class='d-none d-lg-table-cell'>Job Title</th>
                <th scope='col' class='d-none d-lg-table-cell'>Department</th>
                <th scope='col' class='d-none d-lg-table-cell'>Location</th>
                <th scope='col' class='d-sm-table-cell d-lg-none text-center'>View</th>
                <th scope='col' class='d-none d-lg-table-cell text-center'>Edit</th>
                <th scope='col' class='d-lg-table-cell text-center'>Delete</th>
            </tr>
        </thead>
        <tbody id='directoryRecords'></tbody>
    `)

    if (data.length > 0) {

    $.each(data, (i, d)=> {
        $('#directoryRecords').append(`
            <tr class='directory-items'>
                <td class='id'>${d.id}</td>
                <td class='d-lg-table-cell lname'>${d.lastName}</td>
                <td class='d-lg-table-cell fname'>${d.firstName}</td>
                <td class='d-none d-lg-table-cell'>${d.email}</td>
                <td class='d-none d-lg-table-cell'>${d.jobTitle}</td>
                <td class='d-none d-lg-table-cell'>${d.department}</td>
                <td class='d-none d-lg-table-cell'>${d.location}</td>
                <td class='d-sm-table-cell d-lg-none text-center view-btn'><i class="fas fa-eye"></i></i></td>
                <td class='d-none d-lg-table-cell text-center edit-btn'><i class="fas fa-edit"></i></td>
                <td class='d-lg-table-cell text-center delete-btn'><i class="fas fa-trash-alt"></i></td>
            </tr>
        `)
    });

    $('.id').hide();

    /*$('.directory-items').on('click', (e)=> {
        let parent = $(e.target).closest('tr');
        let id = parent.find('.id').html();

        getRecord(id)
        .then((obj)=> displayModal(obj))
        .catch((err)=> console.error(err));
    });*/

    $('.view-btn').on('click', (e)=> {
        let parent = $(e.target).closest('tr');
        let id = parent.find('.id').html();

        getRecord(id)
        .then((obj)=> displayModal(obj))
        .catch((err)=> console.error(err));
    });

    $('.edit-btn').on('click', (e)=> {
        let parent = $(e.target).closest('tr');
        let id = parent.find('.id').html();
        let deps;

        getAllDepartments()
        .then((data)=> deps = data)
        .then(()=> {
            getRecord(id)
            .then((obj)=> editModal(deps, obj))
            .catch((err)=> console.error(err));
        })
        .catch((e)=> console.error(e));
    });

    $('.delete-btn').on('click', (e)=> {
        let parent = $(e.target).closest('tr');
        let em = {
            id: parent.find('.id').html(),
            lname: parent.find('.lname').html(),
            fname: parent.find('.fname').html(),
        };
        confirmDeleteModal(em)
    });

    } else {
        $('#directoryRecords').html(`
            <tr class='directory-items'>
                <td></td>
                <td></td>
                <td></td>
                <td>No records found!</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `);
    };
    
};

