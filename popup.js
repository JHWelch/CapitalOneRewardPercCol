// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: `

	var headerRow = document.getElementById("rewards_transactions_table_header_row");
	var headerCell = document.createElement('th');
	headerCell.innerHTML = "REWARD %";
	headerCell.className = "col_amount";
	headerRow.insertBefore(headerCell, headerRow.children[3]);

	var tableRows = document.getElementsByClassName("rtRewardsTransactions"); 
	var i;
	for (i = 0; i < tableRows.length; i++) {
		var description = tableRows[i].children[1].innerHTML;
		var amount = tableRows[i].children[2].children[1].children[0].innerHTML;

		var purchaseTotal = parseFloat(description.substring(description.indexOf('(') + 2, description.indexOf(')')));
		var rewardAmount = parseFloat(amount.substring(1));

		var newcell = tableRows[i].insertCell(3);
		newcell.innerHTML = (Math.round(((rewardAmount / purchaseTotal) * 200))/2 + "%");
		newcell.className = "col_amount rewards_amount";
	}

`});
  });
};
