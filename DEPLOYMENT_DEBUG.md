# Vercel 部署调试指南

## 📋 检查部署状态

### 1. 登录 Vercel Dashboard
访问：https://vercel.com/dashboard

### 2. 找到你的项目
应该叫 "thered" 或类似名字

### 3. 查看部署日志
点击最新的部署 → 查看 "Build Logs"

## 🔍 需要检查的信息：

### A. 构建阶段（Build）
查找这些关键输出：
```
✓ vite v7.3.5 building for production...
✓ built in XXXs
```

### B. 输出目录
确认是否找到了：
```
dist/client/_shell.html
dist/client/assets/...
```

### C. 错误信息
如果有红色错误，复制完整的错误信息

## 🐛 常见问题排查

### 问题1：构建失败
**症状**：构建日志中有红色 ERROR
**解决**：
- 检查 Node.js 版本（需要 >= 20.0.0）
- 检查依赖是否正确安装

### 问题2：404 错误（现在应该修复了）
**症状**：网站显示 404 NOT_FOUND
**原因**：路由配置错误
**已修复**：vercel.json 已更新为使用 `_shell.html`

### 问题3：白屏/空白页面
**症状**：页面加载但什么都不显示
**原因**：可能是客户端 JS 错误
**排查**：打开浏览器 F12 控制台查看错误

### 问题4：连接按钮无响应
**症状**：页面正常但按钮点击无效
**原因**：SSR 兼容性问题
**已修复**：web3.ts 已添加客户端检查

## 📸 请提供这些信息：

如果仍然失败，请截图或复制：

1. **Vercel 部署状态页面**
   - 显示 "Ready" 还是 "Failed"？

2. **Build Logs（构建日志）**
   - 完整的构建输出
   - 特别是红色的错误信息

3. **浏览器控制台**
   - 打开网站按 F12
   - 切换到 Console 标签
   - 复制所有红色错误

4. **网站当前状态**
   - 还是 404 吗？
   - 还是白屏？
   - 还是其他错误？

## 🔧 快速测试

在 Vercel 控制台尝试：

### 选项1：手动重新部署
点击 "Redeploy" → "Use existing Build Cache" → Deploy

### 选项2：强制重新构建
点击 "Redeploy" → **不选** "Use existing Build Cache" → Deploy

### 选项3：检查环境变量
确认没有需要设置的环境变量

## 📝 临时解决方案

如果 Git 部署一直有问题，可以尝试：

1. 删除 Vercel 上的项目
2. 重新从 GitHub 导入
3. 让 Vercel 自动检测配置
4. 覆盖检测，手动设置：
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist/client`
   - Install Command: `npm install`

---

## 当前 Vercel 配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/client",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/_shell.html"
    }
  ]
}
```

这个配置应该是正确的。
