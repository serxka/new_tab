document.getElementById('save').addEventListener('click', save);

chrome.storage.local.get(['url'], (res) => {
	document.getElementById('url').value = res.url;
});

function save() {
	const text = document.getElementById('url').value;
	chrome.storage.local.set({url: text}, () => {
		let status = document.getElementById('status');
		status.style.display = "block";
		setTimeout(() => {
			status.style.display = "none";
		}, 3000);
	});
}