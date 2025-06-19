import ipc from 'node-ipc';
import { checkAdminPrivileges } from './util.js';

ipc.config.id = 'function-client';
ipc.config.retry = 1500;
ipc.config.silent = true;

checkAdminPrivileges();

ipc.connectTo('function-server', () => {
    console.log('已连接到函数服务器');

    ipc.of['function-server'].emit('call-function', {
        functionName: 'a',
        args: [5, 3]
    });
});

ipc.of['function-server'].on('function-result', (response) => {
    console.log('函数调用结果:', response);
});

ipc.of['function-server'].on('disconnect', () => {
    console.log('与服务器的连接已关闭');
});

ipc.of['function-server'].on('error', (err) => {
    console.error('发生错误:', err);
}); 