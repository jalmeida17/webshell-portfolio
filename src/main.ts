import command from '../config.json' assert {type: 'json'};
import { createHelp } from "./commands/help";
import { createBanner } from "./commands/banner";
import { createAbout } from "./commands/about"
import { createDefault } from "./commands/default";
import { PROJECTS as PROJECTS_DATA, PROJECT_DETAILS, ProjectData } from "./commands/projects";
import { createCareer } from "./commands/career";
import { EDUCATION } from "./commands/education";
import { SKILLS } from "./commands/skills";
import { runBootSequence } from "./boot";
import { VEILLE_SOURCES, VEILLE_SYNTHESES, VEILLE_METHODOLOGY } from "./commands/veille";

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
const COMMANDS = ["help", "about", "projects", "banner", "clear", "skills", "career", "education", "veille", "cv", "gui", "clauger"];
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
    case 'veille':
      if(bareMode) {
        writeLines(["No tech watch for you.", "<br>"])
        break;
      }
      openVeilleWindow();
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

  window.addEventListener('load', async () => {
    await runBootSequence();
    writeLines(BANNER);
    updateDesktopClock();
    setInterval(updateDesktopClock, 1000);
    USERINPUT.focus();
  });
  
  USERINPUT.addEventListener('keypress', userInputHandler);
  USERINPUT.addEventListener('keydown', userInputHandler);
  USERINPUT.addEventListener('input', scrollToBottom);
  PASSWORD_INPUT.addEventListener('keypress', userInputHandler);

  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    // Don't focus main input if clicking on a new terminal or app grid overlay
    if (target.closest('.new-terminal') || target.closest('#app-grid-overlay')) return;
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

// Power button — shows login screen overlay
const powerBtn = document.getElementById('power-btn');
if (powerBtn) {
  powerBtn.addEventListener('click', () => {
    const topbar = document.getElementById('desktop-topbar');
    const sidebar = document.getElementById('sidebar-dock');
    const mainEl = document.getElementById('main');
    const versionInfo = document.getElementById('version-info');
    const activities = document.getElementById('topbar-activities');

    // Hide desktop elements
    if (sidebar) sidebar.style.visibility = 'hidden';
    if (mainEl) mainEl.style.visibility = 'hidden';
    if (versionInfo) versionInfo.style.visibility = 'hidden';
    if (activities) activities.style.display = 'none';
    // Hide all open windows
    document.querySelectorAll<HTMLElement>('.new-terminal, .calc-window, .music-player-window').forEach(w => w.style.visibility = 'hidden');

    // Style topbar for login and bring above overlay
    if (topbar) {
      topbar.style.background = '#3B3B3B';
      topbar.style.boxShadow = 'none';
      topbar.style.zIndex = '100000';
    }

    // Create login overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99998;';

    const login = document.createElement('div');
    login.className = 'login-screen';

    const card = document.createElement('div');
    card.className = 'login-card';

    const avatar = document.createElement('img');
    avatar.className = 'login-avatar';
    avatar.src = '/res/profile.png';
    avatar.alt = 'Profile';

    const nameEl = document.createElement('div');
    nameEl.className = 'login-name';
    nameEl.textContent = 'jalmeida17';

    card.appendChild(avatar);
    card.appendChild(nameEl);

    const logo = document.createElement('img');
    logo.className = 'login-logo';
    logo.src = '/res/Ubuntu-logo-2022.svg.png';
    logo.alt = 'Ubuntu';

    const notListed = document.createElement('div');
    notListed.className = 'login-not-listed';
    notListed.textContent = 'Not listed?';

    login.appendChild(card);
    login.appendChild(notListed);
    login.appendChild(logo);
    overlay.appendChild(login);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => { login.style.opacity = '1'; });
    });

    card.addEventListener('click', () => {
      // Restore desktop
      if (topbar) {
        topbar.style.background = '';
        topbar.style.boxShadow = '';
        topbar.style.zIndex = '';
      }
      if (sidebar) sidebar.style.visibility = '';
      if (mainEl) mainEl.style.visibility = '';
      if (versionInfo) versionInfo.style.visibility = '';
      if (activities) activities.style.display = '';
      document.querySelectorAll<HTMLElement>('.new-terminal, .calc-window, .music-player-window').forEach(w => w.style.visibility = '');
      document.body.removeChild(overlay);
    });
  });
}

// Terminal window functionality
let windowZIndex = 50;

function bringToFront(element: HTMLElement) {
  windowZIndex++;
  element.style.zIndex = String(windowZIndex);
}

// ─── Window Management Helpers ───

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgIcon(type: 'minimize' | 'maximize' | 'maximize-restore' | 'close'): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 12 12');

  if (type === 'minimize') {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', '2'); line.setAttribute('y1', '6');
    line.setAttribute('x2', '10'); line.setAttribute('y2', '6');
    svg.appendChild(line);
  } else if (type === 'maximize') {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', '2'); rect.setAttribute('y', '2');
    rect.setAttribute('width', '8'); rect.setAttribute('height', '8');
    rect.setAttribute('rx', '1');
    svg.appendChild(rect);
  } else if (type === 'maximize-restore') {
    const back = document.createElementNS(SVG_NS, 'rect');
    back.setAttribute('x', '3.5'); back.setAttribute('y', '1');
    back.setAttribute('width', '7.5'); back.setAttribute('height', '7.5');
    back.setAttribute('rx', '1');
    svg.appendChild(back);
    const front = document.createElementNS(SVG_NS, 'rect');
    front.setAttribute('x', '1'); front.setAttribute('y', '3.5');
    front.setAttribute('width', '7.5'); front.setAttribute('height', '7.5');
    front.setAttribute('rx', '1');
    svg.appendChild(front);
  } else if (type === 'close') {
    const l1 = document.createElementNS(SVG_NS, 'line');
    l1.setAttribute('x1', '3'); l1.setAttribute('y1', '3');
    l1.setAttribute('x2', '9'); l1.setAttribute('y2', '9');
    svg.appendChild(l1);
    const l2 = document.createElementNS(SVG_NS, 'line');
    l2.setAttribute('x1', '9'); l2.setAttribute('y1', '3');
    l2.setAttribute('x2', '3'); l2.setAttribute('y2', '9');
    svg.appendChild(l2);
  }

  return svg;
}

function createWindowControls(options: {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose: () => void;
}): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'window-controls';

  if (options.onMinimize) {
    const minBtn = document.createElement('button');
    minBtn.className = 'window-btn';
    minBtn.appendChild(createSvgIcon('minimize'));
    minBtn.addEventListener('click', (e) => { e.stopPropagation(); options.onMinimize!(); });
    container.appendChild(minBtn);
  }

  if (options.onMaximize) {
    const maxBtn = document.createElement('button');
    maxBtn.className = 'window-btn window-btn-maximize';
    maxBtn.appendChild(createSvgIcon('maximize'));
    maxBtn.addEventListener('click', (e) => { e.stopPropagation(); options.onMaximize!(); });
    container.appendChild(maxBtn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'window-btn window-btn-close';
  closeBtn.appendChild(createSvgIcon('close'));
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); options.onClose(); });
  container.appendChild(closeBtn);

  return container;
}

