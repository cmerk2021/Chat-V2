const login = localStorage.getItem("logindata")
if (!login) {
  localStorage.setItem("windowOrigin", window.location)
  window.location.href = "/auth/login"
} else {
  const userData = JSON.parse(login)
  localStorage.removeItem("logindata")
  alert("Logged in!")
  console.log(userData)
}

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const PERSON_IMG = "https://static.vecteezy.com/system/resources/previews/023/887/720/non_2x/profile-icon-vector.jpg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

// ----- FIREBASE -----

// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13/firebase-app.js'
// import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.13/firebase-database.js";


// const firebaseConfig = {
//   apiKey: "AIzaSyD5RnepBgemF1bzXbSMGiw5egWqeeMnZxI",
//   authDomain: "chat-dbe69.firebaseapp.com",
//   databaseURL: "https://chat-dbe69-default-rtdb.firebaseio.com/",
//   projectId: "chat-dbe69",
//   storageBucket: "chat-dbe69.appspot.com",
//   messagingSenderId: "973114972335",
//   appId: "1:973114972335:web:0785b31471e28ad0481c5a",
//   measurementId: "G-27X4H5XL3Z"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const messagesRef = ref(database, 'messages/');
// onValue(messagesRef, (snapshot) => {
//   const data = snapshot.val();
//   console.log(data)
// });

// ----- END FIREBASE -----

const socket = io();
	
socket.on('chat', (msg) => {
  appendMessage(msg.name, PERSON_IMG, "right", msg.text);
});

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  socket.emit('chat', {"name": PERSON_NAME, "text": msgText});

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