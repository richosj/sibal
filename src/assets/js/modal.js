// 모든 버튼 요소를 선택합니다.
const buttons = document.querySelectorAll('button[data-trigger="modal"]');

// 모달 열기 함수
const openModal = (modal) => {
    modal.style.display = 'block';
};

// 모달 닫기 함수
const closeModal = (modal) => {
    modal.style.display = 'none';
};

// 버튼 클릭 이벤트 리스너를 추가합니다.
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        const modal = document.querySelector(target);

        if (modal) {
            openModal(modal);

            // 모달 닫기 버튼 이벤트 리스너를 추가합니다.
            const closeButton = modal.querySelector('.close');
            if (closeButton) {
                closeButton.addEventListener('click', () => closeModal(modal));
            }

            // 모달 외부 클릭 시 닫기 이벤트 리스너를 추가합니다.
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });
});