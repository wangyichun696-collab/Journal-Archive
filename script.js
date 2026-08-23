const entries = {};

const calendarGrid = document.querySelector("#calendar-grid");
const entryCardList = document.querySelector("#entry-card-list");
const entryListKicker = document.querySelector("#entry-list-kicker");
const clearFilter = document.querySelector("#clear-filter");
const calendarTitle = document.querySelector("#calendar-title");
const calendarEyebrow = document.querySelector("#calendar-eyebrow");
const monthCode = document.querySelector("#month-code");
const prevMonth = document.querySelector("#prev-month");
const nextMonth = document.querySelector("#next-month");
const storyViewer = document.querySelector("#story-viewer");
const storyPaper = document.querySelector("#story-paper");
const storyDate = document.querySelector("#story-date");
const storyTitle = document.querySelector("#story-title");
const storyMeta = document.querySelector("#story-meta");
const homeAddButton = document.querySelector("#home-add-button");
const recordBack = document.querySelector("#record-back");
const scanInput = document.querySelector("#scan-input");
const scanForm = document.querySelector("#record-view .entry-form");
const scanStatus = document.querySelector("#scan-status");
const scanResultImage = document.querySelector(".scan-result-image");
const recordDateInput = document.querySelector("#record-date-input");
const recordTitleInput = document.querySelector("#record-title-input");
const recordNotebookSelect = document.querySelector("#record-notebook-select");
const recordPageInput = document.querySelector("#record-page-input");
const recordSaveButton = document.querySelector("#record-save-button");
const documentScanner = document.querySelector("#document-scanner");
const scannerStage = document.querySelector("#scanner-stage");
const scannerImage = document.querySelector("#scanner-image");
const scannerPolygon = document.querySelector("#scanner-polygon");
const scannerHandles = document.querySelectorAll(".scanner-handle");
const scannerCancel = document.querySelector("#scanner-cancel");
const scannerRetake = document.querySelector("#scanner-retake");
const scannerFinish = document.querySelector("#scanner-finish");
const notebookFilterTabs = document.querySelectorAll("[data-notebook-filter]");
const notebookInfoCover = document.querySelector("#notebook-info-cover");
const notebookInfoName = document.querySelector("#notebook-info-name");
const notebookInfoMeta = document.querySelector("#notebook-info-meta");
const notebookInfoEntryList = document.querySelector("#notebook-info-entry-list");
const notebookActionTrigger = document.querySelector("#notebook-action-trigger");
const notebookActionModal = document.querySelector("#notebook-action-modal");
const notebookToggleStatus = document.querySelector("#notebook-toggle-status");
const notebookEditInfo = document.querySelector("#notebook-edit-info");
const materialTabs = document.querySelectorAll("[data-material-tab]");
const materialPanels = document.querySelectorAll("[data-material-panel]");
const materialsView = document.querySelector("#materials-view");
const materialDetailTitle = document.querySelector("#material-detail-title");
const materialDetailForm = document.querySelector("#material-detail-form");
const materialDetailPreview = document.querySelector("#material-detail-preview");
const materialTypeSelect = document.querySelector("#material-type-select");
const materialNameInput = document.querySelector("#material-name-input");
const materialBrandInput = document.querySelector("#material-brand-input");
const materialDateInput = document.querySelector("#material-date-input");
const materialPriceInput = document.querySelector("#material-price-input");
const materialNoteInput = document.querySelector("#material-note-input");
const materialSaveButton = document.querySelector("#material-save-button");
const customSelects = document.querySelectorAll("[data-select]");
const materialUploadTrigger = document.querySelector(".material-upload-trigger");
const materialImageRemove = document.querySelector("#material-image-remove");
const materialImageInput = document.querySelector("#material-image-input");
const materialDeleteModal = document.querySelector("#material-delete-modal");
const materialDeleteCancel = document.querySelector("#material-delete-cancel");
const materialDeleteConfirm = document.querySelector("#material-delete-confirm");
const notebookModeTabs = document.querySelectorAll("[data-notebook-mode]");
const notebookModePanels = document.querySelectorAll("[data-notebook-panel]");
const libraryNotebookPicker = document.querySelector(".library-notebook-picker");
const libraryNotebookAddButton = document.querySelector('[data-notebook-panel="library"] .notebook-bottom-action');
const notebookShelf = document.querySelector(".notebook-shelf");
const notebookNewForm = document.querySelector("#notebook-new-form");
const notebookNewCoverPreview = document.querySelector("#notebook-new-cover-preview");
const notebookUploadTrigger = document.querySelector(".notebook-upload-trigger");
const notebookImageInput = document.querySelector("#notebook-image-input");
const notebookUploadHint = document.querySelector("#notebook-upload-hint");
const notebookNewName = document.querySelector("#notebook-new-name");
const notebookNewBrand = document.querySelector("#notebook-new-brand");
const notebookNewSpec = document.querySelector("#notebook-new-spec");
const notebookEditForm = document.querySelector("#notebook-edit-form");
const notebookEditCoverPreview = document.querySelector("#notebook-edit-cover-preview");
const notebookEditUploadTrigger = document.querySelector(".notebook-edit-upload-trigger");
const notebookEditImageInput = document.querySelector("#notebook-edit-image-input");
const notebookEditUploadHint = document.querySelector("#notebook-edit-upload-hint");
const notebookEditName = document.querySelector("#notebook-edit-name");
const notebookEditBrand = document.querySelector("#notebook-edit-brand");
const notebookEditSpec = document.querySelector("#notebook-edit-spec");
const notebookEditStatus = document.querySelector("#notebook-edit-status");

const chineseMonths = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const englishMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const calendarMonths = [];

for (let year = 2026; year <= 2028; year += 1) {
  for (let month = 0; month < 12; month += 1) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const mondayFirstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    calendarMonths.push({ year, month, daysInMonth, mondayFirstOffset });
  }
}

let currentMonthIndex = calendarMonths.findIndex((item) => item.year === 2026 && item.month === 7);
let selectedDate = null;
let currentNotebookStatus = "writing";
let currentNotebookCard = null;
let pendingNotebookCover = null;
let pendingNotebookTilt = 0;
let currentMaterialId = null;
let pendingDeleteMaterialId = null;
let suppressMaterialClick = false;
let materialLongPressTimer = null;
let pendingMaterialImage = null;
let pendingMaterialTilt = 0;
let materialImageCleared = false;
let scannerImageUrl = "";
let scannerCorners = {
  tl: { x: 14, y: 12 },
  tr: { x: 86, y: 12 },
  br: { x: 88, y: 88 },
  bl: { x: 12, y: 88 },
};
let activeScannerCorner = null;

const journalCards = Object.keys(entries).sort().flatMap((dateKey) => {
  const data = entries[dateKey];
  const day = Number(dateKey.slice(-2));
  const month = Number(dateKey.slice(5, 7));
  const year = Number(dateKey.slice(0, 4));
  return Array.from({ length: data.count }, (_, index) => ({
    ...data,
    dateKey,
    day,
    month,
    year,
    id: `${dateKey}-${index + 1}`,
    title: data.count > 1 ? `${data.title} ${index + 1}` : data.title,
    page: data.page + index,
  }));
});

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function getMonthState() {
  return calendarMonths[currentMonthIndex];
}

function getMonthKey({ year, month }) {
  return `${year}-${padNumber(month + 1)}`;
}

function getDateKey(year, month, day) {
  return `${year}-${padNumber(month + 1)}-${padNumber(day)}`;
}

function formatChineseDate(card) {
  return `${card.year} 年 ${card.month} 月 ${card.day} 日`;
}

