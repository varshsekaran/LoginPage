const form = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const message = document.getElementById('message');
const switchForm = document.getElementById('switch-form');
const switchLink = document.getElementById('switch-link');

let isLoginForm = true;
let justCreatedAccount = false;
let isRemembered = false;
const users = [];

function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    if (password.length < minLength) {
        return "Weak: Password should be at least 8 characters long.";
    } else if (hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas) {
        return "Strong";
    } else if ((hasUpperCase || hasLowerCase) && hasNumbers) {
        return "Moderate";
    } else {
        return "Weak: Use a mix of uppercase, lowercase, numbers, and special characters.";
    }
}

function updateFormUI() 
{
    const currentMessage = message.textContent;
    const currentMessageColor = message.style.color;

    if (isLoginForm) {
        formTitle.textContent = 'Login';
        switchForm.innerHTML = 'Don\'t have an account? <a href="#" id="switch-link">Create one</a>';
        form.innerHTML = `
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <div>
                <input type="checkbox" id="rememberme">
                <label for="remember-me">Remember me</label>
            </div>
            <button type="submit">Login</button>
        `;
    } 
    else 
    {
        formTitle.textContent = 'Create Account';
        switchForm.innerHTML = 'Already have an account? <a href="#" id="switch-link">Login</a>';
        form.innerHTML = `
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <div id="password-strength"></div>
            <button type="submit">Create Account</button>
        `;
        
        const passwordInput = document.getElementById('password');
        const passwordStrength = document.getElementById('password-strength');
        
        passwordInput.addEventListener('input', () => {
            const strength = checkPasswordStrength(passwordInput.value);
            passwordStrength.textContent = `Password strength: ${strength}`;
            passwordStrength.style.color = strength === "Strong" ? "green" : (strength === "Moderate" ? "orange" : "red");
        });
    }
    if (currentMessage) {
        message.textContent = currentMessage;
        message.style.color = currentMessageColor;
        }
    document.getElementById('switch-link').addEventListener('click', (e) => {
            e.preventDefault();
            isLoginForm = !isLoginForm;
            updateFormUI();
        });
        
}
function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        message.textContent = 'Login successful!';
        message.style.color = 'green';
        justCreatedAccount = false;
        localStorage.setItem('loggedInUser', username);
        isRemembered = document.getElementById('rememberme').checked;
        window.location.href = 'index2.html';
        if (isRemembered) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
    } else {
        message.textContent = 'Invalid username or password.';
        message.style.color = 'red';
    }
}

function checkRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberme').checked = true;
    }
}

window.addEventListener('load', () => {
    updateFormUI();
    if (isLoginForm) {
        checkRememberedUser();
    }
});


function createAccount(username, password) {
    if (users.some(u => u.username === username)) {
        message.textContent = 'Username already exists.';
        message.style.color = 'red';
    } else {
        const strength = checkPasswordStrength(password);
        if (strength === "Weak: Password should be at least 8 characters long." || 
            strength === "Weak: Use a mix of uppercase, lowercase, numbers, and special characters.") {
            message.textContent = 'Please choose a stronger password. ' + strength;
            message.style.color = 'red';
        } else {
            users.push({ username, password });
            message.textContent = 'Account created successfully! Please log in.';
            message.style.color = 'green';
            justCreatedAccount = true;
            isLoginForm = true;
            updateFormUI();
        }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (isLoginForm) {
        login(username, password);
    } else {
        createAccount(username, password);
    }

    if (justCreatedAccount) {
        setTimeout(() => {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }, 0);
    }
});


