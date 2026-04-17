const fallbackImageFiles = [
  "NOC-555bce.png",
  "NOC-1975.png",
  "NOC-1965.png",
  "NOC-1555.png",
  "NOC-1755.png",
  "NOC-555.png",
  "NOC-1055.png",
  "NOC-1915.png",
  "NOC-2005.png",
  "NOC-1,000,055 BCE.png",
  "NOC-2012.PNG",
  "NOC-2025.png",
  "NOC-5000055bce.png",
  "NOC-1935.png",
  "NOC-1855.png",
  "NOC-1895.png",
  "NOC-200,000,055 bce.png",
  "NOC-105.png",
  "NOC-1925.png",
  "NOC-1995.png",
  "NOC-1955.png",
  "NOC-1945.png",
  "NOC-1985.png",
];

const root = document.documentElement;
const image = document.querySelector("#nocImage");
const yearLabel = document.querySelector("#yearLabel");
const eraBand = document.querySelector("#eraBand");
const eraTitle = document.querySelector("#eraTitle");
const frameIndex = document.querySelector("#frameIndex");
const rangeSummary = document.querySelector("#rangeSummary");
const snapshotCount = document.querySelector("#snapshotCount");
const minLabel = document.querySelector("#minLabel");
const maxLabel = document.querySelector("#maxLabel");
const jumpLabel = document.querySelector("#jumpLabel");
const slider = document.querySelector("#timelineSlider");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const playButton = document.querySelector("#playButton");
const timelineButtons = document.querySelector("#timelineButtons");
const dossierTitle = document.querySelector("#dossierTitle");
const descriptionText = document.querySelector("#descriptionText");
const toolingText = document.querySelector("#toolingText");
const alertingText = document.querySelector("#alertingText");
const escalationText = document.querySelector("#escalationText");
const moodText = document.querySelector("#moodText");

let currentIndex = 0;
let autoplayId = 0;
let timeline = [];

function formatDisplayYear(entry) {
  const plainYear = String(entry.year);
  const groupedYear = entry.year.toLocaleString("en-US");

  if (entry.era === "BCE") {
    return `${groupedYear} BC`;
  }

  if (entry.year < 1000) {
    return `${plainYear} AD`;
  }

  return plainYear;
}

function buildTimeline(files) {
  return files
    .map((file) => {
      const rawLabel = file.replace(/^NOC-/i, "").replace(/\.[^.]+$/, "");
      const era = /bce/i.test(rawLabel) ? "BCE" : "CE";
      const year = Number.parseInt(rawLabel.replace(/bce/gi, "").replace(/[^0-9]/g, ""), 10);

      return {
        file,
        era,
        year,
        sortYear: era === "BCE" ? -year : year,
        label: formatDisplayYear({ era, year }),
        shortLabel: formatDisplayYear({ era, year }),
        slug: `${year.toLocaleString("en-US").replace(/,/g, "")}-${era.toLowerCase()}`,
      };
    })
    .filter((entry) => !(entry.era === "BCE" && entry.year === 1000055))
    .sort((left, right) => right.sortYear - left.sortYear);
}

const IMAGE_CACHE = new Set();

function formatDistance(years) {
  return `${years.toLocaleString("en-US")} ${years === 1 ? "year" : "years"}`;
}

