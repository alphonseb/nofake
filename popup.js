nofake_form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const isFake = e.target.querySelector('#fake').checked ? true : false
    console.log(isFake);
    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes('twitter.com')) {
        document.querySelector('.legend#url').textContent = tab.url
    }
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
            let title = document.querySelector('meta[property="twitter:title"]')?.getAttribute('content')
            if (!title) {
                title = document.querySelector('meta[property="og:title"]')?.getAttribute('content')
            }
            if (!title) {
                title = document.querySelector('title').textContent
            }
            return title
        }
    }, (results) => {
        const request = new Request('https://app.alphonsebouy.fr/nofake/article/', {
                method: 'POST',
                headers: new Headers([
                ['Content-Type', 'application/json']
            ]),
                body: JSON.stringify({
                    url: tab.url.split('?')[0],
                    title: results[0].result,
                    fake_score: isFake ? 1 : 0,
                    nofake_score: isFake ? 0 : 1
                })
        })
        const resultContainer = document.querySelector('#result')
        fetch(request).then(res => res.json()).then(data => {
            if (data.error) {
                resultContainer.innerHTML = "<p>Erreur</p>"
            } else {
                resultContainer.innerHTML = "<p>Merci pour ta contribution !</p>"
            }
            console.log(data.message)
        })
  });
})