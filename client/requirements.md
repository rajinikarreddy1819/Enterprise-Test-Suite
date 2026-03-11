## Packages
framer-motion | Page transitions and highly polished scroll animations
date-fns | Formatting application and license dates professionally
react-hook-form | Form state management
@hookform/resolvers | Zod validation for forms
qrcode.react | Rendering actual QR codes for doctor verification profiles

## Notes
- Ensure the backend handles `?q=` or similar query parameter for `/api/public/search`, or returns all doctors to be filtered on the client side.
- Auth endpoints expect standard cookie-based authentication.
- Added `react-qr-code` to generate actual QR codes which adds significant realism and professionalism to a verification portal.
