export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}



