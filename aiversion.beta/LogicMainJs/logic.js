// ===== VARIABEL ======
const chatMessages = document.getElementById("chatMessages");
const userInputField = document.getElementById("userInput");
const chatForm = document.getElementById("chatForm");
const typingIndicator = document.getElementById("typingIndicator");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");

let storyMemory = []; // kosongkan chat saat refresh
let lastMood = null;
let favoriteWords = {};
let moodMemory = [];
let resetTime = 5*60, idleTimer;

// ===== Info modal =====
infoBtn.addEventListener("click", ()=> infoModal.style.display="flex");
document.getElementById("closeInfo").addEventListener("click", ()=> infoModal.style.display="none");

// ===== Emoji =====
emojiBtn.addEventListener("click", ()=>emojiPicker.classList.toggle("show"));
emojiPicker.addEventListener("click", e=>{
  if(e.target.classList.contains("emoji-item")){
    userInputField.value += e.target.textContent;
    emojiPicker.classList.remove("show");
    userInputField.focus();
    resetIdleTimer();
  }
});

// ===== Reset idle =====
function resetIdleTimer(){
  clearTimeout(idleTimer);
  idleTimer = setTimeout(()=>{
    addMessageVisual("Auto-reset idle 5 menit 💖. Jangan khawatir, aku tetap di sini untukmu 😊", false);
    createConfetti(15);
  }, resetTime*1000);
}

// ===== Highlight kata favorit =====
function highlightText(text){
  const words = Object.keys(favoriteWords);
  let highlighted = text;
  words.forEach(w=>{
    const count = favoriteWords[w];
    const color = count > 5 ? "#ff69b4" : "#ffb6c1";
    const re = new RegExp(`\\b(${w})\\b`, "gi");
    highlighted = highlighted.replace(re, `<span class="highlight" style="color:${color};font-weight:bold;">$1</span>`);
  });
  return highlighted;
}

// ===== Confetti Ultra =====
function createConfetti(count=20){
  for(let i=0;i<count;i++){
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random()*100 + "%";
    confetti.style.background = `hsl(${Math.random()*360}, 100%, 50%)`;
    confetti.style.animationDuration = 1 + Math.random()*2 + "s";
    document.body.appendChild(confetti);
    setTimeout(()=>confetti.remove(), 3000);
  }
}

// ===== Emoji Mengambang =====
function floatingEmoji(emoji, parent=chatMessages){
  const float = document.createElement("div");
  float.className = "floating-emoji";
  float.textContent = emoji;
  float.style.left = Math.random()*80 + "%";
  float.style.top = "80%";
  parent.appendChild(float);
  float.animate([
    {transform: "translateY(0)", opacity: 1},
    {transform: "translateY(-200px)", opacity: 0}
  ], {duration: 2000 + Math.random()*1000, easing: "ease-out"});
  setTimeout(()=>float.remove(), 3000);
}

// ===== Heart Interaktif =====
function floatingHeart(parent){
  const heart = document.createElement("div");
  heart.className = "bubble-heart";
  heart.style.left = (Math.random()*90)+"%";
  heart.style.bottom = "0";
  heart.textContent = "💖";
  parent.appendChild(heart);
  heart.animate([
    {transform: "translateY(0) scale(1)", opacity: 1},
    {transform: "translateY(-150px) scale(1.5)", opacity: 0}
  ], {duration: 2000 + Math.random()*1000, easing: "ease-out"});
  setTimeout(()=>heart.remove(), 2500);
}

