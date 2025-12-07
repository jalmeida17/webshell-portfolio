import command from '../config.json' assert {type: 'json'};
import { createHelp } from "./commands/help";
import { createBanner } from "./commands/banner";
import { createAbout } from "./commands/about"
import { createDefault } from "./commands/default";
import { createProject } from "./commands/projects";
import { createCareer } from "./commands/career";
import { NEWS } from "./commands/news";

//mutWriteLines gets deleted and reassigned
let mutWriteLines = document.getElementById("write-lines");
let historyIdx = 0
let tempInput = ""
let userInput : string;
let isSudo = false;
let isPasswordInput = false;
let passwordCounter = 0;
let bareMode = false;

const HELP = createHelp();
const BANNER = createBanner();
const ABOUT = createAbout();
const DEFAULT = createDefault();
const PROJECTS = createProject();
const CAREER = createCareer();

//WRITELINESCOPY is used to during the "clear" command
const WRITELINESCOPY = mutWriteLines;
const TERMINAL = document.getElementById("terminal");
const USERINPUT = document.getElementById("user-input") as HTMLInputElement;
const INPUT_HIDDEN = document.getElementById("input-hidden");
const PASSWORD = document.getElementById("password-input");
const PASSWORD_INPUT = document.getElementById("password-field") as HTMLInputElement;
const PRE_HOST = document.getElementById("pre-host");
const PRE_USER = document.getElementById("pre-user");
const HOST = document.getElementById("host");
const USER = document.getElementById("user");
const PROMPT = document.getElementById("prompt");
const COMMANDS = ["help", "about", "projects", "banner", "clear"];
const HISTORY : string[] = [];
const SUDO_PASSWORD = command.password;

// Typing sound functionality
const typingSound = new Audio('/res/key_press.wav');
typingSound.volume = 0.3; // Adjust volume (0.0 to 1.0)

const playTypingSound = () => {
  if (!soundEnabled) return;
  
  // Clone the audio to allow multiple simultaneous plays without interference
  const sound = typingSound.cloneNode() as HTMLAudioElement;
  sound.volume = 0.3;
  sound.play().catch(() => {
    // Silently fail if audio can't play (e.g., autoplay restrictions)
  });
};

const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if(!MAIN) return

  MAIN.scrollTop = MAIN.scrollHeight;
}

function userInputHandler(e : KeyboardEvent) {
  const key = e.key;

  // Play typing sound for printable characters and backspace
  if (key.length === 1 || key === 'Backspace') {
    playTypingSound();
  }

  switch(key) {
    case "Enter":
      e.preventDefault();
      if (!isPasswordInput) {
        enterKey();
      } else {
        passwordHandler();
      }

      scrollToBottom();
      break;
    case "Escape":
      USERINPUT.value = "";
      break;
    case "ArrowUp":
      arrowKeys(key);
      e.preventDefault();
      break;
    case "ArrowDown":
      arrowKeys(key);
      break;
    case "Tab":
      tabKey();
      e.preventDefault();
      break;
  }
}

