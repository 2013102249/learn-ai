# 部署说明

本仓库是 [itshen/learn-ai](https://github.com/itshen/learn-ai) 的 fork，用于通过 GitHub Pages 公开访问该课程站点。

- **站点地址**：https://2013102249.github.io/learn-ai/
- **源项目**：https://github.com/itshen/learn-ai （作者：洛小山 · 小山学堂）
- **许可证**：GNU AGPL-3.0，详见仓库根目录 `LICENSE` 与 `README.md`
- **内容归属**：课件内容与署名均归原作者所有，本仓库仅做静态镜像部署

## 镜像定制（相对上游）

| 定制项 | 实现方式 |
| --- | --- |
| 站点首页默认进入课程页 | `index.html`、`slides/index.html` 改为按语言跳转 `slides/learn*.html` |
| 所有课程页免登录、全文可读 | `slides/paywall.js` 替换为解锁垫片；`slides/auth.js` 替换为免登录兼容桩（`XueaiAuth.isFree()` 恒为 true）；统一覆盖层移除 `html.xa-locked` |
| 隐藏每页顶部「扫码关注」横幅 | `slides/lesson.js` 关闭 `initQrBar()`；覆盖层 CSS 兜底 |
| 隐藏左下角公众号二维码 | 覆盖层 CSS 隐藏 `.sidebar-qr` / `#partnerSidebarSlot` |
| 隐藏右上角整排按钮 | 覆盖层 CSS 隐藏分享 / 主题 / 语言 / 伴学计划 / 交流群 / 账号控件 |
| 隐藏首页二维码区与启动推广层 | 覆盖层 CSS 隐藏 `.qr-section` / `#xueai-sp-overlay` |
| 统一覆盖层 | 追加到 `slides/` 下 25 个共享 JS 文件尾部（幂等，`window.__XA_MIRROR_FREE__` 防重复），并向 `learn*.html` / `home*.html` 的 `<head>` 注入同一段 CSS 避免首屏闪烁 |

课件正文、作者署名、JSON-LD 作者信息、`LICENSE`、`README.md` 均未改动。

## 更新方式（重要）

⚠️ **不要直接点击 GitHub 的 Sync fork**：上游同步会用原版文件覆盖上述定制（尤其是 `paywall.js`、`auth.js`、`lesson.js` 与 25 个共享 JS）。如需同步上游课程更新，请先备份定制文件，同步后重新应用覆盖层，或只 cherry-pick 上游新增的课件内容。

## 许可提示

原项目 AGPL-3.0 要求：衍生版本必须同样开源、网站部署与二次传播必须保留原作者署名，且禁止用于闭源商业产品。本仓库保持 public 并保留全部署名与 LICENSE。
