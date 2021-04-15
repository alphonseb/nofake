console.log('heeeelllooo')

const checkLink = (link) => {
    let card = link.querySelector('[data-testid="card.layoutLarge.detail"]')
    if (!card) {
        card = link.querySelector('[data-testid="card.layoutSmall.detail"]')
    }
    if (card) {
        const texts = [...card.querySelectorAll('span')].map(span => span.innerText)
        const request = new Request('https://app.alphonsebouy.fr/nofake/article/?title=' + texts[0], {
                method: 'GET',
                headers: new Headers([
                ['Content-Type', 'application/json']
            ])
        })
            
        fetch(request).then(res => res.json()).then(data => {
            if (data.is_in_db) {
                console.log(link);
                const parent = link.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                
                switch (data.status) {
                    case 'good':
                        parent.classList.add('flag--good')
                        break;
                        
                    case 'warning':
                        parent.classList.add('flag--warn')
                        break;
                    
                    case 'fake':
                        parent.classList.add('flag--fake')
                        parent.classList.add('flag--fake--blurred')
                        const popup = document.createElement('div')
                        popup.classList.add('nofake__popup')
                        const image = document.createElement("img");
                        image.src = chrome.runtime.getURL("img/logo.png");
                        const div = document.createElement('div')
                        div.appendChild(image)
                        popup.appendChild(div)
                        popup.insertAdjacentHTML('beforeend',  `
                            <h4>Contenu fake détecté !</h4>
                            <p>Nous l'avons bloqué pour vous</p>
                        `)
                        const button = document.createElement('button')
                        button.textContent = 'Afficher quand même'
                        button.addEventListener('click', () => {
                            console.log('click');
                            parent.classList.remove('flag--fake--blurred')
                            popup.remove()
                        })
                        popup.appendChild(button)
                        parent.parentNode.appendChild(popup)
                        break;
                }
            } else {
                console.log('not in db');
            }
        })
    } else {
        const request = new Request('https://app.alphonsebouy.fr/nofake/article/?url=' + link.textContent, {
                method: 'GET',
                headers: new Headers([
                ['Content-Type', 'application/json']
            ])
        })
        fetch(request).then(res => res.json()).then(data => {
            if (data.is_in_db) {
                console.log(data.status);
                
                const parent = link.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                
                switch (data.status) {
                    case 'good':
                        parent.classList.add('flag--good')
                        break;
                        
                    case 'warning':
                        parent.classList.add('flag--warn')
                        break;
                    
                    case 'fake':
                        parent.classList.add('flag--fake')
                        parent.classList.add('flag--fake--blurred')
                        const popup = document.createElement('div')
                        popup.classList.add('nofake__popup')
                        const image = document.createElement("img");
                        image.src = chrome.runtime.getURL("img/logo.png");
                        const div = document.createElement('div')
                        div.appendChild(image)
                        popup.appendChild(div)
                        popup.insertAdjacentHTML('beforeend',  `
                            <h4>Contenu fake détecté !</h4>
                            <p>Nous l'avons bloqué pour vous</p>
                        `)
                        const button = document.createElement('button')
                        button.textContent = 'Afficher quand même'
                        button.addEventListener('click', () => {
                            console.log('click');
                            parent.classList.remove('flag--fake--blurred')
                            popup.remove()
                        })
                        popup.appendChild(button)
                        parent.parentNode.appendChild(popup)
                        break;
                }
            } else {
                console.log('not in db');
            }
        })
    }
}

window.setTimeout(() => {
    
    const root = document.querySelector('[data-testid="primaryColumn"] section > [aria-label] > div')
    
    const firstLinks = root.querySelectorAll('a[target="_blank"]');
    [...firstLinks].forEach(link => {
        if (link.textContent) {
            checkLink(link)
        }
    })
    
    const callback = (mutationsList) => {
        for(const mutation of mutationsList) {
            if (mutation.type == 'childList') {
                if (mutation.addedNodes.length) {
                    const node = mutation.addedNodes[0]
                    const links = node.querySelectorAll('a[target="_blank"]')
                    for (const link of links) {
                        if (link.textContent) {
                            checkLink(link)
                        }
                    }
                }
            }
        }
    }
    
    const observer = new MutationObserver(callback)
    
    observer.observe(root, { childList: true })
}, 6000)