function enterKey() {
  if (!mutWriteLines || !PROMPT) return
  const resetInput = "";
  let newUserInput;
  userInput = USERINPUT.value;

  if (bareMode) {
    newUserInput = userInput;
  } else {
    newUserInput = `<span class='output'>${userInput}</span>`;
  }

  HISTORY.push(userInput);
  historyIdx = HISTORY.length

  //if clear then early return
  if (userInput === 'clear') {
    commandHandler(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    userInput = resetInput;
    return
  }

  const div = document.createElement("div");
  div.innerHTML = `<span id="prompt">${PROMPT.innerHTML}</span> ${newUserInput}`;

  if (mutWriteLines.parentNode) {
    mutWriteLines.parentNode.insertBefore(div, mutWriteLines);
  }

  /*
  if input is empty or a collection of spaces, 
  just insert a prompt before #write-lines
  */
  if (userInput.trim().length !== 0) {
      commandHandler(userInput.toLowerCase().trim());
    }
  
  USERINPUT.value = resetInput;
  userInput = resetInput; 
}

function tabKey() {
  let currInput = USERINPUT.value;

  for (const ele of COMMANDS) {
    if(ele.startsWith(currInput)) {
      USERINPUT.value = ele;
      return
    }
  }
}

function arrowKeys(e : string) {
  switch(e){
    case "ArrowDown":      
      if (historyIdx !== HISTORY.length) {
          historyIdx += 1;
          USERINPUT.value = HISTORY[historyIdx];
          if (historyIdx === HISTORY.length) USERINPUT.value = tempInput;  
      }      
      break;
    case "ArrowUp":
      if (historyIdx === HISTORY.length) tempInput = USERINPUT.value;
      if (historyIdx !== 0) {
        historyIdx -= 1;
        USERINPUT.value = HISTORY[historyIdx];
      }
      break;
  }
}

function commandHandler(input : string) {

  if(input.startsWith("rm -rf") && input.trim() !== "rm -rf") {
    if (isSudo) {
      if(input === "rm -rf src" && !bareMode) {
        bareMode = true;

        setTimeout(() => {
          if(!TERMINAL || !WRITELINESCOPY) return
          TERMINAL.innerHTML = "";
          TERMINAL.appendChild(WRITELINESCOPY);
          mutWriteLines = WRITELINESCOPY;
        });

        easterEggStyles();
        setTimeout(() => {
          writeLines(["What made you think that was a good idea?", "<br>"]);
        }, 200)

        setTimeout(() => {
          writeLines(["Now everything is ruined.", "<br>"]);
        }, 1200)

        } else if (input === "rm -rf src" && bareMode) {
          writeLines(["there's no more src folder.", "<br>"])
        } else {
          if(bareMode) {
            writeLines(["What else are you trying to delete?", "<br>"])
          } else {
            writeLines(["<br>", "Directory not found.", "type <span class='command'>'ls'</span> for a list of directories.", "<br>"]);
          }
        } 
      } else {
        writeLines(["Permission not granted.", "<br>"]);
    }
    return
  }

  switch(input) {
    case 'clear':
      setTimeout(() => {
        if(!TERMINAL || !WRITELINESCOPY) return
        TERMINAL.innerHTML = "";
        TERMINAL.appendChild(WRITELINESCOPY);
        mutWriteLines = WRITELINESCOPY;
      })
      break;
    case 'banner':
      if(bareMode) {
        writeLines(["WebShell v1.0.0", "<br>"])
        break;
      }
      writeLines(BANNER);
      break;
    case 'help':
      if(bareMode) {
        writeLines(["<br>","Do you really think this is going to work now? Refresh your damn browser!", "<br>"])
        break;
      }
      writeLines(HELP);
      break;
    case 'about':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      openAboutWindow();
      break;
    case 'projects':
      if(bareMode) {
        writeLines(["I don't want you to break the other projects.", "<br>"])
        break;
      }
      writeLines(PROJECTS);
      break;
    case 'career':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      openCareerWindow();
      break;
    case 'news':
      if(bareMode) {
        writeLines(["No news for you.", "<br>"])
        break;
      }
      openNewsWindow();
      break;
    case 'linkedin':
      //add stuff here
      break;
    case 'github':
      //add stuff here
      break;
    case 'email':
      //add stuff here
      break;
    case 'rm -rf':
      if (bareMode) {
        writeLines(["don't try again.", "<br>"])
        break;
      }

      if (isSudo) {
        writeLines(["Usage: <span class='command'>'rm -rf &lt;dir&gt;'</span>", "<br>"]);
      } else {
        writeLines(["Permission not granted.", "<br>"])
      }
        break;
    case 'sudo':
      if(bareMode) {
        writeLines(["no.", "<br>"])
        break;
      }
      if(!PASSWORD) return
      isPasswordInput = true;
      USERINPUT.disabled = true;

      if(INPUT_HIDDEN) INPUT_HIDDEN.style.display = "none";
      PASSWORD.style.display = "block";
      setTimeout(() => {
        PASSWORD_INPUT.focus();
      }, 100);

      break;
    case 'ls':
      if(bareMode) {
        writeLines(["", "<br>"])
        break;
      }

      if (isSudo) {
        writeLines(["src", "<br>"]);
      } else {
        writeLines(["Permission not granted.", "<br>"]);
      }
      break;
    default:
      if(bareMode) {
        writeLines(["Do you really think this is going to work now? Refresh your damn browser!", "<br>"])
        break;
      }

      writeLines(DEFAULT);
      break;
  }  
}

function writeLines(message : string[]) {
  message.forEach((item, idx) => {
    displayText(item, idx);
  });
}

function displayText(item : string, idx : number) {
  setTimeout(() => {
    if(!mutWriteLines) return
    const p = document.createElement("p");
    p.innerHTML = item;
    mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
    scrollToBottom();
  }, 40 * idx);
}

function revertPasswordChanges() {
    if (!INPUT_HIDDEN || !PASSWORD) return
    PASSWORD_INPUT.value = "";
    USERINPUT.disabled = false;
    INPUT_HIDDEN.style.display = "block";
    PASSWORD.style.display = "none";
    isPasswordInput = false;

    setTimeout(() => {
      USERINPUT.focus();
    }, 200)
}

function passwordHandler() {
  if (passwordCounter === 2) {
    if (!INPUT_HIDDEN || !mutWriteLines || !PASSWORD) return
    writeLines(["<br>", "INCORRECT PASSWORD.", "Permission not granted.", "<br>"])
    revertPasswordChanges();
    passwordCounter = 0;
    return
  }

  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    if (!mutWriteLines || !mutWriteLines.parentNode) return
    writeLines(["<br>", "PERMISSION GRANTED.", "Try <span class='command'>'rm -rf'</span>", "<br>"])
    revertPasswordChanges();
    isSudo = true;
    return
  } else {
    PASSWORD_INPUT.value = "";
    passwordCounter++;
  }
}

