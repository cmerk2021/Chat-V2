const pb = new PocketBase('https://connormerk-auth.pockethost.io');
const origin = localStorage.getItem("windowOrigin")

const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get('redirect')

const err = document.getElementById("error")

const form = document.querySelector("form");
const username = document.getElementById("email");
const password = document.getElementById("password");

async function googleAuth() {
    try {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    
    if (!origin) {
        localStorage.setItem("error", "ERR_INVALID_REDIRECT")
        window.location = "../error"
    } else {
        localStorage.setItem("logindata", JSON.stringify(authData))
        window.location.href = origin
    }
} catch (error) {
    // localStorage.setItem("error", error)
    // window.location = "../error"
}
}

form.addEventListener('submit', async (event) => {
    try {
        const button = document.getElementById("button")
        button.innerHTML = "Loading"
        button.disabled = true
	event.preventDefault();
 
	const authData = await pb.collection('users').authWithPassword(
        username.value,
        password.value,
    );

    if (!origin) {
        localStorage.setItem("error", "ERR_INVALID_REDIRECT")
        window.location = "../error"
    } else {
        localStorage.setItem("logindata", JSON.stringify(authData))
        window.location.href = origin
    }
    
    } catch (e) {
        err.innerHTML = "An unexpected error occurred. Check console for more information. <br>"
        const button = document.getElementById("button")
        button.innerHTML = "Loading"
        button.disabled = true
    }

});

