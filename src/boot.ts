// Boot sequence - realistic Linux startup simulation

type BootLine = { text: string; delay: number; class?: string };

// Phase 1: BIOS POST (delays from 0)
const BIOS_LINES: BootLine[] = [
  { text: "American Megatrends Inc. UEFI BIOS", delay: 1500, class: "boot-white-bold" },
  { text: "Version 1650  Date: 11/15/2024", delay: 1600 },
  { text: "", delay: 1700 },
  { text: "Initializing Intel Boot Agent GE v1.5.80", delay: 1800 },
  { text: "", delay: 1900 },
  { text: "Intel(R) Core(TM) i7-13700K CPU @ 3.40GHz", delay: 2100, class: "boot-white" },
  { text: "Speed: 3.40 GHz    Count: 24", delay: 2200 },
  { text: "", delay: 2300 },
  { text: "Initializing USB Controllers .. Done.", delay: 2500 },
  { text: "32768 MB OK", delay: 2900, class: "boot-white" },
  { text: "", delay: 3000 },
  { text: "Auto-Detecting AHCI PORT 0 .. SAMSUNG SSD 990 PRO 2TB", delay: 3200 },
  { text: "Auto-Detecting AHCI PORT 1 .. WDC WD20EFRX-68EUZN0", delay: 3400 },
  { text: "Auto-Detecting AHCI PORT 2 .. None", delay: 3500 },
  { text: "Auto-Detecting AHCI PORT 3 .. None", delay: 3550 },
  { text: "", delay: 3600 },
  { text: "USB Device(s): 3 Keyboard, 1 Mouse, 1 Hub", delay: 3800 },
  { text: "", delay: 3900 },
  { text: "Press <DEL> to enter SETUP, <F12> for BBS POPUP", delay: 4000, class: "boot-dim-blink" },
];

// Phase 2: GRUB menu (shown instantly after clear, waits for Enter or 10s)
const GRUB_LINES: BootLine[] = [
  { text: "                    GNU GRUB  version 2.12-1ubuntu7", delay: 100, class: "boot-grub-title" },
  { text: "", delay: 150 },
  { text: " ┌──────────────────────────────────────────────────┐", delay: 200, class: "boot-grub-border" },
  { text: " │ *Ubuntu                                                             │", delay: 250, class: "boot-grub-selected" },
  { text: " │  Advanced options for Ubuntu                                        │", delay: 300, class: "boot-grub-item" },
  { text: " │  Windows Boot Manager (on /dev/sda1)                                │", delay: 350, class: "boot-grub-item" },
  { text: " │  UEFI Firmware Settings                                             │", delay: 400, class: "boot-grub-item" },
  { text: " └──────────────────────────────────────────────────┘", delay: 450, class: "boot-grub-border" },
];