function easterEggStyles() {   
  const bars = document.getElementById("bars");
  const body = document.body;
  const html = document.documentElement;
  const main = document.getElementById("main");
  const span = document.getElementsByTagName("span");
  const sidebar = document.getElementById("sidebar-dock");
  const topbar = document.getElementById("desktop-topbar");

  if (!bars) return
  bars.innerHTML = "";
  bars.remove()

  // Hide sidebar and topbar
  if (sidebar) sidebar.style.display = "none";
  if (topbar) topbar.style.display = "none";

  if (main) {
    main.style.border = "none";
    main.style.backgroundColor = "black";
    main.style.boxShadow = "none";
    main.style.position = "fixed";
    main.style.left = "0";
    main.style.top = "0";
    main.style.width = "100%";
    main.style.height = "100%";
    main.style.transform = "none";
    main.style.borderRadius = "0";
  }

  html.style.backgroundColor = "black";
  html.style.backgroundImage = "none";
  body.style.backgroundColor = "black";
  body.style.backgroundImage = "none";
  body.style.fontFamily = "VT323, monospace";
  body.style.fontSize = "20px";
  body.style.color = "white";
  body.style.padding = "0";

  for (let i = 0; i < span.length; i++) {
    span[i].style.color = "white";
  }

  USERINPUT.style.backgroundColor = "black";
  USERINPUT.style.color = "white";
  USERINPUT.style.fontFamily = "VT323, monospace";
  USERINPUT.style.fontSize = "20px";
  if (PROMPT) PROMPT.style.color = "white";

}

