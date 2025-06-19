import isElevated from 'is-elevated';

export async function checkAdminPrivileges() {
  try {
    const elevated = await isElevated();
    if (elevated) {
      console.log('当前脚本以管理员权限运行');
    } else {
      console.log('当前脚本以普通用户权限运行');
    }
    return elevated;
  } catch (error) {
    console.error('检查权限时出错:', error);
    return false;
  }
}