// ===== Add Message Visual =====
function addMessageVisual(msg, isUser=false){
  const group = document.createElement("div");
  group.className = `message-group ${isUser?"user":"bot"} fade-in`;

  if(!isUser){
    const avatar = document.createElement("img");
    avatar.src="https://placehold.co/40x40/ff69b4/white?text=♡";
    avatar.alt="Avatar AI Bucin";
    avatar.className="avatar";
    group.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${isUser?"user":"bot"}`;
  bubble.innerHTML = highlightText(msg);

  const timestamp = document.createElement("div");
  timestamp.className = `timestamp ${isUser?"user":"bot"}`;
  timestamp.textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  bubble.appendChild(timestamp);
  group.appendChild(bubble);
  chatMessages.appendChild(group);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Efek visual
  if(!isUser){
    createHeartAnimation(5, group);
    floatingEmoji(getMoodEmoji(lastMood), group);
    if(lastMood==="love" || lastMood==="happy") createConfetti(10);
  }
}

// ===== Heart Animation =====
function createHeartAnimation(count=5, parent=chatMessages){
  for(let i=0;i<count;i++){
    const heart = document.createElement("div");
    heart.className="bubble-heart";
    heart.style.left = (Math.random()*90)+"%";
    heart.style.top = Math.random()*50+"%";
    heart.textContent="💖";
    parent.appendChild(heart);
    setTimeout(()=>heart.remove(),2000 + Math.random()*500);
  }
}

// ===== Mood Analysis =====
function analyzeMood(input){
  const lower = input.toLowerCase();
  if(lower.includes("?")) return "question";
  if(lower.match(/sedih|galau|patah|kecewa|💔/)) return "sadness";
  if(lower.match(/cinta|suka|sayang|❤️|💕/)) return "love";
  if(lower.match(/bahagia|senang|😁|😂|😊/)) return "happy";
  if(lower.match(/rindu|kangen|🥺/)) return "rindu";
  if(lower.match(/cemburu|iri|saingan/)) return "jealous";
  if(lower.match(/putus|move on|lupa/)) return "breakup";
  return "default";
}

// ===== Save Mood =====
function saveMood(mood){
  moodMemory.push({mood, timestamp:Date.now()});
  if(moodMemory.length > 30) moodMemory.shift();
}

// ===== Mood Emoji / GIF =====
function getMoodEmoji(mood){
  const map = {
    love:["😍","💖","🥰"], sadness:["😢","🥺","💔"], happy:["😁","😊","🥳"], rindu:["🥺","💌"], jealous:["😒","😤"], default:["😶","✨"]
  };
  const arr = map[mood] || map["default"];
  return arr[Math.floor(Math.random()*arr.length)];
}

function getMoodGIF(mood){
  const map = {
    love:["https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"],
    sad:["https://media.giphy.com/media/3o7aCVX1oUByJp9Ays/giphy.gif"],
    happy:["https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"],
    rindu:["https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif"]
  };
  const arr = map[mood] || [];
  return arr[Math.floor(Math.random()*arr.length)] || "";
}

// ===== Helper Ultra =====
function echoUserWords(input){
  const words = input.split(/\s+/);
  const importantWords = words.filter(w => favoriteWords[w.toLowerCase()]);
  if(importantWords.length > 0){
    return `Aku suka kata "${importantWords.join(', ')}" yang kamu pakai 💕`;
  }
  return "";
}

function getLongContext(limit=7){
  return storyMemory.slice(-limit).map(item=>{
    return (item.isUser ? "User: " : "AI: ") + item.text;
  }).join("\n");
}

function personaUltra(msg){
  const personas=[
    msg=>`💖 ${msg} 💖`,
    msg=>`${msg}... 😔`,
    msg=>`${msg} 😂`,
    msg=>`✨ ${msg} ✨`,
    msg=>`${msg} 🤗❤️`,
    msg=>`📝 ${msg}`,
    msg=>`💡 ${msg}`
  ];
  return personas[Math.floor(Math.random()*personas.length)](msg);
}

function emotionIntensity(input, mood){
  const loveWords = ["cinta","sayang","suka","❤️","💕","💖","rindu","kangen"];
  const sadWords = ["sedih","galau","patah","kecewa","💔"];
  const happyWords = ["bahagia","senang","😁","😂","😊"];
  let words = input.toLowerCase().split(/\s+/);
  let count = 0;
  if(mood==="love") count = words.filter(w=>loveWords.includes(w)).length;
  if(mood==="sadness") count = words.filter(w=>sadWords.includes(w)).length;
  if(mood==="happy") count = words.filter(w=>happyWords.includes(w)).length;
  if(count >= 3) return "strong";
  if(count === 2) return "medium";
  return "mild";
}

function ultraTip(mood, intensity){
  const tips = {
    love: [
      "Kirim pesan manis pagi ini 🌅, pasti bikin senyum 😊",
      "Buat playlist lagu romantis untuk dia 🎶",
      "Tulis catatan kecil atau puisi cinta 💌"
    ],
    sadness: [
      "Coba tulis perasaanmu di diary 📝, hati lebih lega",
      "Ajak teman ngobrol santai, pasti mood membaik 😊",
      "Dengerin lagu kesukaanmu biar senyum lagi 🎧"
    ],
    happy: [
      "Bagikan senyum ke orang di sekitarmu 😁",
      "Rayakan momen kecil, hidup jadi ceria 🎉",
      "Tuliskan tiga hal yang bikin bahagia hari ini ✨"
    ],
    rindu: [
      "Kirim pesan kangen lucu 💌, pasti dia senang",
      "Buat rencana ketemuan kecil, biar nggak terlalu kangen 🥰",
      "Tulis surat digital atau suara manis 🎤"
    ]
  };
  return tips[mood]?.[Math.floor(Math.random()*tips[mood].length)] || "";
}

function isQuestion(input){
  return input.includes("?") || input.startsWith("apa") || input.startsWith("bagaimana");
}

function moodFromEmoji(input){
  if(input.match(/❤️|💕|😍|💖|🥰/)) return "love";
  if(input.match(/😢|🥺|💔/)) return "sadness";
  if(input.match(/😁|😂|😊|🥳/)) return "happy";
  if(input.match(/💌|🥺/)) return "rindu";
  if(input.match(/😒|😤/)) return "jealous";
  return null;
}

// ===== Ultra Get Response =====
function getResponseUltra(input, userName="Kamu"){
  let mood = moodFromEmoji(input) || analyzeMood(input);
  lastMood = mood;
  saveMood(mood);

  input.toLowerCase().match(/\b\w+\b/g)?.forEach(w=>{
    favoriteWords[w]=(favoriteWords[w]||0)+1;
  });

  const containsLove = ["cinta","sayang","suka","❤️","💕","💖","rindu","kangen"].some(k => input.toLowerCase().includes(k));
  const context = getLongContext();
  const intensity = emotionIntensity(input, mood);
  let baseMsg = "";

  if(!containsLove){
    const neutral = [
      `Hmm… aku kurang ngerti maksudmu 😅, ${userName}. Ceritain hal-hal tentang cinta yuk 💕`,
      `Aku masih fokus soal cinta ❤️, bisa ceritain sesuatu tentang itu, ${userName}?`,
      `Ups, aku nggak paham 😶 tapi aku senang denger cerita cintamu 💖`
    ];
    baseMsg = neutral[Math.floor(Math.random()*neutral.length)];
  } else {
    const responses={
      love:[`Cinta itu bikin dunia lebih indah, ${userName}`,`Kayaknya kamu lagi berbunga-bunga ya, ${userName}`],
      sadness:[`Aku tau rasanya berat... tapi kamu nggak sendiri, ${userName}`,`Sedih? sini aku peluk dulu 🤗`],
      rindu:[`Rindu itu tanda cintamu tulus, ${userName}`,`Semoga cepat ketemu dia yang kamu rindukan 💌`],
      happy:[`Wah, vibes kamu positif banget, ${userName}! Terus bahagia ya 😁`,`Senang itu menular loh, aku jadi ikutan senyum 😊`],
      question:[`Hmm… pertanyaanmu menarik, bisa ceritain lebih lanjut, ${userName}?`],
      default:[`Aku suka denger cerita cintamu, lanjutkan ya 💖`,`Setiap kata darimu menarik buatku ✨`]
    };
    let key = isQuestion(input) ? "question" : mood;
    baseMsg = responses[key]?.[Math.floor(Math.random()*responses[key].length)] || responses.default[Math.floor(Math.random()*responses.default.length)];

    let tip = ultraTip(mood, intensity);
    if(tip) baseMsg += `\n💡 Tip Hari Ini: ${tip}`;
  }

  const echo = echoUserWords(input);
  if(echo) baseMsg += ` ${echo}`;

  if(context && Math.random() > 0.3){
    baseMsg += `\nBtw, sebelumnya kamu bilang:\n${context}\nMau cerita lebih lanjut, ${userName}? 🧐`;
  }

  let finalMsg = personaUltra(baseMsg);
  const gif = getMoodGIF(mood);
  if(gif) finalMsg += `<br><img src="${gif}" class="chat-gif">`;

  return finalMsg;
}

// ===== Send Message =====
function sendMessage(){
  const userMsg = userInputField.value.trim();
  if(!userMsg) return;
  addMessageVisual(userMsg,true);

  Object.keys(favoriteWords).forEach(w=>{
    if(userMsg.toLowerCase().includes(w)) createConfetti(5);
  });

  userInputField.value="";
  typingIndicator.style.display="flex";
  resetIdleTimer();
  setTimeout(()=>{
    typingIndicator.style.display="none";
    const botResponse = getResponseUltra(userMsg);
    addMessageVisual(botResponse,false);
  },800+Math.random()*1200);
}

// ===== Events =====
chatForm.addEventListener("submit", e=>{e.preventDefault(); sendMessage();});
userInputField.addEventListener("keypress", e=>{if(e.key==="Enter"){e.preventDefault(); sendMessage();}});
emojiPicker.addEventListener("keydown", e=>{
  if(e.key==="Enter"&&e.target.classList.contains("emoji-item")){
    e.preventDefault();
    userInputField.value+=e.target.textContent;
    emojiPicker.classList.remove("show");
    userInputField.focus();
    resetIdleTimer();
  }
});

// ===== CSS tambahan =====
const style = document.createElement("style");
style.textContent = `
.confetti {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  z-index: 9999;
  pointer-events: none;
}
.floating-emoji {
  position: absolute;
  font-size: 24px;
  pointer-events: none;
  z-index: 999;
}
.fade-in {
  animation: fadeIn 0.5s ease forwards;
}
@keyframes fadeIn {
  0% {opacity:0; transform: translateY(20px);}
  100% {opacity:1; transform: translateY(0);}
}`;
document.head.appendChild(style);

// ===== Start =====
resetIdleTimer();