const initEventListeners = () => {
  if(HOST) {
    HOST.innerText= command.hostname;
  }

  if(USER) {
    USER.innerText = command.username;
  }

  if(PRE_HOST) {
    PRE_HOST.innerText= command.hostname;
  }

  if(PRE_USER) {
    PRE_USER.innerText = command.username;
  } 

  window.addEventListener('load', () => {
    writeLines(BANNER);
    updateDesktopClock();
    setInterval(updateDesktopClock, 1000);
  });
  
  USERINPUT.addEventListener('keypress', userInputHandler);
  USERINPUT.addEventListener('keydown', userInputHandler);
  PASSWORD_INPUT.addEventListener('keypress', userInputHandler);

  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    // Don't focus main input if clicking on a new terminal
    if (target.closest('.new-terminal')) return;
    USERINPUT.focus();
  });

  console.log(`%cPassword: ${command.password}`, "color: red; font-size: 20px;");
}

// Desktop top bar functionality
let soundEnabled = true;

function updateDesktopClock() {
  const clockElement = document.getElementById('desktop-clock');
  if (!clockElement) return;
  
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthName = months[now.getMonth()];
  const day = now.getDate();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  clockElement.textContent = `${day} ${monthName} ${hours}:${minutes}`;
}

const soundToggle = document.getElementById('sound-toggle');
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const icon = soundToggle.querySelector('i');
    if (icon) {
      icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
  });
}

// Terminal window functionality
let windowZIndex = 50;

function bringToFront(element: HTMLElement) {
  windowZIndex++;
  element.style.zIndex = String(windowZIndex);
}

