const nivelAcesso = 'userNivelAcesso';

export const getNivelAcesso = (): string => {
    const nivel = localStorage.getItem(nivelAcesso);
    return nivel || ''; 
};


export const logout = () => {
    localStorage.removeItem(nivelAcesso);
    window.location.href = '/login'; 
};