function renderCalendar() {
  const monthState = getMonthState();
  const monthLabel = chineseMonths[monthState.month];
  const englishLabel = `${englishMonths[monthState.month]} ${monthState.year}`;
  const monthKey = getMonthKey(monthState);

  calendarTitle.textContent = monthLabel;
  calendarEyebrow.textContent = englishLabel;
  monthCode.textContent = `${monthState.year}.${padNumber(monthState.month + 1)}`;
  prevMonth.disabled = currentMonthIndex === 0;
  nextMonth.disabled = currentMonthIndex === calendarMonths.length - 1;
  calendarGrid.innerHTML = "";

  for (let i = 0; i < monthState.mondayFirstOffset; i += 1) {
    const spacer = document.createElement("div");
    spacer.className = "day-cell empty";
    spacer.setAttribute("aria-hidden", "true");
    calendarGrid.append(spacer);
  }

  for (let day = 1; day <= monthState.daysInMonth; day += 1) {
    const dateKey = getDateKey(monthState.year, monthState.month, day);
    const data = entries[dateKey];
    const button = document.createElement("button");
    button.type = "button";
    button.className = data ? `day-cell has-entry ${data.style.includes("today") ? "today" : ""}` : "day-cell";
    button.classList.toggle("selected", selectedDate === dateKey);
    button.setAttribute("aria-label", data ? `${monthLabel}${day}日，${data.count}条手帐记录` : `${monthLabel}${day}日，暂无记录`);
    button.innerHTML = `<span>${day}</span>`;

    if (data) {
      const art = document.createElement("div");
      art.className = `day-art ${data.style.replace("today", "").trim()}`;
      button.append(art);

      if (data.count > 1) {
        const count = document.createElement("small");
        count.textContent = data.count;
        button.append(count);
      }
    }

    button.addEventListener("click", () => {
      selectedDate = dateKey;
      renderCalendar();
      renderEntryCards(selectedDate);
    });

    calendarGrid.append(button);
  }

  if (selectedDate && !selectedDate.startsWith(monthKey)) {
    selectedDate = null;
  }
}

function renderEntryCards(dateKey = null) {
  const monthState = getMonthState();
  const monthKey = getMonthKey(monthState);
  const cards = dateKey ? journalCards.filter((card) => card.dateKey === dateKey) : journalCards.filter((card) => card.dateKey.startsWith(monthKey));
  const selectedMonth = dateKey ? Number(dateKey.slice(5, 7)) : null;
  const selectedDay = dateKey ? Number(dateKey.slice(-2)) : null;
  entryListKicker.textContent = dateKey ? `${selectedMonth} 月 ${selectedDay} 日` : "本月手帐";
  clearFilter.hidden = !dateKey;
  entryCardList.innerHTML = cards
    .map(
      (card) => `
        <button class="entry-card" type="button" data-card-id="${card.id}">
          <div class="scan-preview ${card.style.replace("today", "").trim()}"></div>
          <div>
            <p>${card.notebook} · 第 ${card.page} 页</p>
            <h2>${card.title}</h2>
            <span>${formatChineseDate(card)} · 单页扫描</span>
          </div>
        </button>
      `,
    )
    .join("") || emptyStateMarkup("journal", "这里没有归档的手帐哦");
}

function openStory(cardId) {
  renderStory(cardId);
  storyViewer.classList.add("open");
  storyViewer.setAttribute("aria-hidden", "false");
}

function closeStory() {
  storyViewer.classList.remove("open");
  storyViewer.setAttribute("aria-hidden", "true");
}

function renderStory(cardId) {
  const data = journalCards.find((card) => card.id === cardId);
  if (!data) return;

  storyPaper.className = `story-paper ${data.style.replace("today", "").trim()}`;
  storyDate.textContent = formatChineseDate(data);
  storyTitle.textContent = data.title;
  storyMeta.textContent = `${data.notebook} · 第 ${data.page} 页 · 单页扫描`;
}

function showView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `${viewName}-view`);
  });

  if (viewName === "notebook-detail") renderLibraryNotebookPicker();

  document.querySelector(".phone-frame").classList.toggle(
    "record-mode",
    viewName === "record" || viewName.endsWith("-detail") || viewName === "notebook-info" || viewName === "notebook-edit",
  );

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });

  document.querySelectorAll(".bottom-tab").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });
}

function updateProfileStats() {
  const metricCards = document.querySelectorAll(".profile-stat-card");
  const archivedPages = journalCards.length;
  const materialCards = document.querySelectorAll('[data-material-panel="all"] .material-card');
  const notebookCards = document.querySelectorAll("#notebooks-view .shelf-notebook-card");
  const spend = [...materialCards].reduce((sum, card) => sum + Number(card.dataset.materialPrice || 0), 0).toFixed(2);
  const values = [archivedPages, materialCards.length, notebookCards.length, spend];
  metricCards.forEach((card, index) => {
    const number = card.querySelector(".metric-number");
    if (number) number.textContent = String(values[index] ?? 0);
  });
  updateProfileCollections();
}

function updateMonthSummary() {
  const summary = document.querySelector(".month-summary");
  if (!summary) return;
  const current = calendarMonths[currentMonthIndex];
  const monthKey = `${current.year}-${String(current.month + 1).padStart(2, "0")}`;
  const monthlyCards = journalCards.filter((card) => card.dateKey.startsWith(monthKey));
  const days = new Set(monthlyCards.map((card) => card.dateKey)).size;
  summary.querySelector("p").textContent = `${chineseMonths[current.month]}记录`;
  summary.querySelector("strong").textContent = `${days} 天`;
  summary.querySelector("span").textContent = `已归档 ${monthlyCards.length} 页，使用 ${document.querySelectorAll('[data-material-panel="all"] .material-card').length} 件素材`;
}

function removeEmptyState(container) {
  container?.querySelectorAll("[data-empty-state]").forEach((item) => item.remove());
}

function getMaterialEmptyText(panelName) {
  return {
    all: "这里还没有素材哦",
    notebooks: "这里还没有本子哦",
    notes: "这里还没有便签哦",
    stickers: "这里还没有贴纸哦",
    tapes: "这里还没有胶带哦",
  }[panelName] || "这里还没有素材哦";
}

function getMaterialEmptyType(panelName) {
  return {
    all: "notes",
    notebooks: "notebooks",
    notes: "notes",
    stickers: "stickers",
    tapes: "tapes",
  }[panelName] || "notes";
}

function updateMaterialEmptyStates() {
  materialPanels.forEach((panel) => {
    const hasCards = Boolean(panel.querySelector(".material-card"));
    panel.querySelectorAll("[data-empty-state]").forEach((item) => item.remove());
    if (hasCards) return;
    panel.insertAdjacentHTML("beforeend", emptyStateMarkup(getMaterialEmptyType(panel.dataset.materialPanel), getMaterialEmptyText(panel.dataset.materialPanel)));
  });
}

function updateRecordNotebookOptions() {
  if (!recordNotebookSelect) return;
  const names = [...document.querySelectorAll("#notebooks-view .shelf-notebook-card h2")].map((item) => item.textContent.trim());
  recordNotebookSelect.innerHTML = names.length
    ? names.map((name) => `<option>${name}</option>`).join("")
    : '<option value="">暂无本子</option>';
}

const storageKey = "journalArchiveDraftState";
const emptyStateAssets = {
  journal: "./assets/empty-states/journal-folder.png",
  notebooks: "./assets/empty-states/notebook-box.png",
  notes: "./assets/empty-states/notes.png",
  stickers: "./assets/empty-states/stickers.png",
  tapes: "./assets/empty-states/tape.png",
};

