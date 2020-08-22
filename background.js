chrome.commands.onCommand.addListener((cmd) => {
	switch (cmd) {
		case 'new-tab': {
			chrome.tabs.query({
				index: 0,
				title: '~/.',
				windowId: chrome.windows.WINDOW_ID_CURRENT
			}, (tabs) => {
				console.log(tabs);
				// Create a new main tab if it doesn't exist and pin it
				if (tabs.length < 1) {
					chrome.tabs.create({
						active: false,
						index: 0,
						pinned: true,
						url: 'http://home/index.html'
					}, (pin) => { new_tab(pin); });
				} else { // Other wise just try to pin it if its not already
					const tab = tabs[0];
					// chrome.tabs.update(tab.id, {
					// 	pinned: true
					// }, (_) => {});
					new_tab(tab);
				}
			});
			break;
		}
		default:
	}	
});

function new_tab(tab) {
	// Get the current tab
	let current_index = 0;
	chrome.tabs.query({
		active: true,
		windowId: chrome.windows.WINDOW_ID_CURRENT
	}, (current) => { current_index = current[0].index; });

	// Duplicate the tab and move it up
	chrome.tabs.duplicate(tab.id, (new_tab) => {
		chrome.tabs.update(new_tab.id, {
			pinned: false,
			url: 'http://home/index.html'
		}, (_) => {});
		chrome.tabs.move(new_tab.id,
			{ index: current_index + 1 },
			(_) => {});
	});
}