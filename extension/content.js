// content.js (Content Script)

async function loadSave() {
  await chrome.runtime.sendMessage({ action: "GET" });

  const response = await new Promise((resolve) => {
    chrome.runtime.onMessage.addListener(resolve);
  });

  const save = response.save;

  // 這裡可以將save放進localStorage

  console.log("載入完成");
}

// 之後可以改成直接從localStorage拿資料
async function uploadSave(save) {
  const data = JSON.stringify(save, null, 2);

  await chrome.runtime.sendMessage({
    action: "POST",
    data,
  });

  await new Promise((resolve) => {
    chrome.runtime.onMessage.addListener(resolve);
  });

  console.log("上傳完成");
}

const save = {
  "2023-11": [
    {
      text: "設定功能-JS 動畫選項偏後端\n(從createBGA提取timeline然後在switchPauseBtn控制)",
      category: "PJ29",
      status: "O",
    },
    {
      text: 'JS UI 製作結束動畫\n(開始撥放一瞬間switchView"none") (延遲送關閉請求給IPC來撥放動畫)(content往下，剩下背景)\n\n設定功能-JS 色彩選項給定正確預設值\n設定功能-JS 色彩選項給定正確預設值、色彩選項偏後端、語言選項偏後端。\n\nJS 點擊動畫在保持向後兼容同時，也可以return給變數',
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 修復更換語言後未如預期在切換暫停後顯示正確文本、修復某些文字數量過多之問題\n2. 語言選項懸停效果",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "1. 更改架構為以DOM為主，取消tasks陣列，引入JQ。\n2.拆分addtask()\n3.改進上傳UI",
      category: "PJ30",
      status: "O",
    },
    {
      text: "1.使separator被刪除成為可能\n2.初步將gsap導入",
      category: "PJ30",
      status: "O",
    },
    {
      text: "修復GIT同步問題",
      category: "PJ30",
      status: "F",
    },
    {
      type: "separator",
    },
    {
      text: "1. CSS單位變換\n2. 搜尋功能製作\n3. 搜尋與篩選整合",
      category: "PJ30",
      status: "O",
    },
    {
      text: "1. 改進彈出視窗動畫\n2. 新增搜尋icon",
      category: "PJ30",
      status: "O",
    },
    {
      text: "增加清空搜尋欄功能",
      category: "PJ30",
      status: "O",
    },
    {
      text: "taskItem的類別用方框框住，置於左側，字體可以根據類別有不同顏色",
      category: "PJ30",
      status: "O",
    },
    {
      text: "taskItem背景顏色根據類別從左下角漸變，但不影響類別框本身顏色",
      category: "PJ30",
      status: "S",
    },
    {
      text: "雙擊可以編輯內文，記得編輯完成放回屬性",
      category: "PJ30",
      status: "O",
    },
    {
      text: '修復篩選與新增時，缺少"PJ30"選項的問題',
      category: "PJ30",
      status: "O",
    },
    {
      text: "1. 重新設計刪除時樣式、交互效果\n2. 日期懸停時，上下padding增加，日歷icon小格子icon stagger。",
      category: "PJ30",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "1. 正下方新增時間選擇，包含年分與月份 \n2. domToJSON函數增加參數date，取得當前網頁時間選擇.val()，並根據該資料存到{key: Date: value:[原本的陣列]} \n3.該函數每次切換到不同月份都觸發一次，並先存到localStorage。 \n4. 配合該改動，downloadJSON改成從localStorage下載json \n5. 初始化網頁時，固定在當前月份。 \n6. jsonToDOM函數一樣會有date參數，除了初始化，每次切換月份時觸發，先clearTasks再呼叫\n7. 日期懸停時，上下padding增加，日歷icon小格子icon stagger。",
      category: "PJ30",
      status: "O",
    },
    {
      text: "1. 切分 taskUtils.js 至 taskUtils.js 與 Utils.js。",
      category: "PJ30",
      status: "S",
    },
    {
      text: "左下按鈕下方新增版本顯示，背景為與header同色，右上方有border-radius\n改成用註解在同個檔案下分類",
      category: "PJ30",
      status: "O",
    },
    {
      text: "將切換日期整個流程整合成一個函數changeDOM",
      category: "PJ30",
      status: "O",
    },
    {
      text: "1. 更新可以接受有換行之工作內容\n2. 更新可以編輯已有工作內容至有換行狀態",
      category: "PJ30",
      status: "O",
    },
    {
      text: "製作搜索懸停效果，可能是上層div 40*40 clip-path圖片，加上內部img長方形滑過",
      category: "PJ30",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "1. 增加釘選按鈕在左上角，綁定在right panel，使用absolute。 \n2. 按下後cursor會變成釘選狀態，點擊工作會拉開右選單，並返回auto，點擊其他地方，會直接返回auto，在釘選狀態下點擊右鍵，會直接返回auto。\n3. 當切換狀態時，該task背景的顏色會變化，但不是整個，而是從右側或左側會漸變一個相應的顏色",
      category: "PJ30",
      status: "S",
    },
    {
      text: "1. input, select 改為純色選擇，利用與底下計算平均值，分為header > select 與 panel > select，最後利用分割畫面判斷正確性 \n2. 自定義外框的上一層再增加並用clip-path",
      category: "PJ30",
      status: "O",
    },
    {
      text: '有關input的focus與blur事件的自定義動畫\n1. 該input上層增加container，同層增加outline container，outline container內增加一個outline BG\n     (outline BG有四個，對應上下左右的外框，這樣才能在框邊緣為圓弧形)\n2. outline container平常與input一樣大，在focus時利用scale比該input大一點點\n3. outline container 用 clip-path將自己以外遮罩，BG會在focus時從左下移動至右上再回來一點占滿整個outline (利用ease:"back")\n4. 可以的話擴展到select',
      category: "PJ30",
      status: "O",
    },
    {
      text: "1. 先做出右側面板 \n2. 右側面板左上有按鈕(利用現成的)可以收縮，在右側面板出現情況下，右鍵也可以收縮。\n3. 面板收或縮會轉180度，面板收起時按鈕位置在面板左側(有自己的背景)，面板開啟時按鈕在面板內(背景去掉) \n4. 收縮按鈕點擊效果!、新增工作時打開該面板 (利用時間軸打開，這樣判斷邏輯才不會跑掉，指派新工作到清單後，執行onEnd函數，若判斷沒有暫存了，就將面板收起)\n",
      category: "PJ30",
      status: "O",
    },
    {
      text: '1. 右側面板收縮按鈕懸停時，大小於符號會往"|"符號靠近\n2. 實裝新增工作會先移動至暫存區功能\n3. 改善彈出視窗互動效果\n4. 修復滾動條殘影問題',
      category: "PJ30",
      status: "O",
    },
    {
      text: '重新命名有關json的函數的參數名字 (tasks作為"工作清單陣列字串", save作為"存檔物件字串", date作為"ISO格式年月字串"，將有用到這些名字的變數的名字換成其他的，或是省略)',
      category: "PJ30",
      status: "O",
    },
    {
      text: "緊急! 將所有用到em為單位的樣式重寫",
      category: "PJ30",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "重製 Fence Pack 4 \n1. 挑一個材質開始，將架構表複製到該材質上方，利用Texture與Adj部分調出與原本輸出顏色相近之基色。\n",
      category: "PJ26",
      status: "O",
    },
    {
      text: "1. 先做出常駐上箭頭與下箭頭(背景是圓形，用BGcolor做，有陰影，圖示是大小於(暫定))\n2. 上箭頭與下箭頭的懸停效果(對調顏色，背景與圖示顏色，原本是白圖示灰背景，變成黑+紅)與點擊效果 (單純縮放)\n3. 配合該按鈕，移動刪除時的完成按鈕。",
      category: "PJ30",
      status: "O",
    },
    {
      text: "寫出 findFirstTask(status: string) => index: number 與 scrollToTask(index) => void",
      category: "PJ30",
      status: "O",
    },
    {
      text: "實裝上下按鈕功能",
      category: "PJ30",
      status: "O",
    },
    {
      text: "重製 Fence Pack 4 第一個材質\n2. 再將底下其他部分先以新模組方式重新組裝\n3. 根據架構表分類，保持3或4通道(將對應通道從上到下擺放)。\n4. 最後將不明顯的=刪除，可以用模組替換的=替換。\n5. 再加上新模組。",
      category: "PJ26",
      status: "O",
    },
    {
      text: "1. 左下四個按鈕變成每個寬度大約50%，有背景，按鈕內部有圖示(左)+文字(右)，排版為每層兩個總column (可以單純用wrap)\n2. 製作懸停效果 (垃圾桶蓋子會翻開、旁邊三條線會往右走，離開視野後(clip-path)，設定到左邊，再從左邊回來)\n(存檔按鈕會左到右轉向(看要不要用3D transform)，往下掉，再從上方掉回來，中間的圓點會先scale0再出現(用keyframe))\n(上傳按鈕的箭頭會往上，再從下方出現，右下角的圓點會scale0再出現)\n3. 製作點擊效果\n4. 重新設計整體顏色",
      category: "PJ30",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "issue: 由於p編輯後使用html解析，因此特殊符號會變成類似亂碼，但若是直接新增並且沒有被編輯過，那就沒問題。\nsolution: 不要直接透過p編輯，而是先轉為textarea\n",
      category: "PJ30",
      status: "O",
    },
    {
      text: "重新寫workflow 步驟分成 update json > deploy至deploy > 觸發pages deploy",
      category: "PJ29",
      status: "O",
    },
    {
      text: "將桌面應用程式寫法完全改成網頁寫法，要注意requestImage需要先強制下載所有jpg，並且這個過程要有promise。\n可以利用Crtl + shift + R 強制重新快取來測試下載是否正常\nloadManifest ( manifest  [loadNow=true]  [basePath] )",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 增加Crtl + S 快捷鍵可以存檔\n2. 輸入括號或引號時會自動輸入結尾(textarea)\n3. 刪除括號或引號時會自動刪除第一個出現的結尾(textarea)\n",
      category: "PJ30",
      status: "O",
    },
    {
      text: "研究並實裝：\n1. 輸入括號或引號時會自動輸入結尾(p編輯)\n2. 刪除括號或引號時會自動刪除第一個出現的結尾(p編輯)\n",
      category: "PJ30",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "1. 製作資料夾圖示\n2. 製作左側選單上方靜態div塊與動態組件。(component.js:  createFolderIcon() => JQ 與 createFolderButton() => JQ)\n3. 製作資料夾圖示互動效果(interaction.js:  時間軸工廠createTimeline(element, ...)或是全域時間軸變數(屬性)const timeline = gsap...)(懸停會打開，若點擊後拉開則維持打開，沒拉開則滑鼠離開後關閉，點擊時會對該塊scale0.7)\n4. 寫過場，平時只顯示一個主資料夾按鈕，當切換資料夾或是按下主資料夾按鈕時，正下方從左到右出現水平分割線(本來就有但width:0)，其他資料夾按鈕用彈出的感覺出現，並且是stagger\n5. 製作createFolderBox(url)\n6. 將JS與CSS完全分離出去，使其不需再依附於PJ30",
      category: "PJ29",
      status: "O",
    },
    {
      text: "主頁內容：\n1. 組件：內容是三個長方塊，塊本身是組件，塊上有兩個方法建立的組件，addFolderIcon與addRWLabels。\n2. 互動：懸停時資料夾圖示會放大並有打開的動畫，背景變成資料夾內第一張圖片，點擊則是塊本身scale0.7。\n3. 搜尋：搜尋的概念是只搜尋當前DOM，比如對於主頁內容，就是搜尋資料夾(當然實際上會無意義，但符合直覺)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "主頁header：\n與PJ30一樣，但右方變成圓點，背景色是當前所在資料夾對應顏色，還沒進子資料夾是紅色\n主頁左側選單：\n上方是資料夾結構，作品集>三個子資料夾，一共四個導航按鈕。下方則是選擇排序方式。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 完成轉class\n2. 初步製作排序選單\n3. 載入週期",
      category: "PJ29",
      status: "O",
    },
    {
      text: "載入時：\n可以顯示當前進度，下載圖片量或是%數，完成後換解析DOM...，順便作為延遲，讓畫面順了再顯示。載入容器加內部希望也用組件方式構建，這樣的話未來載入png也可以拿來用，甚至也顯示%數\n載入轉主資料夾：\n載入完成後，載入動畫轉成LOGO，整個container向下或上滑出，滑出同時也淡出。淡出完成不要刪除，未來可以拿來用在載入PNG\n淡出開始後幾秒但還沒結束前header, sidebar滑動(使用from)出現(包含child)，內容物(也就是三資料夾)出現時有彈出感",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "1. 建立Gallery類，初始化Gallery時(根據category分三種)，會將預載入圖片對象給傳入\n2. 將ImageManager改名為loadManager\n3. sort方法移至Gallery。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "圖片懸停 - 結構，容器下有圖片與反光片容器，反光片容器的變換z軸較低，有clip inset(0 round 10)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "圖片懸停 - 懸停時，“偵測圖片容器”，圖片容器放大。\n\n圖片開始偵測mousemove，以中心根據游標位置以x, y軸旋轉，讓反光片被看到，同時，反光片容器也會有一樣旋轉，而反光片則會補正旋轉回0，保持平面，離開時記得off\n\n旋轉也可以用ease back讓他有不小心衝過頭又跑回來的感覺",
      category: "PJ29",
      status: "O",
    },
    {
      text: "解決scrollBar是以最高容器為高度基準之Bug(已確認不會有重疊問題(假如過場不變的狀況下))：\n1. 試試看直接在images-container增加固定高度\n2. 再次增加一層在images-container上面，原本images-container改名為images-grid",
      category: "PJ29",
      status: "O",
    },
    {
      text: "改善圖片庫之間切換的使用者體驗(先消失再卡)，消失仍然可以隨機stagger，彈出(相反)效果\n\n為燈泡組件增加屬性：當前顏色， 為燈泡組件增加方法：閃爍，就是switchLight但直接帶入當前顏色，可以用在input事件",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "* 架構：(以左側選單上方來說，按鈕點擊、懸停效果時間軸是寫在interaction，新增按鈕時component會引用時間軸綁定效果，而點擊了按鈕後選單收起的時間軸則是在transition，另外點擊後假設搜尋欄要清空這樣的功能函數寫在utility，綁定該時間軸與觸發功能則是在main。另外component只管html結構，樣式仍給CSS，因此記得指派class)",
      category: "PJ29",
      status: "O",
    },
    {
      text: '進預覽的方法：\n首先會有個類 > PreviewImage(src)，再來在類Gallery中，會有方法 > onSelect(handler(e) => void)其中e可以直接是src方便使用，也可以是原生event再用target.find("img的類名").attr()。\n最後，在該監聽中，可以偵測點擊的圖片，並且創建新的PreviewImage實例(同時會創建元素，預覽圖片是從url重新建立)，並觸發Gallery的hide方法，在適當時機讓PreviewImage實例.show()，就可以使用了',
      category: "PJ29",
      status: "O",
    },
    {
      text: "decode改到工具函數\nPreviewImage類的show方法有url參數，若沒有特別輸入url，則保持this.url，另外要記得先decode再play。\n因為上述，因此Preview hide一定要記得await   =>   最後改為同步顯示而不decode",
      category: "PJ29",
      status: "O",
    },
    {
      text: "修復folderBox在懸停後resize時寬度錯誤之問題",
      category: "PJ29",
      status: "O",
    },
    {
      text: "進預覽畫面：\n內容全部消失.hide()\n上方搜尋欄消失，變成檔名與副檔名。\n右方變成直立式Light Box，下方是左右兩個按鈕，返回與全螢幕\n時間軸主要是全部該消失的一起消失 > 該出現的一起再出現",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 寫註解 2. 返回按鈕 3. 實裝上下按鈕功能\n4. 搜尋欄show hide、圖片名稱顯示、副檔名按鈕",
      category: "PJ29",
      status: "O",
    },
    {
      text: "loadManager確認(blob同元素是否可以重複decode，若不行，重寫loadManager)\n=> 改成用tag loading方式下載",
      category: "PJ29",
      status: "O",
    },
  ],
  "2023-05": [],
  "2023-08": [
    {
      text: "202308\n",
      category: "未分類",
      status: "U",
    },
  ],
  "2023-09": [
    {
      text: "作品集網站 新增原圖檔預覽頁面與植入預覽功能 (利用單html+JS生成技術，需具防呆措施)。\n作品集網站 優化UI過渡動畫與程式碼。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "增加新全局瑕疵紋理(Dirt Dust01, SI002_var2)，包含係數輸出(不透明度)，預設為灰色。\n",
      category: "PJ24",
      status: "O",
    },
    {
      text: "PJ27-4 門滑軌-Append與螺絲包-Append至場景，以及光影設計#3。",
      category: "PJ27",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "PJ27-4 升降梯鋼索接點建模與Append至場景放置，以及升降梯鋼索螺絲*3與粗細初步決定。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 升降梯門細節#1與門細節#2，包括實例化。同時進行升降梯結構細節#1的加倒角修改和自訂倒角，以及結構細節#2的增加縫線和加螺絲（細分或倒角增加次數）。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 升降機損壞版本實例化，確保實例物件可散落在旁邊。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 升降梯所有零件確定UV、平滑、法線處理。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 放置物件，將按鈕盒置於升降機門外，並在按鈕盒右方放置一個，保持拖曳機一正一反的配置。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 接鋼索，對分段實例化，確保三角形量充足。\nPJ27-4 避免鋼索材質都一樣長。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 升降機材質包括門、門軌、門軌滑輪組、鋼纜接點。\n捲揚機重放（放置至地面升降機右方，由目前資產重新做）。\n以及鋼纜輪的製作（整合TMP Front Support與Wheel）",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 擺放與接Cable。同時，在捲揚機右方刪除Cable。",
      category: "PJ27",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "PJ27-4 左方受損升降機彎曲程度修改。\nPJ27-4 最後實例化，包含數字貼花製作（大範圍的瑕疵利用形狀本身，邊緣利用實體化+EF製作瑕疵，再加上全局的部分退色以及瑕疵效果）。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 鋼纜接點實例修改來源，上方兩個螺絲改給鋼纜實例，鋼纜實例改為兩種，有/無螺絲。\nPJ27-4 兩側升降機再加上鋼纜輪及鋼纜接點。\nPJ27-4 地面材質保留目前錯置效果。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 製作、接電線，按鈕盒接一根線上至門後方（假裝有接點）。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 牆面材質#1，基本顏色：共用VactorVar+手動(紋理Mask)指派混合層，調色以參考為主。\nPJ27-4 地面材質初步調色，色調、飽和以參考為主，但比牆面更暗以及飽和度更低。\nPJ27-4 牆面材質#2，加上PJ27-4 Mask以及全局瑕疵。\nPJ27-4 牆面材質#3，最終凹凸的質感要出來，力量別調過低。",
      category: "PJ27",
      status: "O",
    },
    {
      text: "PJ27-4 光影最終設計，進行調色，最後進行Render。\nPJ27-4 正式命名為PJ21-2。",
      category: "PJ27",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "PJ24 Pointness本身似乎可以直接做，包括邊緣剝落，最後包成群組，確保倒角本身有被覆蓋到。\nPJ24 Base Scratch改名為Base Scratch Texture。\nPJ24 雙層雜訊紋理增加位置輸入。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "PJ24 Crack重製，包括考慮色彩混和的部分，使用高品質圖像修剪製作分支，最後定為輪廓來自高品質圖像，實際細節由生成紋理提供。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "製作Crack的過程包括：\n將所有Crack選取，反向選取，擴大選取，刪除，分割成各張，模糊（擴大選取：9、模糊：1.5）。\n放入Blender後差補使用Smart，再將每個分支合在一起隨機分配。\n調整參數有W、縮放、維度、層、離散、擴散、深度。\n維度以何種輪廓種類為中心顯示，\n層代表顯示Crack輪廓(維度)種類數，需最小值避免無維度顯示。\n離散是Crack之區塊分散程度。\n擴散是各區塊大小、深度是裂縫深度。\n每個維度有自己W的全局遮罩，遮罩需緊固，邊緣加上細節以避免切割Glitch，深度控制注意在0~1之間。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "PJ24 新增Vector Location Randomize。\nPJ24 刪除舊Crack節點和舊Base Crack節點。\nPJ24 新增Base Crack Coordinate節點、Texture Des.. (Crack)節點、Base Crack Texture (Set A)節點、Mask Crack D節點。\nPJ24 最終確認節點數應為63。",
      category: "PJ24",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "PJ24 Bump混和方式重製，包括4大色彩變化的混和方式和第四種色彩混和紋理的重新製作。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "PJ24 重製離散紋理，使用新方式為基底，改成三個參數控制：擴散、離散(縮放)、平滑。為確保擴散調整不影響平滑，使用Sigmoid Function，參數應在單位面積下只調整該參數所指屬性。",
      category: "PJ24",
      status: "O",
    },
    {
      text: 'PJ24 更新Collapse B、更新Crack B、Glass Stain混和方式修改。\nPJ24 Dent C參數量拆成"量"與"水平"。',
      category: "PJ24",
      status: "O",
    },
    {
      text: "PJ24 將新離散紋理移植進所有瑕疵節點，找到所有瑕疵節點的新參數預設值。\nPJ24 使用新檔案確認所有瑕疵節點的運作狀態，確認有哪些節點使用瑕疵節點。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "PJ24 Peeling Patch節點類型在細節凹凸部分，根據縮放改變程度時出錯之Bug進行修復。\nPJ24 Patch節點增加Edge類別、增加距離參數、增加扭曲參數。",
      category: "PJ24",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "增加新瑕疵節點(Plastic004 R) - 要有XYZ軸面旋轉方向控制參數，離散紋理應作為參數而不是混和。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "增加新瑕疵節點(SI003)(Water Stain) - 要有XYZ軸面旋轉方向控制參數，離散紋理應作為參數而不是混和。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "架構表整理。\n複製至四通道版本。",
      category: "PJ24",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "模組總表整理。\n建預覽玻璃材質之物件。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "玻璃架構重新設計 - 所有Inperfection節點拆分出來，刪除相應參數，原群組仍為Output類型，輸入色彩與粗糙度，參數為兩種變化的Amount Level，位置對照生成紋理參數，加上灰塵顏色控制，最後整個架構的Frame也得整理。",
      category: "PJ24",
      status: "O",
    },
    {
      text: "模組表預設值給定(玻璃就好)。\n最後check與整理 - 確認群組節點數、使用者數，刪除多餘檔案。\n更新穩定版(總結點數：67)。",
      category: "PJ24",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "重製 Intercom Pack 1/3、2/3、3/3。\n重製 Intercom Pack 更新原點、物件命名、節點命名、2型新增Decal、刪除多餘檔案、Cam naming Lighting、刪除多餘禎數、更新穩定版。",
      category: "PJ26",
      status: "O",
    },
    {
      text: "JS研究有關圖片移動縮放架構(偽代碼、確定方法)。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS研究有關圖片移動縮放嘗試1、嘗試2、requestAnimationFrame()。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS研究如何平滑化現有功能、優化目前進度的程式碼、擴展到任何圖片大小都可以、加上點Esc可以返回縮圖功能。",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "重製 Security Camera 1 導入準備。",
      category: "PJ26",
      status: "O",
    },
    {
      text: "JS 分業程式碼刪除放大鏡功能，並進行優化和架構整理：\n * 函式載入邏輯、載入完成、事件偵測（判斷當下畫面、根據畫面給對應功能）、同樣事件偵測內容放入相同() => {}。\n * 使用 if 與全域變數判斷要操作的功能（isGallery、isPreview、isFullscreen）。\n * 在主要判斷下方多寫不用 && 以便閱讀。\n * 注意切換畫面瞬間的操作都要記得更改變數。",
      category: "PJ29",
      status: "O",
    },
    {
      text: 'JS 分頁加入左右箭頭可切換上下張（在 fullscreen 時要禁止）。\nJS 分頁加入 Esc 時關閉預覽（在 fullscreen 時要禁止）。\nJS 分頁取消 currentImage 變數，Image 改為全域 const，被當作當前 $(".fullscreen-image-container img") 容器。\nJS 分頁增加函式（enterPreview、exitPreview）自動調用 switchView()。',
      category: "PJ29",
      status: "O",
    },
    {
      text: "CSS 分頁更新 HTML 更新。\n為 Code 分區製作臨時伺服器。\n主程式更新前準備狀態測試。",
      category: "PJ29",
      status: "O",
    },
    {
      text: 'JS 新功能在外部寫成函式型態並放入對應事件測試：\n\n進入全螢幕（包含 switchView("fullscreen")）、離開全螢幕、更新圖片容器變換。\nenterFullscreen()、exitFullscreen()、updateTransform()。\n\nJS 新功能加回主程式碼時要注意放在對應的事件中、 CSS 中 transition 位置、全域變數名稱',
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 新功能加回後測試。\nTest 全螢幕再次 Esc 後才關閉預覽（確認操作）。\n 刪除多餘檔案。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 新增放大時剛進入全螢幕（350ms）時，有黏著感，不會立刻繼續縮放。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "UI 研究隱藏滾動條但仍可以滾動。\nUI 改進在圖片牆時隱藏滾動條但仍可以滾動。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "UI 避免全螢幕時左右箭頭與關閉符號出現。\nUI 全螢幕至預覽時左右箭頭與關閉符號出現需要動畫。",
      category: "PJ29",
      status: "O",
    },
    {
      text: " UI 開啟預覽時的動畫改成（隨機挑一個一個 UI 分開 fadein）：\n\n背景的 fadein 很快，背景好了後才開始 UI 的 alpha 動畫隨機先後出現。\n關閉也要做，一樣概念，UI 先都淡出，再快速將背景 alpha 淡出。\n使用 alpha 曲線與全螢幕一樣，動畫時間須跟全螢幕淡出時間一致。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 改進在放大時會稍微改一下 translate 到游標位置（先在測試檔）。",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "Rou Var節點：\n刪除多餘參數(力量)\n需要金屬水平參數\n取消一開始粗糙度相乘後的緊固\n開放粗糙度變化值輸入負值",
      category: "PJ24",
      status: "O",
    },
    {
      text: " 新增Mask Texture Var A (參考攝影機)：\n使用Plastic004_2K_Displacement.jpg作為本質\n遮罩必須將分布平均偏移至0.5(可利用AddOn)\n離散紋理在無的地方也有一定變化量",
      category: "PJ24",
      status: "O",
    },
    {
      text: "其他任務： 整理架構表、刪除多餘檔案(68, 33)、加回穩定版",
      category: "PJ24",
      status: "O",
    },
    {
      text: "JS：\n將回歸校正寫成function\n改進在放大時會稍微改一下translate到游標位置(實裝)\n嘗試擺脫對於selenium依賴\n解決縮放導致超出範圍回來動畫有可能會跑掉之bug",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "Eletron：嘗試製作關閉應用程式之按鈕，了解流程模型，進程間通信之渲染至主進程單向",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Security Camera 1：由於PJ24更新，重新導入",
      category: "PJ26",
      status: "O",
    },
    {
      text: "主頁一體化改造：\n1. 重寫變數與函數、CSS、結構以準備一體化 (HTML)    2. 主頁新版本測試    3. HTML、CSS新增新結構之樣式，拆分成五份\n4. JS主頁移植switchView函數，主頁事件偵測增加判斷邏輯(isIndex)    5. JS主頁新版本測試\n6. JS寫主頁到分頁的過場(測試版本)（需思考switchView函數應在動畫完成後進行還是立刻，switchView函數應包在過場函數裡面）、HTML一體化 (圖片陣列一開始有四個全域變數let - imagesNature, imagesProps, imagesScene, imagesGallery)\n7. JS、CSS、HTML一體化嘗試    8. JS寫分頁到主頁的過場(測試版本)（需在預覽進圖片牆動畫結束才能進行）\n9. JS改進全螢幕移動圖片時游標動畫\n10. JS修復全螢幕移動圖片時快速點擊會導致游標動畫卡死BUG\n11. 結構整理 改成單一images資料夾 裡面包含Icon JPG PNG，專案名稱改為Portfolio",
      category: "PJ29",
      status: "O",
    },
    {
      text: "Eletron IPC雙向溝通：載入本地資料夾、載入本地資料夾之子資料夾、將該技術以更精簡及Jquery方式編寫、將該技術移植至主程式。\n\n將運行環境從python轉成Node.js與Eletron（須確保原本跟python溝通的關閉按鈕改成與eletron溝通），主頁新版本測試",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "Icons 命名與整理",
      category: "PJ29",
      status: "O",
    },
    {
      text: "新UI組設計，標題漸層左右反過來，JS UI，增加按鈕動畫函式（利用$(this)）：\n * 概念是CSS就設定transition:all\n * close-btn改成hover時是rotation(360d)\n * 全螢幕按鈕背景漸層預設不給，按下後會更新translateY，等到transition設定的秒數結束後利用setTimeout再改回來\n * 上一張與下一張按鈕動畫需在按鍵觸發時也觸發\n * 需思考若快速觸發時是否正常運作",
      category: "PJ29",
      status: "O",
    },
    {
      text: "UI，增加主頁陰影效果（利用新增底層架構）\n利用absolute top right... 0 並確定寬高，然後scale 做漸層\nUI，增加主頁陰影效果-1 按鈕",
      category: "PJ29",
      status: "O",
    },
    {
      text: "解決有時剛開啟時背景動畫不執行之BUG",
      category: "PJ29",
      status: "O",
    },
    {
      text: "主頁UI重製完成",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "安裝NPM版GSAP，希望不必擔心偽元素衝突，也不必再一直重新指派transition\n嘗試將GSAP暴露給renderer進程使用(外部測試)",
      category: "PJ29",
      status: "F",
    },
    {
      text: "研究GSAP對於順序動畫是否有幫助\n研究GSAP對於順序動畫是否可以用async",
      category: "PJ29",
      status: "O",
    },
    {
      text: "嘗試將按鈕動畫使用GSAP呈現",
      category: "PJ29",
      status: "F",
    },
    {
      text: '嘗試將進入全螢幕與退出動畫使用GSAP呈現\n新增switchView("none")以提供動畫時需要的邏輯判斷\n嘗試將進入圖片牆動畫使用GSAP呈現\n嘗試將退出圖片牆動畫使用GSAP呈現\n嘗試將之前Feature_a功能使用GSAP呈現\n嘗試將所有動畫改為GSAP呈現',
      category: "PJ29",
      status: "O",
    },
    {
      text: "若從分頁出來並進到不同分頁時應將scroll回到最上方\n * 在分頁opacity:0時延遲0.1秒做這件事，然後再fadeout\n * 由於opacity:0了，所以不須延遲主頁重新淡入的動畫",
      category: "PJ29",
      status: "O",
    },
    {
      text: "解決圖片放大後會導致移動過快之BUG、解決進全螢幕時會太慢隱藏按鈕之BUG、CSS 刪除遺留代碼",
      category: "PJ29",
      status: "O",
    },
  ],
  "2021-01": [
    {
      text: "202001",
      category: "PJ24",
      status: "U",
    },
  ],
  "2021-07": [
    {
      text: "202107",
      category: "PJ28",
      status: "U",
    },
  ],
  "2023-01": [
    {
      text: "202301",
      category: "未分類",
      status: "U",
    },
  ],
  "2023-06": [],
  "2023-04": [],
  "2023-10": [
    {
      text: '1. JS 將GSAP NPM版本刪除。\n2. 研究如何使用GIT。\n3. JS 使用GSAP shuffle()取代原有function。 \n4. JS 啟用GSAP overwrite:"auto"',
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. JS 重製所有動畫(先抓出適合總時長，並分配%數)。2. JS 進全螢幕時container z-index瞬間變4，JS 出全螢幕時container z-index瞬間變2 (進預覽可以考慮1.先覆層 2.圖片出現同時三個按鈕進行stagger) (出預覽可以考慮1.圖片消失同時三個按鈕進行stagger 2. 消覆層)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. JS 將放大時會以滑鼠為中心放大之功能加回。 2. 增加右鍵、ESC可以回到主頁功能。",
      category: "PJ29",
      status: "O",
    },
    {
      text: 'JS UI 製作開始動畫 (可以考慮使用.from()) (一開始時所有is都是false)(一開始，fadein(0)，opacity:0(由於display:flex物件不在面板大小是錯誤的)) (Loading背景變成.title背景) (載入完成後Loading字樣消失，背景變成左上角title的方塊，同時背景顏色也從載入變成.title漸變，.ico淡入，標題字從左到右逐個淡入(每個字較快，使得總體時間跟.ico淡入差不多)，.tool-bar淡入，從左到右依序淡入出現按鈕) (下方介面淡入，從左到右依序淡入出現按鈕) (最後switchView("index")) ',
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS UI 製作開始動畫，有可能的話再加上: (一開始只有icon在正中央(大小不變)(根據容器看能不能用top left center))、(載入字樣消失時icon淡入至正中央)、(Loading背景變成.title背景時，.ico也跟著移動至正確位置)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1.避免開頭動畫的boarder radius 一開始就出現。 2. 2.使用gsap.killTweensOf解決快速進全螢幕時按鈕未消失問題。 3. 研究如何優化某些元素動畫之效能",
      category: "PJ29",
      status: "O",
    },
    {
      text: "將hover拿掉 看效能是否有改善(並不是問題根源)，(實際原因是因為hover需要的transition會衝突)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 改成用js寫hover 並更新開場動畫。(用js寫hover一定要注意overwrite 有沒有運作 ) 2. 重寫按鈕點擊動畫 3. 進/出預覽動畫更新、圖片牆點擊回饋",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Security Camera 1 鏡頭外殼1 (注意極小斑點)",
      category: "PJ26",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "1. 背景動畫重製(參考reference)(向上為最底對齊最底，y:-50%)。 2. 主頁面UI重製(標題看大小是否OK，標題至右側分類，工具列移至右下)、(搜尋改至左下，按下後方框變成實心，並往右出現打字區域)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Security Camera 1 玻璃模型重製、鏡頭外殼前後、鏡頭外殼剩餘部分",
      category: "PJ26",
      status: "O",
    },
    {
      text: "研究如何保持relative下將元素鋪滿整個螢幕。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "開場動畫重製(loading淡出後)，(icon放大旋轉淡入，方塊往右上(原本)，右上按鈕放大從下往上掉落從右往左逐個(似原本)，下方方塊放大掉下，極短暫時間接該方塊按鈕放大...，底下從左到右逐個，搜尋欄跟著方塊，loading消失、icon出現、按鈕進場的時間壓低，按鈕可以在右上還沒全跑完前就先開始跑了)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. JS UI 製作載入動畫(為Loading字樣做動畫)。 2. 主頁進分頁轉場 (參考reference)(一開始記得切邏輯) (.content下去同時.gallery蒙版下來快速開始慢速結尾，結束後進元素圖片>按鈕，從最上開始逐個圖片stagger從個元素往下(彈跳)，圖片進完就切邏輯)",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "重製 Security Camera 1 鏡頭塑膠與鏡頭",
      category: "PJ26",
      status: "O",
    },
    {
      text: "1. 原玻璃輸出改名為(Mirror)。 2. 以玻璃輸出新建透明輸出(取代Glass)",
      category: "PJ24",
      status: "O",
    },
    {
      text: "重製 Security Camera 1 玻璃材質",
      category: "PJ26",
      status: "O",
    },
    {
      text: "鏡子、玻璃、穿透材質重製，(穿透：重新製作透明系數) ，(穿透：刪除合併VAR之輸出節點)，(鏡子：刪除合併VAR之輸出節點)，(Rou VAR移至最開始當成初始值)，(整個架構分成上下區域 上方雙通道)，(而鏡子表面不是鏡子的地方，或是穿透材質不該穿透的髒汙，則使用下方三通道位置呈現)，(有關架構說明須加進註解) ",
      category: "PJ24",
      status: "O",
    },
    {
      text: "鏡子、玻璃、穿透材質重製修復： 1. 鏡子材質重製-參數-灰塵量是錯誤的。 2. 提供非絕對值的XYZ遮罩",
      category: "PJ24",
      status: "O",
    },
    {
      text: "存回穩定版 (69 33)",
      category: "PJ24",
      status: "O",
    },
    {
      text: "出分頁轉場 (參考reference)(一開始記得切邏輯) (按鈕消失同時從最上開始逐個圖片stagger(整體inAndOut)) (.gallery下去同時.content下來快速開始慢速結尾)",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "設計回到頂部按鈕",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 再重製Security Camera 1 玻璃材質。2. 金屬與剩下材質。3. 刪除多餘UV。 4. 物件命名。5. 刪除多餘檔案。6. 節點命名",
      category: "PJ26",
      status: "O",
    },
    {
      text: "JS UI 圖片牆增加回到頂部按鈕 (若已經在頂部會消失)(一開始進圖片牆時就先set:y:+?，等到往下滑在向上移回來，出去時scrolltop同時將他再次移回set:y:+?)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "UI 返回主頁按鈕重新設計 ",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Security Camera 1 ，1. Cam Cam naming Lighting。 2. 更新穩定版",
      category: "PJ26",
      status: "O",
    },
    {
      text: "修復穿透輸出混和節點混和模式錯誤(應為相乘)",
      category: "PJ24",
      status: "O",
    },
    {
      text: "JS 1. 研究是否是因為上下張的點擊動畫導致的性能下降 - (測試結果：確定不是原因) 。 2. 研究是否是因為快速assignImage導致的性能下降 - (測試#1：在經過大約慢速10次開啟預覽並進全螢幕操作後，開始出現問題) 。 3. 研究是否是因為assignImage導致的性能下降 - (測試#2：只打開預覽但不進去全螢幕，在Nature反覆開啟不同img後，大約10次，回到首頁開始出現問題，進到Props繼續後，問題更加嚴重，然而一切到其他電腦畫面，再次回來，就變得跟一開始一樣順了) ",
      category: "PJ29",
      status: "O",
    },
    {
      text: "4. 研究是否是因為指針導致的性能下降 - (測試#3：只打開預覽但不真正指派圖片，只更換指針) (結論，即使在快速切換指針狀態下，也完全不會性能下降)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "5. 研究是動態元素還是.attr()導致的性能下降 - (測試#4：快速進出圖片牆，觀察是否也有一樣現象) (結論，進出圖片牆並不會導致性能下降，因此判斷是assignImage()內部用到的.attr方法出問題)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 想辦法修復性能問題 - 全局時間軸暫停",
      category: "PJ29",
      status: "F",
    },
    {
      type: "separator",
    },
    {
      text: "重製 UP 1 ， 1. 環境設定。 2. 刪除多餘禎數。 3. 更新實例原點。 4. 物體、實例變換歸一 。 5. 傘架材質。 6. 雨傘綁帶重製",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 UP 1 ， 1. 雨傘解UV(使布料紋路跟隨正確方向) 。 2. 雨傘布料材質。 3. 雨傘塑膠材質。 4. 刪除多餘UV Vcol。 5. 物件命名。",
      category: "PJ26",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "重製 UP 1 1. 節點命名。 2. 刪除多餘檔案。 3. Cam Lighting。 4. 更新穩定版。",
      category: "PJ26",
      status: "O",
    },
    {
      text: "JS 測試 。 測試#5：\n\n目標：在沒有背景動畫時，確認是否出現問題。\n結果：問題不明顯，甚至可能是沒有問題。\n副作用：進圖片牆時變得卡頓，需進行進一步研究。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "測試#6： 目標：在預覽換成PNG時，確認是否出現問題。 結果：一切正常。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "研究 onload 事件、研究如何判斷是否已載入（isload）、研究如何取消載入、初步增加載入邏輯、想辦法修復性能問題（包括刪除父元素和一開始建立靜態物件）",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "JS UI 在預覽底下增加名字",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS UI 為名字增加過場邏輯，\n進出預覽、全螢幕有過場 上下張直接換",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS UI 在名字檔名的部分改成按鈕，\n檔名按鈕按下後會換成png，\n會偵測檔案給名字。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS assignImage 改成 assignJPG - 以同樣概念寫 assignPNG - 由於一開始都會 .remove 因此要換檔只需再次 assign 就好 - 只是 assignPNG 要注意從 imgPNG 複製一份放入容器 - 再指派該容器下 img 給 image",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 省去 loadPNG 合併 assignPNG 與 assignJPG、優化開啟畫面",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "重製 Fence Pack 1 環境設定",
      category: "PJ26",
      status: "O",
    },
    {
      text: " 重製 Fence Pack 1 刪除多餘禎數",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 1 更新實例原點、\n物體、實例變換歸一",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 1 導入模組",
      category: "PJ26",
      status: "O",
    },
    {
      text: "1型 Pole 材質",
      category: "PJ26",
      status: "O",
    },
    {
      text: "主頁的下方 div 的 class 都改名為 *-bar、主頁的下方 *-btn 分配給 img（包含搜尋鈕）",
      category: "PJ29",
      status: "O",
    },
    {
      text: "改 class 名字使其更容易閱讀：\ntool-bar 改為 tool-bar-container，\nbuttons-container 改為 pages-btn-container，\nbtn-wrapper 改為 pages-btn ， btn 改為 pages-btn-top。 並且根據該 DOM 結構修改進行 JS 修改",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "關閉選單-分成關閉、重新啟動 UI",
      category: "PJ29",
      status: "O",
    },
    {
      text: "關閉選單-分成關閉、重新啟動 邏輯：\n1. 透過 close-bar 的 hover 偵測，讓按鈕 bottom 變回 10px。\n2. 滑鼠移入時，也會往左邊出來 close restart 提示（要對齊）",
      category: "PJ29",
      status: "O",
    },
    {
      text: "關閉選單-UI 增加文字敘述與圖示間的線條、JS 簡化與重新架構布局",
      category: "PJ29",
      status: "O",
    },
    {
      text: "關閉選單-分成關閉、重新啟動 後端",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "再重製重製後的 UP 1：\n\n1. 研究雨傘透明材質\n2. 更新雨傘傘架\n3. 加入雨傘透明材質\n4. 更新穩定版",
      category: "PJ26",
      status: "O",
    },
    {
      text: "設定功能-UI：\n\n1. 研究\n2. 初步實裝\n3. pointer\n4. 更換背景、UI 顏色\n5. 暫停、反轉背景動畫\n6. 更換語言",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 優化：   進出 closeBar 動畫 、 整體結構",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "JS 優化全螢幕定時器與刪除冗於代碼",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Fence Pack 1 1型Cam、重製 Fence Pack 1 1型 噴漆B重製(簡化)、重製 Fence Pack 1 1型貼紙材質(基色增加邊緣不同顏色)、重製 Fence Pack 1 1型鋼纜材質、重製 Fence Pack 1 1型刪除多餘UV Vcol、重製 Fence Pack 1 1型命名",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 1 2型Cam、重製 Fence Pack 1 3型Cam",
      category: "PJ26",
      status: "O",
    },
    {
      text: "設定功能-UI img 暫時設為40*40",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-UI 左側改成絕對定位，與右側對稱",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-UI 右側分項，左側變成按鈕可打開",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-UI 剛開啟時右側是lable",
      category: "PJ29",
      status: "O",
    },
    {
      text: ' 設定功能-UI 最下方是向下拉圖式，lable 是 "back"',
      category: "PJ29",
      status: "O",
    },
    {
      text: "定功能-UI 剛開啟時右側寬度較小(與右側對稱)",
      category: "PJ29",
      status: "O",
    },
    {
      text: '設定功能-UI 原右側選單改成絕對定位 (按鈕型 lable+btn 放進 div 然後 "被" 垂直 space-round，按鈕型 lable+btn 放進 div 然後 "放置元素" 置中，語言選單 "被" 對齊正上方，刪除左右 padding，增加上下 padding)',
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-JS 自動計算分類寬度(width-左側寬度)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-UI 需與右側有對稱感",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-JS 完善進出分類動畫、出設定選單動畫、研究如何切換至分頁時，初始化設定選單",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Fence Pack 1 拆分檔案、刪除多餘UV Vcol、物件命名、 實例命名",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 3 拆分檔案、物件命名、實例命名、確認法線",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 4 拆分檔案、簡化檔案結構",
      category: "PJ26",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "設定功能-UI 左側完成",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-JS hover#1\n，(btn hover時，對應文字必須高亮)、\n(需要對應的有lable, 分類, close bar)、\n(所以close bar也得更新)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-UI icon製作#1",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Fence Pack 1 節點命名、刪除多餘檔案、Cam Lighting、更新穩定版。",
      category: "PJ26",
      status: "O",
    },
    {
      text: '設定功能-UI "日文"翻譯成日文、設定功能-UI 顏色控制區域',
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "設定功能-UI icon製作#2、設定功能-JS hover#2、設定功能-JS 決定最後寬度",
      category: "PJ29",
      status: "O",
    },
    {
      text: "動畫優化-JS 使用ScrollTrigger更新返回頂部按鈕，\n(確保只要不再頂部(一段距離)就一定會出現(目前有時候不會出現))、\n(使用時間軸變數與reverse()取代匿名實例)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 重製 函數避免直接操作全域變數",
      category: "PJ29",
      status: "O",
    },
    {
      text: "JS 所有須綁定至事件偵測的函數，分類並return出來  、  \n一些比較大範圍的if判斷不要一起寫在變數裡面\n比如isIndex, e.target... deltaY等等  、  \n(若像是e.target... deltaY或e.which等判斷式省略的函數可以描述在變數裡面)  、  \n(這樣甚至可能還可以將這些變數放入區域)",
      category: "PJ29",
      status: "O",
    },
    {
      text: " JS 將進出fullscreen函數從導航拿出，歸類在setupFullscreen，\n(setupFullscreen用10/24最後嘗試的結果在重寫)  ，  \n盡量判斷方式一致，要馬是isFullscreen要馬是scale  ，  \n(將clickAnimation改名並放置到hover函數附近)  ，  \n(將switchView與is4大布爾放到一起並放在request上方)  ，  \n(考慮將GSAP register寫在外面，引入renderer.js前)  ，  \n(為click, insert, switch寫好JSDoc，switch改成用switch寫)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "設定功能-UI 播放與暫停切換時\n(分類選單內的，要思考怎樣與hover不衝突)",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "CSS 將字體樣式寫在同一個地方，並使用:lang  、  CSS 修正首頁、回到頂部按鈕樣式",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Fence Pack 3 材質",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 3 刪除多餘 UV Vcol",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 3 著色平滑",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 3 節點命名",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 3 刪除多餘檔案",
      category: "PJ26",
      status: "S",
    },
    {
      text: "重製 Fence Pack 3 更新穩定版",
      category: "PJ26",
      status: "O",
    },
  ],
  "2023-07": [
    {
      text: "202307",
      category: "未分類",
      status: "U",
    },
    {
      text: "202307-2",
      category: "PJ29",
      status: "U",
    },
  ],
  "2021-04": [],
  "2021-08": [],
  "2020-01": [],
  "2020-07": [],
  "2022-01": [],
  "2023-12": [
    {
      text: "由於進到了12月，因此證明PJ30可以做到自動新增最新日期分類",
      category: "PJ30",
      status: "O",
    },
    {
      text: "初步製作排序選單：\n(排序一樣是類似於上方資料夾按鈕，圖示在左側，懸停時有自己的動畫，跟PJ30左上按鈕類似，再來是分割線，再來是Label寫著排序，整個按鈕懸停時反白，互動效果(懸停點擊)就是跟上方資料夾按鈕完全一樣。)  \n(按下後：向上跑出選單，一樣先有水平分割線。)  (反轉塊：然後有一個240寬的塊，但不是按鈕，懸停時會反白但不會擴大，圖示部分改成toggle button，一樣有分割線，然後是Label寫著反轉排序，反轉後會影響主按鈕的旋轉180度。)  (子按鈕：圖示有與Label對應的圖形，比如修改日期可能是時鐘之類的)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "整個toggle button按鈕容器要有clip-path，這樣可以防止圓點的陰影跑出來，做出圓點最高處與介面同個水平面的感覺",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. icon組件化(稱作Basic)，內部包含icon container、hover timline/timelines。\n2. 組件化後icon，組件拿取icon實例至this.icon，再從icon.element或.tl等屬性拿需要之物件。\n2. 取消時間軸原子化，分類成for basic與for Component。",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "排序選項的各個圖示懸停，外框不動，內部的元素圖層做類似於排序圖示右側圖層的效果\n，完成排序選單的完整UI",
      category: "PJ29",
      status: "O",
    },
    {
      text: "LightBox: \n由gallery的圖片element構成，在該element上方再增加一個container，position為relative，並在該container中增加一個filterImage，不需要container，position為absolute，有clip使他不會超過sideBar。上下按鈕寬度與圖片一樣，平時圖示是平的，懸停時變成箭頭。\n初始化時：先不要將actived的圖片做效果，等組件show完成後，再出現，但離開時同時消失。\n懸停前: brightness(0.8)\n懸停後: scale(1.05), brightness(1), 背後的filter出現",
      category: "PJ29",
      status: "O",
    },
    {
      text: "先做出按下全螢幕按鈕後，會將上下選單收起，同時previewImage container的left與top變為0，完成後右上出現一個圓形按鈕，icon是X。返回時delay(0.1)使按鈕動畫可以先跑完，再讓按鈕消失，同時反轉前述動畫。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "先寫出架構：進全螢幕需要是async，在進入後會執行_onFullscreen()，而他則會註冊執行this._fullscreenHandler，離開的瞬間立刻(首先)先執行_offFullscreen()",
      category: "PJ29",
      status: "O",
    },
    {
      text: "研究是不是真的可以利用Discord實現雲端儲存Note",
      category: "PJ30",
      status: "F",
    },
    {
      type: "separator",
    },
    {
      text: "1. 更新BoxShadow 2. 在內容上層再增加container，使scrollBar不要切掉header",
      category: "PJ30",
      status: "O",
    },
    {
      text: "新增防止重複呼叫實例方法：\nasync yourMethod() {\n  if (this.isRunning) return;\n  this.isRunning = true;\n  await something();\n  this.isRunning = false;\n}\n=> 改成全域變數isTransitioning ，並且將以上方法用於handler中",
      category: "PJ29",
      status: "O",
    },
    {
      text: "workflow 第二步可以再分一個report json內容\nworkflow NodeJS的部分分離出來，用node preload.js方式執行，這樣也可以在本地測試",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 釐清是偽選擇器的寬度還是overflow: scroll讓scrollbar固定佔位  2. 修復textarea的scrollbar顯示錯誤之問題  3. 將GSAP註冊移至head中，以確保有先註冊到",
      category: "PJ30",
      status: "O",
    },
    {
      text: "寫出全螢幕類，有on與off方法， 首次部屬!",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "在GIF載入完成後，再將圖片刪除 (仍然先將gif直接放到容器，並用onload來判斷刪除png，以確保快速切換時GIF可以被刪除)",
      category: "PJ29",
      status: "O",
    },
    {
      text: "清除LFS修復殘餘檔案 (刪除.gitattr)，以及修復某些icon的pointEvent，並再次部屬，測試快取。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "重製 Fence Pack 4 不重新寫材質，節點盡量改寫成相同結構就好，植入物體偏差縮放就好，降低刮痕的量，加上質感模組",
      category: "PJ26",
      status: "O",
    },
    {
      text: "重製 Fence Pack 4 物件、實例命名。\n重製 Fence Pack 4 材質命名。\n重製 Fence Pack 4 刪除多餘UV Vcol。\n重製 Fence Pack 4 著色平滑\n",
      category: "PJ26",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "只在進預覽時開始下載4K(load完成後，執行替換src的函數，該函數一開始會判斷當前預覽圖片對應原圖是否是帶入參數，若不是則return)。 favicon與loading加上drop shadow。",
      category: "PJ29",
      status: "O",
    },
    {
      text: "製作自動化縮圖，改名縮圖.blend，分別提供1K 50%與4K圖片，製作浮水印",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 增加auto resize功能，並利用CSS漸變製作互動效果 2. 標題增加shadow",
      category: "PJ30",
      status: "O",
    },
    {
      text: "1. 懸停反射旋轉的量要根據螢幕大小決定 2. 為所有原圖正式新增浮水印 3. 部屬並在網路環境測試懶加載狀態",
      category: "PJ29",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "在跨年看《BanG Dream! It's MyGO!!!!!》爽世大喊「為什麼要演奏 春日影?」",
      category: "未分類",
      status: "O",
    },
  ],
  "2024-01": [
    {
      text: "在跨年看《BanG Dream! It's MyGO!!!!!》爽世大喊「為什麼要演奏 春日影?」",
      category: "未分類",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "完成上下張動畫、邏輯、實裝",
      category: "PJ29",
      status: "O",
    },
    {
      text: "1. 製作入場動畫 2. 工作懸停效果改成用CSS做，使用filter: brightness(1.15)",
      category: "PJ30",
      status: "O",
    },
    {
      text: "開始sort與編輯時，pointEvent關閉 (證明不行) => 利用:root傳遞1或0解決",
      category: "PJ30",
      status: "O",
    },
    {
      text: "上下張邏輯：\n圖片直接用替換url方法、上下張用list查找法、最後記得也要換圖片名稱!",
      category: "PJ29",
      status: "O",
    },
    {
      text: '利用Chorme插件 + Service Worker繞過同源政策，並再利用"permissions": ["declarativeNetRequest", "declarativeNetRequestFeedback"] 解決fetch API無法修改要求標頭User-Agent的問題，第一次成功用HTTP API與discord API建立通道',
      category: "PJ30",
      status: "O",
    },
    {
      type: "separator",
    },
    {
      text: "AO模組化並分成Local與global，增加係數concave 0~1 預設0 利用Mix Value混和，最後節點數：(71, 33)",
      category: "PJ24",
      status: "O",
    },
    {
      text: "1. 利用const range = 20; W = inputW % range - 10 ; 所做成的環狀/循環結構來避免W超過(-10, 10)，同時保持向後兼容\n2. 目前的W0問題解法仍有問題(在負值輸入下)，改為若是正的則+1、負的則-1，保持連續性，該片段必須置於最後",
      category: "PJ24",
      status: "O",
    },
    {
      text: "! 有W輸入之節點限制W在-10~10 (應用在預設值與界)\n! 確保有W輸出之節點限制W在-10~10 (上述)",
      category: "PJ24",
      status: "O",
    },
    {
      text: "1. Col Var節點需要金屬水平參數 2. Spots節點少了金屬通道",
      category: "PJ24",
      status: "U",
    },
    {
      text: '將Fence Pack 4 的 Scratch寫法+凹凸寫成模組，在瑕疵的分類為新的: "mix"\n最後有五個新節點，三個瑕疵，一個EF模組，一個工具\nMask Texture Var B, Mask Steel Inperfection, Edge Finder Module (Collapse B), Mask Bottom Dirt, Mask X Ratio (local)',
      category: "PJ24",
      status: "U",
    },
    {
      type: "separator",
    },
    {
      text: "確定接下來PJ26重製所需工作、找基座參考",
      category: "PJ26",
      status: "U",
    },
    {
      text: "基座建模 (可能)新的road sign種類sign圖、建模，模組、實例化",
      category: "PJ26",
      status: "U",
    },
    {
      text: "為imageName組件新增changeName方法(包含動畫)，是async，作為之後lightBox傳遞對象",
      category: "PJ29",
      status: "U",
    },
    {
      type: "separator",
    },
    {
      text: "task與icon組件放在一起，屬於elements.js",
      category: "PJ30",
      status: "U",
    },
    {
      text: "PJ30 大重構\n 半組件化：\n1. 以區塊做實例，比如TaskList有方法clear, filter等，TempList有append, show, hide方法等。\n2. task本身也是實例，可作為傳進TempList的append方法的參數，有constructor, get status etc, set status etc, delete, edit等，這些方法會同時編輯DOM與custom attr，並且由於this.element綁在特定元素上，因此就算sort過方法應該也能正常運作。",
      category: "PJ30",
      status: "U",
    },
    {
      text: "修復在TempList編輯工作時，自動補足寬度錯誤之Bug",
      category: "PJ30",
      status: "U",
    },
    {
      text: "實現工作列表分割優化效能、實現避免顯式使用show(), hide()增加效能(包含篩選、切換分類等)",
      category: "PJ30",
      status: "U",
    },
    {
      type: "separator",
    },
    {
      text: "研究是否可以直接用前端與file://溝通，若不行嘗試使用插件的方法，並研究如何利用註冊表與本地onedrive做溝通，若成功可考慮將PJ29圖片與PJ30json都放至onedrive",
      category: "PJ30",
      status: "U",
    },
    {
      text: '新增類別"extra"，背景紅色。\n新增"靈感"大分類在月份部分。',
      category: "PJ30",
      status: "U",
    },
    {
      text: "嘗試製作入口網站",
      category: "未分類",
      status: "U",
    },
    {
      text: "Peeling根據目前為止的經驗研究如何在使用上優化\n(可能加上輸入Bump2並用錯置輸出TexBump, Bump2)",
      category: "PJ24",
      status: "U",
    },
    {
      text: "缺少塑膠類型的透明材質(參考按鈕包決定是否增加)",
      category: "PJ24",
      status: "U",
    },
    {
      text: "靈感：\n5. 將原本時程表導入現在的格式\n6. PJ30新增篩選方式：完成狀態。\n7. PJ29嘗試寫出最小等待時間，以便可以在一個圖片庫消失時，另一個圖片庫就已經開始編碼了",
      category: "未分類",
      status: "U",
    },
  ],
};

loadSave();
