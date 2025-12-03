# ---- Stage 1: Build app ----
  FROM node:20-alpine AS build

  WORKDIR /app
  
  # Chỉ copy file khai báo dependency trước để cache
  COPY package*.json ./
  
  # Cài dependency (dùng npm ci nếu có package-lock)
  RUN npm ci
  
  # Copy source code vào
  COPY . .
  
  # Build Vite → output vào thư mục dist
  RUN npm run build
  
  # ---- Stage 2: Run static server với serve ----
  FROM node:20-alpine AS prod
  
  WORKDIR /app
  
  # Cài serve global
  RUN npm install -g serve
  
  # Copy dist từ stage build sang
  COPY --from=build /app/dist ./dist
  
  # Port app sẽ chạy
  EXPOSE 5173
  
  # Serve thư mục dist, lắng nghe trên 0.0.0.0:5173 (truy cập được từ ngoài)
  CMD ["serve", "-s", "dist", "-l", "5173"]
  