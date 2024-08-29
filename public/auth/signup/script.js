const pb = new PocketBase('https://connormerk-auth.pockethost.io');

const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get('redirect')

const err = document.getElementById("error")

const form = document.querySelector("form");
const user_name = document.getElementById("username")
const username = document.getElementById("email");
const password = document.getElementById("password");
const password_confirm = document.getElementById("password-confirm")

async function googleAuth() {
    try {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    if (!redirect || !redirect.includes("https://")) {
        localStorage.setItem("error", "ERR_INVALID_REDIRECT")
        window.location = "../error"
    } else {
        window.location = `${redirect}?token=${authData.token}`
    }
} catch (error) {
    localStorage.setItem("error", error)
    window.location = "../error"
}
}

form.addEventListener('submit', async (event) => {
    try {
	event.preventDefault();

        if (password.value === password_confirm.value) {
            try {
	        const data = {
                "name": user_name.value,
                "email": username.value,
                "emailVisibility": true,
                "password": password.value,
                "passwordConfirm": password_confirm.value,
            };
            const record = await pb.collection('users').create(data);
            if (record) {
                alert("Authentication successful, please log in.") 
                window.location.replace("../login")
            }
        } catch (error) {
            err.innerHTML = "An unexpected error occurred. Check console for more information."
            console.error(error)
        }

        } else {
            err.innerHTML = "Username and passwords do not match."
        }
    
    
    if (!redirect || !redirect.includes("https://")) {
        localStorage.setItem("error", "ERR_INVALID_REDIRECT")
        window.location = "../error"
    } else {
        window.location = `${redirect}?connormerk-auth=true?token=${authData.token}`
    }
    
    } catch (e) {
        err.innerHTML = "An unexpected error occurred. Check console for more information."
        console.error(e)
    }

});