function createTitleBar(title: string, controls: HTMLDivElement, iconSrc?: string): HTMLDivElement {
  const titleBar = document.createElement('div');
  titleBar.style.cssText = `
    height: 36px;
    background: #303030;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    border-radius: 6px 6px 0 0;
    position: relative;
    user-select: none;
    cursor: move;
    padding: 0 12px;
  `;

  if (iconSrc) {
    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.style.cssText = 'width: 20px; height: 20px; margin-right: 8px;';
    titleBar.appendChild(icon);
  }

  const titleSpan = document.createElement('span');
  titleSpan.textContent = title;
  titleSpan.style.cssText = "flex: 1; text-align: center; font-size: 13px; font-family: 'Ubuntu Sans', sans-serif;";
  titleBar.appendChild(titleSpan);
  titleBar.appendChild(controls);

  return titleBar;
}

function makeDraggable(windowEl: HTMLElement, titleBar: HTMLElement, isMaximizedFn?: () => boolean): void {
  let isDrag = false;
  let oX = 0;
  let oY = 0;

  titleBar.addEventListener('mousedown', (e) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    if (isMaximizedFn && isMaximizedFn()) return;
    isDrag = true;
    const rect = windowEl.getBoundingClientRect();
    oX = e.clientX - rect.left;
    oY = e.clientY - rect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDrag) return;
    if (isMaximizedFn && isMaximizedFn()) return;
    e.preventDefault();
    windowEl.style.left = `${e.clientX - oX}px`;
    windowEl.style.top = `${e.clientY - oY}px`;
    windowEl.style.right = 'auto';
    windowEl.style.bottom = 'auto';
    windowEl.style.transform = 'none';
  });

  document.addEventListener('mouseup', () => { isDrag = false; });
}

// ─── End Helpers ───