function openCareerWindow() {
  const mainElement = document.getElementById('main');
  if (!mainElement) return;

  // Determine position - alternate between left and right
  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';
  
  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed;
    width: 40%;
    height: 70%;
    ${position}: 5%;
    top: 15%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex};
    display: flex;
    flex-direction: column;
  `;

  // Bring to front when clicked
  newTerminal.addEventListener('mousedown', () => {
    bringToFront(newTerminal);
  });

  const topBar = document.createElement('div');
  topBar.style.cssText = `
    height: 36px;
    background: ${command.colors.border.color};
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    border-radius: 6px 6px 0 0;
    position: relative;
    user-select: none;
  `;
  topBar.textContent = `visitor@jalmeida17:$ ~/career`;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    font-size: 20px;
    padding: 2px 6px;
    transition: background 0.2s;
    border-radius: 3px;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
  closeBtn.onclick = () => document.body.removeChild(newTerminal);
  topBar.appendChild(closeBtn);

  // Dragging functionality
  let isDraggingNew = false;
  let offsetX = 0;
  let offsetY = 0;

  topBar.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn) return;
    isDraggingNew = true;
    const rect = newTerminal.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingNew) return;
    e.preventDefault();
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
    newTerminal.style.left = `${newLeft}px`;
    newTerminal.style.top = `${newTop}px`;
    newTerminal.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDraggingNew = false;
  });

  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    padding: 20px;
    color: ${command.colors.foreground};
    overflow-y: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    line-height: 22px;
  `;
  
  // Add career content with prompt
  let careerHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/career</p>`;
  CAREER.forEach((line) => {
    if (line === '<br>') {
      careerHTML += '<br>';
    } else {
      careerHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
    }
  });
  
  content.innerHTML = careerHTML;

  // Add input for closing
  const terminalInput = document.createElement('input');
  terminalInput.type = 'text';
  terminalInput.style.cssText = `
    width: 100%;
    background: ${command.colors.background};
    color: ${command.colors.foreground};
    border: none;
    outline: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    margin-top: 10px;
  `;
  terminalInput.placeholder = 'Press Enter to close...';

  terminalInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.body.removeChild(newTerminal);
    }
  });

  content.appendChild(terminalInput);

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  setTimeout(() => terminalInput.focus(), 100);
}

async function openNewsWindow() {
  const mainElement = document.getElementById('main');
  if (!mainElement) return;

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed;
    width: 50%;
    height: 80%;
    right: 5%;
    top: 10%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex};
    display: flex;
    flex-direction: column;
  `;

  newTerminal.addEventListener('mousedown', () => {
    bringToFront(newTerminal);
  });

  const topBar = document.createElement('div');
  topBar.style.cssText = `
    height: 36px;
    background: ${command.colors.border.color};
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    border-radius: 6px 6px 0 0;
    position: relative;
    user-select: none;
  `;
  topBar.textContent = `visitor@jalmeida17:$ ~/news`;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    font-size: 20px;
    padding: 2px 6px;
    transition: background 0.2s;
    border-radius: 3px;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
  closeBtn.onclick = () => document.body.removeChild(newTerminal);
  topBar.appendChild(closeBtn);

  // Dragging functionality
  let isDraggingNew = false;
  let offsetX = 0;
  let offsetY = 0;

  topBar.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn) return;
    isDraggingNew = true;
    const rect = newTerminal.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingNew) return;
    e.preventDefault();
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
    newTerminal.style.left = `${newLeft}px`;
    newTerminal.style.top = `${newTop}px`;
    newTerminal.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDraggingNew = false;
  });

  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    padding: 20px;
    color: ${command.colors.foreground};
    overflow-y: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    line-height: 20px;
  `;

  let newsHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/news</p>`;
  newsHTML += '<br>';
  newsHTML += `<p style="animation: none;"><span style="color: #70FDFF; font-weight: bold;">📰 Today's Tech & Science Headlines</span></p>`;
  newsHTML += '<br>';
  newsHTML += '<p style="animation: none; color: #888;">Fetching latest news...</p>';
  
  content.innerHTML = newsHTML;

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  // Fetch RSS feeds
  try {
    const feeds = [
      { category: '🔧 Development', url: 'https://github.blog/feed/', color: '#70FDFF' },
      { category: '💻 Tech', url: 'https://techcrunch.com/feed/', color: '#FE6BC9' },
      { category: '🔬 Science', url: 'https://www.sciencealert.com/rss', color: '#70FDFF' },
      { category: '🤖 AI', url: 'https://venturebeat.com/feed/', color: '#FE6BC9' },
      { category: '🎨 Design', url: 'https://www.smashingmagazine.com/feed/', color: '#70FDFF' }
    ];

    newsHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/news</p>`;
    newsHTML += '<br>';
    newsHTML += `<p style="animation: none;"><span style="color: #70FDFF; font-weight: bold;">📰 Today's Tech & Science Headlines</span></p>`;
    newsHTML += '<br>';

    for (const feed of feeds) {
      newsHTML += `<p style="animation: none; margin-top: 10px;"><span style="color: ${feed.color}; font-weight: bold;">${feed.category}</span></p>`;
      
      try {
        // you're a bitch if you use my api key lol
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=lh7qwvgc9wlodqbp8ouslpcyxrml0ejeyursklsz&count=1`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const item = data.items[0];
          const title = item.title.length > 80 ? item.title.substring(0, 80) + '...' : item.title;
          
          // Get description/content preview
          let description = '';
          if (item.description) {
            // Strip HTML tags and get first 150 characters
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.description;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            description = textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;
          }
          
          newsHTML += `<p style="animation: none; margin-left: 10px;">• <a href="${item.link}" target="_blank" style="color: ${command.colors.foreground}; text-decoration: underline;">${title}</a></p>`;
          if (description) {
            newsHTML += `<p style="animation: none; margin-left: 20px; color: #888; font-size: 13px; font-style: italic;">${description}</p>`;
          }
        } else {
          newsHTML += `<p style="animation: none; margin-left: 10px; color: #888;">• Unable to fetch feed (API limit or feed issue)</p>`;
        }
      } catch (err) {
        newsHTML += `<p style="animation: none; margin-left: 10px; color: #888;">• Failed to load (${err instanceof Error ? err.message : 'unknown error'})</p>`;
      }
      
      newsHTML += '<br>';
    }

    content.innerHTML = newsHTML;
  } catch (error) {
    content.innerHTML += '<p style="animation: none; color: #ff6b6b;">Failed to fetch news feeds.</p>';
  }

  const terminalInput = document.createElement('input');
  terminalInput.type = 'text';
  terminalInput.style.cssText = `
    width: 100%;
    background: ${command.colors.background};
    color: ${command.colors.foreground};
    border: none;
    outline: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    margin-top: 10px;
  `;
  terminalInput.placeholder = 'Press Enter to close...';

  terminalInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.body.removeChild(newTerminal);
    }
  });

  content.appendChild(terminalInput);
  setTimeout(() => terminalInput.focus(), 100);
}

function openAboutWindow() {
  const mainElement = document.getElementById('main');
  if (!mainElement) return;

  // Open to the right
  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed;
    width: 40%;
    height: 70%;
    right: 5%;
    top: 15%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex};
    display: flex;
    flex-direction: column;
  `;

  // Bring to front when clicked
  newTerminal.addEventListener('mousedown', () => {
    bringToFront(newTerminal);
  });

  const topBar = document.createElement('div');
  topBar.style.cssText = `
    height: 36px;
    background: ${command.colors.border.color};
    color: #FFFFFF;
    line-height: 36px;
    text-align: center;
    border-radius: 6px 6px 0 0;
    position: relative;
    user-select: none;
  `;
  topBar.textContent = `visitor@jalmeida17:$ ~/about`;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    font-size: 20px;
    padding: 2px 6px;
    transition: background 0.2s;
    border-radius: 3px;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
  closeBtn.onclick = () => document.body.removeChild(newTerminal);
  topBar.appendChild(closeBtn);

  // Dragging functionality
  let isDraggingNew = false;
  let offsetX = 0;
  let offsetY = 0;

  topBar.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn) return;
    isDraggingNew = true;
    const rect = newTerminal.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingNew) return;
    e.preventDefault();
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
    newTerminal.style.left = `${newLeft}px`;
    newTerminal.style.top = `${newTop}px`;
    newTerminal.style.right = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDraggingNew = false;
  });

  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    padding: 20px;
    color: ${command.colors.foreground};
    overflow-y: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    line-height: 22px;
  `;

  // Add about content with prompt
  const textContainer = document.createElement('div');
  textContainer.style.cssText = `
    width: 100%;
  `;
  
  let aboutHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/about</p>`;
  let imageAdded = false;
  ABOUT.forEach((line, index) => {
    // Add image before the "Hi, I'm Joao" line (index 1 in the array)
    if (index === 1 && !imageAdded) {
      aboutHTML += `<div style="margin: 15px 0;"><img src="/res/profile.png" style="width: 150px; height: 150px; border-radius: 8px; border: 2px solid ${command.colors.border.color}; object-fit: cover;"></div>`;
      imageAdded = true;
    }
    
    if (line === '<br>') {
      aboutHTML += '<br>';
    } else {
      aboutHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
    }
  });
  
  textContainer.innerHTML = aboutHTML;
  content.appendChild(textContainer);

  // Add input for closing
  const terminalInput = document.createElement('input');
  terminalInput.type = 'text';
  terminalInput.style.cssText = `
    width: 100%;
    background: ${command.colors.background};
    color: ${command.colors.foreground};
    border: none;
    outline: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    margin-top: 10px;
  `;
  terminalInput.placeholder = 'Press Enter to close...';

  terminalInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.body.removeChild(newTerminal);
    }
  });

  content.appendChild(terminalInput);

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  setTimeout(() => terminalInput.focus(), 100);
}

