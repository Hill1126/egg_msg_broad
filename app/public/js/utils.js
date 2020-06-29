'use strict';
//
// const storage = window.localStorage;
// let loginHtml = `
// <li class="layui-nav-item">
//   <a href="login.html">
//    请登录
//   </a>`;
//
// if (storage.username) {
//   const userMsg = `<img src="${storage.avatar}" class="layui-nav-img">${storage.username}`;
//   loginHtml = `<li class="layui-nav-item">
//   <a href="javascript:;">
//   ${userMsg}
//   </a>
//   <dl class="layui-nav-child">
//   <dd><a href="user.html">个人中心</a></dd>
// <dd><a href="changePass.html">修改密码</a></dd>
// </dl>
// </li>`;
// }
//
// document.getElementById('header').innerHTML = `
//  <div class="layui-layout layui-layout-admin">
//   <div class="layui-header">
//     <div class="layui-logo">egg 在线留言板</div>
//     <ul class="layui-nav layui-layout-left">
//       <li class="layui-nav-item">
//         <a href="index.html">首页</a>
//       </li>
//     </ul>
//
//     <ul class="layui-nav layui-layout-right">
//       <li class="layui-nav-item">
//         <a href="myMsg.html">我的留言</a>
//       </li>
//       ${loginHtml}
//       <li class="layui-nav-item"><a href="">退出</a></li>
//     </ul>
//   </div>
// </div>
// `;
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}