function emptyStateMarkup(type, text) {
  const image = emptyStateAssets[type] || emptyStateAssets.journal;
  return `
    <div class="empty-state" data-empty-state="${type}">
      <img src="${image}" alt="" />
      <p>${text}</p>
    </div>
  `;
}

function readCutoutData(container) {
  return container?.querySelector(".cutout-image")?.src || "";
}

function readBackgroundImageData(element) {
  const background = element?.style.backgroundImage || "";
  const match = background.match(/^url\(["']?(.*?)["']?\)$/);
  return match?.[1] || "";
}

function persistAppState() {
  try {
    const materials = [...document.querySelectorAll('[data-material-panel="all"] .material-card')].map((card) => ({
      id: card.dataset.materialId,
      type: card.dataset.materialType,
      category: card.dataset.materialCategory,
      brand: card.dataset.materialBrand,
      date: card.dataset.materialDate,
      price: card.dataset.materialPrice,
      note: card.dataset.materialNote,
      tilt: card.dataset.materialTilt || "0",
      name: card.querySelector("h2")?.textContent.trim() || "",
      imageData: readCutoutData(card.querySelector(".material-image")),
      imageEmpty: card.querySelector(".material-image")?.classList.contains("material-image-empty") || false,
    }));
    const notebooks = [...document.querySelectorAll("#notebooks-view .shelf-notebook-card")].map((card) => ({
      name: card.querySelector("h2")?.textContent.trim() || "",
      brand: card.dataset.notebookBrand || "",
      spec: card.dataset.notebookSpec || "",
      status: card.dataset.notebookStatus || "writing",
      tilt: card.dataset.notebookTilt || "0",
      scanCount: card.querySelector(".scan-count")?.textContent.trim() || "0",
      coverData: readCutoutData(card.querySelector(".notebook-cover")),
    }));
    localStorage.setItem(storageKey, JSON.stringify({ version: 1, materials, notebooks, journalCards }));
  } catch (error) {
    console.warn("Could not save app state:", error);
  }
}

function restoreMaterial(saved) {
  const previousImage = pendingMaterialImage;
  const previousTilt = pendingMaterialTilt;
  const previousCleared = materialImageCleared;
  pendingMaterialImage = saved.imageData || null;
  pendingMaterialTilt = Number(saved.tilt || 0);
  materialImageCleared = Boolean(saved.imageEmpty);
  syncMaterialCards({
    id: saved.id || `material-${Date.now()}`,
    type: saved.type || "本子",
    category: saved.category || materialTypeToCategory(saved.type || "本子"),
    name: saved.name || "未命名素材",
    brand: saved.brand || "",
    date: saved.date || "",
    price: saved.price || "",
    note: saved.note || "",
  }, { skipPersist: true });
  pendingMaterialImage = previousImage;
  pendingMaterialTilt = previousTilt;
  materialImageCleared = previousCleared;
}

function restoreNotebook(saved) {
  const card = createNotebookCard({
    name: saved.name || "未命名本子",
    brand: saved.brand || "",
    spec: saved.spec || "",
    coverUrl: saved.coverData || "",
    tilt: Number(saved.tilt || 0),
  });
  removeEmptyState(notebookShelf);
  notebookShelf?.append(card);
  updateNotebookStatus(card, saved.status || "writing");
  const scanCount = card.querySelector(".scan-count");
  if (scanCount) scanCount.textContent = saved.scanCount || "0";
}

function restoreJournalCard(saved) {
  if (!saved?.dateKey || journalCards.some((card) => card.id === saved.id)) return;
  journalCards.push(saved);
  entries[saved.dateKey] = {
    count: (entries[saved.dateKey]?.count || 0) + 1,
    style: saved.style || "paper-collage",
    title: saved.title || "未命名手帐页",
    notebook: saved.notebook || "未选择本子",
    page: saved.page || 1,
    tags: saved.tags || [],
  };
}

function makeProfilePreviewItem(kind, index) {
  const item = document.createElement("i");
  item.className = `profile-preview-item ${kind}`;
  item.style.setProperty("--preview-index", String(index));
  return item;
}

function setProfileStageItems(stage, items, fallbackClass) {
  if (!stage) return;
  stage.innerHTML = "";
  stage.classList.toggle("is-dynamic", items.length > 0);
  if (!items.length) {
    for (let index = 0; index < 3; index += 1) {
      stage.append(document.createElement("i"));
    }
    return;
  }
  items.slice(0, 3).forEach((item) => stage.append(item));
}

function createProfileImagePreview(src, kind, index) {
  const item = makeProfilePreviewItem(kind, index);
  const image = document.createElement("img");
  image.alt = "";
  image.src = src;
  item.append(image);
  return item;
}

function createProfilePaperPreview(card, index) {
  const item = makeProfilePreviewItem("journal-page", index);
  const paper = document.createElement("span");
  paper.className = `profile-paper-preview ${card.style || "paper-collage"}`;
  item.append(paper);
  return item;
}

function updateProfileCollections() {
  const journalStage = document.querySelector(".profile-card-stage.notebook-stage");
  const materialStage = document.querySelector(".profile-card-stage.tape-stage");
  const notebookStage = document.querySelector(".profile-card-stage.shelf-stage");

  const journalItems = journalCards.slice(0, 3).map((card, index) => {
    return card.imageData ? createProfileImagePreview(card.imageData, "journal-page", index) : createProfilePaperPreview(card, index);
  });

  const materialItems = [...document.querySelectorAll('[data-material-panel="all"] .material-card')]
    .filter((card) => card.dataset.materialType !== "本子" && card.dataset.materialCategory !== "notebooks")
    .slice(0, 3)
    .map((card, index) => {
    const image = card.querySelector(".material-image");
    const cutout = readCutoutData(image);
    const background = readBackgroundImageData(image);
    if (cutout || background) return createProfileImagePreview(cutout || background, "material-asset", index);
    const item = makeProfilePreviewItem("material-asset material-default", index);
    item.classList.add(materialCategoryToClass(card.dataset.materialCategory || "notebooks"));
    return item;
  });

  const notebookItems = [...document.querySelectorAll("#notebooks-view .shelf-notebook-card")].slice(0, 3).map((card, index) => {
    const cover = card.querySelector(".notebook-cover");
    const cutout = readCutoutData(cover);
    const background = readBackgroundImageData(cover);
    if (cutout || background) return createProfileImagePreview(cutout || background, "notebook-cover-preview", index);
    const item = makeProfilePreviewItem("notebook-cover-preview notebook-default", index);
    ["default-cover-paper", "default-cover-blue", "default-cover-rose", "travel", "daily"].forEach((className) => {
      if (cover?.classList.contains(className)) item.classList.add(className);
    });
    return item;
  });

  setProfileStageItems(journalStage, journalItems, "journal-page");
  setProfileStageItems(materialStage, materialItems, "material-asset");
  setProfileStageItems(notebookStage, notebookItems, "notebook-cover-preview");
}

async function loadPersistedState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    for (const material of state.materials || []) {
      if (material.imageData?.startsWith("data:image")) material.imageData = await trimTransparentPixels(material.imageData);
    }
    for (const notebook of state.notebooks || []) {
      if (notebook.coverData?.startsWith("data:image")) notebook.coverData = await trimTransparentPixels(notebook.coverData);
    }
    state.materials?.forEach(restoreMaterial);
    state.notebooks?.forEach(restoreNotebook);
    state.journalCards?.forEach(restoreJournalCard);
    persistAppState();
  } catch (error) {
    console.warn("Could not restore saved app state:", error);
  }
}

function randomTilt() {
  return Math.round((Math.random() * 30 - 15) * 10) / 10;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function fileToDataUrl(file) {
  return blobToDataUrl(file);
}

function imageToElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function trimTransparentPixels(dataUrl) {
  const image = await imageToElement(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= 8) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) return dataUrl;
  const padding = Math.ceil(Math.max(maxX - minX + 1, maxY - minY + 1) * 0.04);
  const sourceX = Math.max(0, minX - padding);
  const sourceY = Math.max(0, minY - padding);
  const sourceWidth = Math.min(width - sourceX, maxX - minX + 1 + padding * 2);
  const sourceHeight = Math.min(height - sourceY, maxY - minY + 1 + padding * 2);
  const output = document.createElement("canvas");
  output.width = sourceWidth;
  output.height = sourceHeight;
  output.getContext("2d").drawImage(canvas, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
  return output.toDataURL("image/png");
}

async function removeImageBackground(file) {
  if (window.location.protocol === "file:") return fileToDataUrl(file);

  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  const response = await fetch("/api/remove-bg", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error(await response.text());
  return trimTransparentPixels(await blobToDataUrl(await response.blob()));
}

async function prepareCutoutImage(file) {
  try {
    return await removeImageBackground(file);
  } catch (error) {
    console.warn("remove.bg fallback:", error);
    return fileToDataUrl(file);
  }
}

function renderScannerBoundary() {
  if (!scannerPolygon) return;
  const points = ["tl", "tr", "br", "bl"].map((key) => `${scannerCorners[key].x},${scannerCorners[key].y}`).join(" ");
  scannerPolygon.setAttribute("points", points);
  scannerHandles.forEach((handle) => {
    const corner = scannerCorners[handle.dataset.corner];
    handle.style.left = `${corner.x}%`;
    handle.style.top = `${corner.y}%`;
  });
}

function openDocumentScanner(file) {
  scannerImageUrl = URL.createObjectURL(file);
  scannerCorners = {
    tl: { x: 14, y: 12 },
    tr: { x: 86, y: 12 },
    br: { x: 88, y: 88 },
    bl: { x: 12, y: 88 },
  };
  if (scannerImage) scannerImage.src = scannerImageUrl;
  documentScanner?.classList.add("open");
  documentScanner?.setAttribute("aria-hidden", "false");
  renderScannerBoundary();
}

function closeDocumentScanner() {
  documentScanner?.classList.remove("open");
  documentScanner?.setAttribute("aria-hidden", "true");
  activeScannerCorner = null;
}

function updateScannerCorner(event) {
  if (!activeScannerCorner || !scannerStage) return;
  const rect = scannerStage.getBoundingClientRect();
  const x = Math.min(96, Math.max(4, ((event.clientX - rect.left) / rect.width) * 100));
  const y = Math.min(96, Math.max(4, ((event.clientY - rect.top) / rect.height) * 100));
  scannerCorners[activeScannerCorner] = { x, y };
  renderScannerBoundary();
}

function scannerPointToImage(point) {
  const stageRect = scannerStage.getBoundingClientRect();
  const imageRatio = scannerImage.naturalWidth / scannerImage.naturalHeight;
  const stageRatio = stageRect.width / stageRect.height;
  const displayWidth = imageRatio > stageRatio ? stageRect.width : stageRect.height * imageRatio;
  const displayHeight = imageRatio > stageRatio ? stageRect.width / imageRatio : stageRect.height;
  const offsetX = (stageRect.width - displayWidth) / 2;
  const offsetY = (stageRect.height - displayHeight) / 2;
  const stageX = (point.x / 100) * stageRect.width;
  const stageY = (point.y / 100) * stageRect.height;
  const imageX = Math.min(1, Math.max(0, (stageX - offsetX) / displayWidth));
  const imageY = Math.min(1, Math.max(0, (stageY - offsetY) / displayHeight));
  return {
    x: imageX * scannerImage.naturalWidth,
    y: imageY * scannerImage.naturalHeight,
  };
}

function finishDocumentScan() {
  if (!scannerImage?.naturalWidth) return;
  const imagePoints = Object.values(scannerCorners).map(scannerPointToImage);
  const xs = imagePoints.map((point) => point.x);
  const ys = imagePoints.map((point) => point.y);
  const sourceX = Math.max(0, Math.min(...xs));
  const sourceY = Math.max(0, Math.min(...ys));
  const sourceWidth = Math.max(1, Math.min(scannerImage.naturalWidth, Math.max(...xs)) - sourceX);
  const sourceHeight = Math.max(1, Math.min(scannerImage.naturalHeight, Math.max(...ys)) - sourceY);
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = Math.max(900, Math.round((sourceHeight / sourceWidth) * 900));
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.filter = "brightness(1.1) contrast(1.08) saturate(0.86)";
  context.drawImage(scannerImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
  const scannedUrl = canvas.toDataURL("image/jpeg", 0.92);
  scanResultImage.style.backgroundImage = `url("${scannedUrl}")`;
  scanResultImage.className = "scan-result-image";
  scanForm.classList.remove("scanning");
  scanForm.classList.add("scanned");
  scanStatus.textContent = "扫描完成";
  closeDocumentScanner();
  showView("record");
}

function saveRecordEntry() {
  const dateKey = recordDateInput?.value || new Date().toISOString().slice(0, 10);
  const title = recordTitleInput?.value.trim() || "未命名手帐页";
  const notebook = recordNotebookSelect?.value || "未选择本子";
  const page = Number(recordPageInput?.value || journalCards.filter((card) => card.notebook === notebook).length + 1);
  const day = Number(dateKey.slice(-2));
  const month = Number(dateKey.slice(5, 7));
  const year = Number(dateKey.slice(0, 4));
  const currentCount = journalCards.filter((card) => card.dateKey === dateKey).length;
  const imageData = readBackgroundImageData(scanResultImage);
  const card = {
    count: 1,
    style: "paper-collage",
    title,
    notebook,
    page,
    tags: [],
    dateKey,
    day,
    month,
    year,
    id: `${dateKey}-${currentCount + 1}`,
    imageData,
  };
  journalCards.push(card);
  entries[dateKey] = {
    count: (entries[dateKey]?.count || 0) + 1,
    style: card.style,
    title,
    notebook,
    page,
    tags: [],
  };

  const notebookCard = [...document.querySelectorAll("#notebooks-view .shelf-notebook-card")].find(
    (item) => item.querySelector("h2")?.textContent.trim() === notebook,
  );
  const scanCount = notebookCard?.querySelector(".scan-count");
  if (scanCount) scanCount.textContent = String(Number(scanCount.textContent || 0) + 1);

  selectedDate = dateKey;
  renderCalendar();
  renderEntryCards(dateKey);
  updateProfileStats();
  updateMonthSummary();
  persistAppState();
  showView("calendar");
}

function openNotebookInfo(card) {
  const cover = card.querySelector(".notebook-cover");
  const title = card.querySelector("h2")?.textContent.trim() || "未命名本子";
  const brand = card.dataset.notebookBrand?.trim();
  const spec = card.dataset.notebookSpec?.trim();
  const meta = [brand, spec].filter(Boolean).join(" · ");

  currentNotebookCard = card;
  currentNotebookStatus = card.dataset.notebookStatus || "writing";
  if (notebookInfoCover && cover) {
    notebookInfoCover.innerHTML = "";
    notebookInfoCover.append(cover.cloneNode(true));
  }
  if (notebookInfoName) notebookInfoName.textContent = title;
  if (notebookInfoMeta) {
    notebookInfoMeta.textContent = meta;
    notebookInfoMeta.hidden = !meta;
  }
  if (notebookToggleStatus) {
    notebookToggleStatus.textContent = currentNotebookStatus === "archived" ? "重设为使用中" : "归入已归档";
  }
  renderNotebookArchiveCards(title);
  showView("notebook-info");
}

function applyNotebookFilter() {
  const filter = document.querySelector("[data-notebook-filter].active")?.dataset.notebookFilter || "all";
  notebookShelf?.querySelectorAll("[data-empty-state]").forEach((item) => item.remove());
  const cards = [...document.querySelectorAll("#notebooks-view [data-notebook-status]")];
  cards.forEach((card) => {
    card.hidden = filter !== "all" && card.dataset.notebookStatus !== filter;
  });
  const hasVisibleCards = cards.some((card) => !card.hidden);
  notebookShelf?.classList.toggle("has-visible-notebooks", hasVisibleCards);
  if (!hasVisibleCards) notebookShelf?.insertAdjacentHTML("beforeend", emptyStateMarkup("notebooks", "这里还没有本子哦"));
}

function updateNotebookStatus(card, status) {
  if (!card) return;
  card.dataset.notebookStatus = status;
  currentNotebookStatus = status;
  const statusPill = card.querySelector(".status-pill");
  if (statusPill) {
    statusPill.textContent = status === "archived" ? "已归档" : "使用中";
    statusPill.classList.toggle("archived", status === "archived");
  }
  if (notebookToggleStatus) {
    notebookToggleStatus.textContent = status === "archived" ? "重设为使用中" : "归入已归档";
  }
  applyNotebookFilter();
}

function openNotebookEdit() {
  if (!currentNotebookCard) return;
  const cover = currentNotebookCard.querySelector(".notebook-cover");
  notebookEditName.value = currentNotebookCard.querySelector("h2")?.textContent.trim() || "";
  notebookEditBrand.value = currentNotebookCard.dataset.notebookBrand || "";
  notebookEditSpec.value = currentNotebookCard.dataset.notebookSpec || "";
  notebookEditStatus.value = currentNotebookCard.dataset.notebookStatus || "writing";
  pendingNotebookCover = null;
  pendingNotebookTilt = Number(currentNotebookCard.dataset.notebookTilt || 0);
  notebookEditImageInput.value = "";
  notebookEditUploadHint.textContent = "拍摄封面或从相簿选择";
  notebookEditCoverPreview.innerHTML = "";
  if (cover) notebookEditCoverPreview.append(cover.cloneNode(true));
  closeNotebookActionMenu();
  showView("notebook-edit");
}

function applyCutoutCover(cover, imageUrl, tilt = 0) {
  if (!cover || !imageUrl) return;
  cover.classList.add("cutout-cover");
  cover.style.backgroundImage = "";
  cover.style.setProperty("--asset-tilt", `${tilt}deg`);
  cover.querySelector(".cutout-image")?.remove();
  const image = document.createElement("img");
  image.className = "cutout-image";
  image.alt = "";
  image.src = imageUrl;
  cover.prepend(image);
}

function renderNotebookNewPreview() {
  if (!notebookNewCoverPreview || !pendingNotebookCover) return;
  notebookNewCoverPreview.innerHTML = "";
  const cover = document.createElement("div");
  cover.className = "notebook-cover cutout-cover";
  applyCutoutCover(cover, pendingNotebookCover, pendingNotebookTilt);
  notebookNewCoverPreview.append(cover);
  notebookNewCoverPreview.classList.add("active");
}

function createNotebookCard({ name, brand, spec, coverUrl, tilt }) {
  const card = document.createElement("article");
  card.className = "shelf-notebook-card";
  card.dataset.notebookStatus = "writing";
  card.dataset.notebookBrand = brand;
  card.dataset.notebookSpec = spec;
  if (coverUrl) card.dataset.notebookTilt = String(tilt);
  card.innerHTML = `
    <div class="notebook-cover default-cover-paper" data-default-cover>
      <span class="status-pill">使用中</span>
      <span class="cover-mark">2026</span>
      <small class="scan-count">0</small>
    </div>
    <h2></h2>
  `;
  card.querySelector("h2").textContent = name;
  if (coverUrl) {
    const cover = card.querySelector(".notebook-cover");
    cover.className = "notebook-cover cutout-cover";
    applyCutoutCover(cover, coverUrl, tilt);
  }
  return card;
}

function renderNotebookArchiveCards(notebookName) {
  if (!notebookInfoEntryList) return;
  const cards = journalCards.filter((card) => card.notebook === notebookName);
  notebookInfoEntryList.innerHTML = cards
    .map((card) => `
        <button class="entry-card" type="button" data-card-id="${card.id}">
          <div class="scan-preview ${card.style.replace("today", "").trim()}"></div>
          <div>
            <p>${card.notebook}</p>
            <h2>${card.title}</h2>
            <span>${formatChineseDate(card)} · 单页扫描</span>
          </div>
        </button>
      `)
    .join("") || `<p class="empty-note">这本还没有归档手帐。</p>`;
}

function closeNotebookActionMenu() {
  notebookActionModal?.classList.remove("open");
  notebookActionModal?.setAttribute("aria-hidden", "true");
}

function openNotebookActionMenu() {
  notebookActionModal?.classList.add("open");
  notebookActionModal?.setAttribute("aria-hidden", "false");
}

function materialTypeToCategory(type) {
  return {
    本子: "notebooks",
    便签: "notes",
    贴纸: "stickers",
    胶带: "tapes",
  }[type] || "notebooks";
}

function materialCategoryToClass(category) {
  return {
    notebooks: "notebook-material",
    notes: "ticket",
    stickers: "leaf",
    tapes: "grid",
  }[category] || "notebook-material";
}

function setUploadProcessing(trigger, isProcessing) {
  trigger?.classList.toggle("is-processing", isProcessing);
  trigger?.setAttribute("aria-busy", String(isProcessing));
}

function formatMaterialDate(value) {
  return value ? value.replaceAll("-", "/") : "未填写日期";
}

function formatMaterialPrice(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

function readMaterialCard(card) {
  const summaryParts = card.querySelector("p")?.textContent.split(" · ") || [];
  return {
    id: card.dataset.materialId,
    type: card.dataset.materialType || "本子",
    category: card.dataset.materialCategory || materialTypeToCategory(card.dataset.materialType),
    name: card.querySelector("h2")?.textContent.trim() || "",
    brand: card.dataset.materialBrand || summaryParts[0] || "",
    date: card.dataset.materialDate || summaryParts[1]?.replaceAll("/", "-") || "",
    price: card.dataset.materialPrice || summaryParts[2]?.replace("¥", "") || "",
    note: card.dataset.materialNote || card.querySelector("span")?.textContent.trim() || "",
    imageStyle: card.querySelector(".material-image")?.getAttribute("style") || "",
    imageClass: card.querySelector(".material-image")?.className || "material-image notebook-material",
  };
}

function setMaterialSelectValue(type) {
  const triggerLabel = materialTypeSelect?.querySelector(":scope > button span");
  const hiddenInput = materialTypeSelect?.querySelector("input[type='hidden']");
  const optionButtons = materialTypeSelect?.querySelectorAll(".select-menu button") || [];
  if (triggerLabel) triggerLabel.textContent = type;
  if (hiddenInput) hiddenInput.value = type;
  optionButtons.forEach((button) => {
    button.classList.toggle("active", (button.dataset.value || button.textContent.trim()) === type);
  });
}

function updateMaterialPreview(card = null) {
  if (!materialDetailPreview) return;
  materialDetailPreview.innerHTML = "";
  const sourceImage = card?.querySelector(".material-image");
  const sourceCutout = sourceImage?.querySelector(".cutout-image");
  const selectedType = materialTypeSelect?.querySelector("input[type='hidden']")?.value || "本子";
  const selectedCategory = materialTypeToCategory(selectedType);
  const previewImage = document.createElement("div");
  previewImage.className = `material-image ${materialCategoryToClass(selectedCategory)}`;

  if ((sourceCutout || sourceImage?.style.backgroundImage) && !materialImageCleared) {
    previewImage.className = sourceImage.className;
    previewImage.style.setProperty("--asset-tilt", `${card?.dataset.materialTilt || 0}deg`);
    if (sourceCutout) {
      const image = sourceCutout.cloneNode(true);
      previewImage.append(image);
    } else {
      previewImage.style.backgroundImage = sourceImage.style.backgroundImage;
      previewImage.style.backgroundSize = "cover";
      previewImage.style.backgroundPosition = "center";
    }
  }
  if (materialImageCleared) {
    previewImage.className = "material-image material-image-empty";
    previewImage.removeAttribute("style");
  }
  if (pendingMaterialImage) {
    previewImage.className = "material-image cutout-asset";
    previewImage.style.setProperty("--asset-tilt", `${pendingMaterialTilt}deg`);
    const image = document.createElement("img");
    image.className = "cutout-image";
    image.alt = "";
    image.src = pendingMaterialImage;
    previewImage.append(image);
  }
  materialDetailPreview.append(previewImage);
  materialUploadTrigger?.classList.toggle("has-image", previewImage.classList.contains("cutout-asset"));
  materialUploadTrigger?.closest(".material-upload-field")?.classList.toggle("has-image", previewImage.classList.contains("cutout-asset"));
  materialImageRemove?.classList.toggle("hidden", previewImage.classList.contains("material-image-empty"));
}

function resetMaterialDetail() {
  currentMaterialId = null;
  pendingMaterialImage = null;
  materialImageCleared = true;
  if (materialDetailTitle) materialDetailTitle.textContent = "新增素材";
  if (materialSaveButton) materialSaveButton.textContent = "保存素材";
  setMaterialSelectValue("本子");
  if (materialNameInput) materialNameInput.value = "";
  if (materialBrandInput) materialBrandInput.value = "";
  if (materialDateInput) materialDateInput.value = "";
  if (materialPriceInput) materialPriceInput.value = "";
  if (materialNoteInput) materialNoteInput.value = "";
  if (materialImageInput) materialImageInput.value = "";
  updateMaterialPreview();
}

function openMaterialDetail(card) {
  const data = readMaterialCard(card);
  currentMaterialId = data.id;
  pendingMaterialImage = null;
  materialImageCleared = card.querySelector(".material-image")?.classList.contains("material-image-empty") || false;
  if (materialDetailTitle) materialDetailTitle.textContent = "素材详情";
  if (materialSaveButton) materialSaveButton.textContent = "保存修改";
  setMaterialSelectValue(data.type);
  if (materialNameInput) materialNameInput.value = data.name;
  if (materialBrandInput) materialBrandInput.value = data.brand;
  if (materialDateInput) materialDateInput.value = data.date;
  if (materialPriceInput) materialPriceInput.value = data.price;
  if (materialNoteInput) materialNoteInput.value = data.note;
  if (materialImageInput) materialImageInput.value = "";
  updateMaterialPreview(card);
  showView("material-detail");
}

function getMaterialFormData() {
  const type = materialTypeSelect?.querySelector("input[type='hidden']")?.value || "本子";
  return {
    id: currentMaterialId || `material-${Date.now()}`,
    type,
    category: materialTypeToCategory(type),
    name: materialNameInput?.value.trim() || "未命名素材",
    brand: materialBrandInput?.value.trim() || "",
    date: materialDateInput?.value || "",
    price: materialPriceInput?.value ? formatMaterialPrice(materialPriceInput.value) : "",
    note: materialNoteInput?.value.trim() || "",
  };
}

function renderMaterialCard(card, data) {
  const image = card.querySelector(".material-image");
  card.dataset.materialId = data.id;
  card.dataset.materialCategory = data.category;
  card.dataset.materialType = data.type;
  card.dataset.materialBrand = data.brand;
  card.dataset.materialDate = data.date;
  card.dataset.materialPrice = data.price;
  card.dataset.materialNote = data.note;
  if (image && materialImageCleared) {
    image.className = "material-image material-image-empty";
    image.removeAttribute("style");
    image.innerHTML = "";
  } else if (image && !pendingMaterialImage && !image.style.backgroundImage) {
    image.className = `material-image ${materialCategoryToClass(data.category)}`;
  }
  if (image && pendingMaterialImage) {
    card.dataset.materialTilt = String(pendingMaterialTilt);
    image.className = "material-image cutout-asset";
    image.style.backgroundImage = "";
    image.style.setProperty("--asset-tilt", `${pendingMaterialTilt}deg`);
    image.innerHTML = "";
    const cutout = document.createElement("img");
    cutout.className = "cutout-image";
    cutout.alt = "";
    cutout.src = pendingMaterialImage;
    image.append(cutout);
  }
  card.querySelector("h2").textContent = data.name;
  card.querySelector("p").textContent = `${data.brand || "未填写品牌"} · ${formatMaterialDate(data.date)} · ¥${formatMaterialPrice(data.price)}`;
  card.querySelector("span").textContent = data.note || "还没有 Note";
}

function createMaterialCard(data, sourceCard = null) {
  const card = sourceCard?.cloneNode(true) || document.createElement("article");
  if (!sourceCard) {
    card.className = "material-card";
    card.innerHTML = `
      <button class="material-delete-button" type="button" aria-label="删除素材"></button>
      <div class="material-image ${materialCategoryToClass(data.category)}"></div>
      <div>
        <h2></h2>
        <p></p>
        <span></span>
      </div>
    `;
  }
  renderMaterialCard(card, data);
  return card;
}

function syncMaterialCards(data, options = {}) {
  let cards = document.querySelectorAll(`.material-card[data-material-id="${data.id}"]`);
  if (!cards.length) {
    const allPanel = document.querySelector('[data-material-panel="all"]');
    removeEmptyState(allPanel);
    allPanel?.append(createMaterialCard(data));
    cards = document.querySelectorAll(`.material-card[data-material-id="${data.id}"]`);
  }
  cards.forEach((card) => renderMaterialCard(card, data));

  const allCard = document.querySelector(`[data-material-panel="all"] .material-card[data-material-id="${data.id}"]`);
  const categoryPanel = document.querySelector(`[data-material-panel="${data.category}"]`);
  const categoryCards = [...document.querySelectorAll(`.material-list:not([data-material-panel="all"]) .material-card[data-material-id="${data.id}"]`)];
  const categoryCard = categoryCards[0] || createMaterialCard(data, allCard);
  removeEmptyState(categoryPanel);
  categoryPanel?.append(categoryCard);
  categoryCards.slice(1).forEach((card) => card.remove());
  renderMaterialCard(categoryCard, data);
  updateProfileStats();
  updateMonthSummary();
  renderLibraryNotebookPicker();
  if (!options.skipPersist) persistAppState();
}

function openMaterialDeleteModal(materialId) {
  pendingDeleteMaterialId = materialId;
  materialDeleteModal?.classList.add("open");
  materialDeleteModal?.setAttribute("aria-hidden", "false");
}

function closeMaterialDeleteModal() {
  pendingDeleteMaterialId = null;
  setMaterialDeleteMode(null);
  materialDeleteModal?.classList.remove("open");
  materialDeleteModal?.setAttribute("aria-hidden", "true");
}

function deleteMaterial(materialId) {
  if (!materialId) return;
  document.querySelectorAll(`.material-card[data-material-id="${materialId}"]`).forEach((card) => card.remove());
  if (currentMaterialId === materialId) currentMaterialId = null;
  updateMaterialEmptyStates();
  updateProfileStats();
  updateMonthSummary();
  renderLibraryNotebookPicker();
  persistAppState();
}

function setMaterialDeleteMode(materialId) {
  document.querySelectorAll(".material-card.delete-mode").forEach((card) => card.classList.remove("delete-mode"));
  if (!materialId) return;
  document.querySelectorAll(`.material-card[data-material-id="${materialId}"]`).forEach((card) => card.classList.add("delete-mode"));
}

function getNotebookMaterialCards() {
  return [...document.querySelectorAll('[data-material-panel="all"] .material-card')].filter((card) => {
    return card.dataset.materialType === "本子" || card.dataset.materialCategory === "notebooks";
  });
}

function renderLibraryNotebookPicker() {
  if (!libraryNotebookPicker || !libraryNotebookAddButton) return;
  const notebookMaterials = getNotebookMaterialCards();
  libraryNotebookPicker.innerHTML = "";
  libraryNotebookAddButton.disabled = true;

  if (!notebookMaterials.length) {
    libraryNotebookPicker.innerHTML = '<p class="empty-note">素材库里还没有本子素材。</p>';
    return;
  }

  notebookMaterials.forEach((materialCard) => {
    const button = document.createElement("button");
    button.className = "selectable-notebook";
    button.type = "button";
    button.dataset.sourceMaterialId = materialCard.dataset.materialId;

    const materialImage = materialCard.querySelector(".material-image");
    const sourceCutout = materialImage?.querySelector(".cutout-image");
    const cover = document.createElement("div");
    cover.className = "notebook-cover default-cover-paper";

    if (sourceCutout) {
      cover.className = "notebook-cover cutout-cover";
      applyCutoutCover(cover, sourceCutout.src, Number(materialCard.dataset.materialTilt || 0));
    } else if (materialImage?.style.backgroundImage) {
      cover.style.backgroundImage = materialImage.style.backgroundImage;
      cover.style.backgroundSize = "cover";
      cover.style.backgroundPosition = "center";
    }

    const title = document.createElement("span");
    title.textContent = materialCard.querySelector("h2")?.textContent.trim() || "未命名本子";
    button.append(cover, title);
    libraryNotebookPicker.append(button);
  });
}

document.querySelectorAll("[data-view]").forEach((control) => {
  control.addEventListener("click", () => showView(control.dataset.view));
});

document.querySelector('[data-view="material-detail"]')?.addEventListener("click", resetMaterialDetail);

materialTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setMaterialDeleteMode(null);
    materialTabs.forEach((item) => item.classList.toggle("active", item === tab));
    materialPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.materialPanel === tab.dataset.materialTab);
    });
  });
});

