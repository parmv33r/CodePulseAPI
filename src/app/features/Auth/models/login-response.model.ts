export interface LoginResponse {
    token: string,
    email: string;
    firstName:string,
    lastName:string,
    roles: string[];
}