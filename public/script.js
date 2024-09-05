try {

const pb = new PocketBase('https://connormerk.pockethost.io');

const visitorId = await ThumbmarkJS.getFingerprint()


const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const msgerSend = get(".msger-send-btn")

var PERSON_IMG = "https://static.vecteezy.com/system/resources/previews/023/887/720/non_2x/profile-icon-vector.jpg";
var PERSON_NAME

if (localStorage.getItem("ban") == "true") {
  msgerInput.disabled = true
  msgerInput.placeholder = "You are banned."
}

const response = await fetch("./profile");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    PERSON_NAME = json.name
    PERSON_IMG = json.picture

function logout() {
  window.location.href = "/logout"
}

const socket = io();
	
socket.on('chat', (msg) => {
  if (msg.text.startsWith("<p>?ban")) {
    if (msg.text.startsWith("<p>?ban ") && msg.name.includes("[MODERATOR]")) {
      const splitString = msg.text.split("?ban ");
      const toBan = splitString[1].slice(0, -5)
      if (PERSON_NAME == toBan) {
        localStorage.setItem("ban", "true")
        alert("You have been banned! To appeal your ban, email contact@connormerk.com")
        window.location.reload()
      }
      
    } else if (msg.text.startsWith("<p>?unban") && message.name.includes("[MODERATOR]")) {
      const splitString = msg.text.split("?unban ");
      const toUnban = splitString[1].slice(0, -5)
      if (PERSON_NAME == toUnban) {
        localStorage.removeItem()
      }
    }
  } else if (msg.name == PERSON_NAME) {
  appendMessage(msg.name, msg.image, "right", msg.text);
  } else {
    appendMessage(msg.name, msg.image, "left", msg.text);
  }
});

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  socket.emit('chat', {"name": PERSON_NAME, "text": marked.parse(msgText),"image": PERSON_IMG, "visitorId": visitorId});
  console.log(visitorId)

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

function showSettingsPopup() {
  // Create the popup elements
  const popup = document.createElement('div');
  popup.classList.add('settings-popup');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  const content = document.createElement('div');
  content.textContent = 'This is your settings popup.';

  // Add the elements to the popup
  popup.appendChild(closeButton);
  popup.appendChild(content);

  // Append the popup to the document body
  document.body.appendChild(popup);

  // Show the popup
  popup.style.display = 'block';
}

document.getElementById("settings").onclick = showSettingsPopup

} catch (error) {
  localStorage.setItem("error", error)
  window.location = "/error"
}