function getEraTheme(entry) {
  if (entry.era === "BCE" && entry.year >= 10000000) {
    return {
      accent: "#c7ff8d",
      accentStrong: "#6dd35f",
      bgTop: "#152012",
      bgBottom: "#060c08",
      shadowGlow: "rgba(109, 211, 95, 0.28)",
      accentSoft: "rgba(135, 214, 120, 0.14)",
    };
  }

  if (entry.era === "BCE") {
    return {
      accent: "#f6bf78",
      accentStrong: "#d97f32",
      bgTop: "#2e1b0f",
      bgBottom: "#0d0806",
      shadowGlow: "rgba(217, 127, 50, 0.28)",
      accentSoft: "rgba(246, 191, 120, 0.12)",
    };
  }

  if (entry.year <= 1200) {
    return {
      accent: "#efd199",
      accentStrong: "#c5944d",
      bgTop: "#2b2213",
      bgBottom: "#090704",
      shadowGlow: "rgba(197, 148, 77, 0.26)",
      accentSoft: "rgba(239, 209, 153, 0.12)",
    };
  }

  if (entry.year <= 1915) {
    return {
      accent: "#ffbf87",
      accentStrong: "#dd6f47",
      bgTop: "#2b1713",
      bgBottom: "#0b0607",
      shadowGlow: "rgba(221, 111, 71, 0.28)",
      accentSoft: "rgba(255, 191, 135, 0.12)",
    };
  }

  if (entry.year <= 1985) {
    return {
      accent: "#9af4bf",
      accentStrong: "#39b56f",
      bgTop: "#0f2219",
      bgBottom: "#050a08",
      shadowGlow: "rgba(57, 181, 111, 0.28)",
      accentSoft: "rgba(154, 244, 191, 0.14)",
    };
  }

  return {
    accent: "#72d3ff",
    accentStrong: "#20a6ff",
    bgTop: "#0d1726",
    bgBottom: "#050a12",
    shadowGlow: "rgba(32, 166, 255, 0.24)",
    accentSoft: "rgba(114, 211, 255, 0.14)",
  };
}

