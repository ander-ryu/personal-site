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
    bottom: 30px;
    right: 30px;
    z-index: 99;
    width: 50px;
    height: 50px;
    border: none;
    outline: none;
    border-radius: 50%; /* 圆形 */
    background-color: #4CAF50;
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  }
  #topBtn:hover {
    background-color: #45a049;
    transform: scale(1.1); /* 悬停时轻微放大 */
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
