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

export const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  );
  const data = await response.json();
  if (!data.success) throw new Error('Image upload failed');
  return data.data.url;
};
