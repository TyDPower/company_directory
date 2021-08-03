const getPersonnelByID = () => {

    return new Promise((res, rej)=> {

        $.ajax({
            url: "./libs/php/getPersonnelByID.php",
            dataType: "json",

            success: (resp)=> {
                res(resp)
            },

            error: (err)=> {
                rej(err);
            }
        })
    })
}

getPersonnelByID()
.then((data)=> console.log(data))