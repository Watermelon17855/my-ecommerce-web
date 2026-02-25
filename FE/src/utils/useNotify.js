import Swal from 'sweetalert2';

export const notify = {
    // Thông báo xanh rờn khi thành công
    success: (title, text) => {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            borderRadius: '25px',
            background: '#ffffff',
        });
    },

    // Thông báo đỏ chót khi có lỗi
    error: (title, text) => {
        Swal.fire({
            icon: 'error',
            title: title || 'Lỗi rồi sếp ơi!',
            text: text,
            confirmButtonColor: '#3b82f6',
            borderRadius: '25px',
        });
    }
};