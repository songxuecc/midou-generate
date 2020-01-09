 
import fs from 'fs'
import path ,{join} from 'path'



class FindFile {
    constructor() {
        this.counnt = 0;
        this.res = undefined;
        this.rej = undefined;
    }

    clear = () => {
        this.counnt = 0;
    }
    find = (filePath, key) => {
        return new Promise((res, rej) => {
            this.counnt = this.counnt + 1;
            if (this.counnt === 1) {
                this.res = res;
                this.rej = rej;
            }
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    this.rej({ readdirError: err });
                } else {
                    //遍历读取到的文件列表
                    files.forEach(filename => {
                        //获取当前文件的绝对路径
                        var filedir = path.join(filePath, filename);
                        //根据文件路径获取文件信息，返回一个fs.Stats对象
                        fs.stat(filedir, (eror, stats) => {
                            if (eror) {
                                this.rej({ statError: eror });
                            } else {
                                var isFile = stats.isFile(); //是文件
                                var isDir = stats.isDirectory(); //是文件夹
                                if (isFile) {
                                    if (filedir.indexOf(key) > -1) {
                                        this.clear()
                                        this.res(filedir);
                                    }
                                }
                                if (isDir) {
                                    this.find(filedir, key); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                                }
                            }
                        });
                    });
                }
            });
        });
    };
}

// 删除文件夹
function removeFolder(path) {
    if (fs.existsSync(path)) {
        const files = fs.readdirSync(path);
        files.forEach(file => {
            const curPath = join(path, file);
            if (fs.statSync(curPath).isDirectory()) {
                removeFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}


export {
    FindFile,
    removeFolder
}