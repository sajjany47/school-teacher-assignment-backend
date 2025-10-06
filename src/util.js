export const ErrorResponse = (error, res) => {
  const statusCode = error.statusCode || error.status || 500;
  let message = "";

  if (error.errors) {
    // Case 1: error.errors is an array
    if (Array.isArray(error.errors)) {
      message = error.errors.join(", ") || "Validation error occurred";
    }

    // Case 2: error.errors is an object (like yup/zod errors)
    else if (typeof error.errors === "object") {
      message = Object.values(error.errors)
        .map((err) => err?.message || String(err))
        .join(", ");
    }

    // Case 3: already a string
    else if (typeof error.errors === "string") {
      message = error.errors;
    }
  } else if (error.message) {
    message = error.message;
  } else if (error.error) {
    message = error.error;
  } else {
    message = "An unknown error occurred"; // fallback only if nothing found
  }

  return res.status(statusCode).json({ message });
};

export const ResponseTemplate = (data, res) => {
  return res
    .status(200)
    .json({ message: "Data fetched successfully", data: data });
};
