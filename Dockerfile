FROM node:18-alpine
WORKDIR /app
COPY container/nodejs/package.json ./
RUN npm install --production && npm cache clean --force
COPY container/nodejs/index.js ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
