export interface UserInfo {
  name?: string;
  picture?: string;
}

export interface Account {
  sub: string,
  username: string,
  email: string
}

export interface SignUpData {
  username: string,
  firstName: string,
  secondName: string,
  email: string,
  password: string
}