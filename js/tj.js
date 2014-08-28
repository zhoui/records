(function (records) {
	var rst = {};
	var dates = [];
	for(var i=0; i<records.length; i++) {
		var record = records[i];
		dates.push(
			record.date + '<label title="' + record.summary + '"> ?? </label>');
		for(v in record.details) {
			rst[v] = rst[v] || {
				balance:"",
				count:1,
				consumeDtls:{}
			};
			rst[v].balance += record.details[v];
			rst[v].balance = eval(rst[v].balance);
			rst[v].count++;
			rst[v].consumeDtls[record.date] = record.details[v];
		}
	}
	
	//render html
	var table = [
				'<thead><tr rowspan="2"><td colspan="3">' + '羽毛球会员会费及消费记录明细表' + '</td></tr><tr><td  colspan="3"><label>会员数：$rstCount, 总余额：$totleBalance</label></td></tr></thead>',
				'<tr>',
				'<th rowspan="2" >会员名</th>',
				'<th rowspan="2" >余额</th>',
				'<th colspan="$recordsLength" >消费明细</th>',
				'</tr>',
				'<tr class="center"><td>' + dates.join('</td><td>') + '</td></tr>'
				];
	var totleBalance = 0;
	var rstCount = 0;
	for(r in rst) {
		var tr = [];
		tr.push('<td>' + r + '</td>');
		tr.push('<td>' + rst[r].balance + '</td>');
		totleBalance += rst[r].balance;
		rstCount++;
		for(var i=0; i<records.length; i++) {
			var date = records[i].date;
			tr.push('<td>' + (rst[r].consumeDtls[date] || '') + '</td>');
		}
		table.push('<tr>' + tr.join('') + '</tr>');
	}
	document.getElementById('tj').innerHTML = table.join('')
		.replace('$rstCount', rstCount)
		.replace('$totleBalance', totleBalance)
		.replace('$recordsLength', records.length);
}) (TJ);