function openCareerWindow() {
  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed; width: 40%; height: 70%;
    ${position}: 5%; top: 15%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex}; display: flex; flex-direction: column;
  `;
  newTerminal.addEventListener('mousedown', () => bringToFront(newTerminal));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { newTerminal.style.display = 'none'; },
    onMaximize: () => {
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        newTerminal.style.cssText = `position: fixed; width: 40%; height: 70%; ${position}: 5%; top: 15%; background: ${command.colors.background}; border: 2px solid ${command.colors.border.color}; border-radius: 8px 8px 2px 2px; z-index: ${newTerminal.style.zIndex}; display: flex; flex-direction: column;`;
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        newTerminal.style.width = 'calc(100% - 64px)';
        newTerminal.style.height = 'calc(100% - 28px)';
        newTerminal.style.left = '64px';
        newTerminal.style.right = '0';
        newTerminal.style.top = '28px';
        newTerminal.style.transform = 'none';
        newTerminal.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => document.body.removeChild(newTerminal),
  });

  const topBar = createTitleBar('visitor@jalmeida17:$ ~/career', controls);
  makeDraggable(newTerminal, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  const content = document.createElement('div');
  content.style.cssText = `flex: 1; padding: 20px; color: ${command.colors.foreground}; overflow-y: auto; font-family: 'IBM Plex Mono', monospace; font-size: 16px; line-height: 22px;`;

  let careerHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/career</p>`;
  CAREER.forEach((line) => {
    careerHTML += line === '<br>' ? '<br>' : `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
  });
  content.innerHTML = careerHTML;

  const terminalInput = document.createElement('input');
  terminalInput.type = 'text';
  terminalInput.style.cssText = `width: 100%; background: ${command.colors.background}; color: ${command.colors.foreground}; border: none; outline: none; font-family: 'IBM Plex Mono', monospace; font-size: 16px; margin-top: 10px;`;
  terminalInput.placeholder = 'Press Enter to close...';
  terminalInput.addEventListener('keypress', (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); document.body.removeChild(newTerminal); } });

  const careerKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault(); document.body.removeChild(newTerminal); document.removeEventListener('keydown', careerKeydownHandler);
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
  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed; width: 40%; height: 70%;
    ${position}: 5%; top: 15%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex}; display: flex; flex-direction: column;
  `;
  newTerminal.addEventListener('mousedown', () => bringToFront(newTerminal));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { newTerminal.style.display = 'none'; },
    onMaximize: () => {
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        newTerminal.style.cssText = `position: fixed; width: 40%; height: 70%; ${position}: 5%; top: 15%; background: ${command.colors.background}; border: 2px solid ${command.colors.border.color}; border-radius: 8px 8px 2px 2px; z-index: ${newTerminal.style.zIndex}; display: flex; flex-direction: column;`;
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        newTerminal.style.width = 'calc(100% - 64px)';
        newTerminal.style.height = 'calc(100% - 28px)';
        newTerminal.style.left = '64px';
        newTerminal.style.right = '0';
        newTerminal.style.top = '28px';
        newTerminal.style.transform = 'none';
        newTerminal.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => document.body.removeChild(newTerminal),
  });

  const topBar = createTitleBar('visitor@jalmeida17:$ ~/education', controls);
  makeDraggable(newTerminal, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  const content = document.createElement('div');
  content.style.cssText = `flex: 1; padding: 20px; color: ${command.colors.foreground}; overflow-y: auto; font-family: 'IBM Plex Mono', monospace; font-size: 16px; line-height: 22px;`;

  let educationHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/education</p>`;
  EDUCATION.forEach((line) => {
    educationHTML += line === '<br>' ? '<br>' : `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
  });
  content.innerHTML = educationHTML;

  const terminalInput = document.createElement('input');
  terminalInput.type = 'text';
  terminalInput.style.cssText = `width: 100%; background: ${command.colors.background}; color: ${command.colors.foreground}; border: none; outline: none; font-family: 'IBM Plex Mono', monospace; font-size: 16px; margin-top: 10px;`;
  terminalInput.placeholder = 'Press Enter to close...';
  terminalInput.addEventListener('keypress', (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); document.body.removeChild(newTerminal); } });

  const educationKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault(); document.body.removeChild(newTerminal); document.removeEventListener('keydown', educationKeydownHandler);
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
  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed; width: 40%; height: 70%;
    ${position}: 5%; top: 15%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex}; display: flex; flex-direction: column;
  `;
  newTerminal.addEventListener('mousedown', () => bringToFront(newTerminal));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { newTerminal.style.display = 'none'; },
    onMaximize: () => {
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        newTerminal.style.cssText = `position: fixed; width: 40%; height: 70%; ${position}: 5%; top: 15%; background: ${command.colors.background}; border: 2px solid ${command.colors.border.color}; border-radius: 8px 8px 2px 2px; z-index: ${newTerminal.style.zIndex}; display: flex; flex-direction: column;`;
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        newTerminal.style.width = 'calc(100% - 64px)';
        newTerminal.style.height = 'calc(100% - 28px)';
        newTerminal.style.left = '64px';
        newTerminal.style.right = '0';
        newTerminal.style.top = '28px';
        newTerminal.style.transform = 'none';
        newTerminal.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => document.body.removeChild(newTerminal),
  });

  const topBar = createTitleBar('visitor@jalmeida17:$ ~/skills', controls);
  makeDraggable(newTerminal, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  const content = document.createElement('div');
  content.style.cssText = `flex: 1; padding: 20px; color: ${command.colors.foreground}; overflow-y: auto; font-family: 'IBM Plex Mono', monospace; font-size: 16px; line-height: 22px;`;

  let skillsHTML = `<p style="animation: none; white-space: normal; overflow: visible;"><span style="color: ${command.colors.prompt.user}">visitor@jalmeida17</span>:$ ~/skills</p>`;
  SKILLS_DATA.forEach((line) => {
    skillsHTML += line === '<br>' ? '<br>' : `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`;
  });
  content.innerHTML = skillsHTML;

  const terminalInput = document.createElement('input');
  terminalInput.type = 'text';
  terminalInput.style.cssText = `width: 100%; background: ${command.colors.background}; color: ${command.colors.foreground}; border: none; outline: none; font-family: 'IBM Plex Mono', monospace; font-size: 16px; margin-top: 10px;`;
  terminalInput.placeholder = 'Press Enter to close...';
  terminalInput.addEventListener('keypress', (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); document.body.removeChild(newTerminal); } });

  const skillsKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault(); document.body.removeChild(newTerminal); document.removeEventListener('keydown', skillsKeydownHandler);
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
  const existingNewTerminals = document.querySelectorAll('.new-terminal');
  const position = existingNewTerminals.length % 2 === 0 ? 'left' : 'right';

  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed; width: 50%; height: 75%;
    ${position}: 5%; top: 12%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex}; display: flex; flex-direction: column;
  `;
  newTerminal.addEventListener('mousedown', () => bringToFront(newTerminal));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { newTerminal.style.display = 'none'; },
    onMaximize: () => {
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        newTerminal.style.cssText = `position: fixed; width: 50%; height: 75%; ${position}: 5%; top: 12%; background: ${command.colors.background}; border: 2px solid ${command.colors.border.color}; border-radius: 8px 8px 2px 2px; z-index: ${newTerminal.style.zIndex}; display: flex; flex-direction: column;`;
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        newTerminal.style.width = 'calc(100% - 64px)';
        newTerminal.style.height = 'calc(100% - 28px)';
        newTerminal.style.left = '64px';
        newTerminal.style.right = '0';
        newTerminal.style.top = '28px';
        newTerminal.style.transform = 'none';
        newTerminal.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => document.body.removeChild(newTerminal),
  });

  const topBar = createTitleBar(`visitor@jalmeida17:$ ~/projects/${project.id}`, controls);
  makeDraggable(newTerminal, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  const content = document.createElement('div');
  content.style.cssText = `flex: 1; padding: 20px; color: ${command.colors.foreground}; overflow-y: auto; font-family: 'IBM Plex Mono', monospace; font-size: 16px; line-height: 22px;`;

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
  project.fullDescription.forEach(line => { projectHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${line}</p>`; });
  projectHTML += '<br>';
  projectHTML += `<p style="animation: none;"><span class='command'>Key Achievements:</span></p>`;
  project.achievements.forEach(achievement => { projectHTML += `<p style="animation: none; white-space: normal; overflow: visible;">${achievement}</p>`; });
  projectHTML += '<br>';
  projectHTML += `<p style="animation: none;"><span class='command'>Technologies:</span></p>`;
  project.technologies.forEach(tech => { projectHTML += `<p style="animation: none;">${tech}</p>`; });
  projectHTML += '<br>';
  if (project.repository && project.repository.length > 0) {
    projectHTML += `<p style="animation: none;"><span class='command'>Repository:</span></p>`;
    project.repository.forEach(repo => { projectHTML += `<p style="animation: none;">${repo}</p>`; });
    projectHTML += '<br>';
  }
  content.innerHTML = projectHTML;

  const terminalInput = document.createElement('input');
  terminalInput.type = 'text';
  terminalInput.style.cssText = `width: 100%; background: ${command.colors.background}; color: ${command.colors.foreground}; border: none; outline: none; font-family: 'IBM Plex Mono', monospace; font-size: 16px; margin-top: 10px;`;
  terminalInput.placeholder = 'Press Enter to close...';
  terminalInput.addEventListener('keypress', (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); document.body.removeChild(newTerminal); } });

  const projectDetailKeydownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && document.body.contains(newTerminal) && (target === terminalInput || newTerminal.contains(target))) {
      e.preventDefault(); document.body.removeChild(newTerminal); document.removeEventListener('keydown', projectDetailKeydownHandler);
    }
  };
  document.addEventListener('keydown', projectDetailKeydownHandler);

  content.appendChild(terminalInput);
  newTerminal.appendChild(topBar);
  newTerminal.appendChild(content);
  document.body.appendChild(newTerminal);
  setTimeout(() => terminalInput.focus(), 100);
}

let veilleWindow: HTMLDivElement | null = null;

function openVeilleWindow() {
  if (veilleWindow && document.body.contains(veilleWindow)) {
    bringToFront(veilleWindow);
    return;
  }

  veilleWindow = document.createElement('div');
  windowZIndex++;
  veilleWindow.style.cssText = `
    position: fixed;
    width: 800px;
    height: 700px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #2D2D2D;
    border: 1px solid #1A1A1A;
    border-radius: 6px;
    z-index: ${windowZIndex};
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    font-family: 'Ubuntu Sans', sans-serif;
  `;
  veilleWindow.addEventListener('mousedown', () => bringToFront(veilleWindow!));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { if (veilleWindow) veilleWindow.style.display = 'none'; },
    onMaximize: () => {
      if (!veilleWindow) return;
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        veilleWindow.style.width = '800px';
        veilleWindow.style.height = '700px';
        veilleWindow.style.left = '50%';
        veilleWindow.style.top = '50%';
        veilleWindow.style.transform = 'translate(-50%, -50%)';
        veilleWindow.style.borderRadius = '6px';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        veilleWindow.style.width = 'calc(100% - 64px)';
        veilleWindow.style.height = 'calc(100% - 28px)';
        veilleWindow.style.left = '64px';
        veilleWindow.style.top = '28px';
        veilleWindow.style.transform = 'none';
        veilleWindow.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => {
      if (veilleWindow && document.body.contains(veilleWindow)) {
        document.body.removeChild(veilleWindow);
        veilleWindow = null;
      }
    },
  });

  const topBar = createTitleBar('Tech Watch', controls);
  makeDraggable(veilleWindow, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  // Content area
  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    background: #2D2D2D;
  `;

  // === Identity section ===
  const identity = document.createElement('div');
  identity.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 32px 28px;
    gap: 12px;
  `;

  const iconWrap = document.createElement('div');
  iconWrap.style.cssText = `
    width: 96px;
    height: 96px;
    border-radius: 22px;
    background: linear-gradient(135deg, #7C3AED, #A855F7);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.06);
  `;
  const brainIcon = document.createElement('i');
  brainIcon.className = 'fa-solid fa-brain';
  brainIcon.style.cssText = 'font-size: 42px; color: #FFFFFF;';
  iconWrap.appendChild(brainIcon);

  const idName = document.createElement('div');
  idName.textContent = 'Tech Watch';
  idName.style.cssText = 'font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;';

  const idTag = document.createElement('div');
  idTag.textContent = 'Intelligence Artificielle & Machine Learning';
  idTag.style.cssText = 'font-size: 13px; color: #999999; font-weight: 400;';

  const idBadge = document.createElement('div');
  idBadge.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    padding: 4px 12px;
    background: rgba(124, 58, 237, 0.12);
    border-radius: 20px;
  `;
  const badgeIcon = document.createElement('i');
  badgeIcon.className = 'fa-solid fa-graduation-cap';
  badgeIcon.style.cssText = 'font-size: 11px; color: #A855F7;';
  const badgeText = document.createElement('span');
  badgeText.textContent = 'BTS SIO \u2014 Daily to weekly';
  badgeText.style.cssText = 'font-size: 12px; color: #A855F7; font-weight: 500;';
  idBadge.appendChild(badgeIcon);
  idBadge.appendChild(badgeText);

  identity.appendChild(iconWrap);
  identity.appendChild(idName);
  identity.appendChild(idTag);
  identity.appendChild(idBadge);

  // === List groups ===
  const listArea = document.createElement('div');
  listArea.style.cssText = 'padding: 0 28px 28px; display: flex; flex-direction: column; gap: 20px;';

  // Helper: GNOME-style listbox group (same pattern as Clauger)
  function createVeilleListGroup(label: string, rows: { icon: string; iconColor: string; text: string; detail: string }[]) {
    const group = document.createElement('div');

    const groupLabel = document.createElement('div');
    groupLabel.textContent = label;
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const box = document.createElement('div');
    box.style.cssText = `
      background: #363636;
      border-radius: 10px;
      overflow: hidden;
    `;

    rows.forEach((row, i) => {
      const rowEl = document.createElement('div');
      rowEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 11px 16px;
        transition: background 0.15s ease;
        ${i < rows.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.06);' : ''}
      `;
      rowEl.addEventListener('mouseenter', () => { rowEl.style.background = 'rgba(255,255,255,0.04)'; });
      rowEl.addEventListener('mouseleave', () => { rowEl.style.background = 'transparent'; });

      const iconEl = document.createElement('div');
      iconEl.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: ${row.iconColor};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      `;
      const iconI = document.createElement('i');
      iconI.className = row.icon;
      iconI.style.cssText = 'font-size: 14px; color: #FFFFFF;';
      iconEl.appendChild(iconI);

      const textWrap = document.createElement('div');
      textWrap.style.cssText = 'flex: 1; min-width: 0;';

      const textMain = document.createElement('div');
      textMain.textContent = row.text;
      textMain.style.cssText = 'font-size: 13px; color: #EEEEEE; font-weight: 500; line-height: 1.3;';

      const textSub = document.createElement('div');
      textSub.textContent = row.detail;
      textSub.style.cssText = 'font-size: 11px; color: #888888; margin-top: 1px; line-height: 1.3;';

      textWrap.appendChild(textMain);
      textWrap.appendChild(textSub);

      rowEl.appendChild(iconEl);
      rowEl.appendChild(textWrap);
      box.appendChild(rowEl);
    });

    group.appendChild(box);
    return group;
  }

  // --- Methodology section ---
  listArea.appendChild(createVeilleListGroup('Subject & Methodology', [
    { icon: 'fa-solid fa-brain',        iconColor: '#7C3AED', text: 'Subject',    detail: VEILLE_METHODOLOGY.subject },
    { icon: 'fa-solid fa-magnifying-glass', iconColor: '#6366F1', text: 'Objective',  detail: VEILLE_METHODOLOGY.description },
    { icon: 'fa-solid fa-clock',         iconColor: '#0891B2', text: 'Frequency',  detail: VEILLE_METHODOLOGY.frequency },
    { icon: 'fa-solid fa-screwdriver-wrench', iconColor: '#059669', text: 'Tools',      detail: VEILLE_METHODOLOGY.tools },
  ]));

  // --- Sources section ---
  listArea.appendChild(createVeilleListGroup('Sources', VEILLE_SOURCES.map(s => ({
    icon: s.icon,
    iconColor: s.iconColor,
    text: s.name,
    detail: s.description,
  }))));

  // --- Syntheses section (accordion) ---
  const synthGroup = document.createElement('div');

  const synthLabel = document.createElement('div');
  synthLabel.textContent = 'Summaries';
  synthLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
  synthGroup.appendChild(synthLabel);

  const synthBox = document.createElement('div');
  synthBox.style.cssText = `
    background: #363636;
    border-radius: 10px;
    overflow: hidden;
  `;

  VEILLE_SYNTHESES.forEach((synth, i) => {
    // Row header (clickable)
    const rowEl = document.createElement('div');
    rowEl.style.cssText = `
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 11px 16px;
      cursor: pointer;
      transition: background 0.15s ease;
      ${i < VEILLE_SYNTHESES.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.06);' : ''}
    `;
    rowEl.addEventListener('mouseenter', () => { rowEl.style.background = 'rgba(255,255,255,0.04)'; });
    rowEl.addEventListener('mouseleave', () => { rowEl.style.background = 'transparent'; });

    const iconEl = document.createElement('div');
    iconEl.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #7C3AED;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    `;
    const iconI = document.createElement('i');
    iconI.className = 'fa-solid fa-file-lines';
    iconI.style.cssText = 'font-size: 14px; color: #FFFFFF;';
    iconEl.appendChild(iconI);

    const textWrap = document.createElement('div');
    textWrap.style.cssText = 'flex: 1; min-width: 0;';

    const textMain = document.createElement('div');
    textMain.textContent = synth.title;
    textMain.style.cssText = 'font-size: 13px; color: #EEEEEE; font-weight: 500; line-height: 1.3;';

    const textSub = document.createElement('div');
    textSub.textContent = synth.summary;
    textSub.style.cssText = 'font-size: 11px; color: #888888; margin-top: 1px; line-height: 1.3;';

    textWrap.appendChild(textMain);
    textWrap.appendChild(textSub);

    // Date badge
    const dateBadge = document.createElement('div');
    dateBadge.textContent = synth.date;
    dateBadge.style.cssText = 'font-size: 11px; color: #A855F7; background: rgba(124, 58, 237, 0.12); padding: 2px 8px; border-radius: 10px; white-space: nowrap; flex-shrink: 0;';

    // Chevron
    const chevron = document.createElement('i');
    chevron.className = 'fa-solid fa-chevron-down';
    chevron.style.cssText = 'font-size: 12px; color: #888888; transition: transform 0.2s ease; flex-shrink: 0;';

    rowEl.appendChild(iconEl);
    rowEl.appendChild(textWrap);
    rowEl.appendChild(dateBadge);
    rowEl.appendChild(chevron);

    // Accordion content (hidden by default)
    const accordionContent = document.createElement('div');
    accordionContent.style.cssText = `
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      background: #2D2D2D;
      ${i < VEILLE_SYNTHESES.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.06);' : ''}
    `;

    const accordionInner = document.createElement('div');
    accordionInner.style.cssText = 'padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;';

    // Source badge
    const sourceLine = document.createElement('div');
    sourceLine.style.cssText = 'font-size: 11px; color: #A855F7; margin-bottom: 4px;';
    const sourceIcon = document.createElement('i');
    sourceIcon.className = 'fa-solid fa-bookmark';
    sourceIcon.style.cssText = 'margin-right: 6px;';
    sourceLine.appendChild(sourceIcon);
    sourceLine.appendChild(document.createTextNode('Source: ' + synth.source));
    accordionInner.appendChild(sourceLine);

    // Analysis paragraphs
    synth.analysis.forEach(para => {
      const p = document.createElement('p');
      p.textContent = para;
      p.style.cssText = 'font-size: 12px; color: #CCCCCC; line-height: 1.6; margin: 0;';
      accordionInner.appendChild(p);
    });

    // External link button
    const linkBtn = document.createElement('a');
    linkBtn.href = synth.link;
    linkBtn.target = '_blank';
    linkBtn.rel = 'noopener noreferrer';
    linkBtn.textContent = 'View source';
    linkBtn.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 6px 14px;
      background: rgba(124, 58, 237, 0.15);
      color: #A855F7;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      align-self: flex-start;
      transition: background 0.15s ease;
    `;
    linkBtn.addEventListener('mouseenter', () => { linkBtn.style.background = 'rgba(124, 58, 237, 0.25)'; });
    linkBtn.addEventListener('mouseleave', () => { linkBtn.style.background = 'rgba(124, 58, 237, 0.15)'; });
    const linkIcon = document.createElement('i');
    linkIcon.className = 'fa-solid fa-arrow-up-right-from-square';
    linkIcon.style.cssText = 'font-size: 10px;';
    linkBtn.prepend(linkIcon);
    accordionInner.appendChild(linkBtn);

    accordionContent.appendChild(accordionInner);

    // Toggle accordion
    let isOpen = false;
    rowEl.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        chevron.style.transform = 'rotate(180deg)';
      } else {
        accordionContent.style.maxHeight = '0';
        chevron.style.transform = 'rotate(0deg)';
      }
    });

    synthBox.appendChild(rowEl);
    synthBox.appendChild(accordionContent);
  });

  synthGroup.appendChild(synthBox);
  listArea.appendChild(synthGroup);

  content.appendChild(identity);
  content.appendChild(listArea);

  veilleWindow.appendChild(topBar);
  veilleWindow.appendChild(content);
  document.body.appendChild(veilleWindow);
}

function openAboutWindow() {
  const newTerminal = document.createElement('div');
  newTerminal.className = 'new-terminal';
  windowZIndex++;
  newTerminal.style.cssText = `
    position: fixed; width: 40%; height: 70%;
    right: 5%; top: 15%;
    background: ${command.colors.background};
    border: 2px solid ${command.colors.border.color};
    border-radius: 8px 8px 2px 2px;
    z-index: ${windowZIndex}; display: flex; flex-direction: column;
  `;
  newTerminal.addEventListener('mousedown', () => bringToFront(newTerminal));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { newTerminal.style.display = 'none'; },
    onMaximize: () => {
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        newTerminal.style.cssText = `position: fixed; width: 40%; height: 70%; right: 5%; top: 15%; background: ${command.colors.background}; border: 2px solid ${command.colors.border.color}; border-radius: 8px 8px 2px 2px; z-index: ${newTerminal.style.zIndex}; display: flex; flex-direction: column;`;
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        newTerminal.style.width = 'calc(100% - 64px)';
        newTerminal.style.height = 'calc(100% - 28px)';
        newTerminal.style.left = '64px';
        newTerminal.style.right = '0';
        newTerminal.style.top = '28px';
        newTerminal.style.transform = 'none';
        newTerminal.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => document.body.removeChild(newTerminal),
  });

  const topBar = createTitleBar('visitor@jalmeida17:$ ~/about', controls);
  makeDraggable(newTerminal, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  const content = document.createElement('div');
  content.style.cssText = `flex: 1; padding: 20px; color: ${command.colors.foreground}; overflow-y: auto; font-family: 'IBM Plex Mono', monospace; font-size: 16px; line-height: 22px;`;

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

let claugerWindow: HTMLDivElement | null = null;

function openClaugerWindow() {
  if (claugerWindow && document.body.contains(claugerWindow)) {
    bringToFront(claugerWindow);
    return;
  }

  claugerWindow = document.createElement('div');
  windowZIndex++;
  claugerWindow.style.cssText = `
    position: fixed;
    width: 750px;
    height: 620px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #2D2D2D;
    border: 1px solid #1A1A1A;
    border-radius: 6px;
    z-index: ${windowZIndex};
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    font-family: 'Ubuntu Sans', sans-serif;
  `;
  claugerWindow.addEventListener('mousedown', () => bringToFront(claugerWindow!));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { if (claugerWindow) claugerWindow.style.display = 'none'; },
    onMaximize: () => {
      if (!claugerWindow) return;
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        claugerWindow.style.width = '750px';
        claugerWindow.style.height = '620px';
        claugerWindow.style.left = '50%';
        claugerWindow.style.top = '50%';
        claugerWindow.style.transform = 'translate(-50%, -50%)';
        claugerWindow.style.borderRadius = '6px';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        claugerWindow.style.width = 'calc(100% - 64px)';
        claugerWindow.style.height = 'calc(100% - 28px)';
        claugerWindow.style.left = '64px';
        claugerWindow.style.top = '28px';
        claugerWindow.style.transform = 'none';
        claugerWindow.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => {
      if (claugerWindow && document.body.contains(claugerWindow)) {
        document.body.removeChild(claugerWindow);
        claugerWindow = null;
      }
    },
  });

  const topBar = createTitleBar('Clauger', controls, '/res/logoclauger.png');
  makeDraggable(claugerWindow, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  // Content area — GNOME "About" style layout
  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    background: #2D2D2D;
  `;

  // === Identity section (centered logo + name + tagline) ===
  const identity = document.createElement('div');
  identity.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 32px 28px;
    gap: 12px;
  `;

  const logoWrap = document.createElement('div');
  logoWrap.style.cssText = `
    width: 96px;
    height: 96px;
    border-radius: 22px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.06);
  `;

  const logoImg = document.createElement('img');
  logoImg.src = '/res/logo-clauger.png';
  logoImg.alt = 'Clauger';
  logoImg.style.cssText = 'width: 68px; height: 68px; object-fit: contain;';
  logoWrap.appendChild(logoImg);

  const idName = document.createElement('div');
  idName.textContent = 'Clauger';
  idName.style.cssText = 'font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;';

  const idTag = document.createElement('div');
  idTag.textContent = 'Industrial Refrigeration & HVAC Solutions';
  idTag.style.cssText = 'font-size: 13px; color: #999999; font-weight: 400;';

  const idBadge = document.createElement('div');
  idBadge.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    padding: 4px 12px;
    background: rgba(41, 143, 221, 0.12);
    border-radius: 20px;
  `;
  const badgeIcon = document.createElement('i');
  badgeIcon.className = 'fa-solid fa-globe';
  badgeIcon.style.cssText = 'font-size: 11px; color: #298FDD;';
  const badgeText = document.createElement('span');
  badgeText.textContent = '20+ countries worldwide';
  badgeText.style.cssText = 'font-size: 12px; color: #298FDD; font-weight: 500;';
  idBadge.appendChild(badgeIcon);
  idBadge.appendChild(badgeText);

  identity.appendChild(logoWrap);
  identity.appendChild(idName);
  identity.appendChild(idTag);
  identity.appendChild(idBadge);

  // === Listbox groups (GNOME Settings style) ===
  const listArea = document.createElement('div');
  listArea.style.cssText = 'padding: 0 28px 28px; display: flex; flex-direction: column; gap: 20px;';

  // Helper: create a GNOME-style listbox group
  function createListGroup(label: string, rows: { icon: string; iconColor: string; text: string; detail: string }[]) {
    const group = document.createElement('div');

    const groupLabel = document.createElement('div');
    groupLabel.textContent = label;
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const box = document.createElement('div');
    box.style.cssText = `
      background: #363636;
      border-radius: 10px;
      overflow: hidden;
    `;

    rows.forEach((row, i) => {
      const rowEl = document.createElement('div');
      rowEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 11px 16px;
        transition: background 0.15s ease;
        ${i < rows.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.06);' : ''}
      `;
      rowEl.addEventListener('mouseenter', () => { rowEl.style.background = 'rgba(255,255,255,0.04)'; });
      rowEl.addEventListener('mouseleave', () => { rowEl.style.background = 'transparent'; });

      const iconEl = document.createElement('div');
      iconEl.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: ${row.iconColor};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      `;
      const iconI = document.createElement('i');
      iconI.className = row.icon;
      iconI.style.cssText = 'font-size: 14px; color: #FFFFFF;';
      iconEl.appendChild(iconI);

      const textWrap = document.createElement('div');
      textWrap.style.cssText = 'flex: 1; min-width: 0;';

      const textMain = document.createElement('div');
      textMain.textContent = row.text;
      textMain.style.cssText = 'font-size: 13px; color: #EEEEEE; font-weight: 500; line-height: 1.3;';

      const textSub = document.createElement('div');
      textSub.textContent = row.detail;
      textSub.style.cssText = 'font-size: 11px; color: #888888; margin-top: 1px; line-height: 1.3;';

      textWrap.appendChild(textMain);
      textWrap.appendChild(textSub);

      rowEl.appendChild(iconEl);
      rowEl.appendChild(textWrap);
      box.appendChild(rowEl);
    });

    group.appendChild(box);
    return group;
  }

  listArea.appendChild(createListGroup('Core Expertise', [
    { icon: 'fa-solid fa-snowflake',       iconColor: '#298FDD', text: 'Industrial Refrigeration',       detail: 'Large-scale cooling systems for industrial facilities' },
    { icon: 'fa-solid fa-warehouse',        iconColor: '#5B7FCC', text: 'Cold Storage',                   detail: 'Temperature-controlled warehousing solutions' },
    { icon: 'fa-solid fa-leaf',             iconColor: '#48A56A', text: 'Energy Efficiency',              detail: 'Sustainable and eco-friendly cooling technologies' },
    { icon: 'fa-solid fa-utensils',         iconColor: '#D4763E', text: 'Food & Beverage Processing',    detail: 'Process refrigeration for production lines' },
  ]));

  listArea.appendChild(createListGroup('Industries', [
    { icon: 'fa-solid fa-industry',         iconColor: '#7C6DAF', text: 'Food Processing & Production',  detail: 'End-to-end cold chain for food manufacturers' },
    { icon: 'fa-solid fa-truck-fast',        iconColor: '#CC6B5B', text: 'Cold Chain Logistics',          detail: 'Transport and distribution refrigeration' },
    { icon: 'fa-solid fa-capsules',          iconColor: '#4CA8A8', text: 'Pharmaceuticals',               detail: 'Precision temperature control for pharma storage' },
    { icon: 'fa-solid fa-flask',             iconColor: '#A0873C', text: 'Chemical Industry',             detail: 'Specialized cooling for chemical processes' },
  ]));

  listArea.appendChild(createListGroup('About', [
    { icon: 'fa-solid fa-location-dot',      iconColor: '#666666', text: 'Headquartered in France',       detail: 'Global operations across Europe, Americas & Asia' },
    { icon: 'fa-solid fa-clock-rotate-left',  iconColor: '#666666', text: 'Decades of Experience',         detail: 'Engineering excellence since the 20th century' },
    { icon: 'fa-solid fa-handshake',          iconColor: '#666666', text: 'My Current Employer',           detail: 'Where I work as a Full Stack Developer' },
  ]));

  content.appendChild(identity);
  content.appendChild(listArea);

  claugerWindow.appendChild(topBar);
  claugerWindow.appendChild(content);
  document.body.appendChild(claugerWindow);
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
        resetMainTerminalGeometry();
        mainEl.style.display = 'none';
        terminalIcon.classList.remove('active');
      }
    }
  });
}

