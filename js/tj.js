(function (records) {
	var member = {};
	var consumeRecords = [];
	for(var i=0; i<records.length; i++) {
		var record = records[i];
		if(record.type == 'consume') {
			consumeRecords.push(record.date + '#<label title="' + record.summary + '"> ?? </label>');
		}
		for(v in record.details) {
			member[v] = member[v] || {
				name:v,
				balance:"",
				count:0,
				rechargeDtls:[],
				consumeDtls:{}
			};
			member[v].balance += record.details[v];
			member[v].balance = eval(member[v].balance);
			switch(record.type) {
				case 'consume':
					member[v].count++;
					member[v].consumeDtls[record.date] = record.details[v];
					break;
				case 'recharge':
					member[v].rechargeDtls.push(record.date + ': ' + record.details[v]);
					break;
				case 'init':
					member[v].rechargeDtls.push(record.date + '(初始余额): ' + record.details[v]);
					break;
			}
		}
	}
	
	//filter _memberCard's records
	var memberCard = member['_memberCard'];
	delete member['_memberCard'];
	
	//render html
	var vMap = {
		"#label_title":"研发中心羽毛球会员会费及打球记录",
		"#label_notice":"交接后会员初始金额各有不同",
		"#label_memberName":"会员名",
		"#label_balance":"余额",
		"#label_consumeDtls":"打球记录",
		"#label_memberCount":"会员数",
		"#label_totleBalance":"总余额",
		"#label_rechargeDtls":"充值明细",
		"#label_memberCardBalance":"会员卡余额",
		"#label_profit":"收支",
		"#memberCardBalance":memberCard.balance,
		"#memberCount":0,
		"#totleBalance":0,
		"#profit":0,
		"#consumeRecordsLength":consumeRecords.length,
	};
	var table = [
			'<thead>',
			'<tr rowspan="2"><td colspan="4">' + '#label_title' + '</td></tr>',
			'<tr><td colspan="4"><label>#label_memberCount：#memberCount, #label_totleBalance：#totleBalance, #label_memberCardBalance：#memberCardBalance, #label_profit：#profit</label></td><td colspan=',
			consumeRecords.length - 2,
			'><a target="_blank" href="./js/data.js">数据明细</a></td></tr>',
			'</thead>',
			'<tbody>',
			'<tr>',
			'<th rowspan="2" >#label_memberName</th>',
			'<th rowspan="2" >#label_balance</th>',
			'<th colspan="#consumeRecordsLength" >#label_consumeDtls</th>',
			'</tr>',
			'<tr><td>' + consumeRecords.join('</td><td>').replace(/#/g,'') + '</td></tr>'
		];
	
	// convert to array
	var memberArray = [];
	for(r in member) {
		memberArray.push(member[r]);
	}
	// sort by consume count
	memberArray.sort(function(m1, m2) {
		return m2.count - m1.count;
	});
	
	for(var i=0; i<memberArray.length; ++i) {
		var tr = [];
		tr.push('<td>' + memberArray[i].name + '<sup>' + memberArray[i].count + '</sup>' + ' <label title="#label_rechargeDtls\r\n' + memberArray[i].rechargeDtls.join('\r\n') + '">??</label>' + '</td>');
		tr.push('<td>' + memberArray[i].balance + '</td>');
		vMap['#totleBalance'] += memberArray[i].balance;
		vMap['#memberCount']++;
		for(var j=0; j<consumeRecords.length; j++) {
			var date = consumeRecords[j].split('#')[0];
			tr.push('<td>' + (memberArray[i].consumeDtls[date] || '') + '</td>');
		}
		table.push('<tr>' + tr.join('') + '</tr>');
	}
	table.push('</tbody>', '<tfoot>', '<tr><td colspan=', consumeRecords.length + 2, ' ><sub>powered BY https://github.com/zhoui/records</sub></td></tr>', '</tfoot');
	//profit
	vMap['#profit'] = vMap['#totleBalance'] - vMap['#memberCardBalance'];
	
	//replace variable
	var html = table.join('');
	for(v in vMap) {
		html = html.replace(new RegExp(v,'g'), vMap[v]);
	}
	document.getElementById('tj').innerHTML = html;
}) (TJ);