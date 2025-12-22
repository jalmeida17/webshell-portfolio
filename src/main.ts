import command from '../config.json' assert {type: 'json'};
import { createHelp } from "./commands/help";
import { createBanner } from "./commands/banner";
import { createAbout } from "./commands/about"
import { createDefault } from "./commands/default";
import { PROJECTS as PROJECTS_DATA, PROJECT_DETAILS, ProjectData } from "./commands/projects";
import { createCareer } from "./commands/career";
import { EDUCATION } from "./commands/education";
import { SKILLS } from "./commands/skills";
import { CLAUGER } from "./commands/clauger";

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
const CAREER = createCareer();
const SKILLS_DATA = SKILLS;

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
const COMMANDS = ["help", "about", "projects", "banner", "clear", "skills", "career", "education", "news", "cv", "gui", "clauger"];
const HISTORY : string[] = [];
const SUDO_PASSWORD = command.password;

const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if(!MAIN) return

  MAIN.scrollTop = MAIN.scrollHeight;
}

function userInputHandler(e : KeyboardEvent) {
  const key = e.key;

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
      writeLines(PROJECTS_DATA);
      // Add click listeners to project links after they're rendered
      // Calculate total animation time: 40ms per line * number of lines
      const totalAnimationTime = PROJECTS_DATA.length * 40 + 100;
      setTimeout(() => {
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            const projectId = (e.target as HTMLElement).getAttribute('data-project-id');
            if (projectId) {
              const project = PROJECT_DETAILS.find(p => p.id === projectId);
              if (project) {
                openProjectDetailWindow(project);
              }
            }
          });
        });
      }, totalAnimationTime);
      break;
    case 'career':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      openCareerWindow();
      break;
    case 'education':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      openEducationWindow();
      break;
    case 'skills':
      if(bareMode) {
        writeLines(["No skills to show.", "<br>"])
        break;
      }
      openSkillsWindow();
      break;
    case 'news':
      if(bareMode) {
        writeLines(["No news for you.", "<br>"])
        break;
      }
      openNewsWindow();
      break;
    case 'cv':
      if(bareMode) {
        writeLines(["No CV for you.", "<br>"])
        break;
      }
      const link = document.createElement('a');
      link.href = '/res/cv.pdf';
      link.download = 'CV_Joao_Almeida.pdf';
      link.click();
      writeLines(["Downloading CV...", "<br>"]);
      break;
    case 'gui':
      if(bareMode) {
        writeLines(["No GUI for you.", "<br>"])
        break;
      }
      window.location.href = 'gui.html';
      break;
    case 'clauger':
      if(bareMode) {
        writeLines(["No company info for you.", "<br>"])
        break;
      }
      openClaugerWindow();
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
  USERINPUT.addEventListener('input', scrollToBottom);
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

// Sound toggle functionality
let isMuted = false;
const soundToggleBtn = document.getElementById('sound-toggle');

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;

    // Mute/unmute the music player if it's playing
    if (currentAudio) {
      currentAudio.muted = isMuted;
    }

    // Update icon
    const icon = soundToggleBtn.querySelector('i');
    if (icon) {
      if (isMuted) {
        icon.className = 'fa-solid fa-volume-xmark';
      } else {
        icon.className = 'fa-solid fa-volume-high';
      }
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

  // Global keydown listener for this window
  const careerKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault();
      document.body.removeChild(newTerminal);
      document.removeEventListener('keydown', careerKeydownHandler);
    }
  };
  document.addEventListener('keydown', careerKeydownHandler);

  content.appendChild(terminalInput);

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  setTimeout(() => terminalInput.focus(), 100);
}