initEventListeners();

// Sidebar dock terminal icon functionality
const terminalIcon = document.getElementById('terminal-icon');

if (terminalIcon) {
  terminalIcon.addEventListener('click', () => {
    const mainEl = document.getElementById('main');
    if (mainEl) {
      if (mainEl.style.display === 'none') {
        // Open terminal
        mainEl.style.display = 'flex';
        mainEl.style.flexDirection = 'column';
        terminalIcon.classList.add('active');
        USERINPUT.focus();
      } else {
        // Close terminal
        mainEl.style.display = 'none';
        terminalIcon.classList.remove('active');
      }
    }
  });
}

// Maximize window button functionality
const maximizeButton = document.getElementById("maximize-window");
const closeButton = document.getElementById("close-window");
const mainElement = document.getElementById("main");
const barElement = document.getElementById("bar-1");
let isMaximized = false;

// Bring main terminal to front when clicked
if (mainElement) {
  mainElement.addEventListener('mousedown', () => {
    bringToFront(mainElement);
  });
}

// Close button functionality
if (closeButton && mainElement && terminalIcon) {
  closeButton.addEventListener('click', () => {
    mainElement.style.display = 'none';
    terminalIcon.classList.remove('active');
  });
}

if (maximizeButton && mainElement) {
  maximizeButton.addEventListener("click", () => {
    if (isMaximized) {
      // Restore to custom size - center it
      mainElement.style.width = "50%";
      mainElement.style.height = "80%";
      mainElement.style.position = "absolute";
      mainElement.style.left = "50%";
      mainElement.style.top = "50%";
      mainElement.style.transform = "translate(-50%, -50%)";
      mainElement.style.margin = "";
      mainElement.style.marginTop = "";
      mainElement.style.flex = "";
      maximizeButton.textContent = "🗖";
      isMaximized = false;
    } else {
      // Maximize
      mainElement.style.width = "";
      mainElement.style.height = "";
      mainElement.style.position = "";
      mainElement.style.left = "";
      mainElement.style.top = "";
      mainElement.style.transform = "";
      mainElement.style.margin = "";
      mainElement.style.marginTop = "";
      mainElement.style.flex = "";
      maximizeButton.textContent = "🗗";
      isMaximized = true;
    }
  });
}

