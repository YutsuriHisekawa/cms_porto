# Langkah 1: Gunakan "cetakan" dasar Node.js versi 18 yang ringan.
FROM node:18-slim

# Langkah 2: Buat sebuah folder di dalam lingkungan virtual untuk menaruh kode kita.
WORKDIR /usr/src/app

# Langkah 3: Salin file package.json dan package-lock.json terlebih dahulu.
# Ini adalah trik agar proses instalasi dependensi tidak diulang setiap saat jika tidak ada perubahan.
COPY package*.json ./

# Langkah 4: Jalankan perintah untuk menginstall semua dependensi yang dibutuhkan untuk production.
RUN npm install --only=production

# Langkah 5: Salin semua sisa kode dari proyek Anda ke dalam folder yang sudah dibuat.
COPY . .

# Langkah 6: Beritahu lingkungan bahwa aplikasi kita akan berjalan di port 8080.
EXPOSE 8080

# Langkah 7: Ini adalah perintah final yang akan dijalankan untuk memulai server Anda.
CMD [ "npm", "start" ]