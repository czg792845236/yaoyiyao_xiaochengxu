const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8080 });
 
 var ws_arr = [];
 //用来存放用户的昵称、头像路径、摇的次数
 var score_arr = [];
wss.on('connection', function connection(ws) {
	console.log("有人上线了")
	ws_arr.push(ws)
	// 当有前端用户
  ws.on('message', function incoming(message) {
  	// 用户发送过来的是字符串，需要转成数组
    	var messageObj = JSON.parse(message);
    	// 信号量，如果为true的话那么就将message信息存到score_arr数组当中
    	isHave = false;
    	// 遍历数组，如果数组当中的nickName和接收到的messageObj的nickName相同就让当中的n加1
    	score_arr.forEach(item =>{
    		if(item.nickName == messageObj.nickName){
    			item.n ++;
    			isHave = true;
    		}
    	});
    	// 如果ishave为false了,就说明没有nickName,就创建数据
    	if(!isHave){
    		score_arr.push({
    			nickName:messageObj.nickName,
    			avatarUrl : messageObj.avatarUrl,
    			n : 0
    		})
    	}
    	ws_arr.forEach(item =>{
    		// 返回给前端的数据
    		item.send(JSON.stringify({
                "score_arr" : score_arr
    		}))
    	})
  });
 

});