// Modal Component
const Modal = {
    container: null,
    currentModal: null,

    init() {
        this.container = document.getElementById('modal-container');
    },

    open(options = {}) {
        if (!this.container) this.init();

        const { title, content, size = 'md', showFooter = true, confirmText = 'Xác nhận', cancelText = 'Hủy', onConfirm, onCancel } = options;

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop animate-fade-in';
        modal.innerHTML = `
            <div class="modal-content modal-${size} animate-scale-in">
                <div class="modal-header">
                    <h3 class="text-lg font-semibold text-gray-900">${title || ''}</h3>
                    <button class="btn-icon btn-secondary modal-close-btn">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    ${content || ''}
                </div>
                ${showFooter ? `
                    <div class="modal-footer">
                        <button class="btn btn-secondary modal-cancel-btn">${cancelText}</button>
                        <button class="btn btn-primary modal-confirm-btn">${confirmText}</button>
                    </div>
                ` : ''}
            </div>
        `;

        // Event listeners
        const closeBtn = modal.querySelector('.modal-close-btn');
        const cancelBtn = modal.querySelector('.modal-cancel-btn');
        const confirmBtn = modal.querySelector('.modal-confirm-btn');

        const closeModal = () => {
            modal.classList.add('animate-fade-in');
            modal.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                modal.remove();
                this.currentModal = null;
            }, 200);
        };

        closeBtn?.addEventListener('click', () => {
            onCancel?.();
            closeModal();
        });

        cancelBtn?.addEventListener('click', () => {
            onCancel?.();
            closeModal();
        });

        confirmBtn?.addEventListener('click', () => {
            const result = onConfirm?.();
            if (result !== false) closeModal();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                onCancel?.();
                closeModal();
            }
        });

        // Close on ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                onCancel?.();
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        this.container.appendChild(modal);
        this.currentModal = modal;

        return {
            close: closeModal,
            getElement: () => modal,
            getBody: () => modal.querySelector('.modal-body')
        };
    },

    confirm(options = {}) {
        const { title = 'Xác nhận', message, type = 'warning', confirmText = 'Xác nhận', cancelText = 'Hủy', onConfirm, onCancel } = options;

        const icons = {
            warning: `<div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4 mx-auto">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>`,
            danger: `<div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </div>`,
            success: `<div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>`,
            info: `<div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>`
        };

        const content = `
            <div class="text-center">
                ${icons[type] || icons.warning}
                <h4 class="text-lg font-semibold text-gray-900 mb-2">${title}</h4>
                <p class="text-gray-600">${message || ''}</p>
            </div>
        `;

        return this.open({
            title: '',
            content,
            size: 'sm',
            confirmText,
            cancelText,
            onConfirm,
            onCancel
        });
    },

    alert(title, message, type = 'info') {
        return this.open({
            title,
            content: `<p class="text-gray-600">${message}</p>`,
            size: 'sm',
            showFooter: true,
            confirmText: 'Đóng',
            cancelText: '',
            onConfirm: () => { }
        });
    },

    close() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }
};
