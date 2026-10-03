import Swal from 'sweetalert2'
export const showSuccessDialog = (message:string) => Swal.fire({icon:'success',title:'Berhasil',text:message,confirmButtonColor:'#4f46e5'})
export const showErrorDialog = (message:string) => Swal.fire({icon:'error',title:'Gagal',text:message,confirmButtonColor:'#4f46e5'})
export const showWarningDialog = (message:string) => Swal.fire({icon:'warning',title:'Perhatian',text:message,confirmButtonColor:'#4f46e5'})
export const showConfirmDialog = async (message:string) => { const r=await Swal.fire({icon:'warning',title:'Konfirmasi',text:message,showCancelButton:true,confirmButtonText:'Ya',cancelButtonText:'Batal',confirmButtonColor:'#4f46e5'}); return r.isConfirmed }
export const formatDate = (value:string) => new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value))
