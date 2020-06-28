

document.getElementById('header').innerHTML = `
 <div class="layui-layout layui-layout-admin">
  <div class="layui-header">
    <div class="layui-logo">egg 在线留言板</div>
    <ul class="layui-nav layui-layout-left">
      <li class="layui-nav-item">
        <a href="index.html">首页</a>
      </li>
    </ul>

    <ul class="layui-nav layui-layout-right">
      <li class="layui-nav-item">
        <a href="myMsg.html">我的留言</a>
      </li>
      <li class="layui-nav-item">
        <a href="javascript:;">
          <img src="http://t.cn/RCzsdCq" id="header-image" class="layui-nav-img">
          贤心
        </a>
        <dl class="layui-nav-child">
          <dd><a href="/user/22">个人中心</a></dd>
          <dd><a href="/changePass.html">修改密码</a></dd>
        </dl>
      </li>
      <li class="layui-nav-item"><a href="">退出</a></li>
    </ul>
  </div>
</div>
`;

// 根据参数名获取对应的url参数
function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
