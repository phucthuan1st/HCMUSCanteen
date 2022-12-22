function request_food_list() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        let res = JSON.parse(this.responseText);
        let message = res['message'];

        if (message === "-2") {
            alert('Cannot connect to server');
        } else if (message === "0") {
            alert('Cannot retrive data from server');
        } else {
            var data = res['data'];
            console.log(data);
        }
    }

    xhttp.open('GET', 'http://localhost:1111/api/food');
    xhttp.send();
}

function request_login(usr, pas) {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
        let res = JSON.parse(this.responseText);
        let message = res['message'];

        if (message === "-2") {
            alert("Cannot connect to server");
        } else if (message === "-1") {
            alert("Invalid Username / Password");
        } else if (message === "0") {
            alert("Username / Password is incorrect");
        } else if (message === "1") {
            window.open("home.html", taget = "_self");
        }
    }
    xhttp.open('POST', 'http://localhost:1111/login', true);
    xhttp.send(`UNAME=${usr}?PWD=${pas}`);
}

function request_ordered_cart(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://localhost:1111/cart', true)
    xhttp.send(`MSSV=${id}`);

    xhttp.onload = function() {
        let res = JSON.parse(xhttp.responseText);
        let message = res['message'];

        if (message === "-2") {
            alert("Cannot connect to server");
        } else if (message === "0") {
            alert("Failed to retrieve ordered products from server");
        } else {
            data = res['data'];
            console.log(data);
        }

    }
}

request_food_list();