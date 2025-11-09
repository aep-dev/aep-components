import { validatePatternExamples, findPatternFields } from './validate-patterns.js';
import type { PatternField } from './validate-patterns.js';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
    readonly [key: string]: JsonValue;
}
type JsonArray = readonly JsonValue[];

// Test the validation functions
console.log('Testing validation functions...\n');

// Test 1: Valid pattern and examples
console.log('Test 1: Valid pattern and examples');
const validField: PatternField = {
    path: 'test.field',
    pattern: '^[a-z]+$',
    examples: ['hello', 'world']
};
const validResults = validatePatternExamples(validField);
console.log('Results:', validResults.length === 0 ? 'PASS' : 'FAIL');

// Test 2: Invalid pattern and examples
console.log('\nTest 2: Invalid pattern and examples');
const invalidField: PatternField = {
    path: 'test.field',
    pattern: '^[a-z]+$',
    examples: ['hello', 'WORLD', '123']
};
const invalidResults = validatePatternExamples(invalidField);
console.log('Results:', invalidResults.length === 2 ? 'PASS' : 'FAIL');
console.log('Failures:', invalidResults.map(f => f.example));

// Test 3: Pattern with character class issue
console.log('\nTest 3: Pattern with character class issue');
const charClassField: PatternField = {
    path: 'test.field',
    pattern: '^[.-a-z]+$',
    examples: ['hello.world']
};
const charClassResults = validatePatternExamples(charClassField);
console.log('Results:', charClassResults.length > 0 ? 'PASS (detected issue)' : 'FAIL');
if (charClassResults.length > 0) {
    console.log('Suggestion:', charClassResults[0]?.suggestion || 'None');
}

// Test 4: Finding pattern fields in nested objects
console.log('\nTest 4: Finding pattern fields');
const testSchema: JsonObject = {
    properties: {
        name: {
            type: 'string',
            pattern: '^[a-z]+$',
            examples: ['test']
        },
        nested: {
            properties: {
                value: {
                    type: 'string',
                    pattern: '^[0-9]+$',
                    examples: ['123']
                }
            }
        }
    }
};
const foundFields = findPatternFields(testSchema);
console.log('Found fields:', foundFields.length === 2 ? 'PASS' : 'FAIL');
console.log('Field paths:', foundFields.map(f => f.path));

console.log('\nAll tests completed!');