function openEducationWindow() {
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
  topBar.textContent = `visitor@jalmeida17:$ ~/education`;

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
  
  // Add education content with prompt
  let educationHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/education</p>`;
  EDUCATION.forEach((line) => {
    if (line === '<br>') {
      educationHTML += '<br>';
    } else {
      educationHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
    }
  });
  
  content.innerHTML = educationHTML;

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

  // Global keydown listener for this window
  const educationKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault();
      document.body.removeChild(newTerminal);
      document.removeEventListener('keydown', educationKeydownHandler);
    }
  };
  document.addEventListener('keydown', educationKeydownHandler);

  content.appendChild(terminalInput);

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  setTimeout(() => terminalInput.focus(), 100);
}

function openSkillsWindow() {
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
    cursor: move;
  `;
  topBar.textContent = `visitor@jalmeida17:$ ~/skills`;

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
    font-size: 24px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  closeBtn.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
    document.body.removeChild(newTerminal);
  });

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
  
  // Add skills content with prompt
  let skillsHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/skills</p>`;
  SKILLS_DATA.forEach((line) => {
    if (line === '<br>') {
      skillsHTML += '<br>';
    } else {
      skillsHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
    }
  });
  
  content.innerHTML = skillsHTML;

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

  // Global keydown listener for this window
  const skillsKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault();
      document.body.removeChild(newTerminal);
      document.removeEventListener('keydown', skillsKeydownHandler);
    }
  };
  document.addEventListener('keydown', skillsKeydownHandler);

  content.appendChild(terminalInput);

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  setTimeout(() => terminalInput.focus(), 100);
}

function openProjectDetailWindow(project: ProjectData) {
  const mainElement = document.getElementById('main');
  if (!mainElement) return;

  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed;
    width: 50%;
    height: 75%;
    ${position}: 5%;
    top: 12%;
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
    cursor: move;
  `;
  topBar.textContent = `visitor@jalmeida17:$ ~/projects/${project.id}`;

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
    font-size: 24px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  closeBtn.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
    document.body.removeChild(newTerminal);
  });

  topBar.appendChild(closeBtn);

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

  // Build project detail HTML
  let statusBadge = '';
  if (project.status) {
    const statusColor = project.status === 'CLAUGER' ? '#298FDD' : '#FFA500';
    statusBadge = `<span style='color: ${statusColor};'> - ${project.status}</span>`;
  }
  let projectHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/projects/${project.id}</p>`;
  projectHTML += '<br>';
  projectHTML += `<p style="animation: none;"><span class='command' style='font-size: 20px; text-decoration: underline;'>${project.title}</span>${statusBadge}</p>`;
  projectHTML += `<p style="animation: none;"><span class='command'>${project.year} - Solo Project</span></p>`;
  projectHTML += '<br>';

  // Description
  project.fullDescription.forEach(line => {
    projectHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
  });
  projectHTML += '<br>';

  // Achievements
  projectHTML += `<p style="animation: none;"><span class='command'>Key Achievements:</span></p>`;
  project.achievements.forEach(achievement => {
    projectHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${achievement}</p>`;
  });
  projectHTML += '<br>';

  // Technologies
  projectHTML += `<p style="animation: none;"><span class='command'>Technologies:</span></p>`;
  project.technologies.forEach(tech => {
    projectHTML += `<p style="animation: none;">${tech}</p>`;
  });
  projectHTML += '<br>';

  // Repository (only show if there are repositories)
  if (project.repository && project.repository.length > 0) {
    projectHTML += `<p style="animation: none;"><span class='command'>Repository:</span></p>`;
    project.repository.forEach(repo => {
      projectHTML += `<p style="animation: none;">${repo}</p>`;
    });
    projectHTML += '<br>';
  }

  content.innerHTML = projectHTML;

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

  // Global keydown listener for this window
  const projectDetailKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault();
      document.body.removeChild(newTerminal);
      document.removeEventListener('keydown', projectDetailKeydownHandler);
    }
  };
  document.addEventListener('keydown', projectDetailKeydownHandler);

  content.appendChild(terminalInput);

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  setTimeout(() => terminalInput.focus(), 100);
}