function getEraDossier(entry) {
  if (entry.era === "BCE" && entry.year >= 100000000) {
    return {
      band: "Primeval Monitoring",
      title: "The cave-wall observability stack",
      summary: "Long before dashboards, operators still wanted a room with a wall full of status marks and a clear view of incoming trouble.",
      description:
        "This is the oldest snapshot in the archive, when network operations was basically environmental awareness plus suspicious scratches in a cave. The uptime target was simple: survive the shift and maybe document the weird footprints.",
      tooling: "Rock etchings, geodes, and a very interpretive floor map",
      alerting: "Heavy stomping from the east tunnel",
      escalation: "Everyone silently agrees to move farther inside the cave",
      mood: "Calm until the velociraptor dashboard updates itself",
    };
  }

  if (entry.era === "BCE" && entry.year >= 1000000) {
    return {
      band: "Stone Age Telemetry",
      title: "Torch-lit proto-operations",
      summary: "The runbook has evolved from panic into symbols, which counts as process maturity if you squint.",
      description:
        "Here the NOC is still prehistoric, but not entirely improvisational. People are cataloging signals, tracking movement, and inventing the first postmortem tradition: pointing at a wall and nodding like the outage makes total sense now.",
      tooling: "Charcoal markers, polished bone pointers, and cave acoustics",
      alerting: "Mammoth traffic spikes and mysteriously nervous birds",
      escalation: "Call in the person with the best memory of last season",
      mood: "Operationally scrappy, spiritually committed",
    };
  }

  if (entry.era === "BCE") {
    return {
      band: "Classical Signal Room",
      title: "Philosophy meets incident response",
      summary: "The network is still hypothetical, but the operators already insist on maps, diagrams, and impressive brass instruments.",
      description:
        "By 555 BCE the NOC has become scholarly. There are charts on the wall, elegant devices on the desk, and at least one operator who will absolutely explain that the outage is metaphysically interesting.",
      tooling: "Armillary spheres, annotated maps, and candle-powered focus",
      alerting: "Wax-tablet updates delivered with dramatic concern",
      escalation: "Consult the smartest person in the room and call it a framework",
      mood: "Learned, intense, and a little smug about geometry",
    };
  }

  if (entry.year <= 500) {
    return {
      band: "Imperial Cartography Desk",
      title: "Operations by empire-sized wall chart",
      summary: "Packets are theoretical, but the operators already know the joy of a giant regional overview and a single alarming hotspot.",
      description:
        "The early Common Era NOC turns monitoring into administration. Everything is mapped, indexed, and carefully watched, mostly so somebody can say the issue is definitely in another province.",
      tooling: "Parchment maps, sand timers, and broad jurisdiction",
      alerting: "Courier arrivals with uncomfortable urgency",
      escalation: "Send a second courier to verify the first courier",
      mood: "Disciplined, territorial, and suspicious of latency",
    };
  }

  if (entry.year <= 1200) {
    return {
      band: "Monastic Uptime Lab",
      title: "Scholarly operations in the scriptorium",
      summary: "Observability is now a craft: careful notes, precise instruments, and a workbench that doubles as theology.",
      description:
        "In the medieval timeline, the NOC becomes quieter and more methodical. Signals are studied with patience, outages are copied into ledgers, and every escalation feels like a small ceremony of ink, light, and concern.",
      tooling: "Globes, compasses, vellum logs, and steady hands",
      alerting: "Bell towers and whispered warnings over candlelight",
      escalation: "Hand the matter to the monk with the neatest handwriting",
      mood: "Measured, dutiful, and fueled by long attention spans",
    };
  }

  if (entry.year <= 1700) {
    return {
      band: "Instrument Age Control Room",
      title: "Navigation, measurement, and rising expectations",
      summary: "The NOC starts looking more like a laboratory, which means operators can now misread very sophisticated equipment.",
      description:
        "By the early modern period, network ops has embraced instruments, cabinetry, and the kind of precision that makes every tiny deviation feel personal. Things are getting empirical and slightly theatrical.",
      tooling: "Brass instruments, survey charts, and precision tables",
      alerting: "Clockwork ticks falling out of rhythm",
      escalation: "Blame calibration first, then reality",
      mood: "Curious, exacting, and one notch from a breakthrough",
    };
  }

  if (entry.year <= 1895) {
    return {
      band: "Steam Relay Room",
      title: "Industrial monitoring with soot in the air",
      summary: "The room fills with gauges, pipes, switches, and the special confidence of people who trust pressure valves more than vibes.",
      description:
        "This era gives the NOC a mechanical heartbeat. There are more readouts, more operators, and a thrilling possibility that the infrastructure may literally hiss when it is unhappy.",
      tooling: "Gauge walls, relay panels, and mechanical indicators",
      alerting: "Whistles, pressure swings, and frantic clipboards",
      escalation: "Turn the largest wheel first and take notes afterward",
      mood: "Purposeful, loud, and slightly under-ventilated",
    };
  }

  if (entry.year <= 1935) {
    return {
      band: "Switchboard Modernity",
      title: "The disciplined early command floor",
      summary: "Monitoring is now organized enough to look official, which is dangerous because everyone starts believing the process will save them.",
      description:
        "At the turn of the twentieth century the NOC becomes a serious room with serious furniture and serious posture. Data flows faster, hierarchy sharpens, and the operators have absolutely developed opinions about proper cable management.",
      tooling: "Switchboards, paper logs, and sharply dressed authority",
      alerting: "Buzzers, desk lamps, and escalating handwriting",
      escalation: "Notify the supervisor with the cleanest clipboard",
      mood: "Orderly, alert, and allergic to improvisation",
    };
  }

  if (entry.year <= 1965) {
    return {
      band: "Mainframe Dawn",
      title: "Electronic vigilance enters the room",
      summary: "Now the NOC has real machines, glowing consoles, and a growing suspicion that the machines have personalities.",
      description:
        "Mid-century operations brings electronics into the center of attention. The room is brighter, the interfaces are stranger, and every successful recovery feels like a negotiation with blinking hardware.",
      tooling: "Console lights, tape systems, and authoritative binders",
      alerting: "Alarms, indicator lamps, and ominous printer output",
      escalation: "Summon the person who understands this specific cabinet",
      mood: "Focused, technical, and ready to trust the green light",
    };
  }

  if (entry.year <= 1985) {
    return {
      band: "Console Boom Era",
      title: "The wall-of-screens phase begins",
      summary: "The modern NOC silhouette finally appears: terminals, rolling chairs, and a room that feels one coffee away from destiny.",
      description:
        "By the seventies and eighties, the joke lands immediately because the control-room archetype is fully here. Operators are glued to monitors, charts are everywhere, and incident response now includes elaborate pointing.",
      tooling: "CRT clusters, command terminals, and status mosaics",
      alerting: "Flashing panels, ringing phones, and dramatic swivels",
      escalation: "Spin toward the loudest terminal and type with intent",
      mood: "Capable, caffeinated, and permanently on watch",
    };
  }

  if (entry.year <= 2012) {
    return {
      band: "Internet Scale Adolescence",
      title: "From racks to dashboards to mild panic",
      summary: "Everything is now networked, graphed, and blessed with enough metrics to create new kinds of confusion.",
      description:
        "The late internet era turns the NOC into a true dashboard habitat. Operators juggle tickets, terminals, and giant wall displays while pretending the graph that just twitched is probably fine.",
      tooling: "Rack rows, graph walls, and terminal multiplexers",
      alerting: "Pager noise, ticket queues, and red lines on graphs",
      escalation: "Open another tab and say the words 'correlated signal'",
      mood: "Busy, competent, and never fully caught up",
    };
  }

  return {
    band: "Contemporary Incident Floor",
    title: "Cloud-era command center",
    summary: "The NOC is now fluent in dashboards, distributed systems, and the very modern art of explaining latency to everyone else.",
    description:
      "By the present day the room looks exactly like the image we all picture when someone says 'network operations center': live maps, real-time metrics, laptops everywhere, and one operator delivering status updates with practiced calm while the charts do something unsettling.",
    tooling: "Global maps, performance dashboards, and enough screens to feel responsible",
    alerting: "Slack pings, incident channels, and suspiciously specific graphs",
    escalation: "Declare the bridge, assign roles, and narrate the blast radius",
    mood: "Polished, vigilant, and one alert away from a war room",
  };
}

