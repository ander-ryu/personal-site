// 创建按钮元素
const topBtn = document.createElement("button");
topBtn.id = "topBtn";
topBtn.innerText = "↑";
document.body.appendChild(topBtn);

// 按钮样式
const style = document.createElement("style");
style.innerHTML = `
  #topBtn {
    display: none;
    position: fixed;
    bottom: 40px;
    right: 40px;
    z-index: 99;
    font-size: 18px;
    border: none;
    outline: none;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: 0.3s;
  }
  #topBtn:hover {
    background-color: #45a049;
  }
`;
document.head.appendChild(style);

// 滚动时显示/隐藏按钮
window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
};

// 点击按钮回到顶部
topBtn.onclick = function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
