const ipc = require('node-ipc').default;
const path = require('path');

// 配置 IPC
ipc.config.id = 'function-server';
ipc.config.retry = 1500;
ipc.config.silent = true;

// 定义要共享的函数
function a(x, y) {
    return x + y;
}

// 启动 IPC 服务器
ipc.serve(() => {
    console.log('函数共享服务器已启动');

    // 处理函数调用请求
    ipc.server.on('call-function', (data, socket) => {
        console.log('call function exec', data)
        try {
            const { functionName, args } = data;
            
            // 根据函数名调用对应的函数
            if (functionName === 'a') {
                const result = a(...args);
                ipc.server.emit(socket, 'function-result', {
                    status: 'success',
                    result: result
                });
            } else {
                ipc.server.emit(socket, 'function-result', {
                    status: 'error',
                    message: '函数不存在'
                });
            }
        } catch (error) {
            ipc.server.emit(socket, 'function-result', {
                status: 'error',
                message: error.message
            });
        }
    });
});

// 启动服务器
ipc.server.start();

console.log('Socket 路径:', ipc.server.socketPath);

// 优雅关闭
process.on('SIGINT', () => {
    ipc.server.stop();
    console.log('服务器已关闭');
    process.exit(0);
}); 