async function openNewsWindow() {
  const mainElement = document.getElementById('main');
  if (!mainElement) return;

  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed;
    width: 55%;
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
    font-size: 16px;
    line-height: 22px;
  `;

  let newsHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/news</p>`;
  newsHTML += '<br>';
  newsHTML += `<p style="animation: none;"><span style="color: #E95420; font-weight: bold;">📰 Today's Tech & Science Headlines</span></p>`;
  newsHTML += '<br>';
  newsHTML += '<p style="animation: none; color: #888;">Fetching latest news...</p>';
  
  content.innerHTML = newsHTML;

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  // Fetch RSS feeds
  try {
    const feeds = [
      { category: '🔧 Development', url: 'https://github.blog/feed/', color: '#E95420' },
      { category: '💻 Tech', url: 'https://techcrunch.com/feed/', color: '#E95420' },
      { category: '🔬 Science', url: 'https://www.sciencealert.com/rss', color: '#E95420' },
      { category: '🤖 AI', url: 'https://venturebeat.com/feed/', color: '#E95420' },
      { category: '🎨 Design', url: 'https://www.smashingmagazine.com/feed/', color: '#E95420' }
    ];

    newsHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/news</p>`;
    newsHTML += '<br>';
    newsHTML += `<p style="animation: none;"><span style="color: #E95420; font-weight: bold;">📰 Today's Tech & Science Headlines</span></p>`;
    newsHTML += '<br>';

    for (let feedIndex = 0; feedIndex < feeds.length; feedIndex++) {
      const feed = feeds[feedIndex];
      newsHTML += `<p style="animation: none; margin-top: 10px;"><span style="color: ${feed.color}; font-weight: bold;">${feed.category}</span></p>`;

      try {
        // you're a bitch if you use my api key lol
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=lh7qwvgc9wlodqbp8ouslpcyxrml0ejeyursklsz&count=2`);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          // Loop through each news item (max 2)
          for (let i = 0; i < Math.min(data.items.length, 2); i++) {
            const item = data.items[i];
            const title = item.title.length > 80 ? item.title.substring(0, 80) + '...' : item.title;

            // Get description/content preview
            let description = '';
            if (item.description) {
              // Strip HTML tags and get first 100 characters
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = item.description;
              const textContent = tempDiv.textContent || tempDiv.innerText || '';
              description = textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
            }

            // Display title and description
            newsHTML += `<div style="margin-left: 10px; max-width: 90%;">`;
            newsHTML += `<p style="animation: none; margin: 0;">• <a href="${item.link}" target="_blank" style="color: ${command.colors.foreground}; text-decoration: underline;">${title}</a></p>`;
            if (description) {
              newsHTML += `<p style="animation: none; margin: 5px 0 0 10px; color: #888; font-size: 13px; font-style: italic; max-width: 95%; word-wrap: break-word;">${description}</p>`;
            }
            newsHTML += `</div>`;

            // Add spacing between news items
            if (i < Math.min(data.items.length, 2) - 1) {
              newsHTML += `<div style="margin: 15px 0;"></div>`;
            }
          }
        } else {
          newsHTML += `<p style="animation: none; margin-left: 10px; color: #888;">• Unable to fetch feed (API limit or feed issue)</p>`;
        }
      } catch (err) {
        newsHTML += `<p style="animation: none; margin-left: 10px; color: #888;">• Failed to load (${err instanceof Error ? err.message : 'unknown error'})</p>`;
      }

      newsHTML += '<br>';

      // Add divider between subjects (but not after the last one)
      if (feedIndex < feeds.length - 1) {
        newsHTML += `<div style="border-top: 1px solid #444; margin: 20px 0;"></div>`;
      }
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

  // Global keydown listener for this window
  const newsKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault();
      document.body.removeChild(newTerminal);
      document.removeEventListener('keydown', newsKeydownHandler);
    }
  };
  document.addEventListener('keydown', newsKeydownHandler);

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

  // Use ASCII art from config.json, formatted the same way as the banner
  let asciiArtHTML = '';
  command.ascii.forEach((ele) => {
    let bannerString = "";
    for (let i = 0; i < ele.length; i++) {
      if (ele[i] === " ") {
        bannerString += "&nbsp;";
      } else {
        bannerString += ele[i];
      }
    }
    asciiArtHTML += `<pre style="margin: 0;">${bannerString}</pre>`;
  });

  let imageAdded = false;
  ABOUT.forEach((line, index) => {
    // Add image and ASCII art side by side before the "Hi, I'm Joao" line (index 1 in the array)
    if (index === 1 && !imageAdded) {
      aboutHTML += `
        <div style="display: flex; gap: 20px; margin: 15px 0; align-items: center;">
          <img src="/res/profile.png" style="width: 150px; height: 150px; border-radius: 8px; border: 2px solid ${command.colors.border.color}; object-fit: cover;">
          <div style="color: ${command.colors.banner}; font-family: 'IBM Plex Mono', monospace;">${asciiArtHTML}</div>
        </div>
      `;
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

  // Global keydown listener for this window
  const aboutKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault();
      document.body.removeChild(newTerminal);
      document.removeEventListener('keydown', aboutKeydownHandler);
    }
  };
  document.addEventListener('keydown', aboutKeydownHandler);

  content.appendChild(terminalInput);

  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);

  setTimeout(() => terminalInput.focus(), 100);
}

function openClaugerWindow() {
  const mainElement = document.getElementById('main');
  if (!mainElement) return;

  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed;
    width: 50%;
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
  topBar.textContent = `visitor@jalmeida17:$ ~/clauger`;

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

  // Add Clauger content with prompt and logo
  let claugerHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/clauger</p>`;

  // Add logo with white background similar to /about profile image
  claugerHTML += `
    <div style="display: flex; justify-content: flex-start; margin: 20px 0;">
      <img src="/res/logo-clauger.png" style="width: 150px; height: 100px; border-radius: 8px; border: 2px solid ${command.colors.border.color}; object-fit: contain; background: #FFFFFF; padding: 10px;">
    </div>
  `;

  CLAUGER.forEach((line) => {
    if (line === '<br>') {
      claugerHTML += '<br>';
    } else {
      claugerHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
    }
  });

  content.innerHTML = claugerHTML;

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

  // Global keydown listener for this window
  const claugerKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault();
      document.body.removeChild(newTerminal);
      document.removeEventListener('keydown', claugerKeydownHandler);
    }
  };
  document.addEventListener('keydown', claugerKeydownHandler);

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
      mainElement.style.width = "95%";
      mainElement.style.height = "";
      mainElement.style.position = "";
      mainElement.style.left = "52%";
      mainElement.style.top = "50%";
      mainElement.style.transform = "translate(-50%, -50%)";
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

// Music Player functionality
let musicPlayerWindow: HTMLDivElement | null = null;
let currentAudio: HTMLAudioElement | null = null;
let isPlaying = false;
let currentTrackIndex = 0;

// Playlist
const playlist: Array<{title: string, artist: string, album: string, file: string, cover?: string}> = [
  {
    title: "Nightcall",
    artist: "Kavinsky",
    album: "10th Record Makers",
    file: "/musics/Kavinsky - Nightcall.mp3",
    cover: "/musics/nightcall.png"
  },
  {
    title: "Illegal",
    artist: "PinkPantheress",
    album: "Fancy That",
    file: "/musics/PinkPantheress - Illegal.mp3",
    cover: "/musics/illegal.png"
  }
];

const musicPlayerIcon = document.getElementById('music-player-icon');

if (musicPlayerIcon) {
  musicPlayerIcon.addEventListener('click', () => {
    if (musicPlayerWindow && document.body.contains(musicPlayerWindow)) {
      // Close music player
      document.body.removeChild(musicPlayerWindow);
      musicPlayerWindow = null;
      musicPlayerIcon.classList.remove('active');
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
    } else {
      // Open music player
      openMusicPlayer();
      musicPlayerIcon.classList.add('active');
    }
  });
}

function openMusicPlayer() {
  musicPlayerWindow = document.createElement('div');
  musicPlayerWindow.className = 'music-player-window';
  windowZIndex++;
  musicPlayerWindow.style.cssText = `
    position: fixed;
    width: 600px;
    height: 120px;
    left: 50%;
    bottom: 60px;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, #3C3C3C 0%, #2A2A2A 100%);
    border: 1px solid #1A1A1A;
    border-radius: 6px 6px 0 0;
    z-index: ${windowZIndex};
    display: flex;
    flex-direction: column;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
    font-family: 'IBM Plex Mono', monospace;
  `;

  musicPlayerWindow.addEventListener('mousedown', () => {
    bringToFront(musicPlayerWindow!);
  });

  // Top bar
  const topBar = document.createElement('div');
  topBar.style.cssText = `
    height: 32px;
    background: linear-gradient(to bottom, #4A4A4A 0%, #3A3A3A 100%);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-radius: 6px 6px 0 0;
    position: relative;
    user-select: none;
    border-bottom: 1px solid #1A1A1A;
  `;

  const logo = document.createElement('img');
  logo.src = '/res/Rhythmbox_logo_3.4.4.svg.png';
  logo.style.cssText = 'width: 20px; height: 20px; margin-right: 8px;';

  const title = document.createElement('span');
  title.textContent = 'Rythmbox';
  title.style.cssText = 'font-size: 13px; flex: 1;';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    background: transparent;
    border: none;
    color: #FFFFFF;
    cursor: pointer;
    font-size: 20px;
    padding: 0 4px;
    transition: background 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
  closeBtn.onclick = () => {
    document.body.removeChild(musicPlayerWindow!);
    musicPlayerWindow = null;
    const icon = document.getElementById('music-player-icon');
    if (icon) icon.classList.remove('active');
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
  };

  topBar.appendChild(logo);
  topBar.appendChild(title);
  topBar.appendChild(closeBtn);

  // Dragging functionality
  let isDraggingPlayer = false;
  let playerOffsetX = 0;
  let playerOffsetY = 0;

  topBar.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn) return;
    isDraggingPlayer = true;
    const rect = musicPlayerWindow!.getBoundingClientRect();
    playerOffsetX = e.clientX - rect.left;
    playerOffsetY = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingPlayer || !musicPlayerWindow) return;
    e.preventDefault();
    const newLeft = e.clientX - playerOffsetX;
    const newTop = e.clientY - playerOffsetY;
    musicPlayerWindow.style.left = `${newLeft}px`;
    musicPlayerWindow.style.top = `${newTop}px`;
    musicPlayerWindow.style.bottom = 'auto';
    musicPlayerWindow.style.transform = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingPlayer) {
      isDraggingPlayer = false;
      topBar.style.cursor = '';
    }
  });

  // Player content
  const playerContent = document.createElement('div');
  playerContent.style.cssText = `
    flex: 1;
    display: flex;
    align-items: center;
    padding: 4px 12px;
    gap: 12px;
  `;

  // Album cover
  const albumCover = document.createElement('img');
  albumCover.id = 'music-player-cover';
  albumCover.src = '/res/logo.png'; // Default cover
  albumCover.style.cssText = `
    width: 80px;
    height: 80px;
    border-radius: 4px;
    object-fit: cover;
    margin-bottom: 12px;
    background: #1A1A1A;
  `;

  // Track info and controls
  const controlsContainer = document.createElement('div');
  controlsContainer.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  `;

  // Track info
  const trackInfo = document.createElement('div');
  trackInfo.style.cssText = 'display: flex; flex-direction: column; gap: 2px;';

  const trackTitle = document.createElement('div');
  trackTitle.id = 'track-title';
  trackTitle.textContent = 'No track loaded';
  trackTitle.style.cssText = 'color: #FFFFFF; font-size: 13px; font-weight: 500;';

  const trackArtist = document.createElement('div');
  trackArtist.id = 'track-artist';
  trackArtist.textContent = 'Select a track to play';
  trackArtist.style.cssText = 'color: #B0B0B0; font-size: 11px;';

  trackInfo.appendChild(trackTitle);
  trackInfo.appendChild(trackArtist);

  // Controls
  const controls = document.createElement('div');
  controls.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  const createControlButton = (icon: string, id: string) => {
    const btn = document.createElement('button');
    btn.id = id;
    btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    btn.style.cssText = `
      background: linear-gradient(to bottom, #5A5A5A 0%, #4A4A4A 100%);
      border: 1px solid #2A2A2A;
      color: #FFFFFF;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    `;
    btn.onmouseover = () => {
      btn.style.background = 'linear-gradient(to bottom, #6A6A6A 0%, #5A5A5A 100%)';
    };
    btn.onmouseout = () => {
      btn.style.background = 'linear-gradient(to bottom, #5A5A5A 0%, #4A4A4A 100%)';
    };
    return btn;
  };

  const prevBtn = createControlButton('fa-backward-step', 'music-prev');
  const playPauseBtn = createControlButton('fa-play', 'music-play-pause');
  const nextBtn = createControlButton('fa-forward-step', 'music-next');

  // Time display
  const timeDisplay = document.createElement('div');
  timeDisplay.id = 'time-display';
  timeDisplay.textContent = '-3:27 / 4:27';
  timeDisplay.style.cssText = 'color: #B0B0B0; font-size: 11px; margin-left: auto;';

  // Progress bar
  const progressBar = document.createElement('input');
  progressBar.id = 'music-progress';
  progressBar.type = 'range';
  progressBar.min = '0';
  progressBar.max = '100';
  progressBar.value = '0';
  progressBar.style.cssText = `
    flex: 1;
    height: 4px;
    border-radius: 2px;
    outline: none;
    -webkit-appearance: none;
    background: #4A4A4A;
  `;

  controls.appendChild(prevBtn);
  controls.appendChild(playPauseBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(progressBar);
  controls.appendChild(timeDisplay);

  controlsContainer.appendChild(trackInfo);
  controlsContainer.appendChild(controls);

  playerContent.appendChild(albumCover);
  playerContent.appendChild(controlsContainer);

  musicPlayerWindow.appendChild(topBar);
  musicPlayerWindow.appendChild(playerContent);
  document.body.appendChild(musicPlayerWindow);

  // Event listeners for controls
  playPauseBtn.addEventListener('click', togglePlayPause);
  prevBtn.addEventListener('click', playPreviousTrack);
  nextBtn.addEventListener('click', playNextTrack);
  progressBar.addEventListener('input', seekTrack);

  // Load the first track by default
  if (playlist.length > 0) {
    loadTrack(0);
  }
}

