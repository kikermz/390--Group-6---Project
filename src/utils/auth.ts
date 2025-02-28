export const isAuthenticated = (): boolean => {
    if (typeof window !== "undefined") {
        return !!localStorage.getItem("token"); // Checks if token exists
    }
    return false;
};