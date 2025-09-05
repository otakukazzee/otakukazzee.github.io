// ===== VARIABEL ======
const chatMessages = document.getElementById("chatMessages");
const userInputField = document.getElementById("userInput");
const chatForm = document.getElementById("chatForm");
const typingIndicator = document.getElementById("typingIndicator");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");

let storyMemory = JSON.parse(localStorage.getItem("storyMemory") || "[]");
let lastMood = localStorage.getItem("lastMood") || null;
let favoriteWords = JSON.parse(localStorage.getItem("favoriteWords") || "{}");
let moodMemory = JSON.parse(localStorage.getItem("moodMemory") || "[]");
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
    addMessage("Auto-reset idle 5 menit 💖. Jangan khawatir, aku tetap di sini untukmu 😊", false);
    createHeartAnimation(10);
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

// ===== Add Message =====
function addMessage(msg, isUser=false){
  const group = document.createElement("div");
  group.className = `message-group ${isUser?"user":"bot"}`;

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

  // Simpan ke localStorage (user + AI)
  storyMemory.push({text: msg, isUser});
  localStorage.setItem("storyMemory", JSON.stringify(storyMemory));

  if(!isUser && (msg.includes("❤️") || msg.includes("💖") || msg.includes("😍"))){
    createHeartAnimation(5, group);
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
  localStorage.setItem("moodMemory", JSON.stringify(moodMemory));
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

// ===== Get Response =====
function getResponse(input){
  const mood = analyzeMood(input);
  lastMood = mood;
  saveMood(mood);

  // Track kata favorit
  input.toLowerCase().match(/\b\w+\b/g)?.forEach(w=>{favoriteWords[w]=(favoriteWords[w]||0)+1;});
  localStorage.setItem("favoriteWords", JSON.stringify(favoriteWords));

  const loveKeywords = ["cinta","sayang","suka","❤️","💕","💖","rindu","kangen"];
  const containsLove = loveKeywords.some(k => input.toLowerCase().includes(k));

  if(!containsLove){
    const neutralResponses = [
      "Hmm… aku kurang ngerti maksudmu 😅. Ceritain hal-hal tentang cinta yuk 💕",
      "Aku masih fokus ngobrolin soal cinta ❤️, bisa ceritain sesuatu tentang itu?",
      "Ups, aku kurang paham 😶 tapi aku senang denger cerita cintamu 💖"
    ];
    return neutralResponses[Math.floor(Math.random()*neutralResponses.length)];
  }

  const responses={
    love:["Cinta itu bikin dunia lebih indah","Kayaknya kamu lagi berbunga-bunga ya","Hati yang jatuh cinta susah tidur... bener gak?","Cerita cintamu bikin aku ikut senyum","Ahh, romantis banget"],
    sadness:["Aku tau rasanya berat... tapi kamu nggak sendiri","Kadang air mata jadi bahasa cinta yang tak terucap","Sedih? sini aku peluk dulu 🤗"],
    rindu:["Rindu itu tanda cintamu tulus","Kangen itu manis tapi nyiksa juga ya","Semoga cepat ketemu dia yang kamu rindukan"],
    happy:["Wah, vibes kamu positif banget! Terus bahagia ya","Senang itu menular loh, aku jadi ikutan senyum","Asik! Dunia jadi lebih indah kalau kamu bahagia"],
    question:["Hmm… pertanyaanmu menarik, bisa ceritain lebih lanjut?","Aku penasaran jawaban hatimu","Cerita lebih detail dong, aku dengerin"],
    default:["Aku suka denger cerita cintamu, lanjutkan ya","Setiap kata darimu menarik buatku","Cerita terus aja, aku selalu siap dengerin"]
  };

  let lastMsg = storyMemory.length>0 ? storyMemory[storyMemory.length-1].text : "";
  let baseMsg = responses[mood]?.[Math.floor(Math.random()*responses[mood].length)] || responses.default[Math.floor(Math.random()*responses.default.length)];

  if(lastMsg && Math.random()>0.3 && !input.includes(lastMsg)){
    baseMsg += ` Oh iya, sebelumnya kamu bilang "${lastMsg}", mau cerita lebih lanjut? 🧐`;
  }

  const personas=[msg=>`💖 ${msg} 💖`,msg=>`${msg}... 😔`,msg=>`${msg} 😂`,msg=>`✨ ${msg} ✨`,msg=>`${msg} 🤗❤️`];
  let finalMsg = personas[Math.floor(Math.random()*personas.length)](baseMsg);

  // Emoji & GIF
  finalMsg += ` ${getMoodEmoji(mood)}`;
  const gif = getMoodGIF(mood);
  if(gif) finalMsg += `<br><img src="${gif}" class="chat-gif">`;

  if(mood==="love" && Math.random()>0.4) finalMsg += `\n💡 Sardidev tips: Jangan lupa kirim ucapan manis hari ini!`;

  return finalMsg;
}

// ===== Confetti kata favorit =====
function showFavoriteWordEffect(word){
  const span = document.createElement("span");
  span.textContent = "🎉";
  span.style.position="absolute";
  span.style.left=Math.random()*80+"%";
  span.style.top=Math.random()*50+"%";
  span.style.fontSize="20px";
  chatMessages.appendChild(span);
  setTimeout(()=>span.remove(),1200);
}

// ===== Send Message =====
function sendMessage(){
  const userMsg = userInputField.value.trim();
  if(!userMsg) return;
  addMessage(userMsg,true);

  // Confetti untuk kata favorit
  Object.keys(favoriteWords).forEach(w=>{
    if(userMsg.toLowerCase().includes(w)) showFavoriteWordEffect(w);
  });

  userInputField.value="";
  typingIndicator.style.display="flex";
  resetIdleTimer();
  setTimeout(()=>{
    typingIndicator.style.display="none";
    const botResponse = getResponse(userMsg);
    addMessage(botResponse,false);
  },800+Math.random()*1200);
}

// ===== Events =====
chatForm.addEventListener("submit", e=>{e.preventDefault(); sendMessage();});
userInputField.addEventListener("keypress", e=>{if(e.key==="Enter"){e.preventDefault(); sendMessage();}});
emojiPicker.addEventListener("keydown", e=>{if(e.key==="Enter"&&e.target.classList.contains("emoji-item")){e.preventDefault();userInputField.value+=e.target.textContent;emojiPicker.classList.remove("show");userInputField.focus();resetIdleTimer();}});

// ===== Start =====
resetIdleTimer();

// Render ulang chat dari localStorage
storyMemory.forEach(item => addMessage(item.text, item.isUser));
