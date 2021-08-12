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
                    <button id='directoryModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                    <button id="directoryModalSubmit" type="button" class="btn btn-primary">Submit</button>
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
                url: './libs/php/getLocationByDepID.php',
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

    $('#directoryModalSubmit').on('click', ()=> {
        let dep = $('#depSlc').val()
        let isValid;
        if (record.fname && record.lname && record.email && record.jobTitle) {
            if (utils.validStr(record.fname) && utils.validStr(record.lname) && utils.validStr(record.jobTitle) && utils.validEmail(record.email) && dep !== 'Select Department') {
                isValid = true;
                $('#directoryModal').hide();
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

    $('#directoryModalClose').on('click', ()=> {
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
                url: './libs/php/getAll.php',
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
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-user"></i> ${obj.fname} ${obj.lname}</h5>
                    <button id='directoryModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                    <tr>
                        <td>Employee ID</td>
                        <td class="floatRight">${obj.id}</td>
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
                    <button id='directoryModalCancel' type="button" class="btn btn-secondary close-modal dir-modal-close-btn">Close</button>
                    <button id="directoryModalEdit" type="button" class="btn btn-primary">Edit</button>
                </div>
            </div>
        </div>
    `)

    $('#directoryModal').show();
    $('#directoryModalCancel').hide();

    $('#directoryModalClose').on('click', ()=> {
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
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-user"></i> ${obj.fname} ${obj.lname}</h5>
                    <button id='directoryModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                        <tr>
                            <td>Employee ID</td>
                            <td class="floatRight">${obj.id}</td>
                        </tr>
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
                    <button id="directoryModalDelete" type="button" class="btn btn-danger">Delete</button>
                    <button id="directoryModalSubmit" type="button" class="btn btn-primary">Submit</button>
                </div>
            </div>
        </div>
    `)

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
                url: './libs/php/getLocationByDepID.php',
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

    $('#directoryModal').show();

    $('#directoryModalClose').on('click', ()=> {
        $('#directoryModal').hide();
    });

    $('#directoryModalSubmit').on('click', ()=> {
        let isValid;
        if (utils.validStr(record.fname) && utils.validStr(record.lname) && utils.validStr(record.jobTitle) && utils.validEmail(record.email)) {
            isValid = true;
            $('#directoryModal').hide();
            confirmUpdateModal(isValid)
        } else {
            isValid = false;
            confirmUpdateModal(isValid)
        }
    });

    $('#directoryModalDelete').on('click', ()=> {
        $('#directoryModal').hide();
        confirmDeleteModal(record);
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
                <button id='confirmUpdateModalCancel' type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button id='confirmUpdateModalSave' type="button" class="btn btn-primary">Save changes</button>
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
        }, 2000);
    });

    $('#confirmUpdateModalClose').on('click', ()=> {
        $('#confirmUpdateModal').hide();
    });

};
     
const updateRecord = (obj) => {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: './libs/php/updatePersonnel.php',
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
            url: './libs/php/deletePersonnelByID.php',
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
            url: './libs/php/insertPersonnel.php',
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
                <button id='confirmUpdateModalCancel' type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button id='confirmUpdateModalSave' type="button" class="btn btn-primary">Save changes</button>
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
        $('#confirmUpdateModalTitle').html('Personnel Record Updated');
        $('#confirmUpdateModalBody').html('<p>Your changes have been updated.</p>');
        $('#confirmUpdateModalSave').hide();
        $('#confirmUpdateModalCancel').hide();
        setTimeout(()=> {
            $('#confirmUpdateModal').hide();
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
                <p>Do you wish to procced with deleting record <span class='boldText'>ID# ${obj.id} ${obj.lname}, ${obj.fname}?</span> This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button id='confirmDeleteModalCancel' type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button id='confirmDeleteModalDelete' type="button" class="btn btn-danger">Delete</button>
            </div>
            </div>
        </div>
    `);

    $('#confirmDeleteModalDelete').on('click', ()=> {
        deleteRecord(record)
        .then(()=> displayRecords(filter))
        .catch((err)=> console.error(err));
        $('#confirmDeleteModalTitle').html('Personnel Record Deleted');
        $('#confirmDeleteModalBody').html(`<p>${obj.lname}, ${obj.fname} has been deleted.</p>`);
        $('#confirmDeleteModalDelete').hide();
        $('#confirmDeleteModalCancel').hide();
        setTimeout(()=> {
            $('#confirmDeleteModal').hide();
        }, 2000);
    });

    $('#confirmDeleteModalCancel').on('click', ()=> {
        $('#confirmDeleteModal').hide();
        getAllDepartments()
        .then((data)=> editModal(data, record))
        .catch((err)=> console.error(err));
    });

    $('#confirmDeleteModalClose').on('click', ()=> {
        $('#confirmDeleteModal').hide();
    });
};

const getAllRecords = (filterObj) => {

    return new Promise((resolve, reject)=> {

        let url;

        if (filterObj.isFiltered) {            
            if (filterObj.locations > 0 || filterObj.departments > 0) {
                url = './libs/php/filterBy.php';
            } else {
                url = './libs/php/sortBy.php';
            }
        } else {
            url = './libs/php/getAllPersonnel.php';
        }


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

const displayAllPersonnel = (data) => {
    filter.directory = 'personnel';
    $('#directoryTable').html(`
        <thead>
            <tr>
                <th scope='col'>ID <i class="fas fa-sort"></i></th>
                <th scope='col'>Last Name <i class="fas fa-sort"></i></th>
                <th scope='col'>First Name <i class="fas fa-sort"></i></th>
                <th scope='col'>Email <i class="fas fa-sort"></i></th>
                <th scope='col'>Job Title <i class="fas fa-sort"></i></th>
                <th scope='col'>Department <i class="fas fa-sort"></i></th>
                <th scope='col'>Location <i class="fas fa-sort"></i></th>
            </tr>
        </thead>
        <tbody id='directoryRecords'></tbody>
    `)

    $.each(data, (i, d)=> {
        $('#directoryRecords').append(`
            <tr class='directory-items'>
                <td id='id'>${d.id}</td>
                <td class='lastName'>${d.lastName}</td>
                <td>${d.firstName}</td>
                <td>${d.email}</td>
                <td>${d.jobTitle}</td>
                <td>${d.department}</td>
                <td>${d.location}</td>
            </tr>
        `)
    });

    $('.directory-items').on('click', (e)=> {
        let parent = $(e.target).closest('tr');
        let id = parent.find('#id').html();
        getRecord(id)
        .then((obj)=> displayModal(obj))
        .catch((err)=> console.error(err));
    });
};

