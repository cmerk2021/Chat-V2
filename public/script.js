const pb = new PocketBase('https://connormerk.pockethost.io');

var visitorIdTemp
const fpPromise = import('https://fpjscdn.net/v3/t1cfxF7F5I4clPsSCOgI')
    .then(FingerprintJS => FingerprintJS.load())

  // Get the visitorId when you need it.
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      visitorIdTemp = result.visitorId
      console.log(visitorIdTemp)
    })
const visitorId = visitorIdTemp

const login = localStorage.getItem("logindata")


var userData;
if (!login) {
  localStorage.setItem("windowOrigin", window.location)
  window.location.href = "/auth/login"
} else {
  userData = JSON.parse(login)
  localStorage.removeItem("logindata")
  alert("Logged in!")
  console.log(userData)
}

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const msgerSend = get(".msger-send-btn")

var PERSON_IMG = "https://static.vecteezy.com/system/resources/previews/023/887/720/non_2x/profile-icon-vector.jpg";
var PERSON_NAME

if (userData.meta) {
  PERSON_NAME = userData.meta.rawUser.given_name
} else if (userData.record) {
  PERSON_NAME = userData.record.name
} else {
  alert("An unexpected error occurred.")
}

if (userData.record.avatar !== "") {
  PERSON_IMG = userData.record.avatar
}

if (userData.record.moderator == true) {
  PERSON_NAME = PERSON_NAME + " [MODERATOR]"
}

const moderator = userData.record.moderator
console.log(moderator)

const socket = io();
	
socket.on('chat', (msg) => {
  if (msg.text.startsWith("?")) {
    if (msg.text.startsWith("?ban ")) {
      const splitString = inputString.split(" ");
      const toBan = splitString[1]
      
    }
  } else if (msg.name == PERSON_NAME) {
  appendMessage(msg.name, PERSON_IMG, "right", msg.text);
  } else {
    appendMessage(msg.name, PERSON_IMG, "left", msg.text);
  }
});

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  socket.emit('chat', {"name": PERSON_NAME, "text": marked.parse(msgText), "visitorId": visitorId});

  //appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  // set(ref(db, 'messages'), {
  //   username: PERSON_NAME,
  //   image: PERSON_IMG,
  //   msgText,
  // });
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function uploadImage() {
  try {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("image",
        file);

      pb.collection("images")
        .create({
        ["image"]: file,
        }, { files: formData })
        .then((record) => {
          console.log('Image uploaded successfully:', record);

          const fileName = record["image"]; // Assuming the file field stores the filename
          const fileUrl = pb.files.getUrl(record, fileName);
          msgerInput.value = `<image src="${fileUrl}" width="100%">`
          msgerSend.click()
          setTimeout(() => {
            pb.collection('images')
              .delete(record.id);
          }, 5000)
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          // Handle upload error
        });
    }
  });

  input.click();
} catch (error) {
  alert(error)
}

}

document.getElementById("imagebutton").onclick = uploadImage

window.onerror = function(message, source, lineNo, colNo, error) {
  alert(message)
  // Handle the error here
  console.error(message, source, lineNo, colNo, error);
  // Prevent page reload (optional)
  return false;
};