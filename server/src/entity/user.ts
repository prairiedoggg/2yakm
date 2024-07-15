export interface User {
    userId: string;
    email?: string;
    userName: string;
    nickName: string;
    profileImg: string;
    role: boolean;
    kakaoId: string;
    naverId: string;
    googleId: string;
    created_at: Date;
}