// Main terminal window controls
const minimizeButton = document.getElementById("minimize-window");
const maximizeButton = document.getElementById("maximize-window");
const closeButton = document.getElementById("close-window");
const mainElement = document.getElementById("main");
const barElement = document.getElementById("bar-1");
let isMaximized = false;

// Bring main terminal to front when clicked
if (mainElement) {
  mainElement.addEventListener('mousedown', () => bringToFront(mainElement));
}

// Minimize button functionality
if (minimizeButton && mainElement && terminalIcon) {
  minimizeButton.addEventListener('click', () => {
    mainElement.style.display = 'none';
    terminalIcon.classList.remove('active');
  });
}

function resetMainTerminalGeometry() {
  if (!mainElement || !maximizeButton) return;
  mainElement.style.width = "50%";
  mainElement.style.height = "80%";
  mainElement.style.position = "absolute";
  mainElement.style.left = "50%";
  mainElement.style.top = "50%";
  mainElement.style.transform = "translate(-50%, -50%)";
  mainElement.style.margin = "";
  mainElement.style.marginTop = "";
  mainElement.style.flex = "";
  mainElement.style.borderRadius = "8px 8px 2px 2px";
  maximizeButton.replaceChildren(createSvgIcon('maximize'));
  isMaximized = false;
}

