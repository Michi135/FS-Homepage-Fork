import type { TOTP } from "otpauth"
import type Roles from '../permissions/roles'

export interface IUser {
    _id: string
    email: string
    password: string,
    roles: Array<typeof Roles>
    otp?: TOTP
}