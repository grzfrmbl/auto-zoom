let tabIds = new Map();

chrome.tabs.onCreated.addListener(function (tab) {
	if (tab.pendingUrl != null) {
		if (tab.pendingUrl.includes("chrome://")) {
			addKey(tab.id);
			return
		}
	}

	if (tab.url != null) {
		if (tab.url.includes("chrome://")) {
			addKey(tab.id);
			return
		}
	}

	var loaded = tab.status;
	var i = 0;

	while (loaded !== "complete") {
		i = i + 1;

		loaded = tab.status;

		if (i > 200) {
			break;
		}
	}
	setTabZoom();


});
// Not used because this is called alot, might degrade performance..
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tabIds.has(tabId)) {
		if (tabIds.get(tabId) === 6) { // This is specifically tuned to Vivaldis speed dial
			tabIds.delete(tabId);
			sleep(3000).then(() => {
				setTabZoom()
			});

		} else {
			tabIds.set(tabId, tabIds.get(tabId) + 1)
		}
	}
});
chrome.tabs.onActivated.addListener(function (activeInfo) {
	setTabZoom()
});
chrome.tabs.onZoomChange.addListener(function (zoomChangeInfo) {
	setTabZoom(zoomChangeInfo)
});
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {

});


function setTabZoom(info) {
	zoomVal = 1.6;

	// dont do anything on user zoom change
	if (info != null) {
		chrome.tabs.setZoom(info.id, info.zoomSettings.newZoomFactor);
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
				chrome.tabs.setZoom(activeTab.id, zoomVal);
			} else {
				chrome.tabs.setZoom(activeTab.id, 1.0);
			}
		});

	});
}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function addKey(id) {
	tabIds.set(id, 0);

}