function togglePlayPause() {
  if (!currentAudio && playlist.length > 0) {
    loadTrack(currentTrackIndex);
  }

  if (currentAudio) {
    if (isPlaying) {
      currentAudio.pause();
      isPlaying = false;
      const btn = document.getElementById('music-play-pause');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
      currentAudio.play();
      isPlaying = true;
      const btn = document.getElementById('music-play-pause');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
  }
}

function loadTrack(index: number) {
  if (index < 0 || index >= playlist.length) return;

  currentTrackIndex = index;
  const track = playlist[index];

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentAudio = new Audio(track.file);
  currentAudio.muted = isMuted; // Apply current mute state

  const titleEl = document.getElementById('track-title');
  const artistEl = document.getElementById('track-artist');
  const coverEl = document.getElementById('music-player-cover') as HTMLImageElement;

  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = `by ${track.artist} from ${track.album}`;
  if (coverEl && track.cover) coverEl.src = track.cover;

  currentAudio.addEventListener('loadedmetadata', updateProgress);
  currentAudio.addEventListener('timeupdate', updateProgress);
  currentAudio.addEventListener('ended', playNextTrack);
}

function updateProgress() {
  if (!currentAudio) return;

  const progress = document.getElementById('music-progress') as HTMLInputElement;
  const timeDisplay = document.getElementById('time-display');

  if (progress && currentAudio.duration) {
    const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
    progress.value = percent.toString();
  }

  if (timeDisplay && currentAudio.duration) {
    const current = formatTime(currentAudio.currentTime);
    const total = formatTime(currentAudio.duration);
    timeDisplay.textContent = `${current} / ${total}`;
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function seekTrack(e: Event) {
  if (!currentAudio || !currentAudio.duration) return;
  const input = e.target as HTMLInputElement;
  const seekTime = (parseFloat(input.value) / 100) * currentAudio.duration;
  currentAudio.currentTime = seekTime;
}

function playPreviousTrack() {
  if (currentTrackIndex > 0) {
    loadTrack(currentTrackIndex - 1);
    if (isPlaying && currentAudio) {
      currentAudio.play();
    }
  }
}

function playNextTrack() {
  if (currentTrackIndex < playlist.length - 1) {
    loadTrack(currentTrackIndex + 1);
    if (isPlaying && currentAudio) {
      currentAudio.play();
    }
  }
}

// Desktop context menu functionality
// Load saved background from localStorage or default to 0
let currentBackgroundIndex = parseInt(localStorage.getItem('currentBackgroundIndex') || '0', 10);
const backgrounds = ['ubuntu.jpg', 'ubuntu2.jpg'];
const contextMenu = document.getElementById('desktop-context-menu');
const changeBackgroundBtn = document.getElementById('change-background-btn');

// Apply saved background on load
const savedBackground = backgrounds[currentBackgroundIndex];
document.documentElement.style.backgroundImage = `url('/res/${savedBackground}')`;
document.body.style.backgroundImage = `url('/res/${savedBackground}')`;

// Show context menu on right-click
document.addEventListener('contextmenu', (e: MouseEvent) => {
  // Only show context menu if clicking on the body/desktop area
  const target = e.target as HTMLElement;
  if (target === document.body || target.id === 'desktop-topbar' || target.id === 'desktop-clock') {
    e.preventDefault();

    if (contextMenu) {
      contextMenu.style.display = 'block';
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;
    }
  }
});

// Hide context menu on click outside
document.addEventListener('click', (e: MouseEvent) => {
  if (contextMenu && e.target !== changeBackgroundBtn) {
    contextMenu.style.display = 'none';
  }
});

// Change background on menu item click
if (changeBackgroundBtn) {
  changeBackgroundBtn.addEventListener('click', () => {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    const newBackground = backgrounds[currentBackgroundIndex];

    // Update background for both html and body
    document.documentElement.style.backgroundImage = `url('/res/${newBackground}')`;
    document.body.style.backgroundImage = `url('/res/${newBackground}')`;

    // Save the current background index to localStorage
    localStorage.setItem('currentBackgroundIndex', currentBackgroundIndex.toString());

    if (contextMenu) {
      contextMenu.style.display = 'none';
    }
  });
}
