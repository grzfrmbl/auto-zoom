chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({color: '#3aa757'}, function () {
		console.log("The color is green.");
	});
});

chrome.tabs.onCreated.addListener(function () {
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		var activeTab = tabs[0];

		if (activeTab.pendingUrl != null) {
			if (activeTab.pendingUrl.startsWith("chrome://")) {
				return
			}
		}
		sleep(1750).then(() => {
			setTabZoom()
		});


	});

});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	setTabZoom()
});
chrome.tabs.onZoomChange.addListener(function (zoomChangeInfo) {
	setTabZoom(zoomChangeInfo)
});


function setTabZoom(info) {
	zoomVal = 1.5;

	// dont do anything on user zoom change
	if (info != null) {
		zoomVal = info.zoomSettings.newZoomFactor;
		return

	}

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		// since only one tab should be active and in the current window at once
		// the return variable should only have one entry
		var activeTab = tabs[0];

		if (activeTab == null) {
			return
		}


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

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}