// Double-click on topbar to maximize/restore
if (barElement && mainElement && maximizeButton) {
  barElement.addEventListener("dblclick", () => {
    // Trigger the maximize button click
    maximizeButton.click();
  });
}

// Drag functionality when window is not maximized
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

if (barElement && mainElement) {
  barElement.addEventListener("mousedown", (e) => {
    if (isMaximized || e.target === maximizeButton) return;
    
    isDragging = true;
    
    // Get current position
    const rect = mainElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || isMaximized) return;
    
    e.preventDefault();
    
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
    
    mainElement.style.left = `${newLeft}px`;
    mainElement.style.top = `${newTop}px`;
    mainElement.style.transform = "none";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// Desktop-style selection box
let selectionBox: HTMLDivElement | null = null;
let isSelecting = false;
let selectionStartX = 0;
let selectionStartY = 0;

document.addEventListener("mousedown", (e) => {
  // Only start selection on body/html, not on main terminal or its children
  const target = e.target as HTMLElement;
  const mainEl = document.getElementById("main");
  
  // Check if click is outside the main terminal
  if (mainEl && !mainEl.contains(target) && (target === document.body || target === document.documentElement)) {
    isSelecting = true;
    selectionStartX = e.clientX;
    selectionStartY = e.clientY;
    
    // Create selection box
    selectionBox = document.createElement("div");
    selectionBox.style.position = "fixed";
    selectionBox.style.border = "1px solid rgba(255, 255, 255, 0.5)";
    selectionBox.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    selectionBox.style.pointerEvents = "none";
    selectionBox.style.zIndex = "1";
    selectionBox.style.left = `${selectionStartX}px`;
    selectionBox.style.top = `${selectionStartY}px`;
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
    document.body.appendChild(selectionBox);
  }
});

document.addEventListener("mousemove", (e) => {
  if (!isSelecting || !selectionBox) return;
  
  const currentX = e.clientX;
  const currentY = e.clientY;
  
  const width = Math.abs(currentX - selectionStartX);
  const height = Math.abs(currentY - selectionStartY);
  const left = Math.min(currentX, selectionStartX);
  const top = Math.min(currentY, selectionStartY);
  
  selectionBox.style.left = `${left}px`;
  selectionBox.style.top = `${top}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
});

document.addEventListener("mouseup", () => {
  if (isSelecting && selectionBox) {
    document.body.removeChild(selectionBox);
    selectionBox = null;
    isSelecting = false;
  }
});
