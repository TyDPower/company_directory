export const getAllDepartments = () => {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: "./libs/php/getAllDepartments.php",
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