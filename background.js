chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({color: '#3aa757'}, function () {
		console.log("The color is green.");
	});
});
chrome.tabs.onUpdated.addListener(function () {
	setTabZoom()
});

chrome.tabs.onCreated.addListener(function () {
	setTabZoom()
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	setTabZoom()
});


function setTabZoom() {
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		// since only one tab should be active and in the current window at once
		// the return variable should only have one entry
		var activeTab = tabs[0];

		//alert("Your screen resolution is: " + window.screen.width * window.devicePixelRatio + "x" + window.screen.height * window.devicePixelRatio);

		chrome.tabs.executeScript(activeTab.id, {code: "screen.availWidth;"}, function t(availW) {
			if (availW >= 1921) {
				chrome.tabs.setZoom(activeTab.id, 1.5);
			} else {
				chrome.tabs.setZoom(activeTab.id, 1.0);
			}
		});

	});
}

