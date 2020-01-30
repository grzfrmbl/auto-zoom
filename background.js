let tabIds = new Map();

chrome.tabs.onActivated.addListener(function (activeInfo) {
	setTabZoom(activeInfo.tabId, activeInfo)
});

chrome.tabs.onZoomChange.addListener(function (zoomChangeInfo) {
	setTabZoom(zoomChangeInfo.zoomSettings.id, zoomChangeInfo)
});

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

	var loaded = tab.status, i = 0;

	while (loaded !== "complete") {
		i++;

		loaded = tab.status;

		if (i > 20) {
			break;
		}

		sleep(100).then(() => {
		});
	}

	setTabZoom(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tabIds.has(tabId)) {
		if (tabIds.get(tabId) === 6) { // This is specifically tuned to Vivaldis speed dial
			tabIds.delete(tabId);
			sleep(3000).then(() => {
				setTabZoom(tabId)
			});

		} else {
			tabIds.set(tabId, tabIds.get(tabId) + 1)
		}
	}
});

function setTabZoom(id, info) {
	zoomVal = 1.6;
	tabId = id;

	// dont do anything on user zoom change
	if (info != null) {
		chrome.tabs.setZoom(info.id, info.zoomSettings.newZoomFactor);
		return
	}

	if (tabId == null) {
		tabId = getActiveTabId()
	}

	// it seems not possible to fetch the availWidth/Height from the chrome extensions API
	// fortunately this can be done by injection into each tab
	chrome.tabs.executeScript(activeTab.id, {code: "screen.availWidth;"}, function t(availW) {
		availW >= 1921 ? hrome.tabs.setZoom(activeTab.id, zoomVal) : chrome.tabs.setZoom(activeTab.id, 1.0);
	});

}

function getActiveTabId() {
	return chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		if (tabs[0] == null) {
			return null
		}
		return tabs[0]
	});
}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function addKey(id) {
	tabIds.set(id, 0);
}