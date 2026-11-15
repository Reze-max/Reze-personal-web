# Hero背景素材

- assets/hero/background-loop.mp4：来自用户提供的视频，保留动画段、去除片尾搜索页与音轨，H.264/yuv420p、1152×720、30fps、faststart，约7秒、844KB。
- 循环处理：从原片0.8秒播放到7.8秒，在最后0.8秒叠化原片前0.8秒，下次循环接回原片0.8秒，避免额外停帧。
- assets/hero/poster.jpg：循环视频首帧，静态回退。
- assets/hero/light-texture.png：内置ImageGen生成的暖黑光影纹理。提示词：1536×1024，近黑哑光墙面，右上方低曝光柔和暖色窗光/树影，左侧55%近黑，无文字、物件或人物；用于screen混合叠加。
- hero-video.css / hero-video.js：仅作用Hero及Hero可见时的导航配色。页面隐藏或Hero离屏暂停，减少动态效果偏好默认静态，支持手动播放。
- 没有修改或替换源视频文件，水印保留。未部署上线。

## 当前版本 v2

当前素材已替换为用户提供的 mmexport1794626929336.mp4（8.75秒，无片尾搜索页）。输出 background-loop-v2.mp4 / poster-v2.jpg，1152×720，30fps，去音轨，以0.8秒叠化，结果约7.9秒。原始视频未修改；v1留存但页面不再引用。
