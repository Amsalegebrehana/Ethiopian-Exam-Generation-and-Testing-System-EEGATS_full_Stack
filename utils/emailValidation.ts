export async function validateEmail(email:string) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const newEmail: string = email;
    const result: boolean = expression.test(newEmail);
    return result;
};