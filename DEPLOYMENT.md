# 部署说明

本仓库是 [itshen/learn-ai](https://github.com/itshen/learn-ai) 的 fork，用于通过 GitHub Pages 公开访问该课程站点。

- **站点地址**：https://2013102249.github.io/learn-ai/
- **源项目**：https://github.com/itshen/learn-ai （作者：洛小山 · 原品牌「小山学堂」）
- **许可证**：GNU AGPL-3.0，详见仓库根目录 `LICENSE` 与 `README.md`
- **内容归属**：课件内容与署名均归原作者所有，本仓库仅做静态镜像部署

## 镜像定制（相对上游）

| 定制项 | 实现方式 |
| --- | --- |
| 站点首页默认进入课程页 | `index.html`、`slides/index.html` 按语言跳转 `slides/learn*.html`；`learn*.html` 左上角品牌链接也改为课程页 |
| 所有课程页免登录、全文可读 | `slides/paywall.js` 替换为解锁垫片；`slides/auth.js` 替换为免登录兼容桩（`XueaiAuth.isFree()` 恒为 true）；统一覆盖层移除 `html.xa-locked` |
| 隐藏每页顶部「扫码关注」横幅 | `slides/lesson.js` 关闭 `initQrBar()`；覆盖层 CSS 兜底 |
| 隐藏左下角公众号二维码 | 覆盖层 CSS 隐藏 `.sidebar-qr` / `#partnerSidebarSlot` |
| 隐藏右上角整排按钮 | 覆盖层 CSS 隐藏分享 / 主题 / 语言 / 伴学计划 / 交流群 / 账号控件 |
| 隐藏首页二维码区与启动推广层 | 覆盖层 CSS 隐藏 `.qr-section` / `#xueai-sp-overlay` |
| 统一覆盖层 | 追加到 `slides/` 下 25 个共享 JS 文件尾部（幂等，`window.__XA_MIRROR_FREE__` 防重复），并向 `learn*.html` / `home*.html` 的 `<head>` 注入同一段 CSS 避免首屏闪烁 |

课件正文、作者署名、JSON-LD 作者信息、`LICENSE`、`README.md` 均未改动。品牌改名与 Logo 替换见下节。


## 品牌定制（2026-11-09）

镜像站点已按「新像素学堂」重新贴牌，仅改动品牌层，课程内容与作者署名不变：

| 项目 | 改动 |
| --- | --- |
| 站点品牌名 | 全站 `小山学堂` → `新像素学堂`（含繁体 `小山學堂` → `新像素學堂`），共 170 个文件、261 处 |
| 顶栏/导航 Logo | 原远程图 `img.alice.miyang.cn/xueai/logo.png` → 本地 `slides/assets/brand-mark.png`（红底白字「新」方标） |
| 站点图标 | `slides/assets/favicon.ico` 换成新品牌方标（16/32/48 多尺寸） |
| 分享卡片图标 | `slides/assets/logo.png` 换成新品牌方标（原为作者吉祥物插画） |
| 品牌字标 | `slides/assets/brand-logo.png` 保留用户提供的完整字标（含 UIXS.COM） |
| 结构化数据/分享文案 | `og:site_name`、`publisher`、`course-data.js` 的 `brand`、分享卡片 `posterBrand`/`fileTag` 同步为新品牌 |

以下内容**未改动**，以符合 AGPL-3.0 署名要求：作者姓名「洛小山」、`<meta name="author">`、JSON-LD 的 `author`、`LICENSE`、`README.md`、全部课件正文。

## 更新方式（重要）

⚠️ **不要直接点击 GitHub 的 Sync fork**：上游同步会用原版文件覆盖上述定制（尤其是 `paywall.js`、`auth.js`、`lesson.js` 与 25 个共享 JS）。如需同步上游课程更新，请先备份定制文件，同步后重新应用覆盖层，或只 cherry-pick 上游新增的课件内容。

## 许可提示

原项目 AGPL-3.0 要求：衍生版本必须同样开源、网站部署与二次传播必须保留原作者署名，且禁止用于闭源商业产品。本仓库保持 public 并保留全部署名与 LICENSE。
