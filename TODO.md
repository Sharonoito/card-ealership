# TODO - Role-based Admin (Prisma)

- [ ] Implement Prisma `User` model + `AdminRole` enum
- [ ] Update NextAuth Credentials auth (`lib/auth.ts`) to authenticate against Prisma users
- [ ] Include `role` in NextAuth JWT/session for authorization checks
- [ ] Update server authorization helper (`app/actions/cars.ts`) to enforce role-based permissions
- [ ] Add initial seed guidance / create users (manual)
- [ ] Run Prisma migrate and verify login + inventory actions
- [ ] Run lint/build checks