materialsView?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".material-delete-button");
  if (deleteButton) {
    event.stopPropagation();
    const card = deleteButton.closest(".material-card");
    openMaterialDeleteModal(card?.dataset.materialId);
    return;
  }

  const card = event.target.closest(".material-card");
  if (!card) {
    setMaterialDeleteMode(null);
    return;
  }
  if (suppressMaterialClick) {
    suppressMaterialClick = false;
    return;
  }
  if (card.classList.contains("delete-mode")) return;
  openMaterialDetail(card);
});

materialsView?.addEventListener("pointerdown", (event) => {
  const card = event.target.closest(".material-card");
  if (!card || event.target.closest(".material-delete-button")) return;
  clearTimeout(materialLongPressTimer);
  materialLongPressTimer = setTimeout(() => {
    suppressMaterialClick = true;
    setMaterialDeleteMode(card.dataset.materialId);
  }, 650);
});

["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
  materialsView?.addEventListener(eventName, () => clearTimeout(materialLongPressTimer));
});

materialsView?.addEventListener("contextmenu", (event) => {
  if (event.target.closest(".material-card")) event.preventDefault();
});

materialDeleteCancel?.addEventListener("click", closeMaterialDeleteModal);

materialDeleteModal?.addEventListener("click", (event) => {
  if (event.target === materialDeleteModal) closeMaterialDeleteModal();
});

