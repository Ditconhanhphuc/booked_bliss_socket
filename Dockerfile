# Sử dụng image Node.js làm base image
FROM node:16.13.0-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Cài đặt nodemon toàn cầu
RUN npm install -g nodemon

# Copy toàn bộ mã nguồn vào container
COPY . .

# Expose cổng 4000 mà server sẽ chạy
EXPOSE 4000

# Chạy server Socket.io khi container khởi động
CMD ["npm", "start"]
