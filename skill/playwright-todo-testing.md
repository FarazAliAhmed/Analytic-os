# Playwright Todo App Testing Skill

Use this skill to perform end-to-end browser testing of the Todo application using the Playwright MCP tools.

## When to Use

- Testing todo app functionality after implementation changes
- Verifying UI components render correctly
- Testing user workflows (create, read, update, delete todos)
- Validating responsive design across viewports
- Checking for console errors during user interactions

## Preconditions

- Playwright MCP server must be connected (`/mcp` shows "playwright ● connected")
- Todo app must be running (frontend dev server)
- Backend API must be accessible

## Workflow

### 1. Navigate to App
```javascript
// Navigate to the todo app
await page.goto('http://localhost:3000');
await page.wait_for_load_state('networkidle');
```

### 2. Take Initial Snapshot
```javascript
// Capture initial page state
const snapshot = await page.snapshot();
```

### 3. Test Core Features

#### Test: Create Todo
```javascript
// 1. Click add todo button or focus input
await page.click('button:has-text("Add")');

// 2. Type todo content
await page.type('[placeholder*="todo" i], input[type="text"]:first-of-type', 'Test todo item');

// 3. Submit
await page.click('button:has-text("Add")');

// 4. Verify
const todos = await page.locator('text=Test todo item').count();
console.log(`Created todo - found ${todos} instance(s)`);
```

#### Test: View Todo List
```javascript
// Check todos are displayed
const todoItems = await page.locator('[class*="todo"], [class*="item"]').count();
console.log(`Found ${todoItems} todo items`);
```

#### Test: Mark Todo Complete
```javascript
// Find and click a checkbox or complete button
await page.click('input[type="checkbox"], button:has-text("Complete")');

// Verify visual feedback (strikethrough, dimmed, etc.)
const completed = await page.locator('.completed, [data-state="completed"]').count();
console.log(`Completed todos: ${completed}`);
```

#### Test: Delete Todo
```javascript
// Find and click delete button
await page.click('button:has-text("Delete"), button[aria-label*="delete"]');

// Verify removal
const remaining = await page.locator('[class*="todo"]').count();
console.log(`Remaining todos: ${remaining}`);
```

### 4. Test Responsive Design
```javascript
// Desktop
await page.set_viewport_size({ width: 1280, height: 800 });
console.log('Desktop viewport tested');

// Tablet
await page.set_viewport_size({ width: 768, height: 1024 });
console.log('Tablet viewport tested');

// Mobile
await page.set_viewport_size({ width: 375, height: 667 });
console.log('Mobile viewport tested');
```

### 5. Check Console for Errors
```javascript
// Capture console messages after interactions
const errors = await page.get_console_messages({ level: 'error' });
console.log(`Console errors: ${errors.length}`);
if (errors.length > 0) {
  errors.forEach(e => console.log('ERROR:', e.text));
}
```

### 6. Take Final Screenshot
```javascript
await page.screenshot({ filename: 'test-result.png' });
console.log('Screenshot saved to test-result.png');
```

## Testing Checklist

- [ ] App loads without errors
- [ ] Page title is correct
- [ ] Add todo form is visible and functional
- [ ] Todo list displays all items
- [ ] Mark complete toggles state
- [ ] Delete removes item
- [ ] Empty state shows appropriately
- [ ] No console errors
- [ ] Responsive layout works on mobile/tablet/desktop

## Example Full Test Script

```javascript
async (page) => {
  console.log('Starting Todo App E2E Test...');

  // Navigate
  await page.goto('http://localhost:3000');
  await page.wait_for_load_state('networkidle');

  // Verify header
  const title = await page.title();
  console.log(`Page title: ${title}`);

  // Add todo
  await page.click('button:has-text("Add")');
  await page.type('input[type="text"]', 'Learn Playwright');
  await page.click('button:has-text("Add")');

  // Verify added
  const todoText = await page.locator('text=Learn Playwright').count();
  console.log(`Todo created: ${todoText > 0 ? 'YES' : 'NO'}`);

  // Mark complete
  await page.click('input[type="checkbox"]');

  // Delete
  await page.click('button:has-text("Delete")');

  // Final count
  const finalCount = await page.locator('[class*="todo"]').count();
  console.log(`Final todo count: ${finalCount}`);

  // Check errors
  const errors = await page.get_console_messages({ level: 'error' });
  console.log(`Errors found: ${errors.length}`);

  console.log('Test complete!');
}
```

## Skill Commands

Use these prompts with the skill:

- `/test-todo-app` - Run full E2E test suite
- `/test-todo-create` - Test todo creation only
- `/test-todo-crud` - Test CRUD operations
- `/test-responsive` - Test responsive breakpoints
- `/check-console` - Check for console errors only

## Expected App URLs

| Environment | URL |
|-------------|-----|
| Development | http://localhost:3000 |
| Production  | https://todo-app.domain.com |

## Troubleshooting

- **"Page not loading"**: Verify dev server is running (`npm run dev`)
- **"Element not found"**: Take snapshot to identify correct selectors
- **"Timeout"**: Increase timeout in browser_evaluate options
- **"Console errors"**: Check browser console manually, review network requests
