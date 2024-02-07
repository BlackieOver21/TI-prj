function validateForm() {
    document.getElementById('imieError').textContent = '';
    document.getElementById('nazwiskoError').textContent = '';
    document.getElementById('peselError').textContent = '';
    document.getElementById('loginError').textContent = '';
    document.getElementById('hasloError').textContent = '';

    const imie = document.getElementById('imie').value;
    const nazwisko = document.getElementById('nazwisko').value;
    const pesel = document.getElementById('pesel').value;
    const login = document.getElementById('login').value;
    const haslo = document.getElementById('haslo').value;

    // Reguły walidacji
    const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    const peselRegex = /^[0-9]{11}$/;
    const loginRegex = /^[a-zA-Z0-9_]+$/;
    const hasloRegex = /^[a-zA-Z0-9$&*@]+$/;

    if (!nameRegex.test(imie)) {
        document.getElementById('imieError').textContent = 'Nieprawidłowe imię';
        return false;
    }

    if (!nameRegex.test(nazwisko)) {
        document.getElementById('nazwiskoError').textContent = 'Nieprawidłowe nazwisko';
        return false;
    }

    if (!peselRegex.test(pesel)) {
        document.getElementById('peselError').textContent = 'PESEL musi składać się z 11 cyfr, oraz nie może zawierać innych znaków';
        return false;
    }

    if (!loginRegex.test(login)) {
        document.getElementById('loginError').textContent = 'Login może zawierać tylko litery, cyfry i podkreślenie';
        return false;
    }

    if (haslo.length < 6 && !hasloRegex.test(haslo)) {
        document.getElementById('hasloError').textContent = 'Hasło musi zawierać co najmniej 6 znaków, oraz nie może zawierać znaków specjalnych';
        return false;
    }

    return true;
}

function fetchAndDisplayHTML(choice) {
    //const choice = document.getElementById('choice').value;
    const url = `http://pascal.fis.agh.edu.pl/~1bersutskyi/prj/forms/${choice}.html`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
            return response.text();
        })
        .then(htmlContent => {
            const contentContainer = document.getElementById('form-container');
            contentContainer.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function button1() {
    fetchAndDisplayHTML('form_pacjent');
    // TODO
}

function button2() {
    fetchAndDisplayHTML('register');
    // TODO
}

// Function to fetch the list of doctors from the server
function fetchDoctors() {
    return fetch('http://pascal.fis.agh.edu.pl:8013/fetching_lekarzy')
        .then(response => response.json())
        .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
        });
}

function fetchZabiegi() {
    return fetch('http://pascal.fis.agh.edu.pl:8013/fetching_zabiegi')
        .then(response => response.json())
        .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
        });
}

// Function to populate the select element with choices
function populateSelectLekarze(choices) {
    const selectElement = document.getElementById('dynamicSelectLekarz');

    selectElement.innerHTML = '';

    choices.forEach(choice => {
        console.log(choice);
        const optionElement = document.createElement('option');
        optionElement.value = choice.id;
        optionElement.textContent = choice.imie + " " + choice.nazwisko;
        selectElement.appendChild(optionElement);
    });
}

function populateSelectZabiegi(choices) {
    const selectElement = document.getElementById('dynamicSelectZabieg');

    selectElement.innerHTML = '';

    choices.forEach(choice => {
        console.log(choice);
        const optionElement = document.createElement('option');
        optionElement.value = choice.id;
        optionElement.textContent = choice.nazwa;
        selectElement.appendChild(optionElement);
    });
}

function jsonToTableRow(jsonObj) {
    const row = document.createElement('tr');

    for (const key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) {
        const cell = document.createElement('td');
        cell.textContent = jsonObj[key];
        row.appendChild(cell);
    }
    }

    return row;
}

function fetchAllTerminy() {
    const param1 = document.getElementById('dynamicSelectLekarz').value;
    const param2 = document.getElementById('calendarInput').value;
    console.log(param1, param2);

    const apiUrl = 'http://pascal.fis.agh.edu.pl:8013/fetching_terminy?lekarz_id='+param1+'&dzien='+param2;
    console.log(apiUrl);
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = '<table border="1"><tbody id="tableBody"></tbody></table>';

    fetch(apiUrl, {method: 'GET'})
    .then(response => response.json())
    .then(data => {

        console.log(data);

        //contentContainer.innerHTML = data[0];

        const tableBody = document.getElementById('tableBody');
        console.log('tableBody:', tableBody);

        data.forEach(element => {
            const row = document.createElement('tr');
            console.log('row:', row);

            const cell1 = document.createElement('td');
            cell1.textContent = element['imie'];
            row.appendChild(cell1);

            const cell2 = document.createElement('td');
            cell2.textContent = element['nazwisko'];
            row.appendChild(cell2);

            const dateObject = new Date(element['data_wizyty']);
            const formattedDate = dateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            });
            const cell3 = document.createElement('td');
            cell3.textContent = formattedDate;
            row.appendChild(cell3);

            const cell4 = document.createElement('td');
            cell4.textContent = element['czas_rozpoczecia'];
            row.appendChild(cell4);

            tableBody.appendChild(row);
        });
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
        contentContainer.innerHTML = '<p>Error fetching content</p>';
    });
}

function fillinTimeChoice(data) {
    const selectTime = document.getElementById('selectTime');
    const startHour = 8;
    const endHour = 18;
    const interval = 15;

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            selectTime.appendChild(option);
        }
    }
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    console.log(cookies);
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

function zapisz_wizyte() {
    const data = {
        lekarz: document.getElementById('dynamicSelectLekarz').value,
        dzien: document.getElementById('calendarInput').value,
        czas: document.getElementById('selectTime').value,
    };

    fetch('http://pascal.fis.agh.edu.pl:8013/add_wizyta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to send data to server: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(response => {
        console.log('Response from server:', response);
    })
    .catch(error => {
        console.error('Error sending data to server:', error);
    });
}

function sendQuery(queryTarget, searchTerm, checked) {
    const apiUrl = 'http://pascal.fis.agh.edu.pl:8013/fetching_statistics?tab='+queryTarget+'&srch='+searchTerm+'&ch='+checked;
    fetch(apiUrl, {method: 'GET'})
    .then(response => response.json())
    .then(data => {});
}