// Close button functionality
if (closeButton && mainElement && terminalIcon) {
  closeButton.addEventListener('click', () => {
    resetMainTerminalGeometry();
    mainElement.style.display = 'none';
    terminalIcon.classList.remove('active');
  });
}

if (maximizeButton && mainElement) {
  maximizeButton.addEventListener("click", () => {
    if (isMaximized) {
      mainElement.style.width = "50%";
      mainElement.style.height = "80%";
      mainElement.style.position = "absolute";
      mainElement.style.left = "50%";
      mainElement.style.top = "50%";
      mainElement.style.transform = "translate(-50%, -50%)";
      mainElement.style.margin = "";
      mainElement.style.marginTop = "";
      mainElement.style.flex = "";
      mainElement.style.borderRadius = "8px 8px 2px 2px";
      maximizeButton.replaceChildren(createSvgIcon('maximize'));
      isMaximized = false;
    } else {
      mainElement.style.width = "calc(100% - 64px)";
      mainElement.style.height = "calc(100% - 28px)";
      mainElement.style.position = "fixed";
      mainElement.style.left = "64px";
      mainElement.style.top = "28px";
      mainElement.style.transform = "none";
      mainElement.style.margin = "";
      mainElement.style.marginTop = "";
      mainElement.style.flex = "";
      mainElement.style.borderRadius = "0";
      maximizeButton.replaceChildren(createSvgIcon('maximize-restore'));
      isMaximized = true;
    }
  });
}