materialDeleteConfirm?.addEventListener("click", () => {
  deleteMaterial(pendingDeleteMaterialId);
  setMaterialDeleteMode(null);
  closeMaterialDeleteModal();
});

notebookFilterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    notebookFilterTabs.forEach((item) => item.classList.toggle("active", item === tab));
    applyNotebookFilter();
  });
});

notebookShelf?.addEventListener("click", (event) => {
  const card = event.target.closest(".shelf-notebook-card");
  if (!card) return;
  openNotebookInfo(card);
});

notebookActionTrigger?.addEventListener("click", openNotebookActionMenu);
notebookToggleStatus?.addEventListener("click", () => {
  updateNotebookStatus(currentNotebookCard, currentNotebookStatus === "archived" ? "writing" : "archived");
  if (currentNotebookCard) openNotebookInfo(currentNotebookCard);
  closeNotebookActionMenu();
});
notebookEditInfo?.addEventListener("click", openNotebookEdit);

document.addEventListener("click", (event) => {
  if (!notebookActionModal?.classList.contains("open")) return;
  if (event.target.closest("#notebook-action-modal") || event.target.closest("#notebook-action-trigger")) return;
  closeNotebookActionMenu();
});

document.querySelectorAll(".detail-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  });
});

notebookModeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    notebookModeTabs.forEach((item) => item.classList.toggle("active", item === tab));
    notebookModePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.notebookPanel === tab.dataset.notebookMode);
    });
  });
});

