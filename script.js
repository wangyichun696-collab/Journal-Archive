const entries = {
  1: { count: 1, style: "paper-collage", title: "夏日车票拼贴", notebook: "旅行记录本", page: 12, tags: ["车票", "复古", "蓝灰胶带"] },
  3: { count: 2, style: "blue", title: "蓝色收据页", notebook: "复古拼贴本", page: 28, tags: ["收据", "格纹", "冷色"] },
  5: { count: 1, style: "rose", title: "玫瑰便签页", notebook: "日常拼贴本", page: 9, tags: ["玫瑰", "便签", "印章"] },
  7: { count: 1, style: "paper-collage", title: "旧书页练习", notebook: "复古拼贴本", page: 34, tags: ["旧书页", "植物", "棕色"] },
  8: { count: 3, style: "blue", title: "三张小票拼贴", notebook: "旅行记录本", page: 18, tags: ["小票", "跨页", "蓝色"] },
  10: { count: 1, style: "rose", title: "午后粉色页", notebook: "日常拼贴本", page: 16, tags: ["粉色", "花", "贴纸"] },
  12: { count: 2, style: "paper-collage", title: "植物旧票贴纸", notebook: "复古拼贴本", page: 38, tags: ["OURS", "植物", "旧票"] },
  14: { count: 1, style: "blue", title: "蓝灰格纹实验", notebook: "复古拼贴本", page: 40, tags: ["mt", "格纹", "试色"] },
  15: { count: 1, style: "paper-collage today", title: "海边票根拼贴", notebook: "复古拼贴本", page: 42, tags: ["票根", "海边", "TN"] },
  18: { count: 1, style: "rose", title: "红色印章页", notebook: "日常拼贴本", page: 21, tags: ["印章", "红色", "标题"] },
  20: { count: 2, style: "paper-collage", title: "咖啡馆收纳页", notebook: "旅行记录本", page: 24, tags: ["咖啡", "票据", "便签"] },
  22: { count: 1, style: "blue", title: "雨天蓝色拼贴", notebook: "复古拼贴本", page: 45, tags: ["雨天", "蓝色", "胶带"] },
  25: { count: 1, style: "rose", title: "小花边角料", notebook: "日常拼贴本", page: 29, tags: ["边角料", "小花", "拼贴"] },
  28: { count: 2, style: "paper-collage", title: "月末素材复盘", notebook: "复古拼贴本", page: 51, tags: ["复盘", "素材", "推荐"] },
};

const calendarGrid = document.querySelector("#calendar-grid");
const entryCardList = document.querySelector("#entry-card-list");
const entryListKicker = document.querySelector("#entry-list-kicker");
const clearFilter = document.querySelector("#clear-filter");
const firstWeekOffset = 5;
const storyViewer = document.querySelector("#story-viewer");
const storyPaper = document.querySelector("#story-paper");
const storyDate = document.querySelector("#story-date");
const storyTitle = document.querySelector("#story-title");
const storyMeta = document.querySelector("#story-meta");
const storyTags = document.querySelector("#story-tags");
const storyNote = document.querySelector("#story-note");
const homeAddButton = document.querySelector("#home-add-button");
const sourceSheet = document.querySelector("#source-sheet");
const sheetBackdrop = document.querySelector("#sheet-backdrop");
const sourceCancel = document.querySelector("#source-cancel");
const cameraOption = document.querySelector("#camera-option");
const albumOption = document.querySelector("#album-option");
const recordBack = document.querySelector("#record-back");
const scanInput = document.querySelector("#scan-input");
const scanForm = document.querySelector(".entry-form");
const scanStatus = document.querySelector("#scan-status");
const orderedDays = Object.keys(entries).map(Number).sort((a, b) => a - b);
const journalCards = orderedDays.flatMap((day) => {
  const data = entries[day];
  return Array.from({ length: data.count }, (_, index) => ({
    ...data,
    day,
    id: `${day}-${index + 1}`,
    title: data.count > 1 ? `${data.title} ${index + 1}` : data.title,
    page: data.page + index,
  }));
});
let selectedDay = null;

