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
                        parent.style.border = 'solid 3px green'
                        break;
                        
                    case 'warning':
                        parent.style.border = 'solid 3px orange'
                        break;
                    
                    case 'fake':
                        parent.style.border = 'solid 3px red'
                        parent.style.filter = 'blur(10px)'
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
                        parent.style.border = 'solid 3px green'
                        break;
                        
                    case 'warning':
                        parent.style.border = 'solid 3px orange'
                        break;
                    
                    case 'fake':
                        parent.style.border = 'solid 3px red'
                        parent.style.filter = 'blur(10px)'
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