document.querySelectorAll(".selectable-notebook").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".selectable-notebook").forEach((item) => item.classList.toggle("selected", item === card));
  });
});

libraryNotebookPicker?.addEventListener("click", (event) => {
  const card = event.target.closest(".selectable-notebook");
  if (!card) return;
  libraryNotebookPicker.querySelectorAll(".selectable-notebook").forEach((item) => {
    item.classList.toggle("selected", item === card);
  });
  if (libraryNotebookAddButton) libraryNotebookAddButton.disabled = false;
});

libraryNotebookAddButton?.addEventListener("click", () => {
  const selected = libraryNotebookPicker?.querySelector(".selectable-notebook.selected");
  if (!selected) return;
  const source = document.querySelector(`[data-material-panel="all"] .material-card[data-material-id="${selected.dataset.sourceMaterialId}"]`);
  if (!source) return;

  const card = createNotebookCard({
    name: source.querySelector("h2")?.textContent.trim() || "未命名本子",
    brand: source.dataset.materialBrand || "",
    spec: source.dataset.materialNote || "",
    coverUrl: readCutoutData(source.querySelector(".material-image")),
    tilt: Number(source.dataset.materialTilt || 0),
  });

  removeEmptyState(notebookShelf);
  notebookShelf?.append(card);
  applyNotebookFilter();
  updateRecordNotebookOptions();
  updateProfileStats();
  updateMonthSummary();
  persistAppState();
  showView("notebooks");
});

