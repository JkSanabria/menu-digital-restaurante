/**
 * Normaliza texto eliminando acentos y diacríticos
 * Ejemplo: "Jamón" -> "jamon"
 */
export const normalizeText = (text: string | null | undefined): string => {
    if (!text) return '';

    return text
        .toLowerCase()
        .normalize('NFD') // Descompone caracteres con acentos
        .replace(/[\u0300-\u036f]/g, ''); // Elimina los diacríticos
};

/**
 * Función de búsqueda mejorada que:
 * - No diferencia mayúsculas/minúsculas
 * - No diferencia acentos (jamón = jamon)
 * - Busca todas las palabras ingresadas
 */
export const matchesSearch = (text: string | null | undefined, searchQuery: string): boolean => {
    if (!searchQuery.trim()) return true;

    const searchWords = normalizeText(searchQuery).trim().split(/\s+/);
    const targetText = normalizeText(text);

    return searchWords.every(word => targetText.includes(word));
};
