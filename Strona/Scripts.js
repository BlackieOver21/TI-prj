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