entryCardList.addEventListener("click", (event) => {
  const card = event.target.closest(".entry-card");
  if (!card) return;
  openStory(card.dataset.cardId);
});

notebookInfoEntryList?.addEventListener("click", (event) => {
  const card = event.target.closest(".entry-card");
  if (!card) return;
  openStory(card.dataset.cardId);
});

clearFilter.addEventListener("click", () => {
  selectedDate = null;
  renderCalendar();
  renderEntryCards();
  updateMonthSummary();
});

document.querySelector("#story-close").addEventListener("click", closeStory);
prevMonth.addEventListener("click", () => {
  if (currentMonthIndex === 0) return;
  currentMonthIndex -= 1;
  selectedDate = null;
  renderCalendar();
  renderEntryCards();
  updateMonthSummary();
});
nextMonth.addEventListener("click", () => {
  if (currentMonthIndex === calendarMonths.length - 1) return;
  currentMonthIndex += 1;
  selectedDate = null;
  renderCalendar();
  renderEntryCards();
  updateMonthSummary();
});
async function initApp() {
  await loadPersistedState();
  renderCalendar();
  renderEntryCards();
  updateRecordNotebookOptions();
  updateProfileStats();
  updateMonthSummary();
}

initApp();

homeAddButton.addEventListener("click", () => {
  scanInput.click();
});

