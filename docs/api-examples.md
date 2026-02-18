# API Usage Examples

## Register
`POST /auth/register`

## Request OTP
`POST /auth/otp/request` with `{ "phone": "+9647700000003" }`

## Verify OTP
`POST /auth/otp/verify` with `{ "phone": "+9647700000003", "code": "123456" }`

## Create booking
`POST /bookings`

## Create payment
`POST /payments/:appointmentId`

## Payment webhook
`POST /payments/webhook` with `x-signature`
