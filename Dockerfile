FROM node:18-slim

WORKDIR /app

# 复制 package.json 并安装依赖
COPY container/nodejs/package.json ./
RUN npm install

# 复制所有文件
COPY . .

# 赋予脚本执行权限
RUN chmod +x argosbx.sh container/nodejs/start.sh

# 设置环境变量，默认端口为 3000
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "container/nodejs/index.js"]