function applyTheme(entry) {
  const theme = getEraTheme(entry);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-strong", theme.accentStrong);
  root.style.setProperty("--bg-top", theme.bgTop);
  root.style.setProperty("--bg-bottom", theme.bgBottom);
  root.style.setProperty("--shadow-glow", theme.shadowGlow);
  root.style.setProperty("--accent-soft", theme.accentSoft);
}

function warmImages(index) {
  [index - 1, index + 1, index - 2, index + 2].forEach((candidate) => {
    if (candidate < 0 || candidate >= timeline.length) {
      return;
    }

    const file = timeline[candidate].file;
    if (IMAGE_CACHE.has(file)) {
      return;
    }

    const preload = new Image();
    preload.src = file;
    IMAGE_CACHE.add(file);
  });
}

function describePosition(index) {
  const current = timeline[index];
  const later = timeline[index - 1];
  const earlier = timeline[index + 1];

  if (!later && earlier) {
    const delta = Math.abs(current.sortYear - earlier.sortYear);
    return `Starting point in 2025. The next jump backward skips ${formatDistance(delta)}.`;
  }

  if (later && earlier) {
    const fromLater = Math.abs(later.sortYear - current.sortYear);
    const toEarlier = Math.abs(current.sortYear - earlier.sortYear);
    return `This frame sits ${formatDistance(fromLater)} earlier than the last stop. The next jump goes ${formatDistance(toEarlier)} deeper into the past.`;
  }

  if (later) {
    const fromLater = Math.abs(later.sortYear - current.sortYear);
    return `Oldest stop in the archive. You have traveled ${formatDistance(fromLater)} beyond the previous stop into the far past.`;
  }

  return "Only one timeline frame is available.";
}

function updateHash(entry) {
  history.replaceState(null, "", `#${entry.slug}`);
}

function updateTimelineButtons(index) {
  Array.from(timelineButtons.children).forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
    button.setAttribute("aria-pressed", buttonIndex === index ? "true" : "false");
  });

  const activeButton = timelineButtons.children[index];
  if (activeButton) {
    activeButton.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }
}

function setPlayState(isPlaying) {
  playButton.classList.toggle("is-playing", isPlaying);
  playButton.textContent = isPlaying ? "Pause auto-scrub" : "Auto-scrub";
}

function stopAutoplay() {
  if (autoplayId) {
    window.clearInterval(autoplayId);
    autoplayId = 0;
    setPlayState(false);
  }
}

function startAutoplay() {
  if (autoplayId) {
    stopAutoplay();
    return;
  }

  setPlayState(true);
  autoplayId = window.setInterval(() => {
    if (currentIndex >= timeline.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex += 1;
    }

    render(currentIndex, { keepAutoplay: true });
  }, 2600);
}