// Double-click on topbar to maximize/restore
if (barElement && mainElement && maximizeButton) {
  barElement.addEventListener("dblclick", () => maximizeButton.click());
}

// Drag via helper
if (barElement && mainElement) {
  makeDraggable(mainElement, barElement, () => isMaximized);
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
    height: 130px;
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

  musicPlayerWindow.addEventListener('mousedown', () => bringToFront(musicPlayerWindow!));

  const musicControls = createWindowControls({
    onClose: () => {
      document.body.removeChild(musicPlayerWindow!);
      musicPlayerWindow = null;
      const icon = document.getElementById('music-player-icon');
      if (icon) icon.classList.remove('active');
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
    },
  });

  const topBar = createTitleBar('Rhythmbox', musicControls, '/res/Rhythmbox_logo_3.4.4.svg.png');
  makeDraggable(musicPlayerWindow, topBar);

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
    btn.innerHTML = `<i class="fa-solid ${icon}" style="color: #FFFFFF;"></i>`;
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
    progress.style.setProperty('--progress-value', `${percent}%`);
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
  input.style.setProperty('--progress-value', `${input.value}%`);
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

// LibreOffice Calc functionality
let calcWindow: HTMLDivElement | null = null;


const excelIcon = document.getElementById('excel-icon');

if (excelIcon) {
  excelIcon.addEventListener('click', () => {
    if (calcWindow && document.body.contains(calcWindow)) {
      if (calcWindow.style.display === 'none') {
        // Restore minimized
        calcWindow.style.display = 'flex';
        excelIcon.classList.add('active');
        bringToFront(calcWindow);
      } else {
        // Close calc window
        document.body.removeChild(calcWindow);
        calcWindow = null;
        excelIcon.classList.remove('active');
      }
    } else {
      // Open calc window
      openCalcWindow();
      excelIcon.classList.add('active');
    }
  });
}

function openCalcWindow() {
  calcWindow = document.createElement('div');
  calcWindow.className = 'calc-window';
  windowZIndex++;
  calcWindow.style.cssText = `
    position: fixed;
    width: 800px;
    height: 600px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(to bottom, #3C3C3C 0%, #2A2A2A 100%);
    border: 1px solid #1A1A1A;
    border-radius: 6px;
    z-index: ${windowZIndex};
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    font-family: 'IBM Plex Mono', monospace;
  `;

  calcWindow.addEventListener('mousedown', () => bringToFront(calcWindow!));

  let isCalcMaximized = false;
  const calcControls = createWindowControls({
    onMinimize: () => {
      if (calcWindow) calcWindow.style.display = 'none';
      excelIcon?.classList.remove('active');
    },
    onMaximize: () => {
      if (!calcWindow) return;
      const maxBtn = calcControls.querySelector('.window-btn-maximize');
      if (isCalcMaximized) {
        calcWindow.style.width = '800px';
        calcWindow.style.height = '600px';
        calcWindow.style.left = '50%';
        calcWindow.style.top = '50%';
        calcWindow.style.transform = 'translate(-50%, -50%)';
        calcWindow.style.borderRadius = '6px';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isCalcMaximized = false;
      } else {
        calcWindow.style.width = 'calc(100% - 64px)';
        calcWindow.style.height = 'calc(100% - 28px)';
        calcWindow.style.left = '64px';
        calcWindow.style.top = '28px';
        calcWindow.style.transform = 'none';
        calcWindow.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isCalcMaximized = true;
      }
    },
    onClose: () => {
      if (calcWindow && document.body.contains(calcWindow)) {
        document.body.removeChild(calcWindow);
        calcWindow = null;
        excelIcon?.classList.remove('active');
      }
    },
  });

  const topBar = createTitleBar('LibreOffice Calc (Read-Only)', calcControls, '/res/excellogo.png');

  // Toolbar with file dropdown
  const toolbar = document.createElement('div');
  toolbar.style.cssText = `
    height: 40px;
    background: #3A3A3A;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 10px;
    border-bottom: 1px solid #1A1A1A;
  `;

  const fileDropdown = document.createElement('select');
  fileDropdown.style.cssText = `
    width: 35%;
    padding: 4px 8px;
    background: #2A2A2A;
    color: #FFFFFF;
    border: 1px solid #1A1A1A;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    outline: none;
    height: 28px;
  `;

  // Prevent dropdown from closing immediately
  fileDropdown.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });

  fileDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select an Excel file...';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.style.cssText = 'background: #2A2A2A; color: #FFFFFF;';
  fileDropdown.appendChild(defaultOption);

  // Fetch Excel files from /excel/ folder
  async function loadExcelFiles() {
    try {
      // Try to fetch a manifest file that lists all Excel files
      const response = await fetch('/excel/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        manifest.files.forEach((fileName: string) => {
          addFileOption(fileName);
        });
      } else {
        // Fallback: try known file names
        await loadFilesWithFallback();
      }
    } catch (error) {
      console.log('Could not load manifest, trying fallback method');
      await loadFilesWithFallback();
    }
  }

  async function loadFilesWithFallback() {
    // Try to fetch each file to see if it exists
    const possibleFiles = [
      'BTS SIO 2025 - E4 - Tableau de synthèse - Joao.xlsx'
    ];

    for (const fileName of possibleFiles) {
      try {
        const response = await fetch(`/excel/${fileName}`, { method: 'HEAD' });
        if (response.ok) {
          addFileOption(fileName);
        }
      } catch (error) {
        // File doesn't exist, skip it
      }
    }
  }

  function addFileOption(fileName: string) {
    const option = document.createElement('option');
    option.value = `/excel/${fileName}`;
    option.textContent = fileName;
    option.style.cssText = 'background: #2A2A2A; color: #FFFFFF;';
    fileDropdown.appendChild(option);
  }

  // Load files when window opens
  loadExcelFiles();

  const openButton = document.createElement('button');
  openButton.textContent = 'Open';
  openButton.style.cssText = `
    padding: 4px 20px;
    background: #4A4A4A;
    color: #FFFFFF;
    border: 1px solid #5A5A5A;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.2s;
    height: 28px;
  `;

  openButton.addEventListener('mouseenter', () => {
    openButton.style.background = '#5A5A5A';
  });

  openButton.addEventListener('mouseleave', () => {
    openButton.style.background = '#4A4A4A';
  });

  // Button click handler - Load and display Excel file
  openButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    const selectedFile = fileDropdown.value;
    if (selectedFile) {
      await loadExcelFile(selectedFile);
    }
  });

  async function loadExcelFile(filePath: string) {
    try {
      content.innerHTML = '<div style="color: #FFFFFF; padding: 20px;">Loading...</div>';

      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();

      // @ts-ignore - XLSX is loaded via CDN
      const workbook = XLSX.read(arrayBuffer, {
        type: 'array',
        cellStyles: true
      });

      // Clear content and change to white background when file is loaded
      content.innerHTML = '';
      content.style.background = '#FFFFFF';

      workbook.SheetNames.forEach((sheetName: string) => {
        const worksheet = workbook.Sheets[sheetName];

        // Convert to HTML table with cell info
        // @ts-ignore
        const htmlTable = XLSX.utils.sheet_to_html(worksheet, {
          header: '',
          editable: false,
          cellHTML: true
        });

        // Table wrapper takes full height - hide scrollbars but keep functionality
        const tableWrapper = document.createElement('div');
        tableWrapper.innerHTML = htmlTable;
        tableWrapper.style.cssText = `
          overflow: auto;
          height: 100%;
          scrollbar-width: none;
          -ms-overflow-style: none;
        `;
        // Hide webkit scrollbars
        const style = document.createElement('style');
        style.textContent = `
          .excel-table-wrapper::-webkit-scrollbar {
            display: none;
          }
        `;
        document.head.appendChild(style);
        tableWrapper.className = 'excel-table-wrapper';

        // Extract cell styles from worksheet and apply them
        const range = worksheet['!ref'];
        if (range) {
          // @ts-ignore
          const decoded = XLSX.utils.decode_range(range);
          for (let R = decoded.s.r; R <= decoded.e.r; ++R) {
            for (let C = decoded.s.c; C <= decoded.e.c; ++C) {
              // @ts-ignore
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              const cell = worksheet[cellAddress];

              if (cell && cell.s && cell.s.fgColor) {
                const color = cell.s.fgColor;
                const rgb = color.rgb || 'FFFFFF';
                const bgColor = `#${rgb}`;

                // Find the corresponding HTML cell
                const table = tableWrapper.querySelector('table');
                if (table && table.rows[R]) {
                  const htmlCell = table.rows[R].cells[C];
                  if (htmlCell) {
                    htmlCell.style.backgroundColor = bgColor;
                  }
                }
              }
            }
          }
        }

        // Style the table
        const table = tableWrapper.querySelector('table');
        if (table) {
          table.style.cssText = `
            border-collapse: collapse;
            background: #FFFFFF;
            color: #000000;
            font-family: 'Ubuntu Sans', sans-serif;
            font-size: 13px;
            width: 100%;
          `;

          // Style cells and preserve background colors
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            const existingBg = htmlCell.style.backgroundColor;

            htmlCell.style.cssText = `
              border: 1px solid #CCCCCC;
              padding: 8px 10px;
              text-align: left;
              ${existingBg ? `background-color: ${existingBg};` : ''}
            `;
          });

          // Style header cells
          const headerCells = table.querySelectorAll('th');
          headerCells.forEach(cell => {
            const htmlCell = cell as HTMLElement;
            if (!htmlCell.style.backgroundColor) {
              htmlCell.style.backgroundColor = '#F0F0F0';
            }
            htmlCell.style.fontWeight = 'bold';
          });
        }

        content.appendChild(tableWrapper);
      });

    } catch (error) {
      content.innerHTML = `<div style="color: #FF6B6B; padding: 20px;">Error loading file: ${error}</div>`;
      console.error('Error loading Excel file:', error);
    }
  }

  // Prevent toolbar from triggering window drag
  openButton.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });

  toolbar.appendChild(fileDropdown);
  toolbar.appendChild(openButton);

  // Main content area - starts dark, turns white when file is loaded
  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    background: #2A2A2A;
    border-radius: 0 0 6px 6px;
    padding: 0;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  `;
  content.className = 'calc-content-area';

  makeDraggable(calcWindow, topBar, () => isCalcMaximized);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = calcControls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  calcWindow.appendChild(topBar);
  calcWindow.appendChild(toolbar);
  calcWindow.appendChild(content);
  document.body.appendChild(calcWindow);
}


// Set wallpaper
document.documentElement.style.backgroundImage = `url('/res/ubuntu2.jpg')`;
document.body.style.backgroundImage = `url('/res/ubuntu2.jpg')`;

// ========== Show Applications Overlay ==========

const APP_GRID_ITEMS = [
  { name: 'Terminal',          icon: '/res/terminal-app.png',              action: 'terminal' },
  { name: 'Rhythmbox',        icon: '/res/Rhythmbox_logo_3.4.4.svg.png', action: 'music' },
  { name: 'LibreOffice Calc', icon: '/res/excellogo.png',                 action: 'calc' },
  { name: 'Clauger',          icon: '/res/logoclauger.png',               action: 'clauger' },
  { name: 'Tech Watch',       icon: '/res/veille-icon.svg',               action: 'veille' },
];

const showApplicationsBtn = document.getElementById('show-applications');
let appGridOverlay: HTMLDivElement | null = null;

function appGridKeyHandler(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeShowApplications();
  }
}

function toggleShowApplications() {
  if (appGridOverlay && document.body.contains(appGridOverlay)) {
    closeShowApplications();
  } else {
    openShowApplications();
  }
}

function openShowApplications() {
  if (appGridOverlay && document.body.contains(appGridOverlay)) return;

  appGridOverlay = document.createElement('div');
  appGridOverlay.id = 'app-grid-overlay';

  // Search bar
  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.className = 'app-grid-search';
  searchBar.placeholder = 'Type to search\u2026';
  searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const items = appGridOverlay?.querySelectorAll('.app-grid-item');
    items?.forEach((item) => {
      const name = item.getAttribute('data-name') || '';
      item.classList.toggle('hidden', !name.toLowerCase().includes(query));
    });
  });

  // Desktop image link
  const desktopLink = document.createElement('img');
  desktopLink.className = 'app-grid-desktop-link';
  desktopLink.src = '/res/ubuntu2.jpg';
  desktopLink.alt = 'Desktop';
  desktopLink.addEventListener('click', () => closeShowApplications());

  // App grid
  const grid = document.createElement('div');
  grid.className = 'app-grid';

  APP_GRID_ITEMS.forEach((app) => {
    const item = document.createElement('div');
    item.className = 'app-grid-item';
    item.setAttribute('data-name', app.name);

    const img = document.createElement('img');
    img.src = app.icon;
    img.alt = app.name;

    const label = document.createElement('span');
    label.textContent = app.name;

    item.appendChild(img);
    item.appendChild(label);

    item.addEventListener('click', () => {
      closeShowApplications();
      executeAppAction(app.action);
    });

    grid.appendChild(item);
  });

  appGridOverlay.appendChild(searchBar);
  appGridOverlay.appendChild(desktopLink);
  appGridOverlay.appendChild(grid);
  document.body.appendChild(appGridOverlay);

  // Fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      appGridOverlay?.classList.add('visible');
      searchBar.focus();
    });
  });

  document.addEventListener('keydown', appGridKeyHandler);
}

function closeShowApplications() {
  if (!appGridOverlay || !document.body.contains(appGridOverlay)) return;

  appGridOverlay.classList.remove('visible');
  document.removeEventListener('keydown', appGridKeyHandler);

  const overlay = appGridOverlay;
  appGridOverlay = null;

  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }, 300);
}

function executeAppAction(action: string) {
  switch (action) {
    case 'terminal': {
      const mainEl = document.getElementById('main');
      if (mainEl) {
        mainEl.style.display = 'flex';
        mainEl.style.flexDirection = 'column';
        terminalIcon?.classList.add('active');
        bringToFront(mainEl);
        USERINPUT.focus();
      }
      break;
    }
    case 'music':
      if (!musicPlayerWindow || !document.body.contains(musicPlayerWindow)) {
        openMusicPlayer();
        musicPlayerIcon?.classList.add('active');
      } else {
        bringToFront(musicPlayerWindow);
      }
      break;
    case 'calc':
      if (!calcWindow || !document.body.contains(calcWindow)) {
        openCalcWindow();
        excelIcon?.classList.add('active');
      } else {
        bringToFront(calcWindow);
      }
      break;
    case 'clauger':
      openClaugerWindow();
      break;
    case 'veille':
      openVeilleWindow();
      break;
    case 'noop':
      break;
  }
}

if (showApplicationsBtn) {
  showApplicationsBtn.addEventListener('click', toggleShowApplications);
}
