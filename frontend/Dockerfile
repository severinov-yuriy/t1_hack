FROM node:18.17.1

# Установить рабочую директорию
WORKDIR /app

# Скопировать package.json и package-lock.json
COPY package.json package-lock.json ./

# Установить зависимости
RUN npm install

# Скопировать оставшиеся файлы приложения
COPY . .

# Сборка приложения
RUN npm run build

# Открыть порт 3000
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
