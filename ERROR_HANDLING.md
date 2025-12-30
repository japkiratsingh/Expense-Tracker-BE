# Error Handling Guide

Complete guide to error handling in the Expense Tracker API. This document covers error response formats, HTTP status codes, common errors, and best practices for frontend error handling.

## Table of Contents

- [Overview](#overview)
- [Error Response Format](#error-response-format)
- [HTTP Status Codes](#http-status-codes)
- [Error Categories](#error-categories)
- [Common Errors by Module](#common-errors-by-module)
- [Frontend Error Handling](#frontend-error-handling)
- [Best Practices](#best-practices)
- [Examples](#examples)

---

## Overview

The Expense Tracker API uses consistent error responses across all endpoints. All errors follow the same structure and include appropriate HTTP status codes for easy handling on the frontend.

### Key Principles

- **Consistent Format**: All errors use the same JSON structure
- **Descriptive Messages**: Clear, user-friendly error messages
- **Field-Level Validation**: Detailed validation errors with field names
- **Appropriate Status Codes**: Standard HTTP status codes
- **No Sensitive Data**: Error messages never expose sensitive information

---

## Error Response Format

### Basic Error Structure

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400
  }
}
```

### Validation Error Structure

For validation errors, the response includes an `errors` array with field-specific details:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Please provide a valid email"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters long"
      }
    ]
  }
}
```

### Properties

| Property                 | Type    | Description                              |
| ------------------------ | ------- | ---------------------------------------- |
| `success`                | boolean | Always `false` for errors                |
| `error.message`          | string  | Main error message                       |
| `error.statusCode`       | number  | HTTP status code                         |
| `error.errors`           | array   | Field-level validation errors (optional) |
| `error.errors[].field`   | string  | Name of the invalid field                |
| `error.errors[].message` | string  | Specific validation error message        |

---

## HTTP Status Codes

### Success Codes (2xx)

| Code | Status       | Description        | Usage                              |
| ---- | ------------ | ------------------ | ---------------------------------- |
| 200  | OK           | Request successful | GET, PUT, DELETE operations        |
| 201  | Created      | Resource created   | POST operations                    |
| 207  | Multi-Status | Partial success    | Bulk operations with some failures |

### Client Error Codes (4xx)

| Code | Status            | Description                       | When It Occurs                          |
| ---- | ----------------- | --------------------------------- | --------------------------------------- |
| 400  | Bad Request       | Invalid request parameters        | Validation failures, malformed requests |
| 401  | Unauthorized      | Missing or invalid authentication | No token, expired token, invalid token  |
| 403  | Forbidden         | Insufficient permissions          | Accessing another user's resources      |
| 404  | Not Found         | Resource not found                | Invalid ID, deleted resource            |
| 409  | Conflict          | Resource conflict                 | Duplicate email, duplicate tag name     |
| 413  | Payload Too Large | Request body too large            | File upload exceeds size limit          |
| 429  | Too Many Requests | Rate limit exceeded               | Too many requests in short time         |

### Server Error Codes (5xx)

| Code | Status                | Description                     | When It Occurs                    |
| ---- | --------------------- | ------------------------------- | --------------------------------- |
| 500  | Internal Server Error | Unexpected server error         | Server-side bugs, database errors |
| 503  | Service Unavailable   | Service temporarily unavailable | Maintenance, overload             |

---

## Error Categories

### 1. Authentication Errors (401)

Errors related to user authentication and authorization.

**Common Scenarios**:

```json
{
  "success": false,
  "error": {
    "message": "No token provided",
    "statusCode": 401
  }
}
```

```json
{
  "success": false,
  "error": {
    "message": "Invalid token",
    "statusCode": 401
  }
}
```

```json
{
  "success": false,
  "error": {
    "message": "Token expired",
    "statusCode": 401
  }
}
```

```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials",
    "statusCode": 401
  }
}
```

### 2. Validation Errors (400)

Errors due to invalid input data.

**Example**:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "errors": [
      {
        "field": "amount",
        "message": "Amount is required"
      },
      {
        "field": "description",
        "message": "Description must be at least 1 character"
      },
      {
        "field": "date",
        "message": "Date must be in YYYY-MM-DD format"
      }
    ]
  }
}
```

### 3. Authorization Errors (403)

Errors due to insufficient permissions.

**Example**:

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized to access this category",
    "statusCode": 403
  }
}
```

### 4. Not Found Errors (404)

Errors when requested resource doesn't exist.

**Example**:

```json
{
  "success": false,
  "error": {
    "message": "Expense not found",
    "statusCode": 404
  }
}
```

### 5. Conflict Errors (409)

Errors due to resource conflicts.

**Example**:

```json
{
  "success": false,
  "error": {
    "message": "Email already registered",
    "statusCode": 409
  }
}
```

```json
{
  "success": false,
  "error": {
    "message": "A tag with this name already exists",
    "statusCode": 409
  }
}
```

### 6. File Upload Errors (400, 413)

Errors related to file uploads.

**Examples**:

```json
{
  "success": false,
  "error": {
    "message": "Invalid file type. Allowed types: images (JPEG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX, XLS, XLSX, TXT, CSV)",
    "statusCode": 400
  }
}
```

```json
{
  "success": false,
  "error": {
    "message": "File size exceeds maximum limit",
    "statusCode": 413
  }
}
```

```json
{
  "success": false,
  "error": {
    "message": "Maximum number of attachments per expense exceeded",
    "statusCode": 400
  }
}
```

---

## Common Errors by Module

### Authentication Module

| Error Message                    | Status Code | Cause                        | Solution                     |
| -------------------------------- | ----------- | ---------------------------- | ---------------------------- |
| Email already registered         | 409         | Email exists in database     | Use different email or login |
| Invalid credentials              | 401         | Wrong email or password      | Verify credentials           |
| User not found                   | 404         | User doesn't exist           | Check email or register      |
| No token provided                | 401         | Missing Authorization header | Include token in request     |
| Invalid token                    | 401         | Malformed or tampered token  | Get new token via login      |
| Token expired                    | 401         | Token past expiration time   | Refresh token                |
| Invalid or expired refresh token | 401         | Refresh token invalid        | Login again                  |

### Category Module

| Error Message                                    | Status Code | Cause                             | Solution               |
| ------------------------------------------------ | ----------- | --------------------------------- | ---------------------- |
| Category not found                               | 404         | Invalid category ID               | Verify category exists |
| Unauthorized to access this category             | 403         | Accessing another user's category | Use own category       |
| Category name is required                        | 400         | Missing name field                | Provide category name  |
| Category name must be at least 2 characters long | 400         | Name too short                    | Use longer name        |
| Category name must not exceed 50 characters      | 400         | Name too long                     | Use shorter name       |
| Color must be a valid hex color code             | 400         | Invalid color format              | Use format: #FF5733    |
| Budget cannot exceed 999999999.99                | 400         | Budget too large                  | Use smaller amount     |

### Tag Module

| Error Message                                | Status Code | Cause                        | Solution                       |
| -------------------------------------------- | ----------- | ---------------------------- | ------------------------------ |
| Tag not found                                | 404         | Invalid tag ID               | Verify tag exists              |
| Unauthorized to access this tag              | 403         | Accessing another user's tag | Use own tag                    |
| A tag with this name already exists          | 409         | Duplicate tag name           | Use different name             |
| Maximum number of tags reached               | 400         | User has 100 tags            | Delete unused tags             |
| Tag name is required                         | 400         | Missing name field           | Provide tag name               |
| Tag name must not exceed 30 characters       | 400         | Name too long                | Use shorter name               |
| Color must be a valid hex color              | 400         | Invalid color format         | Use format: #FF5733            |
| Cannot delete tag that is in use by expenses | 400         | Tag assigned to expenses     | Remove tag from expenses first |
| Target tag for merge not found               | 404         | Invalid target tag ID        | Verify target tag exists       |
| Cannot merge a tag with itself               | 400         | Source and target are same   | Use different target tag       |

### Expense Module

| Error Message                              | Status Code | Cause                            | Solution                                       |
| ------------------------------------------ | ----------- | -------------------------------- | ---------------------------------------------- |
| Expense not found                          | 404         | Invalid expense ID               | Verify expense exists                          |
| Unauthorized to access this expense        | 403         | Accessing another user's expense | Use own expense                                |
| Amount is required                         | 400         | Missing amount field             | Provide amount                                 |
| Amount must be at least 0.01               | 400         | Amount too small                 | Use minimum 0.01                               |
| Amount is too large                        | 400         | Amount exceeds max               | Use amount ≤ 999999999.99                      |
| Description is required                    | 400         | Missing description              | Provide description                            |
| Description cannot be empty                | 400         | Empty description                | Add description text                           |
| Description must be at least 1 character   | 400         | Description too short            | Add more text                                  |
| Description must not exceed 500 characters | 400         | Description too long             | Use shorter description                        |
| Date must be in YYYY-MM-DD format          | 400         | Invalid date format              | Use format: 2025-12-30                         |
| Invalid category ID format                 | 400         | Malformed category ID            | Provide valid UUID                             |
| Category not found                         | 404         | Invalid category ID              | Verify category exists                         |
| Tags must be an array of UUIDs             | 400         | Invalid tags format              | Provide array of UUIDs                         |
| Tag not found                              | 404         | Invalid tag ID                   | Verify all tags exist                          |
| Invalid payment method                     | 400         | Unknown payment method           | Use: cash, credit, debit, online, check, other |
| Notes must not exceed 1000 characters      | 400         | Notes too long                   | Use shorter notes                              |
| Export format must be either json or csv   | 400         | Invalid export format            | Use 'json' or 'csv'                            |
| Failed to import expenses                  | 400         | Import data issues               | Check data format                              |

### Recurring Expense Module

| Error Message                                            | Status Code | Cause                              | Solution                        |
| -------------------------------------------------------- | ----------- | ---------------------------------- | ------------------------------- |
| Recurring expense not found                              | 404         | Invalid recurring ID               | Verify recurring expense exists |
| Unauthorized to access this recurring expense            | 403         | Accessing another user's recurring | Use own recurring expense       |
| Frequency is required                                    | 400         | Missing frequency field            | Provide frequency               |
| Frequency must be one of: daily, weekly, monthly, yearly | 400         | Invalid frequency                  | Use valid frequency             |
| Start date is required                                   | 400         | Missing start date                 | Provide start date              |
| Start date must be in YYYY-MM-DD format                  | 400         | Invalid start date format          | Use format: 2025-12-30          |
| End date must be in YYYY-MM-DD format                    | 400         | Invalid end date format            | Use format: 2025-12-30          |
| End date must be after start date                        | 400         | End date before start date         | Use later end date              |
| Interval count must be between 1 and 365                 | 400         | Invalid interval                   | Use value 1-365                 |
| Day of month must be between 1 and 31                    | 400         | Invalid day of month               | Use value 1-31                  |
| Day of week must be between 0 and 6                      | 400         | Invalid day of week                | Use value 0-6                   |
| Recurring expense is already paused                      | 400         | Already inactive                   | Resume instead of pause         |
| Recurring expense is already active                      | 400         | Already active                     | Pause instead of resume         |
| Failed to generate expense from recurring template       | 500         | Generation error                   | Try again or check logs         |

### Attachment Module

| Error Message                                      | Status Code | Cause                               | Solution                                   |
| -------------------------------------------------- | ----------- | ----------------------------------- | ------------------------------------------ |
| Attachment not found                               | 404         | Invalid attachment ID               | Verify attachment exists                   |
| Unauthorized to access this attachment             | 403         | Accessing another user's attachment | Use own attachment                         |
| File not found on server                           | 404         | File deleted from disk              | Re-upload file                             |
| File upload failed                                 | 400         | Upload error                        | Try again                                  |
| Invalid file type                                  | 400         | Unsupported file type               | Use allowed file types                     |
| File size exceeds maximum limit                    | 413         | File too large                      | Use smaller file (<5MB images, <10MB docs) |
| Maximum number of attachments per expense exceeded | 400         | Too many attachments                | Delete some attachments                    |
| Thumbnail generation failed                        | 400         | Image processing error              | Check image format                         |
| Failed to delete attachment                        | 500         | Deletion error                      | Try again                                  |

---

## Frontend Error Handling

### 1. Error Detection

```javascript
async function makeApiRequest(url, options) {
  try {
    const response = await fetch(url, options);

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}
```

### 2. Displaying Validation Errors

```javascript
function displayValidationErrors(errors) {
  // Clear previous errors
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  // Display new errors
  errors.forEach((error) => {
    const fieldElement = document.querySelector(`[name="${error.field}"]`);
    if (fieldElement) {
      const errorElement = document.createElement("span");
      errorElement.className = "error-message";
      errorElement.textContent = error.message;
      fieldElement.parentNode.appendChild(errorElement);
      fieldElement.classList.add("error");
    }
  });
}

// Usage
try {
  const response = await fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    const errorData = await response.json();

    if (errorData.error.errors) {
      // Validation errors
      displayValidationErrors(errorData.error.errors);
    } else {
      // General error
      alert(errorData.error.message);
    }
    return;
  }

  const data = await response.json();
  // Handle success
} catch (error) {
  alert("An unexpected error occurred. Please try again.");
}
```

### 3. React Error Handling

```javascript
import { useState } from "react";

export const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.error.errors) {
          // Convert array of errors to object
          const fieldErrors = {};
          errorData.error.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(errorData.error.message);
        }
        return;
      }

      const data = await response.json();
      // Handle success
      alert("Expense created successfully!");
    } catch (error) {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {generalError && <div className="alert alert-error">{generalError}</div>}

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className={errors.amount ? "error" : ""}
        />
        {errors.amount && (
          <span className="error-message">{errors.amount}</span>
        )}
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={errors.description ? "error" : ""}
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Expense"}
      </button>
    </form>
  );
};
```

### 4. Global Error Handler

```javascript
// errorHandler.js
class ErrorHandler {
  static handle(error, context = {}) {
    console.error("Error:", error, context);

    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      this.showNotification(
        "Network error. Please check your connection.",
        "error"
      );
      return;
    }

    // HTTP errors
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          this.handleValidationError(error);
          break;
        case 401:
          this.handleAuthError(error);
          break;
        case 403:
          this.showNotification(
            "You do not have permission to perform this action.",
            "error"
          );
          break;
        case 404:
          this.showNotification("Resource not found.", "error");
          break;
        case 409:
          this.handleConflictError(error);
          break;
        case 500:
          this.showNotification(
            "Server error. Please try again later.",
            "error"
          );
          break;
        default:
          this.showNotification(
            "An error occurred. Please try again.",
            "error"
          );
      }
    } else {
      this.showNotification("An unexpected error occurred.", "error");
    }
  }

  static handleValidationError(error) {
    const errors = error.response.data.error.errors;
    if (errors && errors.length > 0) {
      const messages = errors.map((e) => e.message).join("\n");
      this.showNotification(messages, "error");
    } else {
      this.showNotification(error.response.data.error.message, "error");
    }
  }

  static handleAuthError(error) {
    this.showNotification(
      "Your session has expired. Please login again.",
      "error"
    );
    // Redirect to login
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }

  static handleConflictError(error) {
    this.showNotification(error.response.data.error.message, "warning");
  }

  static showNotification(message, type = "info") {
    // Implementation depends on your notification library
    // Examples: toast, alert, modal, etc.
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

export default ErrorHandler;

// Usage
try {
  const data = await apiCall();
} catch (error) {
  ErrorHandler.handle(error, { context: "Creating expense" });
}
```

### 5. Error Boundary (React)

```javascript
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

---

## Best Practices

### 1. Always Check Response Status

```javascript
// Good
const response = await fetch(url);
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error.message);
}
const data = await response.json();

// Bad
const response = await fetch(url);
const data = await response.json(); // May fail if response is error
```

### 2. Use Try-Catch Blocks

```javascript
// Good
try {
  const data = await makeApiRequest();
  handleSuccess(data);
} catch (error) {
  handleError(error);
}

// Bad
const data = await makeApiRequest(); // Unhandled rejection
handleSuccess(data);
```

### 3. Provide User-Friendly Messages

```javascript
// Good
function getUserFriendlyMessage(error) {
  const errorMessages = {
    "Email already registered":
      "This email is already in use. Please use a different email or try logging in.",
    "Invalid credentials": "Incorrect email or password. Please try again.",
    "Token expired": "Your session has expired. Please log in again.",
  };

  return errorMessages[error.message] || "An error occurred. Please try again.";
}

// Bad
alert(error.message); // Shows raw error message
```

### 4. Handle Network Errors Separately

```javascript
try {
  const response = await fetch(url);
  // ... handle response
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
    showNotification(
      "Unable to connect to server. Please check your internet connection."
    );
  } else {
    // Other errors
    showNotification(error.message);
  }
}
```

### 5. Implement Retry Logic for Transient Errors

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        const error = await response.json();
        throw new Error(error.error.message);
      }

      // Retry server errors (5xx)
      if (i === maxRetries - 1) {
        throw new Error("Server error. Please try again later.");
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
    }
  }
}
```

### 6. Log Errors for Debugging

```javascript
function logError(error, context = {}) {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context: context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.error("Error log:", errorLog);

  // Send to error tracking service (e.g., Sentry, LogRocket)
  // sendToErrorTracking(errorLog);
}

// Usage
try {
  await createExpense(data);
} catch (error) {
  logError(error, { action: "create_expense", data });
  showErrorToUser(error);
}
```

### 7. Clear Errors When User Interacts

```javascript
const [errors, setErrors] = useState({});

const handleInputChange = (field, value) => {
  setFormData({ ...formData, [field]: value });

  // Clear error for this field when user starts typing
  if (errors[field]) {
    setErrors({ ...errors, [field]: null });
  }
};
```

### 8. Use Error Messages from Constants

```javascript
// constants/errorMessages.js
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
  RESOURCE_NOT_FOUND: "The requested resource was not found.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

// Usage
import { ERROR_MESSAGES } from "./constants/errorMessages";

if (error.status === 401) {
  showNotification(ERROR_MESSAGES.SESSION_EXPIRED);
}
```

---

## Examples

### Complete Form Validation Example

```javascript
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useApiClient } from "../utils/apiClient";

export const CreateExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    paymentMethod: "cash",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const apiClient = useApiClient();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Clear field error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }

    // Clear general error
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError("");
    setSuccess(false);

    try {
      const response = await apiClient.post("/expenses", {
        ...formData,
        amount: parseFloat(formData.amount),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle validation errors
        if (errorData.error.errors) {
          const fieldErrors = {};
          errorData.error.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(errorData.error.message);
        }
        return;
      }

      // Success
      setSuccess(true);
      setFormData({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        categoryId: "",
        paymentMethod: "cash",
      });

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      if (error instanceof TypeError) {
        setGeneralError("Network error. Please check your connection.");
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Create Expense</h2>

      {generalError && (
        <div className="alert alert-error" role="alert">
          {generalError}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          Expense created successfully!
        </div>
      )}

      <div className="form-group">
        <label htmlFor="amount">Amount *</label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          className={errors.amount ? "error" : ""}
          step="0.01"
          min="0.01"
          disabled={loading}
        />
        {errors.amount && (
          <span className="error-message">{errors.amount}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={errors.description ? "error" : ""}
          maxLength={500}
          disabled={loading}
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
        <small>{formData.description.length}/500 characters</small>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date *</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className={errors.date ? "error" : ""}
          disabled={loading}
        />
        {errors.date && <span className="error-message">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="paymentMethod">Payment Method</label>
        <select
          id="paymentMethod"
          value={formData.paymentMethod}
          onChange={(e) => handleChange("paymentMethod", e.target.value)}
          disabled={loading}
        >
          <option value="cash">Cash</option>
          <option value="credit">Credit Card</option>
          <option value="debit">Debit Card</option>
          <option value="online">Online Payment</option>
          <option value="check">Check</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Creating..." : "Create Expense"}
      </button>
    </form>
  );
};
```

---

## Additional Resources

- [MDN HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Error Handling Best Practices](https://www.baeldung.com/rest-api-error-handling-best-practices)
- [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)

---

## Support

For questions about error handling or to report issues, please refer to the main [README.md](./README.md) or [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
push test
