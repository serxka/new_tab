let url = 'http://home/index.html';

chrome.commands.onCommand.addListener((cmd) => {
	chrome.storage.local.get(['url'], (res) => { url = res.url; });
	switch (cmd) {
		case 'new-tab': {
			chrome.tabs.query({
				index: 0,
				url: url,
				windowId: chrome.windows.WINDOW_ID_CURRENT
			}, (tabs) => {
				// Create a new main tab if it doesn't exist and pin it
				if (tabs.length < 1) {
					chrome.tabs.create({
						active: false,
						index: 0,
						pinned: true,
						url: url
					}, (pin) => { new_tab(pin, true); });
				} else { // Other wise just try to pin it if its not already
					const tab = tabs[0];
					chrome.tabs.update(tab.id, {
					 	pinned: true
					}, (_) => {});
					new_tab(tab);
				}
			});
			break;
		}
		default:
	}	
});

function new_tab(tab,update_url=false) {
	// Get the current tab
	let current_index = 0;
	chrome.tabs.query({
		active: true,
		windowId: chrome.windows.WINDOW_ID_CURRENT
	}, (current) => { current_index = current[0].index; });

	// Duplicate the tab and move it up
	chrome.tabs.duplicate(tab.id, (new_tab) => {
		let obj = {pinned: false};
		if (update_url)
			obj.url = url;
		chrome.tabs.update(new_tab.id, obj, (_) => {});
		chrome.tabs.move(new_tab.id,
			{ index: current_index + 1 },
			(_) => {});
	});
}