function render(index, options = {}) {
  currentIndex = index;
  const entry = timeline[index];
  const dossier = getEraDossier(entry);
  const sliderProgress = timeline.length === 1 ? 100 : (index / (timeline.length - 1)) * 100;

  applyTheme(entry);
  frameIndex.textContent = `${index + 1} / ${timeline.length}`;
  yearLabel.textContent = entry.label;
  eraBand.textContent = dossier.band;
  eraTitle.textContent = dossier.summary;
  dossierTitle.textContent = dossier.title;
  descriptionText.textContent = dossier.description;
  toolingText.textContent = dossier.tooling;
  alertingText.textContent = dossier.alerting;
  escalationText.textContent = dossier.escalation;
  moodText.textContent = dossier.mood;
  jumpLabel.textContent = describePosition(index);

  slider.value = String(index);
  slider.style.setProperty("--progress", `${sliderProgress}%`);
  prevButton.disabled = index === timeline.length - 1;
  nextButton.disabled = index === 0;

  image.classList.add("is-loading");
  image.alt = `Imagined Network Operations Center scene for ${entry.label}`;
  image.src = entry.file;

  updateTimelineButtons(index);
  updateHash(entry);
  warmImages(index);

  if (!options.keepAutoplay) {
    stopAutoplay();
  }
}

function buildTimelineButtons() {
  const fragment = document.createDocumentFragment();

  timeline.forEach((entry, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "timeline-button";
    button.textContent = entry.shortLabel;
    button.addEventListener("click", () => render(index));
    fragment.append(button);
  });

  timelineButtons.append(fragment);
}

async function loadImageFiles() {
  try {
    const response = await fetch("manifest.json", { cache: "no-store" });
    if (!response.ok) {
      return fallbackImageFiles;
    }

    const payload = await response.json();
    if (Array.isArray(payload.files) && payload.files.length > 0) {
      return payload.files;
    }
  } catch (error) {
    console.warn("Falling back to embedded image manifest.", error);
  }

  return fallbackImageFiles;
}

function getIndexFromHash() {
  const hash = window.location.hash.replace(/^#/, "").trim().toLowerCase();
  if (!hash) {
    return 0;
  }

  const directIndex = timeline.findIndex((entry) => entry.slug === hash);
  if (directIndex >= 0) {
    return directIndex;
  }

  if (/^\d+$/.test(hash)) {
    const year = Number.parseInt(hash, 10);
    const ceIndex = timeline.findIndex((entry) => entry.year === year && entry.era === "CE");
    if (ceIndex >= 0) {
      return ceIndex;
    }
  }

  return 0;
}

slider.addEventListener("input", (event) => {
  render(Number(event.target.value));
});

prevButton.addEventListener("click", () => {
  render(Math.min(timeline.length - 1, currentIndex + 1));
});

nextButton.addEventListener("click", () => {
  render(Math.max(0, currentIndex - 1));
});

playButton.addEventListener("click", startAutoplay);

window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLElement) {
    const tag = event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) {
      return;
    }
  }

  if (event.key === "ArrowLeft") {
    render(Math.max(0, currentIndex - 1));
  }

  if (event.key === "ArrowRight") {
    render(Math.min(timeline.length - 1, currentIndex + 1));
  }
});

window.addEventListener("hashchange", () => {
  const hashIndex = getIndexFromHash();
  if (hashIndex !== currentIndex) {
    render(hashIndex);
  }
});

image.addEventListener("load", () => {
  image.classList.remove("is-loading");
});

async function init() {
  const files = await loadImageFiles();
  timeline = buildTimeline(files);

  rangeSummary.textContent = `${timeline[0].label} to ${timeline[timeline.length - 1].label}`;
  snapshotCount.textContent = `${timeline.length} frames`;
  minLabel.textContent = timeline[0].shortLabel;
  maxLabel.textContent = timeline[timeline.length - 1].shortLabel;
  slider.max = String(timeline.length - 1);

  buildTimelineButtons();
  currentIndex = getIndexFromHash();
  render(currentIndex);
}

init();
