FROM node:18-alpine

WORKDIR /app

# 安装必要的系统工具
RUN apk add --no-cache bash curl wget ca-certificates

# 复制 package.json 并安装依赖
COPY container/nodejs/package.json ./
RUN npm install --production && npm cache clean --force

# 复制所有文件
COPY . .

# 赋予脚本执行权限
RUN chmod +x argosbx.sh container/nodejs/start.sh

# 设置环境变量
ENV PORT=3000
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "container/nodejs/index.js"]
