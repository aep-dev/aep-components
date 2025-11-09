#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { glob } from 'glob';

const JSON_SCHEMA_DIR = 'json_schema';

interface PatternField {
    readonly path: string;
    readonly pattern: string;
    readonly examples: readonly string[];
}

interface ValidationFailure {
    readonly example: string;
    readonly pattern: string;
    readonly path: string;
    readonly suggestion?: string;
    readonly error?: string;
    readonly file?: string;
}

interface ValidationFailureWithFile extends ValidationFailure {
    readonly file: string;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
    readonly [key: string]: JsonValue;
}
type JsonArray = readonly JsonValue[];

/**
 * Recursively find all string properties with both pattern and examples
 */
function findPatternFields(obj: JsonValue, currentPath: string = ''): readonly PatternField[] {
    const results: PatternField[] = [];

    if (typeof obj !== 'object' || obj === null) {
        return results;
    }

    const objectValue = obj as JsonObject;

    // Check if current object is a string schema with pattern and examples
    if (
        objectValue.type === 'string' &&
        typeof objectValue.pattern === 'string' &&
        objectValue.examples
    ) {
        const examples = Array.isArray(objectValue.examples)
            ? objectValue.examples
            : [objectValue.examples];

        // Ensure all examples are strings
        if (examples.every((example): example is string => typeof example === 'string')) {
            results.push({
                path: currentPath,
                pattern: objectValue.pattern,
                examples: examples
            });
        }
    }

    // Recursively check nested objects
    for (const [key, value] of Object.entries(objectValue)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        results.push(...findPatternFields(value, newPath));
    }

    return results;
}

/**
 * Validate that examples match the pattern
 */
function validatePatternExamples(patternField: PatternField): readonly ValidationFailure[] {
    let regex: RegExp;
    try {
        regex = new RegExp(patternField.pattern);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return [{
            example: 'N/A',
            pattern: patternField.pattern,
            path: patternField.path,
            error: `Invalid regex: ${errorMessage}`
        }];
    }

    const failures: ValidationFailure[] = [];

    for (const example of patternField.examples) {
        if (!regex.test(example)) {
            // Try to suggest a fix for common character class issues
            let suggestion: string = '';
            if (patternField.pattern.includes('[.-')) {
                suggestion = ' (Possible fix: move . and - to end of character class, e.g., [a-z0-9.-])';
            }

            failures.push({
                example,
                pattern: patternField.pattern,
                path: patternField.path,
                ...(suggestion && { suggestion })
            });
        }
    }

    return failures;
}

/**
 * Process a single YAML file
 */
function processYamlFile(filePath: string): readonly ValidationFailureWithFile[] {
    try {
        const content = readFileSync(filePath, 'utf8');
        const schema = yaml.load(content) as JsonValue;

        const patternFields = findPatternFields(schema);
        const failures: ValidationFailureWithFile[] = [];

        for (const patternField of patternFields) {
            const fieldFailures = validatePatternExamples(patternField);
            if (fieldFailures.length > 0) {
                failures.push(...fieldFailures.map((failure): ValidationFailureWithFile => ({
                    ...failure,
                    file: filePath
                })));
            }
        }

        return failures;

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing file ${filePath}:`, errorMessage);
        return [];
    }
}

function printFailure(file: string, failures: readonly ValidationFailureWithFile[]): void {
    console.log(`File: ${file}`);
    for (const failure of failures) {
        console.log(`  Path: ${failure.path}`);
        console.log(`  Pattern: ${failure.pattern}`);
        if (failure.error) {
            console.log(`  Error: ${failure.error}`);
        } else {
            console.log(`  Invalid example: "${failure.example}"`);
            if (failure.suggestion) {
                console.log(`  ${failure.suggestion}`);
            }
        }
        console.log('');
    }
}

/**
 * Main validation function
 */
async function validatePatterns(): Promise<void> {
    console.log('Validating pattern examples in JSON schemas...\n');

    try {
        // Find all YAML files in json_schema directory
        const yamlFiles: readonly string[] = await glob(`${JSON_SCHEMA_DIR}/**/*.yaml`);

        if (yamlFiles.length === 0) {
            console.log(`No YAML files found in ${JSON_SCHEMA_DIR} directory.`);
            return;
        }

        console.log(`Found ${yamlFiles.length} YAML files to validate.\n`);

        const failuresByFile: Record<string, readonly ValidationFailureWithFile[]> = {};
        let processedCount = 0;
        let totalFailureCount = 0;

        // review each file
        for (const filePath of yamlFiles) {
            console.log(`reviewing: ${filePath}`);
            const failures = processYamlFile(filePath);
            if (failures.length > 0) {
                failuresByFile[filePath] = failures;
                totalFailureCount += failures.length;
            }
            processedCount++;
        }

        console.log(`\nProcessed ${processedCount} files.\n`);

        // Report results
        if (totalFailureCount === 0) {
            console.log('✅ All pattern examples are valid!');
            process.exit(0);
        } else {
            console.log(`❌ Found ${totalFailureCount} validation failures:\n`);

            // Report failures by file
            for (const [file, failures] of Object.entries(failuresByFile)) {
                printFailure(file, failures);
            }

            process.exit(1);
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error during validation:', errorMessage);
        process.exit(1);
    }
}

// Run validation if this script is executed directly
if (require.main === module) {
    void validatePatterns();
}

export { validatePatterns, findPatternFields, validatePatternExamples };
export type { PatternField, ValidationFailure, ValidationFailureWithFile };