let highestZIndex = 10; 

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        
        const closeAudio = document.getElementById('closesound');
        if (closeAudio) {
            closeAudio.currentTime = 0;
            closeAudio.play().catch(err => console.log("Audio play blocked:", err));
        }

        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    
    const openAudio = document.getElementById('opensound');
    if (openAudio) {
        openAudio.currentTime = 0;
        openAudio.play().catch(err => console.log("Audio play blocked:", err));
    }

    highestZIndex++; 
    overlay.style.zIndex = highestZIndex;
    
    highestZIndex++; 
    modal.style.zIndex = highestZIndex;
    
    modal.classList.add('active')
    overlay.classList.add('active') 

    requestAnimationFrame(() => {
        const rect = modal.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let leftPos = rect.left;
        let topPos = rect.top;

        if (rect.left < 0) leftPos = 0;
        if (rect.top < 0) topPos = 0;
        if (rect.right > viewportWidth) leftPos = viewportWidth - rect.width;
        if (rect.bottom > viewportHeight) topPos = viewportHeight - rect.height;

        if (rect.left < 0 || rect.top < 0 || rect.right > viewportWidth || rect.bottom > viewportHeight) {
            modal.style.transform = 'scale(1)'; 
            modal.style.left = `${Math.max(0, leftPos)}px`;
            modal.style.top = `${Math.max(0, topPos)}px`;
            modal.style.margin = '0';
        }
    });
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    
    const remainingActiveModals = document.querySelectorAll('.modal.active');
    if (remainingActiveModals.length === 0) {
        overlay.classList.remove('active') 
        overlay.style.zIndex = '';
    } else {
        let maxZ = 5;
        remainingActiveModals.forEach(m => {
            let z = parseInt(m.style.zIndex) || 0;
            if (z > maxZ) maxZ = z;
        });
        overlay.style.zIndex = maxZ - 1;
    }


    modal.style.transform = '';
    modal.style.left = '';
    modal.style.top = '';
    modal.style.margin = '';
    modal.style.zIndex = '';
}

bigAZDragandStack();

function bigAZDragandStack(){
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const header = modal.querySelector('.modal-header');
        if (!header) return;

        let isDragging = false;
        let startX, startY, initalX, initalY;

        modal.addEventListener('mousedown', () => {
            highestZIndex++;
            modal.style.zIndex = highestZIndex;
            
            if (overlay.classList.contains('active')) {
                overlay.style.zIndex = highestZIndex - 1;
            }
        });

        header.addEventListener('mousedown', (e) => {
            if (e.target.hasAttribute('data-close-button')) return;

            isDragging = true;
            const rect = modal.getBoundingClientRect();

            startX = e.clientX;
            startY = e.clientY;
            initalX = rect.left;
            initalY = rect.top;

            modal.style.transform = 'none'; 
            modal.style.left = `${initalX}px`;
            modal.style.top = `${initalY}px`;
            modal.style.margin = '0';
            modal.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const rect = modal.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let targetX = initalX + dx;
            let targetY = initalY + dy;


            targetX = Math.max(0, Math.min(targetX, viewportWidth - rect.width));

            targetY = Math.max(0, Math.min(targetY, viewportHeight - headerRect.height));

            modal.style.left = `${targetX}px`;
            modal.style.top = `${targetY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                modal.style.transition = ''; 
            }
        });
    });
}

let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}


const disableDarkmode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', 'null')
}

if(darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})
