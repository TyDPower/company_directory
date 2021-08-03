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
}

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
}

//Fix getAll.php to return all data from all tables
const getAllPersonnel = () => {

    return new Promise((res, rej)=> {

        $.ajax({
            url: "./libs/php/getAllPersonnel.php",
            type: "post",
            dataType: "json",

            success: (resp)=> {
                res(resp.data)
            },

            error: (err)=> {
                rej(err);
            }
        })
    })

}

const displayPersonnel = (data) => {
    $.each(data, (i, d)=> {
        $("#directory").append(`
            <li id="del${d.id}" value=${d.id} class="list-group-item directory-items"><i class="far fa-id-card"></i>&nbsp${d.lastName + ", " + d.firstName}</li>
        `)
    })
}

const displayContact = (data) => {
    $("#email").html(data.email)
    $("#departmentID").html(data.departmentID)
}

getAllPersonnel()
.then((data)=> displayPersonnel(data))
.then(()=> {
    $( ".directory-items" ).click(function() {
        let val = $(this).val();
        getPersonnelByID(val)
        .then((data)=> displayContact(data[0]))
    });
})