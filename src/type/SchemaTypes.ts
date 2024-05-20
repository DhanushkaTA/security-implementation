export interface UserInterface {
    name?:string,
    phoneNumber: string,
    role?:string,
    email?:string,
    image?:string
}

export interface TokenInterface {
    token: string
}

export interface OtpInterface {
    phoneNumber:string,
    otp:string
}