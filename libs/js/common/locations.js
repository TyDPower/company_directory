import { filter } from '../common/filter.js';
import * as utils from '../utils/utils.js';

var record = {
    id: null,
    name: null,
    count: null,
};

export const displayRecords = (filterObj) => {
    getAllRecords(filterObj)
    .then((data)=> displayAllLocations (data))
    .catch((err)=> console.error(err));
};

export const getAllRecords = (filterObj) => {

    return new Promise((resolve, reject)=> {

        let url;

        if (filterObj.isFiltered) {            
            if (filterObj.locations > 0 || filterObj.departments > 0) {
                url = './libs/php/locations/filterLocationsBy.php';
            } else {
                url = './libs/php/locations/sortLocationsBy.php';
            }
        } else {
            url = './libs/php/locations/getAllLocations.php';
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

const displayAllLocations = (data) => {
    filter.directory = 'locations';
    $('#directoryTable').html(`
        <thead class='sticky-header'>
            <tr>
                <th class='id' scope='col'>ID</th>
                <th scope='col'>Location Name</th>
                <th scope='col'>Department Count</th>
            </tr>
        </thead>
        <tbody id='directoryRecords'></tbody>
    `)

    $.each(data, (i, l)=> {
        $('#directoryRecords').append(`
            <tr class='directory-items'>
                <td class='id'>${l.id}</td>
                <td>${l.name}</td>
                <td>${l.dc}</td>
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

export const getAllLocations = () => {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: "./libs/php/locations/getAllLocations.php",
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
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-building"></i> New Location Record</h5>
                    <button type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                        <tr>
                            <td>Location Name</td>
                            <td id="locationNameCon" class="floatRight">
                                <input type="text" id="locationName" name="firstName">
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

    $('#locationName').on('change', ()=> {
        record.name = $('#locationName').val();
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
        if (utils.validStr(record.name)) {
            isValid = true;
            confirmNewRecordModal(isValid)
        } else {
            isValid = false;
            confirmNewRecordModal(isValid)
        }
    });

};

const getRecord = (id) => {
    return new Promise((resolve, reject) => {
        if (id) {
            $.ajax({
                url: './libs/php/locations/getAllLocationInfo.php',
                type: "post",
                dataType: "json",
                data: {
                    id: id
                },
            
                success: (res)=> {
                    if (res.status.name == 'ok') {
                        let em = res.data[0];
                        record.id = em.id;
                        record.name = em.name;
                        record.count = em.depCount;
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
                    <h5 id='directoryModalTitle' class="modal-title"><i class="fas fa-building"></i> Location Record</h5>
                    <button id='directoryModalClose' type="button" class="btn-close directory-modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id='directoryModalBody' class="modal-body">
                    <table class="table table-striped">
                    <tr>
                        <td>Location Name</td>
                        <td class="floatRight">${obj.name}</td>
                    </tr>
                    <tr>
                        <td>Department Count</td>
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
    $('#directoryModalCancel').hide();

    $('.directory-modal-close').on('click', ()=> {
        $('#directoryModal').hide();
    });

    $('#directoryModalEdit').on('click', ()=> {
        getAllLocations()
        .then((data)=> editModal(record))
        .catch((err)=> console.error(err));
    })
};

const editModal = (obj) => {
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
                            <td>Location Name</td>
                            <td id="departmentNameCon" class="floatRight">
                                <input type="text" id="locationName" name="firstName" value="${obj.name}">
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

    $('#locationName').on('change', ()=> {
        obj.name = $('#locationName').val();
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
            url: './libs/php/locations/updateLocation.php',
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
            url: './libs/php/locations/deleteLocationByID.php',
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
            url: './libs/php/locations/insertLocation.php',
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
        newRecordModal()
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
                    <p>There are department records attached to this location. Please delete all department records before attempting to delete this location.</p>
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
                    <p>Do you wish to procced with deleting location <span class='boldText'>${obj.name}?</span> This action cannot be undone.</p>
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



