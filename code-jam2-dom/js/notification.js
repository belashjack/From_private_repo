const startTimer = function () {
    setTimeout(showNotification, 1000);
};

if (localStorage.getItem('tips disabled') === null) {
    document.addEventListener('DOMContentLoaded', startTimer);
}

const showNotification = function () {
    const notification = document.querySelector('.notification');
    const textContainer = notification.querySelector('.text-container');
    const closeBtn = notification.querySelector('.close-btn');
    const leftBtn = notification.querySelector('.left-btn');
    const rightBtn = notification.querySelector('.right-btn');
    const pageIndicators = notification.querySelector('.page-indicators');
    const tipsCheckbox = notification.querySelector('.tips input[type="checkbox"]');

    // Array with data
    const usefulInfo = [
        '<h3>Don’t skip breakfast.</h3> Studies show that eating a proper breakfast is one of the most positive things you can do if you are trying to lose weight. Breakfast skippers tend to gain weight. A balanced breakfast includes fresh fruit or fruit juice, a high-fibre breakfast cereal, low-fat milk or yoghurt, wholewheat toast, and a boiled egg.',
        '<h3>Drink more water.</h3> Most of us don’t drink enough water every day. Water is essential for our bodies to function. Do you know over 60% of our body is made up of water? Water is needed to carry out body functions, remove waste, and carry nutrients and oxygen around our body. Since we lose water daily through urine, bowel movements, perspiration, and breathing, we need to replenish our water intake.',
        '<h3>Get enough sleep.</h3> When you don’t rest well, you compensate by eating more — usually junk food. Get enough rest and you don’t need to snack to stay awake. Also, lack of sleep causes premature aging and you don’t want that!',
        '<h3>Exercise.</h3> Movement is life. Research has shown that exercising daily brings tremendous benefits to our health, including an increase in lifespan, lowering of risk of diseases, higher bone density, and weight loss. Increase activity in your life. Choose walking over transport for close distances. Climb the stairs instead of taking the lift. Join an aerobics class.',
        '<h3>Eat vegetables.</h3> Vegetables are important for good health with many important vitamins and minerals. Onion, leek, and garlic are prebiotics — essential food for good gut bacteria. Spinach, kale, swiss chard, and turnip greens are dark leafy greens with high mineral content. Consume a variety of different vegetables for a large diversity of good gut bacteria, which improves your immune system. How can you include more vegetables in your diet today?',
        '<h3>Stop smoking.</h3> Smoking is detrimental to health, severely increases the risk of lung cancer, kidney cancer, esophageal cancer (of our gulconst), heart attack, and more. Smoking “lite” cigarettes do not decrease health risks either. If you’re a smoker, quit not just for yourself, but for your family and friends. If you don’t smoke, stay that way and don’t start.',
        'Another tip',
    ];
    const pages = [];
    let currentInfoIndex = 0;
    let previousInfoIndex;

    const closeNotification = function closeNotification(param) {
        const newTarget = param instanceof Event ? param.target : param;

        if (newTarget.closest('.close-btn')) {
            notification.parentElement.removeChild(notification);
            removeListeners();
        }
    };

    const closeNotificationViaKeyboard = function closeNotificationViaKeyboard(event) {
        if (event.target === closeBtn && (event.keyCode === 32 || event.keyCode === 13)) {
            event.preventDefault();
            closeNotification(event.target);
        }
        if (event.keyCode === 27) {
            closeNotification(closeBtn);
        }
    };

    const forceBlur = function forceBlur(event) {
        if (event.target.closest('.left-btn')) {
            leftBtn.blur();
        }
        if (event.target.closest('.right-btn')) {
            rightBtn.blur();
        }
    };

    const flipToLeft = function flipToLeft(event) {
        if (!event.target.closest('.left-btn') && event.type === 'click') {
            return;
        }
        if (currentInfoIndex <= 0) {
            currentInfoIndex = usefulInfo.length;
        }

        currentInfoIndex -= 1;
        updatePageIndicators();
        addUsefulInfo();
    };

    const flipToRight = function flipToRight(event) {
        if (!event.target.closest('.right-btn') && event.type === 'click') {
            return;
        }
        if (currentInfoIndex >= usefulInfo.length - 1) {
            currentInfoIndex = -1;
        }

        currentInfoIndex += 1;
        updatePageIndicators();
        addUsefulInfo();
    };

    const flipViaKeyboard = function flipViaKeyboard(event) {
        if (event.keyCode === 37) {
            leftBtn.focus();
            flipToLeft();
            setTimeout(() => { leftBtn.blur(); }, 150);
        }
        if (event.keyCode === 39) {
            rightBtn.focus();
            flipToRight();
            setTimeout(() => { rightBtn.blur(); }, 150);
        }
    };

    const storeState = function storeState(event) {
        if (event.target.checked) {
            localStorage.setItem('tips disabled', true);
        } else {
            localStorage.removeItem('tips disabled');
        }
    };

    const addPageIndicators = function addPageIndicators() {
        class PageIndicator {
            constructor() {
                const obj = document.createElement('input');
                obj.type = 'button';
                obj.classList.add('page-indicator');
                obj.onclick = function () {
                    currentInfoIndex = pages.indexOf(this);
                    if (currentInfoIndex !== previousInfoIndex) {
                        updatePageIndicators();
                        addUsefulInfo();
                    }
                };
                return obj;
            }
        }

        for (let i = 0; i < usefulInfo.length; i++) {
            const pageindicator = new PageIndicator();
            pages.push(pageindicator);
            pageIndicators.appendChild(pageindicator);
        }

        if (usefulInfo.length > 0) {
            pages[currentInfoIndex].classList.add('active');
        }
    };

    const updatePageIndicators = function updatePageIndicators() {
        if (usefulInfo.length > 0) {
            pages[previousInfoIndex].classList.remove('active');
            pages[currentInfoIndex].classList.add('active');
            pages[currentInfoIndex].scrollIntoView(false);
        }
    };

    const addUsefulInfo = function addUsefulInfo() {
        previousInfoIndex = currentInfoIndex;
        if (usefulInfo.length > 0) {
            textContainer.innerHTML = usefulInfo[currentInfoIndex];
            textContainer.scrollTop = 0;
        }
    };

    const addListeners = function addListeners() {
        notification.addEventListener('click', closeNotification);
        document.body.addEventListener('keydown', closeNotificationViaKeyboard);
        notification.addEventListener('mouseup', forceBlur);
        notification.addEventListener('click', flipToLeft);
        notification.addEventListener('click', flipToRight);
        document.body.addEventListener('keydown', flipViaKeyboard);
        tipsCheckbox.addEventListener('change', storeState);
    };

    const removeListeners = function removeListeners() {
        document.body.removeEventListener('keydown', closeNotificationViaKeyboard);
        document.body.removeEventListener('keydown', flipViaKeyboard);
        document.removeEventListener('DOMContentLoaded', startTimer);
    };

    const render = function render() {
        notification.classList.remove('closed');
    };

    addPageIndicators();
    addUsefulInfo();
    addListeners();
    render();
};
