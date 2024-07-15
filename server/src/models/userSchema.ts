export interface User {
    userId: string;
    email?: string;
    username: string;
    nickname: string;
    profileImg: string;
    role: boolean;
    kakaoId: string;
    naverId: string;
    googleId: string;
    created_at: Date;
}