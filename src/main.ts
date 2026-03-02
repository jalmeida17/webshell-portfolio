import command from '../config.json' assert {type: 'json'};
import { createHelp } from "./commands/help";
import { createBanner } from "./commands/banner";
import { createAbout } from "./commands/about"
import { createDefault } from "./commands/default";
import { PROJECT_DETAILS, ProjectData } from "./commands/projects";
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
      openProjectsWindow();
      break;
    case 'career':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      openResumeWindow('career');
      break;
    case 'education':
      if(bareMode) {
        writeLines(["Nothing to see here.", "<br>"])
        break;
      }
      openResumeWindow('education');
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

// ═══════ SKILLS APP ═══════
let skillsWindow: HTMLDivElement | null = null;

function openSkillsWindow() {
  if (skillsWindow && document.body.contains(skillsWindow)) {
    bringToFront(skillsWindow);
    return;
  }

  skillsWindow = document.createElement('div');
  windowZIndex++;
  skillsWindow.style.cssText = `
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
  skillsWindow.addEventListener('mousedown', () => bringToFront(skillsWindow!));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { if (skillsWindow) skillsWindow.style.display = 'none'; },
    onMaximize: () => {
      if (!skillsWindow) return;
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        skillsWindow.style.width = '800px';
        skillsWindow.style.height = '700px';
        skillsWindow.style.left = '50%';
        skillsWindow.style.top = '50%';
        skillsWindow.style.transform = 'translate(-50%, -50%)';
        skillsWindow.style.borderRadius = '6px';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        skillsWindow.style.width = 'calc(100% - 64px)';
        skillsWindow.style.height = 'calc(100% - 28px)';
        skillsWindow.style.left = '64px';
        skillsWindow.style.top = '28px';
        skillsWindow.style.transform = 'none';
        skillsWindow.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => {
      if (skillsWindow && document.body.contains(skillsWindow)) {
        document.body.removeChild(skillsWindow);
        skillsWindow = null;
      }
    },
  });

  const topBar = createTitleBar('Skills', controls);
  makeDraggable(skillsWindow, topBar, () => isWinMax);
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
    background: linear-gradient(135deg, #D97706, #F59E0B);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.06);
  `;
  const skillsIconEl = document.createElement('i');
  skillsIconEl.className = 'fa-solid fa-star';
  skillsIconEl.style.cssText = 'font-size: 42px; color: #FFFFFF;';
  iconWrap.appendChild(skillsIconEl);

  const idName = document.createElement('div');
  idName.textContent = 'Skills';
  idName.style.cssText = 'font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;';

  const idTag = document.createElement('div');
  idTag.textContent = 'Technical & Soft Skills';
  idTag.style.cssText = 'font-size: 13px; color: #999999; font-weight: 400;';

  identity.appendChild(iconWrap);
  identity.appendChild(idName);
  identity.appendChild(idTag);

  // === List area ===
  const listArea = document.createElement('div');
  listArea.style.cssText = 'padding: 0 28px 28px; display: flex; flex-direction: column; gap: 20px;';

  // Helper: GNOME-style listbox group with pill badges
  function createSkillGroup(label: string, rows: { icon: string; iconColor: string; text: string; detail: string }[]) {
    const group = document.createElement('div');
    const groupLabel = document.createElement('div');
    groupLabel.textContent = label;
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const box = document.createElement('div');
    box.style.cssText = 'background: #363636; border-radius: 10px; overflow: hidden;';

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
        width: 32px; height: 32px; border-radius: 8px;
        background: ${row.iconColor};
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
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

  // Helper: progress bar row
  function createLangGroup(label: string, langs: { flag: string; name: string; pct: number }[]) {
    const group = document.createElement('div');
    const groupLabel = document.createElement('div');
    groupLabel.textContent = label;
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const box = document.createElement('div');
    box.style.cssText = 'background: #363636; border-radius: 10px; overflow: hidden;';

    langs.forEach((lang, i) => {
      const rowEl = document.createElement('div');
      rowEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 11px 16px;
        transition: background 0.15s ease;
        ${i < langs.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.06);' : ''}
      `;
      rowEl.addEventListener('mouseenter', () => { rowEl.style.background = 'rgba(255,255,255,0.04)'; });
      rowEl.addEventListener('mouseleave', () => { rowEl.style.background = 'transparent'; });

      const flag = document.createElement('div');
      flag.textContent = lang.flag;
      flag.style.cssText = 'font-size: 22px; flex-shrink: 0; width: 32px; text-align: center;';

      const textWrap = document.createElement('div');
      textWrap.style.cssText = 'flex: 1; min-width: 0;';

      const nameRow = document.createElement('div');
      nameRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;';
      const nameText = document.createElement('div');
      nameText.textContent = lang.name;
      nameText.style.cssText = 'font-size: 13px; color: #EEEEEE; font-weight: 500;';
      const pctText = document.createElement('div');
      pctText.textContent = lang.pct + '%';
      pctText.style.cssText = 'font-size: 11px; color: #F59E0B; font-weight: 600;';
      nameRow.appendChild(nameText);
      nameRow.appendChild(pctText);

      const barBg = document.createElement('div');
      barBg.style.cssText = 'height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden;';
      const barFill = document.createElement('div');
      barFill.style.cssText = `height: 100%; width: ${lang.pct}%; background: linear-gradient(90deg, #D97706, #F59E0B); border-radius: 2px; transition: width 0.6s ease;`;
      barBg.appendChild(barFill);

      textWrap.appendChild(nameRow);
      textWrap.appendChild(barBg);

      rowEl.appendChild(flag);
      rowEl.appendChild(textWrap);
      box.appendChild(rowEl);
    });

    group.appendChild(box);
    return group;
  }

  // --- Programming Languages ---
  listArea.appendChild(createSkillGroup('Programming Languages', [
    { icon: 'fa-brands fa-js', iconColor: '#F7DF1E', text: 'JavaScript', detail: 'ES6+, DOM, async/await' },
    { icon: 'fa-brands fa-js', iconColor: '#3178C6', text: 'TypeScript', detail: 'Typed JavaScript' },
    { icon: 'fa-solid fa-hashtag', iconColor: '#512BD4', text: 'C#', detail: '.NET ecosystem' },
    { icon: 'fa-brands fa-python', iconColor: '#3776AB', text: 'Python', detail: 'Scripting & automation' },
    { icon: 'fa-brands fa-html5', iconColor: '#E34F26', text: 'HTML5', detail: 'Semantic markup' },
    { icon: 'fa-brands fa-css3-alt', iconColor: '#1572B6', text: 'CSS3', detail: 'Styling & animations' },
  ]));

  // --- Frameworks & Libraries ---
  listArea.appendChild(createSkillGroup('Frameworks & Libraries', [
    { icon: 'fa-brands fa-react', iconColor: '#61DAFB', text: 'React.js', detail: 'Component-based UI' },
    { icon: 'fa-brands fa-react', iconColor: '#000000', text: 'Next.js', detail: 'React framework' },
    { icon: 'fa-brands fa-angular', iconColor: '#DD0031', text: 'Angular', detail: 'Enterprise frontend' },
    { icon: 'fa-brands fa-node-js', iconColor: '#339933', text: 'Node.js', detail: 'Server-side JS' },
    { icon: 'fa-solid fa-code', iconColor: '#512BD4', text: '.NET / ASP.NET', detail: 'Backend framework' },
    { icon: 'fa-solid fa-layer-group', iconColor: '#DD0031', text: 'PrimeNG', detail: 'Angular UI library' },
    { icon: 'fa-solid fa-database', iconColor: '#3ECF8E', text: 'Supabase', detail: 'Backend as a service' },
  ]));

  // --- Databases ---
  listArea.appendChild(createSkillGroup('Databases', [
    { icon: 'fa-solid fa-database', iconColor: '#003545', text: 'MariaDB', detail: 'Relational database' },
    { icon: 'fa-solid fa-leaf', iconColor: '#47A248', text: 'MongoDB', detail: 'NoSQL document store' },
    { icon: 'fa-solid fa-database', iconColor: '#336791', text: 'SQL', detail: 'Query language' },
  ]));

  // --- Cloud & DevOps ---
  listArea.appendChild(createSkillGroup('Cloud & DevOps', [
    { icon: 'fa-brands fa-git-alt', iconColor: '#F05032', text: 'Git', detail: 'Version control' },
    { icon: 'fa-brands fa-github', iconColor: '#6E40C9', text: 'GitHub', detail: 'Code hosting & CI' },
    { icon: 'fa-brands fa-aws', iconColor: '#FF9900', text: 'AWS', detail: 'Cloud services' },
    { icon: 'fa-brands fa-microsoft', iconColor: '#0078D4', text: 'Azure', detail: 'Microsoft cloud' },
    { icon: 'fa-solid fa-bolt', iconColor: '#0066FF', text: 'Power Automate', detail: 'Workflow automation' },
    { icon: 'fa-brands fa-windows', iconColor: '#0078D4', text: 'Power BI', detail: 'Data visualization' },
    { icon: 'fa-solid fa-infinity', iconColor: '#0891B2', text: 'DevOps', detail: 'CI/CD pipelines' },
    { icon: 'fa-solid fa-cloud', iconColor: '#000000', text: 'Vercel', detail: 'Deployment platform' },
  ]));

  // --- Other Tools ---
  listArea.appendChild(createSkillGroup('Other Tools & Technologies', [
    { icon: 'fa-brands fa-google', iconColor: '#4285F4', text: 'Google Workspace', detail: 'Docs, Sheets, Drive' },
    { icon: 'fa-solid fa-robot', iconColor: '#7C3AED', text: 'Generative AI', detail: 'LLMs, prompt engineering' },
    { icon: 'fa-solid fa-film', iconColor: '#DC2626', text: 'Video Editing', detail: 'Content production' },
    { icon: 'fa-brands fa-youtube', iconColor: '#FF0000', text: 'Content Creation', detail: 'YouTube, social media' },
    { icon: 'fa-solid fa-laptop', iconColor: '#6B7280', text: 'Hardware', detail: 'PC building & repair' },
    { icon: 'fa-solid fa-microchip', iconColor: '#059669', text: 'BIOS', detail: 'Firmware configuration' },
    { icon: 'fa-solid fa-palette', iconColor: '#00C4CC', text: 'Canva', detail: 'Graphic design' },
  ]));

  // --- Separator ---
  const sep = document.createElement('div');
  sep.style.cssText = 'height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0;';
  listArea.appendChild(sep);

  // --- Soft Skills ---
  listArea.appendChild(createSkillGroup('Soft Skills', [
    { icon: 'fa-solid fa-users', iconColor: '#0891B2', text: 'Team Working', detail: 'Collaborative mindset' },
    { icon: 'fa-solid fa-medal', iconColor: '#D97706', text: 'Disciplined', detail: 'Consistent & focused' },
    { icon: 'fa-solid fa-clock', iconColor: '#7C3AED', text: 'Patient', detail: 'Methodical approach' },
    { icon: 'fa-solid fa-smile', iconColor: '#059669', text: 'Easygoing', detail: 'Friendly & approachable' },
  ]));

  // --- Separator ---
  const sep2 = document.createElement('div');
  sep2.style.cssText = 'height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0;';
  listArea.appendChild(sep2);

  // --- Languages ---
  listArea.appendChild(createLangGroup('Languages', [
    { flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'English', pct: 95 },
    { flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'French', pct: 90 },
    { flag: '\uD83C\uDDF5\uD83C\uDDF9', name: 'Portuguese', pct: 85 },
    { flag: '\uD83C\uDDEA\uD83C\uDDF8', name: 'Spanish', pct: 70 },
  ]));

  content.appendChild(identity);
  content.appendChild(listArea);

  skillsWindow.appendChild(topBar);
  skillsWindow.appendChild(content);
  document.body.appendChild(skillsWindow);
}

// ═══════ PROJECTS APP ═══════
let projectsWindow: HTMLDivElement | null = null;

let projectImageManifest: Record<string, string[]> = {};

async function loadProjectImageManifest() {
  try {
    const res = await fetch('/res/projects/manifest.json');
    if (res.ok) projectImageManifest = await res.json();
  } catch { /* no manifest yet */ }
}

function openProjectsWindow(targetProjectId?: string) {
  if (projectsWindow && document.body.contains(projectsWindow)) {
    bringToFront(projectsWindow);
    return;
  }

  // Load manifest in background, re-render current project when ready
  loadProjectImageManifest().then(() => {
    if (activeProjectForRerender) renderProjectDetail(activeProjectForRerender);
  });

  projectsWindow = document.createElement('div');
  windowZIndex++;
  projectsWindow.style.cssText = `
    position: fixed;
    width: 950px;
    height: 720px;
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
  projectsWindow.addEventListener('mousedown', () => bringToFront(projectsWindow!));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { if (projectsWindow) projectsWindow.style.display = 'none'; },
    onMaximize: () => {
      if (!projectsWindow) return;
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        projectsWindow.style.width = '950px';
        projectsWindow.style.height = '720px';
        projectsWindow.style.left = '50%';
        projectsWindow.style.top = '50%';
        projectsWindow.style.transform = 'translate(-50%, -50%)';
        projectsWindow.style.borderRadius = '6px';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        projectsWindow.style.width = 'calc(100% - 64px)';
        projectsWindow.style.height = 'calc(100% - 28px)';
        projectsWindow.style.left = '64px';
        projectsWindow.style.top = '28px';
        projectsWindow.style.transform = 'none';
        projectsWindow.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => {
      if (projectsWindow && document.body.contains(projectsWindow)) {
        document.body.removeChild(projectsWindow);
        projectsWindow = null;
      }
    },
  });

  const topBar = createTitleBar('Projects', controls);
  makeDraggable(projectsWindow, topBar, () => isWinMax);
  topBar.addEventListener('dblclick', () => {
    const maxBtn = controls.querySelector('.window-btn-maximize') as HTMLElement;
    if (maxBtn) maxBtn.click();
  });

  // === Layout: sidebar + detail ===
  const layout = document.createElement('div');
  layout.style.cssText = 'flex: 1; display: flex; overflow: hidden;';

  // --- Sidebar ---
  const sidebar = document.createElement('div');
  sidebar.style.cssText = `
    width: 240px;
    min-width: 240px;
    background: #262626;
    border-right: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 12px 0;
  `;

  const sidebarButtons: HTMLDivElement[] = [];

  PROJECT_DETAILS.forEach((project) => {
    const btn = document.createElement('div');
    btn.setAttribute('data-project-id', project.id);
    btn.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.15s ease;
      border-left: 3px solid transparent;
    `;
    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('active-project')) btn.style.background = 'rgba(255,255,255,0.04)';
    });
    btn.addEventListener('mouseleave', () => {
      if (!btn.classList.contains('active-project')) btn.style.background = 'transparent';
    });

    const dot = document.createElement('div');
    const dotColor = project.status === 'CLAUGER' ? '#0891B2' : project.status === 'Unfinished' ? '#D97706' : '#10B981';
    dot.style.cssText = `width: 8px; height: 8px; border-radius: 50%; background: ${dotColor}; flex-shrink: 0;`;

    const textWrap = document.createElement('div');
    textWrap.style.cssText = 'flex: 1; min-width: 0;';
    const nameEl = document.createElement('div');
    nameEl.textContent = project.title;
    nameEl.style.cssText = 'font-size: 12px; color: #EEEEEE; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
    const yearEl = document.createElement('div');
    yearEl.textContent = project.year + (project.status ? ' \u00B7 ' + project.status : '');
    yearEl.style.cssText = 'font-size: 10px; color: #888888; margin-top: 1px;';
    textWrap.appendChild(nameEl);
    textWrap.appendChild(yearEl);

    btn.appendChild(dot);
    btn.appendChild(textWrap);
    sidebar.appendChild(btn);
    sidebarButtons.push(btn);

    btn.addEventListener('click', () => {
      renderProjectDetail(project);
      setActiveSidebarButton(btn);
    });
  });

  function setActiveSidebarButton(activeBtn: HTMLDivElement) {
    sidebarButtons.forEach(b => {
      b.classList.remove('active-project');
      b.style.background = 'transparent';
      b.style.borderLeftColor = 'transparent';
    });
    activeBtn.classList.add('active-project');
    activeBtn.style.background = 'rgba(16, 185, 129, 0.08)';
    activeBtn.style.borderLeftColor = '#10B981';
  }

  // --- Detail panel ---
  const detail = document.createElement('div');
  detail.style.cssText = `
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    background: #2D2D2D;
  `;

  // Helper: GNOME list group
  function createProjListGroup(label: string, rows: { icon: string; iconColor: string; text: string; detail: string }[]) {
    const group = document.createElement('div');
    const groupLabel = document.createElement('div');
    groupLabel.textContent = label;
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const box = document.createElement('div');
    box.style.cssText = 'background: #363636; border-radius: 10px; overflow: hidden;';

    rows.forEach((row, i) => {
      const rowEl = document.createElement('div');
      rowEl.style.cssText = `
        display: flex; align-items: flex-start; gap: 14px; padding: 11px 16px;
        transition: background 0.15s ease;
        ${i < rows.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.06);' : ''}
      `;
      rowEl.addEventListener('mouseenter', () => { rowEl.style.background = 'rgba(255,255,255,0.04)'; });
      rowEl.addEventListener('mouseleave', () => { rowEl.style.background = 'transparent'; });

      const iconEl = document.createElement('div');
      iconEl.style.cssText = `
        width: 32px; height: 32px; border-radius: 8px; margin-top: 2px;
        background: ${row.iconColor};
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
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
      textSub.style.cssText = 'font-size: 11px; color: #888888; margin-top: 2px; line-height: 1.5;';
      textWrap.appendChild(textMain);
      textWrap.appendChild(textSub);

      rowEl.appendChild(iconEl);
      rowEl.appendChild(textWrap);
      box.appendChild(rowEl);
    });

    group.appendChild(box);
    return group;
  }

  // Helper: text block group
  function createTextGroup(label: string, paragraphs: string[]) {
    const group = document.createElement('div');
    const groupLabel = document.createElement('div');
    groupLabel.textContent = label;
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const box = document.createElement('div');
    box.style.cssText = 'background: #363636; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 8px;';

    paragraphs.forEach(p => {
      const pEl = document.createElement('p');
      pEl.textContent = p;
      pEl.style.cssText = 'font-size: 12px; color: #CCCCCC; line-height: 1.6; margin: 0;';
      box.appendChild(pEl);
    });

    group.appendChild(box);
    return group;
  }

  // Helper: lightbox overlay
  function openLightbox(allSrcs: string[], startIndex: number) {
    let currentIdx = startIndex;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-out;
    `;

    const img = document.createElement('img');
    img.src = allSrcs[currentIdx];
    img.style.cssText = 'max-width: 90%; max-height: 85%; border-radius: 8px; box-shadow: 0 8px 40px rgba(0,0,0,0.6); object-fit: contain; cursor: default;';
    img.addEventListener('click', (e) => e.stopPropagation());

    // Counter
    const counter = document.createElement('div');
    counter.style.cssText = 'position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 13px; color: #BBBBBB; font-family: "Ubuntu Sans", sans-serif;';

    function updateCounter() {
      counter.textContent = (currentIdx + 1) + ' / ' + allSrcs.length;
    }
    updateCounter();

    function navigate(dir: number) {
      currentIdx = (currentIdx + dir + allSrcs.length) % allSrcs.length;
      img.src = allSrcs[currentIdx];
      updateCounter();
    }

    // Nav buttons
    function makeNavBtn(icon: string, side: 'left' | 'right') {
      const btn = document.createElement('div');
      btn.style.cssText = `
        position: absolute; ${side}: 16px; top: 50%; transform: translateY(-50%);
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(255,255,255,0.1); color: #FFFFFF;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 18px; transition: background 0.15s ease;
      `;
      btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(255,255,255,0.2)'; });
      btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(255,255,255,0.1)'; });
      const i = document.createElement('i');
      i.className = icon;
      btn.appendChild(i);
      btn.addEventListener('click', (e) => { e.stopPropagation(); navigate(side === 'left' ? -1 : 1); });
      return btn;
    }

    // Close button
    const closeBtn = document.createElement('div');
    closeBtn.style.cssText = `
      position: absolute; top: 16px; right: 16px;
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.1); color: #FFFFFF;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 16px; transition: background 0.15s ease;
    `;
    closeBtn.addEventListener('mouseenter', () => { closeBtn.style.background = 'rgba(255,255,255,0.2)'; });
    closeBtn.addEventListener('mouseleave', () => { closeBtn.style.background = 'rgba(255,255,255,0.1)'; });
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeBtn.appendChild(closeIcon);

    function closeLightbox() {
      document.removeEventListener('keydown', keyHandler);
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }

    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    overlay.addEventListener('click', closeLightbox);

    function keyHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') navigate(-1);
      else if (e.key === 'ArrowRight') navigate(1);
    }
    document.addEventListener('keydown', keyHandler);

    overlay.appendChild(img);
    overlay.appendChild(counter);
    overlay.appendChild(closeBtn);
    if (allSrcs.length > 1) {
      overlay.appendChild(makeNavBtn('fa-solid fa-chevron-left', 'left'));
      overlay.appendChild(makeNavBtn('fa-solid fa-chevron-right', 'right'));
    }
    document.body.appendChild(overlay);
  }

  // Helper: image gallery
  function createImageGallery(projectId: string, images: string[]) {
    const group = document.createElement('div');
    const groupLabel = document.createElement('div');
    groupLabel.textContent = 'Screenshots';
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px;';

    const allSrcs = images.map(img => '/res/projects/' + projectId + '/' + img);

    images.forEach((img, idx) => {
      const imgWrap = document.createElement('div');
      imgWrap.style.cssText = 'border-radius: 8px; overflow: hidden; background: #1A1A1A; aspect-ratio: 16/10; cursor: pointer; transition: transform 0.2s ease;';
      imgWrap.addEventListener('mouseenter', () => { imgWrap.style.transform = 'scale(1.02)'; });
      imgWrap.addEventListener('mouseleave', () => { imgWrap.style.transform = 'scale(1)'; });

      const imgEl = document.createElement('img');
      imgEl.src = allSrcs[idx];
      imgEl.alt = img;
      imgEl.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      imgEl.onerror = () => { imgWrap.style.display = 'none'; };

      imgWrap.addEventListener('click', () => openLightbox(allSrcs, idx));

      imgWrap.appendChild(imgEl);
      grid.appendChild(imgWrap);
    });

    group.appendChild(grid);
    return group;
  }

  let activeProjectForRerender: ProjectData | null = null;

  function renderProjectDetail(project: ProjectData) {
    activeProjectForRerender = project;
    while (detail.firstChild) detail.removeChild(detail.firstChild);

    const area = document.createElement('div');
    area.style.cssText = 'padding: 28px; display: flex; flex-direction: column; gap: 20px;';

    // --- Header ---
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    const titleRow = document.createElement('div');
    titleRow.style.cssText = 'display: flex; align-items: center; gap: 12px; flex-wrap: wrap;';
    const titleEl = document.createElement('div');
    titleEl.textContent = project.title;
    titleEl.style.cssText = 'font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;';
    titleRow.appendChild(titleEl);

    if (project.status) {
      const badge = document.createElement('span');
      badge.textContent = project.status;
      const bColor = project.status === 'CLAUGER' ? '#0891B2' : '#D97706';
      badge.style.cssText = `font-size: 11px; font-weight: 600; color: ${bColor}; background: ${bColor}1A; padding: 3px 10px; border-radius: 12px;`;
      titleRow.appendChild(badge);
    }
    header.appendChild(titleRow);

    const yearEl = document.createElement('div');
    yearEl.textContent = project.year;
    yearEl.style.cssText = 'font-size: 13px; color: #888888;';
    header.appendChild(yearEl);

    area.appendChild(header);

    // --- Description ---
    area.appendChild(createTextGroup('Description', project.fullDescription));

    // --- Images (from manifest) ---
    const manifestImages = projectImageManifest[project.id] || [];
    if (manifestImages.length > 0) {
      area.appendChild(createImageGallery(project.id, manifestImages));
    }

    // --- Context (E4/E5) ---
    if (project.context) {
      area.appendChild(createProjListGroup('Organizational Context', [
        { icon: 'fa-solid fa-building', iconColor: '#0891B2', text: project.context.organization, detail: project.context.organizationDesc },
        { icon: 'fa-solid fa-user', iconColor: '#7C3AED', text: project.context.role, detail: 'Team: ' + project.context.teamSize },
        { icon: 'fa-solid fa-calendar', iconColor: '#6366F1', text: 'Duration: ' + project.context.duration, detail: '' },
      ]));
    }

    // --- Business Need ---
    if (project.businessNeed) {
      area.appendChild(createTextGroup('Business Need', [project.businessNeed]));
    }

    // --- Approach ---
    if (project.approach && project.approach.length > 0) {
      area.appendChild(createTextGroup('Approach & Methodology', project.approach));
    }

    // --- Tech Choices ---
    if (project.techChoices && project.techChoices.length > 0) {
      area.appendChild(createProjListGroup('Technical Choices (Justified)', project.techChoices.map(t => ({
        icon: t.icon,
        iconColor: t.iconColor,
        text: t.name,
        detail: t.justification,
      }))));
    }

    // --- Architecture ---
    if (project.architecture) {
      area.appendChild(createTextGroup('Architecture', [project.architecture]));
    }

    // --- Achievements ---
    if (project.achievements.length > 0) {
      const achRows = project.achievements.map(a => ({
        icon: 'fa-solid fa-check',
        iconColor: '#10B981',
        text: a.replace(/^[•\s]+/, ''),
        detail: '',
      }));
      area.appendChild(createProjListGroup('Key Achievements', achRows));
    }

    // --- Results ---
    if (project.results && project.results.length > 0) {
      area.appendChild(createTextGroup('Results & Impact', project.results));
    }

    // --- Competencies (BTS Blocs) ---
    if (project.competencies && project.competencies.length > 0) {
      project.competencies.forEach(comp => {
        const skillRows = comp.skills.map(s => ({
          icon: 'fa-solid fa-graduation-cap',
          iconColor: comp.color,
          text: s,
          detail: '',
        }));
        area.appendChild(createProjListGroup(comp.bloc, skillRows));
      });
    }

    // --- Repository ---
    if (project.repository && project.repository.length > 0) {
      const repoGroup = document.createElement('div');
      const repoLabel = document.createElement('div');
      repoLabel.textContent = 'Links';
      repoLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
      repoGroup.appendChild(repoLabel);

      const repoBox = document.createElement('div');
      repoBox.style.cssText = 'background: #363636; border-radius: 10px; overflow: hidden;';

      project.repository.forEach((repoHtml, i) => {
        const rowEl = document.createElement('div');
        rowEl.style.cssText = `
          display: flex; align-items: center; gap: 14px; padding: 11px 16px;
          transition: background 0.15s ease;
          ${i < project.repository.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.06);' : ''}
        `;
        rowEl.addEventListener('mouseenter', () => { rowEl.style.background = 'rgba(255,255,255,0.04)'; });
        rowEl.addEventListener('mouseleave', () => { rowEl.style.background = 'transparent'; });

        const iconEl = document.createElement('div');
        iconEl.style.cssText = 'width: 32px; height: 32px; border-radius: 8px; background: #6E40C9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;';
        const iconI = document.createElement('i');
        iconI.className = 'fa-solid fa-link';
        iconI.style.cssText = 'font-size: 14px; color: #FFFFFF;';
        iconEl.appendChild(iconI);

        // Extract href and text from the HTML string safely
        const tempAnchor = document.createElement('div');
        tempAnchor.textContent = '';
        const linkEl = document.createElement('a');
        const hrefMatch = repoHtml.match(/href='([^']+)'/);
        const textMatch = repoHtml.match(/>([^<]+)</);
        if (hrefMatch) linkEl.href = hrefMatch[1];
        if (textMatch) linkEl.textContent = textMatch[1];
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
        linkEl.style.cssText = 'font-size: 12px; color: #10B981; text-decoration: none; transition: opacity 0.2s;';
        linkEl.addEventListener('mouseenter', () => { linkEl.style.opacity = '0.7'; });
        linkEl.addEventListener('mouseleave', () => { linkEl.style.opacity = '1'; });

        rowEl.appendChild(iconEl);
        rowEl.appendChild(linkEl);
        repoBox.appendChild(rowEl);
      });

      repoGroup.appendChild(repoBox);
      area.appendChild(repoGroup);
    }

    detail.appendChild(area);
  }

  // Default: show first project or target
  const initialProject = targetProjectId
    ? PROJECT_DETAILS.find(p => p.id === targetProjectId) || PROJECT_DETAILS[0]
    : PROJECT_DETAILS[0];
  renderProjectDetail(initialProject);

  const initialBtn = sidebarButtons.find(b => b.getAttribute('data-project-id') === initialProject.id);
  if (initialBtn) setActiveSidebarButton(initialBtn);

  layout.appendChild(sidebar);
  layout.appendChild(detail);

  projectsWindow.appendChild(topBar);
  projectsWindow.appendChild(layout);
  document.body.appendChild(projectsWindow);
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

