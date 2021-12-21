/// facebook-feeds-filter.js
(function() {
    const categoriesToHide = '{{1}}';
    const setOfCategoriesToHide = (( ) => {
        if ( categoriesToHide === '' || categoriesToHide === '{{1}}' ) { return new Set(); }
        return new Set(categoriesToHide.split(/\s*\|\s*/).map(s => s.toUpperCase()));
    })();
    const magic = String.fromCharCode(Date.now() % 26 + 97) +
                  Math.floor(Math.random() * 982451653 + 982451653).toString(36);
    const processInsertedFeedUnit = (feedUnit) => {
            const keys = Object.keys(feedUnit).filter(key => key.startsWith('__reactProps'));
            if ( keys.length != 1 ) { return; }
            const key = keys[0];
            try {
                const feedUnitCategory = feedUnit[key].children.props.children.props.edge.category;
                switch ( feedUnitCategory ) {
                    case 'ORGANIC':
                        // Organic feed-units, to be left alone
                        break;
                    case 'SPONSORED':
                        // Sponsored feed-units, to be filtered unconditionally
                        feedUnit.classList.add(magic);
                        break;
                    default:
                        // All other categories to be filtered on-demand
                        if ( setOfCategoriesToHide.has(feedUnitCategory) ) {
                            feedUnit.classList.add(magic);
                        }
                }
            } catch(e) {}
    };
    const start = ( ) => {
        const style = document.createElement('style');
        style.innerHTML = `
            .${magic} {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        const observer = new MutationObserver(mutations => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if ( node instanceof HTMLDivElement ) {
                        const attr = node.getAttribute('data-pagelet');
                        if ( attr && /^FeedUnit/.test(attr) ) {
                            processInsertedFeedUnit(node);
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    if ( document.readyState === 'loading' ) {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
