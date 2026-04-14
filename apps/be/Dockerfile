FROM node:20

WORKDIR /app

COPY apps/be/package*.json ./
RUN npm install

COPY apps/be ./

COPY apps/be/prisma ./prisma


RUN npx prisma generate

RUN npm run build

COPY apps/fe/dist ./public

CMD ["node", "dist/src/main.js"]