// Phase 3: Post-GRUB (delays relative to 0 = moment GRUB was dismissed)
const POST_GRUB_LINES: BootLine[] = [
  { text: "  Loading Linux 6.8.0-45-generic ...", delay: 50, class: "boot-white" },
  { text: "  Loading initial ramdisk ...", delay: 500, class: "boot-white" },

  // Kernel boot messages
  { text: "\x1b[CLEAR]", delay: 1300 },
  { text: "[    0.000000] Linux version 6.8.0-45-generic (buildd@lcy02-amd64-050) (x86_64-linux-gnu-gcc-13 (Ubuntu 13.2.0-23ubuntu4) 13.2.0, GNU ld (GNU Binutils for Ubuntu) 2.42) #49-Ubuntu SMP PREEMPT_DYNAMIC", delay: 1350, class: "boot-kernel" },
  { text: "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.8.0-45-generic root=/dev/mapper/ubuntu--vg-ubuntu--lv ro quiet splash vt.handoff=7", delay: 1450, class: "boot-kernel" },
  { text: "[    0.000000] BIOS-provided physical RAM map:", delay: 1550, class: "boot-kernel" },
  { text: "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable", delay: 1600, class: "boot-kernel" },
  { text: "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x00000000bffdffff] usable", delay: 1630, class: "boot-kernel" },
  { text: "[    0.000000] BIOS-e820: [mem 0x0000000100000000-0x000000087fffffff] usable", delay: 1660, class: "boot-kernel" },
  { text: "[    0.000000] NX (Execute Disable) protection: active", delay: 1750, class: "boot-kernel" },
  { text: "[    0.000000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved", delay: 1800, class: "boot-kernel" },
  { text: "[    0.000000] e820: remove [mem 0x000a0000-0x000fffff] usable", delay: 1840, class: "boot-kernel" },
  { text: "[    0.000000] last_pfn = 0x880000 max_arch_pfn = 0x400000000", delay: 1880, class: "boot-kernel" },
  { text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'", delay: 1930, class: "boot-kernel" },
  { text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'", delay: 1960, class: "boot-kernel" },
  { text: "[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: 'AVX registers'", delay: 1990, class: "boot-kernel" },
  { text: "[    0.000000] x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256", delay: 2020, class: "boot-kernel" },
  { text: "[    0.000000] x86/fpu: Enabled xstate features 0x7, context size is 832 bytes, using 'compacted' format.", delay: 2060, class: "boot-kernel" },
  { text: "[    0.000000] signal: max sigframe size: 1776", delay: 2100, class: "boot-kernel" },
  { text: "[    0.000000] ACPI: Early table checksum verification disabled", delay: 2150, class: "boot-kernel" },
  { text: "[    0.000000] ACPI: RSDP 0x00000000000F0490 000024 (v02 ALASKA)", delay: 2200, class: "boot-kernel" },
  { text: "[    0.000000] ACPI: XSDT 0x00000000BFFE0100 0000CC (v01 ALASKA A M I    01072009 AMI  00010013)", delay: 2240, class: "boot-kernel" },
  { text: "[    0.000000] ACPI: FACP 0x00000000BFFED000 000114 (v06 ALASKA A M I    01072009 AMI  00010013)", delay: 2280, class: "boot-kernel" },
  { text: "[    0.000000] ACPI: DSDT 0x00000000BFFD0000 01A894 (v02 ALASKA A M I    01072009 INTL 20200717)", delay: 2320, class: "boot-kernel" },
  { text: "[    0.000000] DMI: ASUS ROG STRIX B760-A GAMING WIFI/ROG STRIX B760-A GAMING WIFI, BIOS 1650 11/15/2024", delay: 2370, class: "boot-kernel" },
  { text: "[    0.007891] tsc: Detected 3400.000 MHz processor", delay: 2420, class: "boot-kernel" },
  { text: "[    0.070524] Calibrating delay loop (skipped), value calculated using timer frequency.. 6800.00 BogoMIPS (lpj=13600000)", delay: 2480, class: "boot-kernel" },
  { text: "[    0.070530] pid_max: default: 32768 minimum: 301", delay: 2520, class: "boot-kernel" },
  { text: "[    0.072168] LSM: initializing lsm=lockdown,capability,landlock,yama,apparmor,bpf", delay: 2570, class: "boot-kernel" },
  { text: "[    0.072242] Yama: becoming mindful.", delay: 2610, class: "boot-kernel" },
  { text: "[    0.072452] AppArmor: AppArmor initialized", delay: 2650, class: "boot-kernel" },
  { text: "[    0.074291] Mount-cache hash table entries: 65536", delay: 2700, class: "boot-kernel" },
  { text: "[    0.074824] Mountpoint-cache hash table entries: 65536", delay: 2730, class: "boot-kernel" },
  { text: "[    0.120541] CPU0: Raptor Lake", delay: 2780, class: "boot-kernel" },
  { text: "[    0.120901] Performance Events: PEBS fmt4+-baseline,  AnyThread deprecated, Raptor Lake events, 32-deep LBR, full-width counters, Intel PMU driver.", delay: 2830, class: "boot-kernel" },
  { text: "[    0.142873] rcu: Hierarchical SRCU implementation.", delay: 2880, class: "boot-kernel" },
  { text: "[    0.156213] smp: Bringing up secondary CPUs ...", delay: 2930, class: "boot-kernel" },
  { text: "[    0.210482] smp: Brought up 1 node, 24 CPUs", delay: 3000, class: "boot-kernel" },
  { text: "[    0.340881] NET: Registered PF_INET protocol family", delay: 3060, class: "boot-kernel" },
  { text: "[    0.348721] NET: Registered PF_INET6 protocol family", delay: 3110, class: "boot-kernel" },
  { text: "[    0.452003] PCI: Using configuration type 1 for base access", delay: 3170, class: "boot-kernel" },
  { text: "[    0.580441] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x310aa66b996, max_idle_ns: 881590748630 ns", delay: 3230, class: "boot-kernel" },
  { text: "[    0.703821] Freeing initrd memory: 96712K", delay: 3300, class: "boot-kernel" },
  { text: "[    0.892401] EXT4-fs (dm-0): mounted filesystem 78bd8f23-1a5e with ordered data mode. Quota mode: none.", delay: 3360, class: "boot-kernel" },
  { text: "[    0.892621] VFS: Mounted root (ext4 filesystem) readonly on device 252:0.", delay: 3420, class: "boot-kernel" },
  { text: "[    1.003521] systemd[1]: Detected architecture x86-64.", delay: 3480, class: "boot-kernel" },
  { text: "[    1.004102] systemd[1]: Hostname set to <jalmeida17>.", delay: 3540, class: "boot-kernel" },
  { text: "[    1.052441] systemd[1]: Queued start job for default target graphical.target.", delay: 3600, class: "boot-kernel" },

  // systemd services
  { text: "\x1b[CLEAR]", delay: 4300 },
  { text: "         Starting systemd-journald.service - Journal Service...", delay: 4400, class: "boot-service" },
  { text: "[  OK  ] Started systemd-journald.service - Journal Service.", delay: 4700, class: "boot-ok" },
  { text: "[  OK  ] Started systemd-udevd.service - Rule-based Manager for Device Events and Files.", delay: 4900, class: "boot-ok" },
  { text: "         Mounting /boot/efi...", delay: 5050, class: "boot-service" },
  { text: "[  OK  ] Mounted /boot/efi.", delay: 5300, class: "boot-ok" },
  { text: "         Starting systemd-tmpfiles-setup.service - Create Volatile Files and Directories...", delay: 5450, class: "boot-service" },
  { text: "[  OK  ] Started systemd-tmpfiles-setup.service - Create Volatile Files and Directories.", delay: 5700, class: "boot-ok" },
  { text: "[  OK  ] Reached target local-fs.target - Local File Systems.", delay: 5900, class: "boot-ok" },
  { text: "[  OK  ] Reached target sysinit.target - System Initialization.", delay: 6100, class: "boot-ok" },
  { text: "         Starting NetworkManager.service - Network Manager...", delay: 6250, class: "boot-service" },
  { text: "[  OK  ] Started NetworkManager.service - Network Manager.", delay: 6550, class: "boot-ok" },
  { text: "[  OK  ] Reached target network.target - Network.", delay: 6750, class: "boot-ok" },
  { text: "[  OK  ] Reached target network-online.target - Network is Online.", delay: 6900, class: "boot-ok" },
  { text: "         Starting containerd.service - containerd container runtime...", delay: 7050, class: "boot-service" },
  { text: "[  OK  ] Started containerd.service - containerd container runtime.", delay: 7300, class: "boot-ok" },
  { text: "[  OK  ] Started accounts-daemon.service - Accounts Service.", delay: 7500, class: "boot-ok" },
  { text: "[  OK  ] Started power-profiles-daemon.service - Power Profiles daemon.", delay: 7650, class: "boot-ok" },
  { text: "[  OK  ] Started thermald.service - Thermal Daemon Service.", delay: 7800, class: "boot-ok" },
  { text: "[  OK  ] Started udisks2.service - Disk Manager.", delay: 7950, class: "boot-ok" },
  { text: "[  OK  ] Started ModemManager.service - Modem Manager.", delay: 8100, class: "boot-ok" },
  { text: "[  OK  ] Started polkit.service - Authorization Manager.", delay: 8250, class: "boot-ok" },
  { text: "[  OK  ] Started avahi-daemon.service - Avahi mDNS/DNS-SD Stack.", delay: 8400, class: "boot-ok" },
  { text: "[  OK  ] Started cups.service - CUPS Scheduler.", delay: 8550, class: "boot-ok" },
  { text: "[  OK  ] Started bluetooth.service - Bluetooth service.", delay: 8700, class: "boot-ok" },
  { text: "         Starting gdm.service - GNOME Display Manager...", delay: 8850, class: "boot-service" },
  { text: "[  OK  ] Started gdm.service - GNOME Display Manager.", delay: 9200, class: "boot-ok" },
  { text: "[  OK  ] Reached target multi-user.target - Multi-User System.", delay: 9400, class: "boot-ok" },
  { text: "[  OK  ] Reached target graphical.target - Graphical Interface.", delay: 9600, class: "boot-ok" },
  { text: "         Starting ubuntu-portfolio.service - Loading JoaoShell v1.1...", delay: 9800, class: "boot-service" },
  { text: "[  OK  ] Started ubuntu-portfolio.service - JoaoShell Desktop ready.", delay: 10200, class: "boot-ok" },
];

let bootAudio: HTMLAudioElement | null = null;

function playBootSound(): void {
  try {
    bootAudio = new Audio("/res/sounds/hdd_boot.mp3");
    bootAudio.volume = 0.7;
    bootAudio.loop = true;
    bootAudio.play().catch(() => {});
  } catch {}
}

function playBiosBeep(): void {
  try {
    const beep = new Audio("/res/sounds/bios_beep.mp3");
    beep.volume = 0.8;
    beep.currentTime = 0.9;
    beep.play().catch(() => {});
  } catch {}
}

function stopBootSound(): void {
  if (bootAudio) {
    const fadeOut = setInterval(() => {
      if (bootAudio && bootAudio.volume > 0.05) {
        bootAudio.volume = Math.max(0, bootAudio.volume - 0.05);
      } else {
        clearInterval(fadeOut);
        if (bootAudio) {
          bootAudio.pause();
          bootAudio.currentTime = 0;
          bootAudio = null;
        }
      }
    }, 50);
  }
}

function renderLine(output: HTMLElement, text: string, cls?: string): void {
  if (text === "\x1b[CLEAR]") {
    output.innerHTML = "";
    return;
  }

  const line = document.createElement("div");
  line.className = "boot-line";
  if (cls) line.classList.add(cls);

  if (text.startsWith("[  OK  ]")) {
    const okSpan = document.createElement("span");
    okSpan.className = "boot-ok-badge";
    okSpan.textContent = "[  OK  ]";
    const rest = document.createTextNode(text.substring(8));
    line.appendChild(okSpan);
    line.appendChild(rest);
  } else {
    line.textContent = text;
  }

  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function scheduleLines(output: HTMLElement, lines: BootLine[]): void {
  lines.forEach(({ text, delay, class: cls }) => {
    setTimeout(() => renderLine(output, text, cls), delay);
  });
}

function waitForGrub(output: HTMLElement): Promise<void> {
  return new Promise((grubResolve) => {
    // Show GRUB menu
    output.innerHTML = "";
    scheduleLines(output, GRUB_LINES);

    let resolved = false;
    const dismiss = () => {
      if (resolved) return;
      resolved = true;
      window.removeEventListener("keydown", onKey);
      output.innerHTML = "";
      grubResolve();
    };

    // Auto-boot after 10 seconds
    const autoTimer = setTimeout(dismiss, 10000);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(autoTimer);
        dismiss();
      }
    };

    window.addEventListener("keydown", onKey);
  });
}

function showLoginScreen(overlay: HTMLElement): Promise<void> {
  return new Promise((loginResolve) => {
    // Show the real topbar during login (like Ubuntu GDM)
    const topbar = document.getElementById("desktop-topbar");
    if (topbar) {
      topbar.style.visibility = "visible";
      topbar.style.zIndex = "100000";
      topbar.style.background = "#3B3B3B";
      topbar.style.boxShadow = "none";
    }

    // Start the clock (main.ts hasn't initialized yet)
    const clockEl = document.getElementById("desktop-clock");
    const updateClock = () => {
      if (!clockEl) return;
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = now.getDate();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${day} ${months[now.getMonth()]} ${hours}:${minutes}`;
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Build the login screen inside the existing overlay
    const login = document.createElement("div");
    login.className = "login-screen";

    // User card (avatar + name in a clickable rectangle)
    const card = document.createElement("div");
    card.className = "login-card";

    const avatar = document.createElement("img");
    avatar.className = "login-avatar";
    avatar.src = "/res/profile.png";
    avatar.alt = "Profile";

    const name = document.createElement("div");
    name.className = "login-name";
    name.textContent = "jalmeida17";

    card.appendChild(avatar);
    card.appendChild(name);

    // Ubuntu logo at bottom
    const logo = document.createElement("img");
    logo.className = "login-logo";
    logo.src = "/res/Ubuntu-logo-2022.svg.png";
    logo.alt = "Ubuntu";

    // "Not listed?" link
    const notListed = document.createElement("div");
    notListed.className = "login-not-listed";
    notListed.textContent = "Not listed?";

    login.appendChild(card);
    login.appendChild(notListed);
    login.appendChild(logo);
    overlay.appendChild(login);

    // Fade in the login screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        login.style.opacity = "1";
      });
    });

    card.addEventListener("click", () => {
      clearInterval(clockInterval);
      // Reset topbar to its normal style
      if (topbar) {
        topbar.style.background = "";
        topbar.style.boxShadow = "";
      }
      loginResolve();
    });
  });
}

function startBoot(overlay: HTMLElement, output: HTMLElement, resolve: () => void): void {
  const desktopElements = document.querySelectorAll<HTMLElement>(
    "#desktop-topbar, #sidebar-dock, #main, #version-info, #desktop-context-menu"
  );
  desktopElements.forEach((el) => (el.style.visibility = "hidden"));

  // Play BIOS beep - user has interacted so audio is unlocked
  playBiosBeep();

  // Phase 1: BIOS
  scheduleLines(output, BIOS_LINES);

  // Phase 2: GRUB (waits for Enter or 10s)
  setTimeout(async () => {
    await waitForGrub(output);

    // Phase 3: Post-GRUB (Loading, kernel, systemd)
    playBootSound();
    scheduleLines(output, POST_GRUB_LINES);

    // Get last line delay to know when boot text finishes
    const lastDelay = POST_GRUB_LINES[POST_GRUB_LINES.length - 1].delay;

    // Phase 4: Login screen
    setTimeout(async () => {
      stopBootSound();
      output.innerHTML = "";
      overlay.style.background = "#3B3B3B";

      await showLoginScreen(overlay);

      // Reset topbar z-index and reveal desktop
      const topbar = document.getElementById("desktop-topbar");
      if (topbar) topbar.style.zIndex = "";
      desktopElements.forEach((el) => (el.style.visibility = "visible"));
      overlay.classList.add("boot-fade-out");

      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 1000);
    }, lastDelay + 600);
  }, 5200);
}

export function runBootSequence(): Promise<void> {
  return new Promise((resolve) => {
    const overlay = document.getElementById("boot-screen");
    const output = document.getElementById("boot-output");
    if (!overlay || !output) {
      resolve();
      return;
    }

    // Hide desktop elements during boot
    const desktopElements = document.querySelectorAll<HTMLElement>(
      "#desktop-topbar, #sidebar-dock, #main, #version-info, #desktop-context-menu"
    );
    desktopElements.forEach((el) => (el.style.visibility = "hidden"));

    // Show "press any key" prompt - needed to unlock browser audio
    const prompt = document.createElement("div");
    prompt.className = "boot-line boot-dim-blink";
    prompt.style.position = "absolute";
    prompt.style.top = "50%";
    prompt.style.left = "50%";
    prompt.style.transform = "translate(-50%, -50%)";
    prompt.style.fontSize = "22px";
    prompt.textContent = "Press any key to power on...";
    overlay.appendChild(prompt);

    const handler = (e: Event) => {
      e.preventDefault();
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
      prompt.remove();
      startBoot(overlay, output, resolve);
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
  });
}
