import React, { useState } from "react";

const DeleteAccount = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!isConfirmed) {
      alert("Please confirm that you want to delete your account.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with your API endpoint for account deletion
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Your account has been deleted successfully.");
        // Redirect or take any further action here
      } else {
        const error = await response.json();
        alert(`Failed to delete account: ${error.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h3>Delete Account</h3>
      <p>Deleting your account is permanent and cannot be undone.</p>
      <label>
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
        />
        I understand the consequences of deleting my account.
      </label>
      <br />
      <button
        onClick={handleDelete}
        disabled={!isConfirmed || isSubmitting}
        style={{
          backgroundColor: isSubmitting ? "#ccc" : "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {isSubmitting ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
};

export default DeleteAccount;
