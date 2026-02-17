# DB Schema Summary

Core entities:
- Users + roles
- Clinics, specialties, doctors, availability
- Appointments with anti-double-booking unique index (`doctorId + startAt`)
- Payments linked to appointments
- Video sessions for telehealth
- OTP + refresh tokens
- Notification and audit logs
