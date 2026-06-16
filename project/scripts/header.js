document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('[data-site-nav]');
    if (!navContainer) return;

    const navHtml = `
        <nav class="nav">
            <a class="logo" href="index.html" aria-label="WeatherWise Forecast home">
                <span class="logo-mark" aria-hidden="true"></span>
                <span>WeatherWise</span>
            </a>
            <button class="menu-button" id="menuButton" type="button" aria-label="Open navigation" aria-expanded="false">Menu</button>
            <ul class="nav-links" id="navLinks">
                <li>
                    <a href="index.html" class="home-link" aria-label="Home">
                        <span class="home-icon" aria-hidden="true">🏠</span>
                        <span>Home</span>
                    </a>
                </li>
                <li><a href="current.html" data-nav-page="current">Current</a></li>
                <li><a href="forecast.html" data-nav-page="forecast">Forecast</a></li>
                <li><a href="history.html" data-nav-page="history">History</a></li>
            </ul>
        </nav>
    `;

    navContainer.innerHTML = navHtml;
    const currentPage = document.body.dataset.page;
    if (currentPage) {
        const currentLink = navContainer.querySelector(`[data-nav-page="${currentPage}"]`);
        if (currentLink) {
            currentLink.setAttribute('aria-current', 'page');
        }
    }
});
