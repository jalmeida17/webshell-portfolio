import command from '../config.json' assert {type: 'json'};
import { createHelp } from "./commands/help";
import { createBanner } from "./commands/banner";
import { createAbout } from "./commands/about"
import { createDefault } from "./commands/default";
import { createProject } from "./commands/projects";
import { createCareer } from "./commands/career";
import { setLanguage, t } from './translations';

//mutWriteLines gets deleted and reassigned
let mutWriteLines = document.getElementById("write-lines");
let historyIdx = 0
let tempInput = ""
let userInput : string;
let isSudo = false;
let isPasswordInput = false;
let passwordCounter = 0;
let bareMode = false;
let isLanguageSelection = true;

let HELP: string[] = [];
let BANNER: string[] = [];
let ABOUT: string[] = [];
let DEFAULT: string[] = [];
let PROJECTS: string[] = [];
let CAREER: string[] = [];

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
const COMMANDS = ["help", "about", "projects", "banner", "clear", "lang"];
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

  // Handle language selection
  if (isLanguageSelection) {
    handleLanguageSelection(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    return;
  }

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

function handleLanguageSelection(input: string) {
  if (input === 'en' || input === 'fr') {
    setLanguage(input);
    isLanguageSelection = false;
    
    // Initialize translations
    HELP = createHelp();
    BANNER = createBanner();
    ABOUT = createAbout();
    DEFAULT = createDefault();
    PROJECTS = createProject();
    CAREER = createCareer();
    
    // Display banner
    writeLines(BANNER);
  } else if (input.trim().length !== 0) {
    writeLines([t().languageSelection.invalid, "<br>"]);
  }
}

function commandHandler(input : string) {
  // Handle lang command with parameter
  if(input.startsWith("lang ")) {
    const lang = input.split(" ")[1];
    if (lang === 'en' || lang === 'fr') {
      setLanguage(lang);
      // Reinitialize all translated content
      HELP = createHelp();
      BANNER = createBanner();
      ABOUT = createAbout();
      DEFAULT = createDefault();
      PROJECTS = createProject();
      CAREER = createCareer();
      writeLines(["<br>", t().languageChange.switchedTo, "<br>"]);
    } else {
      writeLines(["<br>", t().languageChange.usage, "<br>"]);
    }
    return;
  }

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
          writeLines([t().easterEgg.badIdea, "<br>"]);
        }, 200)

        setTimeout(() => {
          writeLines([t().easterEgg.ruined, "<br>"]);
        }, 1200)

        } else if (input === "rm -rf src" && bareMode) {
          writeLines([t().easterEgg.noSrcFolder, "<br>"])
        } else {
          if(bareMode) {
            writeLines([t().easterEgg.whatElse, "<br>"])
          } else {
            writeLines(["<br>", t().rmRf.directoryNotFound, t().rmRf.typeLS, "<br>"]);
          }
        } 
      } else {
        writeLines([t().rmRf.permissionNotGranted, "<br>"]);
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
        writeLines(["<br>",t().easterEgg.typeHelp, "<br>"])
        break;
      }
      writeLines(HELP);
      break;
    case 'about':
      if(bareMode) {
        writeLines([t().easterEgg.nothing, "<br>"])
        break;
      }
      writeLines(ABOUT);
      break;
    case 'projects':
      if(bareMode) {
        writeLines([t().easterEgg.noProjects, "<br>"])
        break;
      }
      writeLines(PROJECTS);
      break;
    case 'career':
      if(bareMode) {
        writeLines([t().easterEgg.nothing, "<br>"])
        break;
      }
      writeLines(CAREER);
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
        writeLines([t().easterEgg.dontTry, "<br>"])
        break;
      }

      if (isSudo) {
        writeLines([t().rmRf.usage, "<br>"]);
      } else {
        writeLines([t().rmRf.permissionNotGranted, "<br>"])
      }
        break;
    case 'sudo':
      if(bareMode) {
        writeLines([t().easterEgg.no, "<br>"])
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
        writeLines([t().ls.permissionNotGranted, "<br>"]);
      }
      break;
    case 'lang':
      if(bareMode) {
        writeLines([t().easterEgg.typeHelp, "<br>"])
        break;
      }
      writeLines(["<br>", t().languageChange.currentLanguage, t().languageChange.usage, "<br>"]);
      break;
    default:
      if(bareMode) {
        writeLines([t().easterEgg.typeHelp, "<br>"])
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
    writeLines(["<br>", t().sudo.incorrectPassword, t().sudo.permissionNotGranted, "<br>"])
    revertPasswordChanges();
    passwordCounter = 0;
    return
  }

  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    if (!mutWriteLines || !mutWriteLines.parentNode) return
    writeLines(["<br>", t().sudo.permissionGranted, t().sudo.tryRmRf, "<br>"])
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

  if (!bars) return
  bars.innerHTML = "";
  bars.remove()

  if (main) {
    main.style.border = "none";
    main.style.backgroundColor = "black";
  }

  html.style.backgroundColor = "black";
  body.style.backgroundColor = "black";
  body.style.fontFamily = "VT323, monospace";
  body.style.fontSize = "20px";
  body.style.color = "white";

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
    showLanguageSelection();
    updateDesktopClock();
    setInterval(updateDesktopClock, 1000);
  });
  
  USERINPUT.addEventListener('keypress', userInputHandler);
  USERINPUT.addEventListener('keydown', userInputHandler);
  PASSWORD_INPUT.addEventListener('keypress', userInputHandler);

  window.addEventListener('click', () => {
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

function showLanguageSelection() {
  const langSelection = [
    "<br>",
    t().languageSelection.prompt,
    "<br>",
    "  1. 'en' - " + t().languageSelection.english,
    "  2. 'fr' - " + t().languageSelection.french,
    "<br>"
  ];
  writeLines(langSelection);
}

initEventListeners();

// Maximize window button functionality
const maximizeButton = document.getElementById("maximize-window");
const mainElement = document.getElementById("main");
const barElement = document.getElementById("bar-1");
let isMaximized = false;

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
