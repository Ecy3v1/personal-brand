const express = require('express');
const path = require('path');
const app = express();

// 静态文件服务
app.use(express.static('public'));

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 