# Playfair
js实现的Playfair密码 加/解密插件


## 使用方法：

### 首先引入Playfair.js 文件
```
<script type="text/javascript" src="Playfair.js"></script>
```

### 加密
Playfair.getSercretStr(密钥字符串, 明文);
```
var data = Playfair.getSercretStr('qqxufo', 'Hi Playfair');
console.log(data); //BCJGESQDKN
```

### 解密
Playfair.getUnSercretStr(密钥字符串, 密文);
```
var data = Playfair.getUnSercretStr('qqxufo', 'BCJGESQDKN');
console.log(data);//hiplayfair
```

### 效果展示
加密：
![image](https://github.com/qqxufo/Playfair/screenshots/1.png)
解密：
![image](https://github.com/qqxufo/Playfair/screenshots/2.png)
