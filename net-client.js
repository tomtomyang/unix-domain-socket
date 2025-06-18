const net = require('net');

const socketPath = '/tmp/app.function-server';
const client = new net.Socket();

client.connect(socketPath, () => {
    console.log('已连接到函数服务器');

    const message = {
        type: 'call-function',
        data: {
            functionName: 'a',
            args: [5, 3]
        }
    };

    client.write(JSON.stringify(message) + '\f'); 
});

// 处理服务器响应
client.on('data', (data) => {
    console.log('原始数据 (string):', data.toString());

    try {
        const cleanData = data.toString().trim();
        const response = JSON.parse(cleanData);

        console.log('函数调用结果:', response);
    } catch (error) {
        console.error('解析响应失败:', error);
    }
});

// 处理连接关闭
client.on('close', () => {
    console.log('与服务器的连接已关闭');
});

// 处理错误
client.on('error', (err) => {
    console.error('发生错误:', err);
});