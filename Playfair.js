/**
 * playfair
 * auth：qqxufo
 */

var Playfair = (function() {
    var encryptArray = getTwoDimensionArray(5),
        key, message;


    // 返回 row 行的二维数组
    function getTwoDimensionArray(row) {
        if (typeof row !== 'number' || row === 0) {
            return;
        }
        var arr = [];
        for (var i = 0; i < row; ++i) {
            arr[i] = [];
        }
        return arr;
    }

    // 设置密钥
    function setKey(val) {
        if (val != null) {
            key = val;
        }
    }

    // 设置明文/密文
    function setMessage(val) {
        if (val != null) {
            message = val;
        }
    }

    // 去重函数
    function deduplication(arr) {
        var charHash = {}, //字符hash表，用于去重
            tmpArr = [];
        for (var i = 0; i < arr.length; ++i) {
            if (!charHash[arr[i]]) { // 如果未出现则放入数组中
                tmpArr.push(arr[i]);
            }
            charHash[arr[i]] = true; // 标记出现过的字母
        }
        return tmpArr;
    }

    // 数据初始化工作
    function initData() {
        var character = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

        // 将非不是字母的字符去掉
        key = key.replace(/[^a-zA-Z ]/g, '');
        message = message.replace(/[^a-zA-Z ]/g, '');

        // 转大写/去空格
        key = key.toLocaleUpperCase().replace(/\s+/g, '');
        message = message.toLocaleUpperCase().replace(/\s+/g, '');

        // 保证明文长度为偶数
        message += message.length % 2 ? 'X' : '';

        // 因为Z和Y占用了一个格子，所以我对Z替换处理
        key = key.replace('Z', 'Y');
        message = message.replace('Z', 'Y');

        // key去重
        key = deduplication(key);

        // 从字母表中删除已经用掉的字母
        for (var i = 0; i < character.length; ++i) {
            var index = character.indexOf(key[i]);
            if (index !== -1) {
                character.splice(index, 1);
            }
        }

        // 将处理好的key和character数组合并
        for (var i = key.length - 1; i >= 0; --i) {
            character.unshift(key[i]);
        }

        // 生成矩阵
        for (var i = 0; i < 5; ++i) {
            for (var j = 0; j < 5; ++j) {
                encryptArray[i][j] = character[i * 5 + j];
            }
        }
    }

    function getMode(a, b) {
        // 返回值含义 [0 : 同一行, 1 : 同一列, 2 : 其他]

        var a_index = {},
            b_index = {};

        // 检查是否同行
        for (var i = 0; i < 5; ++i) {
            var a_fg = false,
                b_fg = false;
            for (var j = 0; j < 5; ++j) {
                if (a === encryptArray[i][j]) {
                    a_fg = true;
                    a_index['i'] = i;
                    a_index['j'] = j;
                }
                if (b === encryptArray[i][j]) {
                    b_fg = true;
                    b_index['i'] = i;
                    b_index['j'] = j;
                }
            }
            var tmp = a_fg && b_fg;
            if (tmp == true) {
                return {
                    mode: 0,
                    a_index: a_index,
                    b_index: b_index
                };
            }
        }
        // 检查是否同列
        for (var j = 0; j < 5; ++j) {
            var a_fg = false,
                b_fg = false;
            for (var i = 0; i < 5; ++i) {
                if (a === encryptArray[i][j]) {
                    a_fg = true;
                    a_index['i'] = i;
                    a_index['j'] = j;
                }
                if (b === encryptArray[i][j]) {
                    b_fg = true;
                    b_index['i'] = i;
                    b_index['j'] = j;
                }
            }
            var tmp = a_fg && b_fg;
            if (tmp == true) {
                return {
                    mode: 1,
                    a_index: a_index,
                    b_index: b_index
                };
            }
        }
        // 检查对角的情况
        for (var i = 0; i < 5; ++i) {
            for (var j = 0; j < 5; ++j) {
                if (a === encryptArray[i][j]) {
                    a_index['i'] = i;
                    a_index['j'] = j;
                }
                if (b === encryptArray[i][j]) {
                    b_index['i'] = i;
                    b_index['j'] = j;
                }
            }
        }
        return {
            mode: 2,
            a_index: a_index,
            b_index: b_index
        };
    }

    // 明文对加密操作
    function getSercretTwain(modeMap) {
        var strSercret = '';
        switch (modeMap.mode) {
            case 0:
                strSercret = getMoveLeftValue(modeMap.a_index) + getMoveLeftValue(modeMap.b_index);
                break;
            case 1:
                strSercret = getMoveUpValue(modeMap.a_index) + getMoveUpValue(modeMap.b_index);
                break;
            case 2:
                strSercret = getSwapValue(modeMap.a_index, modeMap.b_index);
                break;
            default:
                break;
        }
        return strSercret;
    }

    // 获取循环左移一位后对应的值
    function getMoveLeftValue(index) {
        var i = index.i != 0 ? index.i - 1 : 4,
            j = index.j;
        return encryptArray[i][j];
    }

    // 获取循环右移一位后对应的值
    function getMoveRightValue(index) {
        var i = index.i != 4 ? index.i + 1 : 0,
            j = index.j;
        return encryptArray[i][j];
    }

    // 获取循环上移一位后对应的值
    function getMoveUpValue(index) {
        var i = index.i,
            j = index.j != 0 ? index.j - 1 : 4;
        return encryptArray[i][j];
    }

    // 获取循环下移一位后对应的值
    function getMoveDownValue(index) {
        var i = index.i,
            j = index.j != 4 ? index.j + 1 : 0;
        return encryptArray[i][j];
    }

    // 获取对角线情况下密码对对应的值
    function getSwapValue(a_index, b_index) {
        return encryptArray[a_index.i][b_index.j] + encryptArray[b_index.i][a_index.j];
    }

    // 密文对反加密
    function getUnSercretTwain(modeMap) {
        var strSercret = '';
        switch (modeMap.mode) {
            case 0:
                strSercret = getMoveRightValue(modeMap.a_index) + getMoveRightValue(modeMap.b_index);
                break;
            case 1:
                strSercret = getMoveDownValue(modeMap.a_index) + getMoveDownValue(modeMap.b_index);
                break;
            case 2:
                strSercret = getSwapValue(modeMap.a_index, modeMap.b_index);
                break;
            default:
                break;
        }
        return strSercret;
    }

    // 生成密文串
    function getSercretStr(input_key, input_message) {
        var scretMsg = '',
            modeMap;

        setKey(input_key);
        setMessage(input_message);
        initData();

        for (var i = 0; i < message.length; i += 2) {
            modeMap = getMode(message[i], message[i + 1]); // 俩个一组的获取位置和类型
            scretMsg += getSercretTwain(modeMap);
        }
        return scretMsg;
    }

    // 密文串解密
    function getUnSercretStr(input_key, input_message) {
        var unScretMsg = '',
            modeMap;

        setKey(input_key);
        setMessage(input_message);
        initData();

        for (var i = 0; i < message.length; i += 2) {
            modeMap = getMode(message[i], message[i + 1]); // 俩个一组的获取位置和类型          
            unScretMsg += getUnSercretTwain(modeMap);
        }
        return unScretMsg.toLocaleLowerCase();
    }

    return {
        'getSercretStr': getSercretStr,
        'getUnSercretStr': getUnSercretStr
    };
})();
