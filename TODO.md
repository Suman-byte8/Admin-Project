# TODO: Add React Toasts and Loaders for Reservation Operations

## Tasks
- [x] Add deleteMeetingReservation function to Admin Panel/src/services/reservationApi.js
- [ ] Update Admin Panel/src/components/reservationManagement/ReservationTable.jsx:
  - [ ] Import toast from react-toastify
  - [ ] Import deleteMeetingReservation from reservationApi
  - [ ] Add handleDelete function with confirmation and toast messages
  - [ ] Replace alert() with toast.success() and toast.error() in handleConfirm and handleCancel
  - [ ] Add onClick handler to Delete button
  - [ ] Ensure disabled state for Delete button during operation

## Followup
- [ ] Test confirm, cancel, delete operations to verify toasts appear and loaders work