recordBack.addEventListener("click", () => showView("calendar"));

scanInput.addEventListener("change", () => {
  const file = scanInput.files[0];
  if (!file) return;
  scanForm.classList.remove("scanned");
  scanForm.classList.add("scanning");
  scanStatus.textContent = "等待选择页面边界...";
  openDocumentScanner(file);
});

scannerHandles.forEach((handle) => {
  handle.addEventListener("pointerdown", (event) => {
    activeScannerCorner = handle.dataset.corner;
    handle.setPointerCapture(event.pointerId);
    updateScannerCorner(event);
  });

  handle.addEventListener("pointermove", updateScannerCorner);
  handle.addEventListener("pointerup", () => {
    activeScannerCorner = null;
  });
});

scannerCancel?.addEventListener("click", () => {
  closeDocumentScanner();
  scanInput.value = "";
  scanForm.classList.remove("scanning");
});

scannerRetake?.addEventListener("click", () => {
  closeDocumentScanner();
  scanInput.value = "";
  scanInput.click();
});

scannerFinish?.addEventListener("click", finishDocumentScan);
recordSaveButton?.addEventListener("click", saveRecordEntry);

function closeCustomSelects(except = null) {
  customSelects.forEach((select) => {
    if (select === except) return;
    select.classList.remove("open");
    select.querySelector(":scope > button")?.setAttribute("aria-expanded", "false");
  });
}

customSelects.forEach((select) => {
  const trigger = select.querySelector(":scope > button");
  const triggerLabel = trigger?.querySelector("span");
  const hiddenInput = select.querySelector("input[type='hidden']");
  const optionButtons = select.querySelectorAll(".select-menu button");

  trigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !select.classList.contains("open");
    closeCustomSelects(select);
    select.classList.toggle("open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });

  optionButtons.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      const value = option.dataset.value || option.textContent.trim();
      optionButtons.forEach((item) => item.classList.toggle("active", item === option));
      if (triggerLabel) triggerLabel.textContent = value;
      if (hiddenInput) hiddenInput.value = value;
      if (select === materialTypeSelect && !pendingMaterialImage) {
        const activeCard = currentMaterialId ? document.querySelector(`.material-card[data-material-id="${currentMaterialId}"]`) : null;
        if (currentMaterialId && !activeCard?.querySelector(".material-image")?.style.backgroundImage) materialImageCleared = false;
        updateMaterialPreview(activeCard);
      }
      closeCustomSelects();
    });
  });
});

document.addEventListener("click", () => closeCustomSelects());

materialUploadTrigger?.addEventListener("click", () => {
  materialImageInput?.click();
});

materialImageRemove?.addEventListener("click", () => {
  pendingMaterialImage = null;
  materialImageCleared = true;
  if (materialImageInput) materialImageInput.value = "";
  updateMaterialPreview();
});

materialImageInput?.addEventListener("change", async () => {
  const file = materialImageInput.files[0];
  if (!file) return;
  setUploadProcessing(materialUploadTrigger, true);
  try {
    pendingMaterialImage = await prepareCutoutImage(file);
    pendingMaterialTilt = randomTilt();
    materialImageCleared = false;
    const activeCard = currentMaterialId ? document.querySelector(`.material-card[data-material-id="${currentMaterialId}"]`) : null;
    updateMaterialPreview(activeCard);
  } finally {
    setUploadProcessing(materialUploadTrigger, false);
  }
});

materialDetailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getMaterialFormData();
  if (!currentMaterialId && materialImageCleared && !pendingMaterialImage) materialImageCleared = false;
  syncMaterialCards(data);
  currentMaterialId = data.id;
  pendingMaterialImage = null;
  showView("materials");
});

notebookUploadTrigger?.addEventListener("click", () => {
  notebookImageInput?.click();
});

notebookImageInput?.addEventListener("change", async () => {
  const file = notebookImageInput.files[0];
  if (!file || !notebookUploadHint) return;
  setUploadProcessing(notebookUploadTrigger, true);
  notebookUploadHint.textContent = "正在抠出本子封面...";
  try {
    pendingNotebookCover = await prepareCutoutImage(file);
    pendingNotebookTilt = randomTilt();
    renderNotebookNewPreview();
    notebookUploadHint.textContent = `已选择 ${file.name}`;
  } finally {
    setUploadProcessing(notebookUploadTrigger, false);
  }
});

notebookNewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = notebookNewName?.value.trim() || "未命名本子";
  const card = createNotebookCard({
    name,
    brand: notebookNewBrand?.value.trim() || "",
    spec: notebookNewSpec?.value.trim() || "",
    coverUrl: pendingNotebookCover,
    tilt: pendingNotebookTilt,
  });
  removeEmptyState(notebookShelf);
  notebookShelf?.append(card);
  applyNotebookFilter();
  updateRecordNotebookOptions();
  updateProfileStats();
  updateMonthSummary();
  persistAppState();
  showView("notebooks");
});

notebookEditUploadTrigger?.addEventListener("click", () => {
  notebookEditImageInput?.click();
});

notebookEditImageInput?.addEventListener("change", async () => {
  const file = notebookEditImageInput.files[0];
  if (!file || !currentNotebookCard) return;
  setUploadProcessing(notebookEditUploadTrigger, true);
  notebookEditUploadHint.textContent = "正在抠出本子封面...";
  try {
    pendingNotebookCover = await prepareCutoutImage(file);
    pendingNotebookTilt = randomTilt();
    const previewCover = currentNotebookCard.querySelector(".notebook-cover")?.cloneNode(true);
    if (previewCover) {
      applyCutoutCover(previewCover, pendingNotebookCover, pendingNotebookTilt);
      notebookEditCoverPreview.innerHTML = "";
      notebookEditCoverPreview.append(previewCover);
    }
    notebookEditUploadHint.textContent = `已选择 ${file.name}`;
  } finally {
    setUploadProcessing(notebookEditUploadTrigger, false);
  }
});

notebookEditForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentNotebookCard || !notebookEditName.value.trim()) return;

  const previousName = currentNotebookCard.querySelector("h2")?.textContent.trim() || "";
  const nextName = notebookEditName.value.trim();
  currentNotebookCard.querySelector("h2").textContent = nextName;
  currentNotebookCard.dataset.notebookBrand = notebookEditBrand.value.trim();
  currentNotebookCard.dataset.notebookSpec = notebookEditSpec.value.trim();

  if (pendingNotebookCover) {
    const cover = currentNotebookCard.querySelector(".notebook-cover");
    currentNotebookCard.dataset.notebookTilt = String(pendingNotebookTilt);
    applyCutoutCover(cover, pendingNotebookCover, pendingNotebookTilt);
  }

  journalCards.forEach((card) => {
    if (card.notebook === previousName) card.notebook = nextName;
  });
  updateNotebookStatus(currentNotebookCard, notebookEditStatus.value);
  updateRecordNotebookOptions();
  updateProfileStats();
  updateMonthSummary();
  persistAppState();
  showView("notebooks");
});