for (let i = 0; i < firstWeekOffset; i += 1) {
  const spacer = document.createElement("div");
  spacer.className = "day-cell empty";
  spacer.setAttribute("aria-hidden", "true");
  calendarGrid.append(spacer);
}

for (let day = 1; day <= 31; day += 1) {
  const data = entries[day];
  const button = document.createElement("button");
  button.type = "button";
  button.className = data ? `day-cell has-entry ${data.style.includes("today") ? "today" : ""}` : "day-cell";
  button.setAttribute("aria-label", data ? `8月${day}日，${data.count}条手帐记录` : `8月${day}日，暂无记录`);
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
    if (data) {
      selectedDay = day;
      document.querySelectorAll(".day-cell").forEach((cell) => cell.classList.remove("selected"));
      button.classList.add("selected");
      renderEntryCards(day);
    }
  });

  calendarGrid.append(button);
}

function renderEntryCards(day = null) {
  const cards = day ? journalCards.filter((card) => card.day === day) : journalCards;
  entryListKicker.textContent = day ? `8 月 ${day} 日` : "本月手帐";
  clearFilter.hidden = !day;
  entryCardList.innerHTML = cards
    .map(
      (card) => `
        <button class="entry-card" type="button" data-card-id="${card.id}">
          <div class="scan-preview ${card.style.replace("today", "").trim()}"></div>
          <div>
            <p>${card.notebook} · 第 ${card.page} 页</p>
            <h2>${card.title}</h2>
            <span>2026 年 8 月 ${card.day} 日 · 单页扫描</span>
          </div>
        </button>
      `,
    )
    .join("");
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
  storyDate.textContent = `2026 年 8 月 ${data.day} 日`;
  storyTitle.textContent = data.title;
  storyMeta.textContent = `${data.notebook} · 第 ${data.page} 页 · 单页扫描`;
  storyTags.innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
  storyNote.textContent = "已链接到本子页面，可以继续查看扫描件和页面归档信息。";
}

function showView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `${viewName}-view`);
  });

  document.querySelector(".phone-frame").classList.toggle("record-mode", viewName === "record");

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });

  document.querySelectorAll(".bottom-tab").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });
}

document.querySelectorAll("[data-view]").forEach((control) => {
  control.addEventListener("click", () => showView(control.dataset.view));
});

entryCardList.addEventListener("click", (event) => {
  const card = event.target.closest(".entry-card");
  if (!card) return;
  openStory(card.dataset.cardId);
});

clearFilter.addEventListener("click", () => {
  selectedDay = null;
  document.querySelectorAll(".day-cell").forEach((cell) => cell.classList.remove("selected"));
  renderEntryCards();
});

document.querySelector("#story-close").addEventListener("click", closeStory);
renderEntryCards();

homeAddButton.addEventListener("click", () => {
  sourceSheet.classList.add("open");
  sourceSheet.setAttribute("aria-hidden", "false");
});

function closeSourceSheet() {
  sourceSheet.classList.remove("open");
  sourceSheet.setAttribute("aria-hidden", "true");
}

function pickImage(source) {
  if (source === "camera") {
    scanInput.setAttribute("capture", "environment");
  } else {
    scanInput.removeAttribute("capture");
  }

  scanInput.click();
}

sheetBackdrop.addEventListener("click", closeSourceSheet);
sourceCancel.addEventListener("click", closeSourceSheet);
cameraOption.addEventListener("click", () => pickImage("camera"));
albumOption.addEventListener("click", () => pickImage("album"));
recordBack.addEventListener("click", () => showView("calendar"));

scanInput.addEventListener("change", () => {
  if (!scanInput.files.length) return;

  closeSourceSheet();
  showView("record");
  scanForm.classList.remove("scanned");
  scanForm.classList.add("scanning");
  scanStatus.textContent = "正在检测页面边缘...";

  window.setTimeout(() => {
    scanStatus.textContent = "正在校正透视和提亮...";
  }, 700);

  window.setTimeout(() => {
    scanForm.classList.remove("scanning");
    scanForm.classList.add("scanned");
    scanStatus.textContent = "扫描完成";
  }, 1400);
});
