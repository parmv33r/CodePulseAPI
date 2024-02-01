export interface User 
{
    email:string;
    firstName?:string | null;
    lastName?:string | null;
    roles:string[];
}