(function (records) {
	var members = {};
	var consumeRecords = [];
	
	var pageSize = 8;//record length per page
	
	for(var i=0; i<records.length; i++) {
		var record = records[i];
		if(record.type == 'consume') {
			consumeRecords.push(record.date + '#<label title="' + record.summary + '"> ?? </label>');
		}
		for(v in record.details) {
			members[v] = members[v] || {
				name:v,
				balance:"",
				count:0,
				rechargeDtls:[],
				consumeDtls:{}
			};
			members[v].balance += record.details[v];
			members[v].balance = eval(members[v].balance);
			switch(record.type) {
				case 'consume':
					members[v].count++;
					members[v].consumeDtls[record.date] = record.details[v];
					break;
				case 'recharge':
					members[v].rechargeDtls.push(record.date + ': ' + record.details[v]);
					break;
				case 'init':
					members[v].rechargeDtls.push(record.date + '(初始余额): ' + record.details[v]);
					break;
			}
		}
	}
	
	//filter _membersCard's records
	var memberCard = members['_memberCard'];
	delete members['_memberCard'];
	
	pageSize = Math.min(consumeRecords.length, pageSize);
	
	var pageNums = consumeRecords.length/pageSize;
	pageNums = pageNums%1 === 0? pageNums:Math.ceil(pageNums);
	var pageNumsStr = [];
	for(var p=1; p<pageNums+1; p++) {
		pageNumsStr.push('<a href="#" class="toPage">' + p + '</a>');
	}
	pageNumsStr.join(', ')
	
	//render html
	var vMap = {
		"#label_title":"研发中心羽毛球会员会费及打球记录",
		"#label_notice":"交接后会员初始金额各有不同",
		"#label_membersName":"会员名",
		"#label_balance":"余额",
		"#label_consumeDtls":"打球记录" + "(" + pageNumsStr + ")",
		"#label_membersCount":"会员数",
		"#label_totleBalance":"总余额",
		"#label_rechargeDtls":"充值明细",
		"#label_membersCardBalance":"会员卡余额",
		"#label_profit":"收支",
		"#membersCardBalance":memberCard.balance,
		"#membersCount":0,
		"#totleBalance":0,
		"#profit":0,
		"#consumeRecordsLength":pageSize,
		"#footer":"powered BY https://github.com/zhoui/records"
	};
	
	var table = [
			'<thead>',
			'<tr rowspan="2"><td colspan="4">' + '#label_title' + '</td></tr>',
			'<tr><td colspan="4"><label>#label_membersCount：#membersCount, #label_totleBalance：#totleBalance, #label_membersCardBalance：#membersCardBalance, #label_profit：#profit</label></td><td colspan=',
			consumeRecords.length - 2,
			'><a target="_blank" href="./js/data.js">数据明细</a></td></tr>',
			'</thead>',
			'<tbody>',
			'<tr>',
			'<th rowspan="2" >#label_membersName</th>',
			'<th rowspan="2" >#label_balance</th>',
			'<th colspan="#consumeRecordsLength">#label_consumeDtls</th>',
			'</tr>',
			'<tr id="consumeRecordsTitle"><td>' + consumeRecords.slice(0,pageSize).join('</td><td>').replace(/#/g,'') + '</td></tr>'
		];
	
	// convert to array
	var membersArray = [];
	for(r in members) {
		membersArray.push(members[r]);
	}
	// sort by consume count & balance
	membersArray.sort(function(m1, m2) {
		var rst = m2.count - m1.count;
		return rst == 0 ? m2.balance - m1.balance : rst;
	});
	
	for(var i=0; i<membersArray.length; ++i) {
		var tr = [];
		//name and recharge info
		tr.push('<td>' + membersArray[i].name + '<sup>' + membersArray[i].count + '</sup>' + ' <label title="#label_rechargeDtls\r\n' + membersArray[i].rechargeDtls.join('\r\n') + '">??</label>' + '</td>');
		//balance
		tr.push('<td>' + membersArray[i].balance + '</td>');
		//calculate balance 
		vMap['#totleBalance'] += membersArray[i].balance;
		vMap['#membersCount']++;
		for(var j=0; j<pageSize; j++) {
			var date = consumeRecords[j].split('#')[0];
			tr.push('<td>' + (membersArray[i].consumeDtls[date] || '') + '</td>');
		}
		table.push('<tr class="mr">' + tr.join('') + '</tr>');
	}
	
	table.push('</tbody>', '<tfoot>', '<tr><td colspan=', consumeRecords.length + 2, ' ><sub>#footer</sub></td></tr>', '</tfoot');
	//profit
	vMap['#profit'] = vMap['#totleBalance'] - vMap['#membersCardBalance'];
	
	//replace variable
	var html = table.join('');
	for(v in vMap) {
		html = html.replace(new RegExp(v,'g'), vMap[v]);
	}
	document.getElementById('tj').innerHTML = html;
	var tos = document.getElementsByClassName('toPage');
	for(var t=0; t<tos.length; t++) {
		tos[t].onclick = function() {
			toPage(this.innerHTML);
		}
	}
	//functions define
	
	function toPage(pageNum, pSize) {
		pSize = pSize || pageSize;
		var beginIndex = (pageNum-1)*pSize;
		var tmp = consumeRecords.slice(beginIndex, beginIndex + pSize);
		var trs = document.getElementsByClassName('mr');
		for(var i=0; i<trs.length; i++) {
			var tds = trs[i].childNodes;
			var tdData = [tds[0].innerHTML, tds[1].innerHTML];
			for(var j=0; j<tmp.length; j++) {
				var date = tmp[j].split('#')[0];
				tdData.push(membersArray[i].consumeDtls[date] || '');
			}
			trs[i].innerHTML = '<td>' + tdData.join('</td><td>') + '</td>';
		}
		
		document.getElementById('consumeRecordsTitle').innerHTML = '<td>' + tmp.join('</td><td>').replace(/#/g,'') + '</td>';
	}
	
}) (TJ);