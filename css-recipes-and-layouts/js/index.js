const toggleMenu = function toggleMenu(event) {
    event.preventDefault();
    menu.classList.toggle('responsive');
};
const changeActive = function changeActive(event) {
    event.preventDefault();
    if (event.target.hasAttribute('href')) {
        const previousActive = document.querySelector('.active');
        previousActive.classList.remove('active');
        event.target.classList.add('active');
    }
};

const hamburgerButton = document.querySelector('.hamburger-icon');
const menu = document.querySelector('.nav-menu');
hamburgerButton.addEventListener('click', toggleMenu);
menu.addEventListener('click', changeActive);
