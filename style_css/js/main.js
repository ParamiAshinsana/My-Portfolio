let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');

function moveSlider(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    if (currentIndex >= slides.length) currentIndex = 0;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Initial slide
moveSlider(0);