// ═══════ RESUME APP (Career + Education) ═══════
let resumeWindow: HTMLDivElement | null = null;

function openResumeWindow(tab: 'career' | 'education' = 'career') {
  if (resumeWindow && document.body.contains(resumeWindow)) {
    bringToFront(resumeWindow);
    return;
  }

  resumeWindow = document.createElement('div');
  windowZIndex++;
  resumeWindow.style.cssText = `
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
  resumeWindow.addEventListener('mousedown', () => bringToFront(resumeWindow!));

  let isWinMax = false;
  const controls = createWindowControls({
    onMinimize: () => { if (resumeWindow) resumeWindow.style.display = 'none'; },
    onMaximize: () => {
      if (!resumeWindow) return;
      const maxBtn = controls.querySelector('.window-btn-maximize');
      if (isWinMax) {
        resumeWindow.style.width = '800px';
        resumeWindow.style.height = '700px';
        resumeWindow.style.left = '50%';
        resumeWindow.style.top = '50%';
        resumeWindow.style.transform = 'translate(-50%, -50%)';
        resumeWindow.style.borderRadius = '6px';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize')); }
        isWinMax = false;
      } else {
        resumeWindow.style.width = 'calc(100% - 64px)';
        resumeWindow.style.height = 'calc(100% - 28px)';
        resumeWindow.style.left = '64px';
        resumeWindow.style.top = '28px';
        resumeWindow.style.transform = 'none';
        resumeWindow.style.borderRadius = '0';
        if (maxBtn) { maxBtn.replaceChildren(createSvgIcon('maximize-restore')); }
        isWinMax = true;
      }
    },
    onClose: () => {
      if (resumeWindow && document.body.contains(resumeWindow)) {
        document.body.removeChild(resumeWindow);
        resumeWindow = null;
      }
    },
  });

  const topBar = createTitleBar('Resume', controls);
  makeDraggable(resumeWindow, topBar, () => isWinMax);
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
    background: linear-gradient(135deg, #0891B2, #06B6D4);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.06);
  `;
  const resumeIconEl = document.createElement('i');
  resumeIconEl.className = 'fa-solid fa-file-lines';
  resumeIconEl.style.cssText = 'font-size: 42px; color: #FFFFFF;';
  iconWrap.appendChild(resumeIconEl);

  const idName = document.createElement('div');
  idName.textContent = 'Resume';
  idName.style.cssText = 'font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;';

  const idTag = document.createElement('div');
  idTag.textContent = 'Career & Education';
  idTag.style.cssText = 'font-size: 13px; color: #999999; font-weight: 400;';

  const idBadge = document.createElement('div');
  idBadge.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    padding: 4px 12px;
    background: rgba(8, 145, 178, 0.12);
    border-radius: 20px;
  `;
  const rBadgeIcon = document.createElement('i');
  rBadgeIcon.className = 'fa-solid fa-location-dot';
  rBadgeIcon.style.cssText = 'font-size: 11px; color: #06B6D4;';
  const rBadgeText = document.createElement('span');
  rBadgeText.textContent = 'Lyon, France';
  rBadgeText.style.cssText = 'font-size: 12px; color: #06B6D4; font-weight: 500;';
  idBadge.appendChild(rBadgeIcon);
  idBadge.appendChild(rBadgeText);

  identity.appendChild(iconWrap);
  identity.appendChild(idName);
  identity.appendChild(idTag);
  identity.appendChild(idBadge);

  // === Tabs ===
  const tabBar = document.createElement('div');
  tabBar.style.cssText = `
    display: flex;
    gap: 0;
    margin: 0 28px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  `;

  const careerTab = document.createElement('button');
  careerTab.textContent = 'Career';
  careerTab.style.cssText = `
    flex: 1;
    padding: 10px 0;
    background: none;
    border: none;
    border-bottom: 2px solid #06B6D4;
    color: #06B6D4;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
  `;

  const educationTab = document.createElement('button');
  educationTab.textContent = 'Education';
  educationTab.style.cssText = `
    flex: 1;
    padding: 10px 0;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #888888;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
  `;

  tabBar.appendChild(careerTab);
  tabBar.appendChild(educationTab);

  // === List area ===
  const listArea = document.createElement('div');
  listArea.style.cssText = 'padding: 20px 28px 28px; display: flex; flex-direction: column; gap: 20px;';

  // Helper: create GNOME-style listbox group
  function createResumeListGroup(label: string, rows: { icon: string; iconColor: string; text: string; detail: string }[]) {
    const group = document.createElement('div');
    const groupLabel = document.createElement('div');
    groupLabel.textContent = label;
    groupLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; padding-left: 4px;';
    group.appendChild(groupLabel);

    const box = document.createElement('div');
    box.style.cssText = 'background: #363636; border-radius: 10px; overflow: hidden;';

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
        width: 32px; height: 32px; border-radius: 8px;
        background: ${row.iconColor};
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
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

  function clearListArea() {
    while (listArea.firstChild) {
      listArea.removeChild(listArea.firstChild);
    }
  }

  // --- Career content ---
  function renderCareerContent() {
    clearListArea();

    listArea.appendChild(createResumeListGroup('Position', [
      { icon: 'fa-solid fa-briefcase', iconColor: '#0891B2', text: 'Full Stack Developer - Internship', detail: 'CLAUGER' },
      { icon: 'fa-solid fa-calendar', iconColor: '#6366F1', text: 'August 2024 - Present', detail: 'Brignais, Auvergne-Rh\u00f4ne-Alpes, France' },
    ]));

    listArea.appendChild(createResumeListGroup('Description', [
      { icon: 'fa-solid fa-circle-info', iconColor: '#7C3AED', text: 'Fullstack Developer at Clauger', detail: 'Focused on developing and maintaining web applications using modern technologies.' },
    ]));

    listArea.appendChild(createResumeListGroup('Projects', [
      { icon: 'fa-solid fa-truck', iconColor: '#059669', text: 'Internal Transport App', detail: 'Development of a internal web application for merchandise transport.' },
      { icon: 'fa-solid fa-shield-halved', iconColor: '#DC2626', text: 'Cyber Security Platform', detail: 'Currently building a cyber security education platform.' },
      { icon: 'fa-solid fa-gears', iconColor: '#D97706', text: 'Automation', detail: 'Automation of data processing tasks.' },
      { icon: 'fa-solid fa-ellipsis', iconColor: '#6B7280', text: 'And More', detail: 'And many other little projects...' },
    ]));

    listArea.appendChild(createResumeListGroup('Technologies', [
      { icon: 'fa-brands fa-angular', iconColor: '#DD0031', text: 'Angular', detail: 'Frontend framework' },
      { icon: 'fa-solid fa-code', iconColor: '#512BD4', text: '.NET / C#', detail: 'Backend framework' },
      { icon: 'fa-solid fa-database', iconColor: '#003545', text: 'MariaDB / SQL', detail: 'Database management' },
      { icon: 'fa-solid fa-infinity', iconColor: '#0078D4', text: 'DevOps & Azure', detail: 'CI/CD, cloud infrastructure' },
      { icon: 'fa-solid fa-bolt', iconColor: '#0066FF', text: 'Power Automate & Power BI', detail: 'Microsoft Power Platform' },
      { icon: 'fa-brands fa-git-alt', iconColor: '#F05032', text: 'Git', detail: 'Version control' },
    ]));
  }

  // --- Education content ---
  function renderEducationContent() {
    clearListArea();

    listArea.appendChild(createResumeListGroup('BTS SIO - SLAM', [
      { icon: 'fa-solid fa-graduation-cap', iconColor: '#0891B2', text: 'NEXA DIGITAL SCHOOL', detail: '2024 - 2026' },
      { icon: 'fa-solid fa-location-dot', iconColor: '#6366F1', text: 'Lyon, Auvergne-Rh\u00f4ne-Alpes, France', detail: 'Two-year technical degree in IT \u2014 Software Solutions and Business Applications' },
    ]));

    listArea.appendChild(createResumeListGroup('Description', [
      { icon: 'fa-solid fa-circle-info', iconColor: '#7C3AED', text: 'SLAM Specialization', detail: 'Gained solid experience in software development, databases, web technologies, and project management, with a strong focus on practical, real-world applications.' },
    ]));

    listArea.appendChild(createResumeListGroup('Achievements', [
      { icon: 'fa-solid fa-globe', iconColor: '#059669', text: 'Full-Stack Bill Manager', detail: 'Developed a full-stack bill manager web application.' },
      { icon: 'fa-solid fa-desktop', iconColor: '#7C3AED', text: 'Winforms Prescription App', detail: 'Developed a winforms application to manage medical prescriptions.' },
      { icon: 'fa-solid fa-dumbbell', iconColor: '#DC2626', text: 'Gym Social Network', detail: 'Currently building a gym social network platform.' },
      { icon: 'fa-solid fa-ellipsis', iconColor: '#6B7280', text: 'And More', detail: 'And other less important school projects...' },
    ]));

    listArea.appendChild(createResumeListGroup('Key Courses', [
      { icon: 'fa-brands fa-react', iconColor: '#61DAFB', text: 'React', detail: 'Frontend library' },
      { icon: 'fa-brands fa-node-js', iconColor: '#339933', text: 'Node.js', detail: 'Backend runtime' },
      { icon: 'fa-brands fa-aws', iconColor: '#FF9900', text: 'AWS & MongoDB', detail: 'Cloud & NoSQL' },
      { icon: 'fa-solid fa-shield-halved', iconColor: '#DC2626', text: 'Cybersecurity', detail: 'Security fundamentals' },
      { icon: 'fa-solid fa-diagram-project', iconColor: '#0891B2', text: 'Software Project Management', detail: 'Agile methodologies' },
    ]));

    // Separator
    const sep = document.createElement('div');
    sep.style.cssText = 'height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0;';
    listArea.appendChild(sep);

    listArea.appendChild(createResumeListGroup('BAC G\u00e9n\u00e9ral - NSI & AMC (European Section)', [
      { icon: 'fa-solid fa-graduation-cap', iconColor: '#0891B2', text: 'Lyc\u00e9e Polyvalent Aragon Picasso', detail: '2023 - 2024' },
      { icon: 'fa-solid fa-location-dot', iconColor: '#6366F1', text: 'Givors, Auvergne-Rh\u00f4ne-Alpes, France', detail: 'General Baccalaur\u00e9at with focus on Computer Science (NSI) and Global English Studies (AMC)' },
    ]));

    listArea.appendChild(createResumeListGroup('Achievements', [
      { icon: 'fa-solid fa-language', iconColor: '#059669', text: 'Self-Taught Languages', detail: 'Mostly self-taught in English and Spanish.' },
      { icon: 'fa-solid fa-globe', iconColor: '#0078D4', text: 'European Section', detail: 'Improved technical English skills through the European section.' },
      { icon: 'fa-solid fa-users', iconColor: '#7C3AED', text: 'Team Projects', detail: 'Active participation in school team coding projects.' },
    ]));

    listArea.appendChild(createResumeListGroup('Key Courses', [
      { icon: 'fa-solid fa-code', iconColor: '#0891B2', text: 'Programming Fundamentals', detail: 'Core programming concepts' },
      { icon: 'fa-solid fa-cube', iconColor: '#7C3AED', text: 'Object-Oriented Programming', detail: 'OOP paradigms' },
      { icon: 'fa-solid fa-database', iconColor: '#003545', text: 'Databases Intro', detail: 'SQL fundamentals' },
      { icon: 'fa-solid fa-network-wired', iconColor: '#6366F1', text: 'Networks Introduction', detail: 'Networking basics' },
      { icon: 'fa-solid fa-book', iconColor: '#D97706', text: 'English History & Culture', detail: 'European section coursework' },
    ]));
  }

  // Tab switching
  careerTab.addEventListener('click', () => {
    careerTab.style.borderBottomColor = '#06B6D4';
    careerTab.style.color = '#06B6D4';
    educationTab.style.borderBottomColor = 'transparent';
    educationTab.style.color = '#888888';
    renderCareerContent();
  });

  educationTab.addEventListener('click', () => {
    educationTab.style.borderBottomColor = '#06B6D4';
    educationTab.style.color = '#06B6D4';
    careerTab.style.borderBottomColor = 'transparent';
    careerTab.style.color = '#888888';
    renderEducationContent();
  });

  // Default: show selected tab
  if (tab === 'education') {
    educationTab.style.borderBottomColor = '#06B6D4';
    educationTab.style.color = '#06B6D4';
    careerTab.style.borderBottomColor = 'transparent';
    careerTab.style.color = '#888888';
    renderEducationContent();
  } else {
    renderCareerContent();
  }

  content.appendChild(identity);
  content.appendChild(tabBar);
  content.appendChild(listArea);

  resumeWindow.appendChild(topBar);
  resumeWindow.appendChild(content);
  document.body.appendChild(resumeWindow);
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
  { name: 'Resume',           icon: '/res/resume-icon.svg',               action: 'resume' },
  { name: 'Skills',           icon: '/res/skills-icon.svg',               action: 'skills' },
  { name: 'Projects',         icon: '/res/projects-icon.svg',             action: 'projects' },
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
    case 'resume':
      openResumeWindow();
      break;
    case 'skills':
      openSkillsWindow();
      break;
    case 'projects':
      openProjectsWindow();
      break;
    case 'noop':
      break;
  }
}

if (showApplicationsBtn) {
  showApplicationsBtn.addEventListener('click', toggleShowApplications);
}
