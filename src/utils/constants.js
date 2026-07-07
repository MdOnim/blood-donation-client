export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DONATION_STATUSES = ['pending', 'inprogress', 'done', 'canceled'];

export const formatStatus = (status) => {
  const map = {
    pending: 'Pending',
    inprogress: 'In Progress',
    done: 'Done',
    canceled: 'Canceled',
  };
  return map[status] || status;
};

export const getStatusClass = (status) => {
  const map = {
    pending: 'status-pending',
    inprogress: 'status-inprogress',
    done: 'status-done',
    canceled: 'status-canceled',
  };
  return map[status] || '';
};

const IMGBB_PLACEHOLDER_KEYS = new Set([
  'your_imgbb_api_key_here',
  'your_imgbb_api_key',
]);

export const isImgBBConfigured = () => {
  const key = import.meta.env.VITE_IMGBB_API_KEY?.trim();
  return Boolean(key && !IMGBB_PLACEHOLDER_KEYS.has(key));
};

const resizeImageFile = (file, maxWidth = 512, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxWidth / img.width);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not process image file'));
    };

    img.src = objectUrl;
  });

export const uploadImageToImgBB = async (file) => {
  if (!isImgBBConfigured()) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5MB');
    }
    return resizeImageFile(file);
  }

  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  );
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error?.message || 'Image upload failed');
  }
  return data.data.url;
};
