# AI 分身本地使用

## 启动

需要 Node.js 24.5 或以上。项目根目录执行 `npm run preview`，打开 http://127.0.0.1:8000/ 。它同时提供现有静态页面和 `/api/chat`，不需要安装额外服务端依赖。

将 `.env.example` 复制为 `.env.local`，在本地编辑 `DEEPSEEK_API_KEY`。密钥只存服务端，不能写到 `index.html` 或 `chat.js`，也不要提交到 Git。可通过 `DEEPSEEK_MODEL` 修改模型，默认 `deepseek-flash`；使用支持 Chat Completions API 的 DeepSeek 模型，默认关闭思考模式。修改环境配置后重启服务。

没有密钥时仍能预览聊天窗口，但发送消息会明确提示 AI 暂未开启，不使用假回答。真实请求会产生 DeepSeek API 费用，具体取决于你的账户和所选模型。

## 资料维护

`server/profile.md` 是 AI 的公开资料来源，修改履历后同步更新此文件并重启。不要放入私密资料。回答以资料为依据；未知内容说明未提供。生成内容仍可能有误，需要实际使用检查。

浏览器仅在当前页面内存保存最近对话；刷新或点击“新对话”清空。服务不主动记录聊天文本，对话上下文按需发送至 DeepSeek Chat Completions API，不使用持久化会话；这不等于第三方零保留承诺。

## 上线

GitHub Pages 只能托管静态文件，不能执行本项目的 Node 接口。当前为本地实现，尚未上线。部署完整项目到支持 Node 的主机，配置 `HOST=0.0.0.0`、平台端口、`DEEPSEEK_API_KEY` 与 `CHAT_ALLOWED_ORIGINS=https://你的域名`；使用 HTTPS，让网页和 `/api/chat` 保持同源。不要把 `.env.local` 或整个源码目录交给静态目录服务器。

当前服务按直接连接 IP 每分钟最多12个请求、全局最多4个并发，输入最多16条/18,000字符，每条4,000字符。部署到反向代理或多实例环境时，需配置可信客户端 IP 和持久化限额，并在 DeepSeek 平台关注余额和用量，避免无约束的公共 API 成本。当前实现不信任客户端传入的 X-Forwarded-For。

## 验证

`npm run test:chat` 验证请求边界、资料注入、响应解析与错误处理，使用模拟上游，不产生 API 费用。没有配置真实密钥时，不代表已经验证真实模型的回答质量。

官方接口文档：https://api-docs.deepseek.com/api/create-chat-completion/

## 2026-11-15线上发布

GitHub Pages通过.github/workflows/pages.yml从main发布白名单静态产物。线上chat.js指向独立Sites接口：https://reze-personal-ai.downyraspberry8.chatgpt.site/api/chat 。本地仍使用/api/chat。Sites项目ID：appgprj_6af96f65538c819183c382bd5852777d。密钥在Sites环境变量中标记为secret。

2026-11-15用户明确授权公开接口并承担DeepSeek API用量费用后，接口已设为public。已从GitHub Pages正式网页验证真实回答及连续追问，均返回HTTP 200。密钥仍为Sites服务端secret，不在网页或仓库中。
