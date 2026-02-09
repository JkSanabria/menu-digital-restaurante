// Test de la función de normalización de texto
import { normalizeText, matchesSearch } from './src/utils/searchUtils';

console.log('🧪 Pruebas de Normalización de Texto\n');
console.log('='.repeat(50));

// Test 1: Normalización básica
console.log('\n📝 Test 1: Normalización de acentos');
const tests = [
    { input: 'Jamón', expected: 'jamon' },
    { input: 'Café', expected: 'cafe' },
    { input: 'Champiñones', expected: 'champinones' },
    { input: 'Hawaiana', expected: 'hawaiana' },
    { input: 'Ñoquis', expected: 'noquis' },
];

tests.forEach(({ input, expected }) => {
    const result = normalizeText(input);
    const status = result === expected ? '✅' : '❌';
    console.log(`${status} "${input}" → "${result}" (esperado: "${expected}")`);
});

// Test 2: Búsqueda sin acentos
console.log('\n🔍 Test 2: Búsqueda sin diferenciar acentos');
const searchTests = [
    { text: 'Pizza de Jamón', query: 'jamon', shouldMatch: true },
    { text: 'Pizza de Jamón', query: 'jamón', shouldMatch: true },
    { text: 'Pizza Hawaiana', query: 'hawaiana', shouldMatch: true },
    { text: 'Pizza Hawaiana', query: 'hawai', shouldMatch: true },
    { text: 'Champiñones', query: 'champinones', shouldMatch: true },
    { text: 'Pizza Napolitana', query: 'cafe', shouldMatch: false },
];

searchTests.forEach(({ text, query, shouldMatch }) => {
    const result = matchesSearch(text, query);
    const status = result === shouldMatch ? '✅' : '❌';
    const matchText = shouldMatch ? 'debería coincidir' : 'NO debería coincidir';
    console.log(`${status} "${text}" con "${query}" (${matchText}): ${result}`);
});

// Test 3: Búsqueda con múltiples palabras
console.log('\n🔍 Test 3: Búsqueda con múltiples palabras');
const multiWordTests = [
    { text: 'Pizza de Jamón y Queso', query: 'pizza jamon', shouldMatch: true },
    { text: 'Pizza de Jamón y Queso', query: 'jamon queso', shouldMatch: true },
    { text: 'Pizza Hawaiana', query: 'pizza cafe', shouldMatch: false },
];

multiWordTests.forEach(({ text, query, shouldMatch }) => {
    const result = matchesSearch(text, query);
    const status = result === shouldMatch ? '✅' : '❌';
    const matchText = shouldMatch ? 'debería coincidir' : 'NO debería coincidir';
    console.log(`${status} "${text}" con "${query}" (${matchText}): ${result}`);
});

console.log('\n' + '='.repeat(50));
console.log('✨ Pruebas completadas\n');
