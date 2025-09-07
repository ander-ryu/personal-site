// 创建回到顶部按钮
const topButton = document.createElement("div");
topButton.innerHTML = "顶部";
topButton.id = "backToTop";
document.body.appendChild(topButton);

// 创建到底部按钮
const bottomButton = document.createElement("div");
bottomButton.innerHTML = "底部";
bottomButton.id = "goToBottom";
document.body.appendChild(bottomButton);

// 样式
const style = document.createElement("style");
style.innerHTML = `
  #backToTop, #goToBottom {
    position: fixed;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: navy;
    color: white;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s, transform 0.3s;
    z-index: 1000;
  }
  #backToTop:hover, #goToBottom:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  #backToTop { bottom: 80px; }  /* 顶部按钮在上 */
  #goToBottom { bottom: 20px; } /* 底部按钮在下 */
`;
document.head.appendChild(style);

// 点击事件：回到顶部
topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 点击事件：到底部
bottomButton.addEventListener("click", () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});
