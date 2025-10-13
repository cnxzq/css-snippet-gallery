const fs = require('fs').promises;
const path = require('path');

// 目标目录
const rootDir = path.join(__dirname, '../examples');
// 输出JSON文件路径
const outputFile = path.join(__dirname, 'html-structure.json');

/**
 * 递归读取目录并构建树形结构
 * @param {string} dir - 当前目录路径
 * @returns {Promise<Object>} 包含目录结构的对象
 */
async function buildTree(dir) {
  const result = {
    name: path.basename(dir),
    path: path.relative(rootDir, dir),
    type: 'directory',
    children: []
  };

  try {
    // 读取目录内容
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      if (entry.isDirectory()) {
        // 递归处理子目录
        const childDir = await buildTree(fullPath);
        if(childDir.children.length>0){
          result.children.push(childDir);
        }
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
        // 处理HTML文件
        result.children.push({
          name: entry.name,
          path: relativePath,
          type: 'file',
          extension: 'html'
        });
      }
    }

    // 按名称排序，目录在前，文件在后
    result.children.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });

    return result;
  } catch (err) {
    console.error(`处理目录 ${dir} 时出错:`, err);
    throw err;
  }
}

/**
 * 主函数：生成并保存树形结构JSON
 */
async function main() {
  try {
    // 检查目录是否存在
    await fs.access(rootDir);

    console.log(`开始读取目录: ${rootDir}`);
    const tree = await buildTree(rootDir);

    if (tree.children) {
      tree.children = tree.children.filter(item => item.type == 'directory')
    }

    // 保存为JSON文件
    await fs.writeFile(outputFile, JSON.stringify(tree.children || [], null, 2), 'utf8');
    console.log(`树形结构已生成: ${outputFile}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`目录不存在: ${rootDir}`);
    } else {
      console.error('发生错误:', err);
    }
    process.exit(1);
  }
}

// 执行主函数
main();