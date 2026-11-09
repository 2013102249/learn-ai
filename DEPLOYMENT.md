# 部署说明

本仓库是 [itshen/learn-ai](https://github.com/itshen/learn-ai) 的 fork，用于通过 GitHub Pages 公开访问该课程站点。

- **站点地址**：https://2013102249.github.io/learn-ai/
- **源项目**：https://github.com/itshen/learn-ai （作者：洛小山 · 小山学堂）
- **许可证**：GNU AGPL-3.0，详见仓库根目录 `LICENSE` 与 `README.md`
- **内容归属**：课件内容与署名均归原作者所有，本仓库仅做静态镜像部署

## 相对源仓库的改动

仅新增以下文件，未修改任何课件内容：

| 文件 | 用途 |
| --- | --- |
| `index.html` | 站点根入口，按浏览器/本地语言偏好跳转到 `slides/home*.html` |
| `.nojekyll` | 跳过 Jekyll 构建，直接发布纯静态文件 |
| `DEPLOYMENT.md` | 本说明文件 |

## 更新方式

在 GitHub 仓库页面点击 **Sync fork** 同步上游更新即可；Pages 会在推送后自动重新构建。

## 许可提示

原项目 AGPL-3.0 要求：衍生版本必须同样开源、网站部署与二次传播必须保留原作者署名，且禁止用于闭源商业产品。本仓库保持 public 并保留全部署名与 LICENSE。
