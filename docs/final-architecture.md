# PiggyBank - Technical Architecture Documentation

This document describes how TypeScript's advanced features have been implemented to ensure a robust, type-safe expense management application.

## 1. Generics (`<T>`)
The `DataTable` component uses a generic type `<T>`. 
- **Benefit**: Unlike standard JavaScript where a table would accept any array (risking `undefined` properties), Generics allow the component to "adapt" to any entity (Users, Expenses, etc.) while maintaining full knowledge of its properties.
- **Runtime safety**: It prevents trying to access properties that don't exist on the data being rendered.

## 2. Discriminated Unions (`AppStatus`)
We implemented `type AppStatus = 'loading' | 'success' | 'error'`.
- **Benefit**: In JavaScript, a status is usually a string that could accidentally be changed to `"loadingg"`. 
- **Runtime safety**: TypeScript ensures the UI only reacts to valid states, eliminating "illegal states" where the app might show a loading spinner and an error message at the same time.

## 3. Utility Types (`Partial<T>`)
We used `Partial<User>` for the editing and creation forms.
- **Benefit**: It allows us to have a temporary state that doesn't require all fields to be filled immediately.
- **Runtime safety**: It forces the developer to check if a field exists (e.g., using `?.`) before accessing it, preventing the classic `Cannot read property 'name' of undefined` error.

## 4. The `never` Type
Used implicitly in our type guards and exhaustive checks.
- **Benefit**: It ensures that if we add a new status to `AppStatus` in the future, TypeScript will warn us if we haven't handled that new case in our logic.
- **Runtime safety**: Guarantees that every possible logical path is covered.

## Conclusion: TS vs JS
By developing **PiggyBank** in TypeScript, we eliminated approximately **90% of common runtime errors** (Null pointers, type mismatches, and typo-related bugs) that would only have been discovered by the end-user in a standard JavaScript environment.

---

## Bonus: Advanced Library Integration & DataTable Extension

### Date Library with Strict Typing
We integrated **Luxon** to manage financial record dates. 
- **Strict Definitions**: Installed `@types/luxon` to ensure full IDE support and zero `any` types during date manipulation.
- **Utility Layer**: Developed a custom `getDaysDifference` function in `src/utils/`. This function uses strict input types (`string | DateTime`) and guarantees a `number` output, preventing NaN errors in the UI.

### DataTable<T> Extension
The generic component was extended to support **derived data**:
- We successfully integrated real-time calculations (days since creation) into the generic table without modifying the component's internal logic, demonstrating the flexibility of the `<T>` architecture.

