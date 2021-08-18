import { getAllLocations } from './locations.js';
import { filter } from '../common/filter.js';
import * as utils from '../utils/utils.js';

var record = {
    id: null,
    name: null,
    location: null,
    count: null,
    locID: null,
};

export const getAllDepartments = () => {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: "./libs/php/departments/getAllDepartments.php",
            type: "post",
            dataType: "json",
            success: (res)=> {
                if (res.status.name == 'ok') {
                    resolve(res.data);
                };
                reject(res.status);
            },
            error: (err)=> {
                reject(err);
            }
        });
    });
};

export const newRecordModal = (locs) => {

    $('#directoryModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-building"></i> New Depatment Record</h5>
                    <button type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                        <tr>
                            <td>Department Name</td>
                            <td id="departmentNameCon" class="floatRight">
                                <input type="text" id="departmentName" name="firstName">
                            </td>
                        </tr>
                        <tr>
                            <td>New Location</td>
                            <td class="floatRight">
                                <select id="selectLocation"></select>
                            </td>
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

    $('#selectLocation').html(`<option>Select Location</option>`);
    $.each(locs, (i, loc)=> {
        $('#selectLocation').append(`<option value=${loc.id}>${loc.name}</option>`);
    });

    $('#selectLocation').on('change', ()=> {
        let id = $('#selectLocation').val();
        record.locID = id;
    });

    $('#departmentName').on('change', ()=> {
        record.name = $('#departmentName').val();
        if (!utils.validStr(record.name)) {
            validationModal('name');
        }
    });

    $('#directoryModal').show();

    $('.directory-modal-close').on('click', ()=> {
        $('#directoryModal').hide();
    });

    $('input').addClass("form-control");
    $('select').addClass("form-control");

    $('#directoryModalSubmit').on('click', ()=> {
        let isValid;

        if (record.name) {
            if (utils.validStr(record.name) && record.locID) {
                isValid = true;
                confirmNewRecordModal(isValid)
            } else {
                isValid = false;
                confirmNewRecordModal(isValid)
            }
        } else {
            isValid = false;
            confirmNewRecordModal(isValid)
        }
    });

};

export const displayRecords = (filterObj) => {
    getAllRecords(filterObj)
    .then((data)=> displayAllDepartments(data))
    .catch((err)=> console.error(err));
};

const getRecord = (id) => {
    return new Promise((resolve, reject) => {
        if (id) {
            $.ajax({
                url: './libs/php/departments/getAllDepartmentInfo.php',
                type: "post",
                dataType: "json",
                data: {
                    id: id
                },
            
                success: (res)=> {
                    if (res.status.name == 'ok') {
                        let em = res.data[0];
                        record.id = em.id
                        record.name = em.name,
                        record.location = em.location,
                        record.count = em.personnelCount,
                        record.locID = em.locationID,
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
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-building"></i> Department Record</h5>
                    <button id='directoryModalClose' type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                    <tr>
                        <td>Department Name</td>
                        <td class="floatRight">${obj.name}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td class="floatRight">${obj.location}</td>
                    </tr>
                    <tr>
                        <td>Personnel Count</td>
                        <td class="floatRight">${obj.count}</td>
                    </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button id="directoryModalEdit" type="button" class="btn btn-dark"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-dark directory-modal-close"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `)

    $('#directoryModal').show();

    $('.directory-modal-close').on('click', ()=> {
        $('#directoryModal').hide();
    });

    $('#directoryModalEdit').on('click', ()=> {
        getAllLocations()
        .then((data)=> editModal(data, record))
        .catch((err)=> console.error(err));
    })
};

const editModal = (locs, obj) => {
    $('#directoryModal').html(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-building"></i> Edit ${obj.name}</h5>
                    <button id='directoryModalClose' type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                        <tr>
                            <td>Department Name</td>
                            <td id="departmentNameCon" class="floatRight">
                                <input type="text" id="departmentName" name="firstName" value="${obj.name}">
                            </td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td class="floatRight">
                                <select id="selectLocation"></select>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button id="directoryModalSubmit" type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                    <button id="directoryModalDelete" type="button" class="btn btn-dark"><i class="fas fa-trash-alt"></i></button>
                    <button type="button" class="btn btn-dark directory-modal-close"><i class="fas fa-ban"></i></button>
                </div>
            </div>
        </div>
    `);

    $.each(locs, (i, loc)=> {
        $('#selectLocation').append(`<option value=${loc.id}>${loc.name}</option>`);
        let sel = $('#selectLocation')
        for (let i=0; i<sel[0].length; i++) {
            if (sel[0][i].text === obj.location) {
                sel[0][i].defaultSelected = true;
            };
        };
    });

    $('#selectLocation').on('change', ()=> {
        let id = $('#selectLocation').val();
        obj.locID = id;
    });

    $('#departmentName').on('change', ()=> {
        obj.name = $('#departmentName').val();
        if (!utils.validStr(obj.name)) {
            validationModal('name');
        }
    });

    $('#directoryModal').show();

    $('.directory-modal-close').on('click', ()=> {
        $('#directoryModal').hide();
    });

    $('#directoryModalSubmit').on('click', ()=> {
        let isValid;
        if (utils.validStr(record.name)) {
            isValid = true;
            confirmUpdateModal(isValid)
        } else {
            isValid = false;
            confirmUpdateModal(isValid)
        }
    });

    $('input').addClass("form-control");
    $('select').addClass("form-control");

    $('#directoryModalDelete').on('click', ()=> {
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
        getAllLocations()
        .then((data)=> editModal(data, record))
        .catch((err)=> console.error(err));
    });

    $('#confirmUpdateModalSave').on('click', ()=> {
        updateRecord(record)
        .then(()=> displayRecords(filter))
        .catch((err)=> console.error(err));
        $('#confirmUpdateModalTitle').html('Department Record Updated');
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
            url: './libs/php/departments/updateDepartment.php',
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
            url: './libs/php/departments/deleteDepartmentByID.php',
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
            url: './libs/php/departments/insertDepartment.php',
            type: 'post',
            dataType: 'json',
            data: {
                department: obj
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
        $('#confirmUpdateModalTitle').html('New Department Created');
        $('#confirmUpdateModalBody').html(`<p>Record for ${record.name} has been created.</p>`);
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

    console.log(obj)

    if (obj.count > 0) {

        $('#confirmDeleteModal').html(`
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 id='confirmDeleteModalTitle' class="modal-title">Personnel Records Found</h5>
                    <button id='confirmDeleteModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='confirmDeleteModalBody' class="modal-body">
                    <p>There are personnel records attached to this department. Please delete all personnel records before attempting to delete this department.</p>
                </div>
                <div class="modal-footer">
                    <button id='confirmDeleteModalCancel' type="button" class="btn btn-dark" data-bs-dismiss="modal"><i class="fas fa-ban"></i></button>
                </div>
                </div>
            </div>
        `);

    } else {

        $('#confirmDeleteModal').html(`
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 id='confirmDeleteModalTitle' class="modal-title">Comfirm Delete Record</h5>
                    <button id='confirmDeleteModalClose' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='confirmDeleteModalBody' class="modal-body">
                    <p>Do you wish to procced with deleting department <span class='boldText'>${obj.name}?</span> This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button id='confirmDeleteModalDelete' type="button" class="btn btn-dark"><i class="fas fa-check-circle"></i></button>
                    <button id='confirmDeleteModalCancel' type="button" class="btn btn-dark" data-bs-dismiss="modal"><i class="fas fa-ban"></i></button>
                </div>
                </div>
            </div>
        `);
    };

    $('#confirmDeleteModalDelete').on('click', ()=> {
        deleteRecord(record)
        .then(()=> displayRecords(filter))
        .catch((err)=> console.error(err));
        $('#confirmDeleteModalTitle').html('Personnel Record Deleted');
        $('#confirmDeleteModalBody').html(`<p>${obj.name} has been deleted.</p>`);
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

export const getAllRecords = (filterObj) => {

    return new Promise((resolve, reject)=> {

        let url;

        if (filterObj.isFiltered) {            
            if (filterObj.locations.length > 0) {
                url = './libs/php/departments/filterDepartmentsBy.php';
            } else {
                url = './libs/php/departments/sortDepartmentsBy.php';
            }
        } else {
            url = './libs/php/departments/getAllDepartments.php';
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
                    console.log(res.data)
                    console.log(filterObj.locations)
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

const displayAllDepartments = (data) => {
    filter.directory = 'departments';
    $('#directoryTable').html(`
        <thead class='sticky-header'>
            <tr>
                <th class='id' scope='col'>ID</th>
                <th scope='col'>Department Name</th>
                <th scope='col'>Personnel Count</th>
                <th scope='col'>Location</th>
            </tr>
        </thead>
        <tbody id='directoryRecords'></tbody>
    `)

    $.each(data, (i, d)=> {
        $('#directoryRecords').append(`
            <tr class='directory-items'>
                <td class='id'>${d.id}</td>
                <td>${d.name}</td>
                <td>${d.pc}</td>
                <td>${d.location}</td>
            </tr>
        `)
    });

    $('.directory-items').on('click', (e)=> {
        let parent = $(e.target).closest('tr');
        let id = parent.find('.id').html();
        getRecord(id)
        .then((obj)=> displayModal(obj))
        .catch((err)=> console.error(err));
    });

    $('.id').hide();
};

