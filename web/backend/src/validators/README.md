# Input Validators

This directory contains input validation schemas and functions.

## Purpose

Validate and sanitize all API input to prevent injection attacks and ensure data integrity.

## Standards

- Use Zod for type-safe validation
- Validate all user input
- Sanitize strings to prevent XSS
- Check data types, formats, and ranges
- Return clear validation error messages

## Example Structure

```
validators/
├── auth.validator.ts        # Auth input validation
├── gospel.validator.ts      # Gospel data validation
├── content.validator.ts     # Content validation
└── common.validator.ts      # Shared validation functions
```
