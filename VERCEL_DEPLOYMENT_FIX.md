# Vercel 部署修复说明

## 已修复的问题

### 1. 服务端渲染 (SSR) 兼容性
- ✅ 在所有 Web3 函数中添加了 `typeof window === 'undefined'` 检查
- ✅ 确保 `window.ethereum` 只在客户端访问
- ✅ 在 `useEffect` 中添加客户端检查

### 2. 改进的 Vercel 配置
- ✅ 添加了安全相关的 HTTP headers
- ✅ 优化了 URL 处理配置

## 部署步骤

1. **提交更改到 Git**
   ```bash
   git add .
   git commit -m "fix: add SSR compatibility for wallet connection on Vercel"
   git push
   ```

2. **在 Vercel 上重新部署**
   - Vercel 会自动检测到 push 并触发新的部署
   - 或者手动在 Vercel 控制台点击 "Redeploy"

3. **测试连接功能**
   - 打开部署后的网站
   - 点击 "Connect" 按钮
   - 确认 MetaMask 弹出窗口正常出现
   - 确认连接后地址显示正确

## 可能的其他问题

### 如果连接按钮仍然无反应：

1. **检查浏览器控制台**
   - 打开 DevTools (F12)
   - 查看 Console 标签页是否有错误信息
   - 查看 Network 标签页是否有加载失败的资源

2. **确认 MetaMask 已安装**
   - 用户必须安装 MetaMask 或其他兼容的 Web3 钱包
   - 在部署环境中测试时确保钱包扩展已启用

3. **检查网络设置**
   - 当前配置使用 Ethereum 主网 (chainId: 1)
   - 确认钱包已连接到正确的网络

4. **Content Security Policy (CSP) 问题**
   - 某些钱包需要特定的 CSP 设置
   - 如果需要，可以在 vercel.json 中添加 CSP headers

## 额外优化建议

### 添加加载状态指示
在 `Nav.tsx` 中可以添加加载状态：

```typescript
<button
  onClick={onConnect}
  disabled={isConnecting}
  className="..."
>
  {isConnecting ? "Connecting..." : connected && address ? `${address.slice(0, 4)}…${address.slice(-4)}` : "Connect"}
</button>
```

### 添加错误提示
显示更友好的错误信息给用户。

### 测试不同的钱包
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow

## 验证清单

- [ ] 本地开发环境正常运行
- [ ] 代码已提交到 Git
- [ ] Vercel 重新部署完成
- [ ] 部署后的网站可以访问
- [ ] Connect 按钮有响应
- [ ] MetaMask 弹窗正常
- [ ] 地址显示正确
- [ ] Mint 功能正常
- [ ] 浏览器控制台无错误
