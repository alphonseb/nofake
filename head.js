(async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab);
    if (tab.url.includes('twitter.com')) {
        fetch('twitter.html').then(res => res.text()).then(html => {
            document.querySelector('.content').innerHTML = html
        })
    } else {
        document.querySelector('#page_title').textContent = tab.title
    }
}) ()