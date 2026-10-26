"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertTriangle, Info, HelpCircle } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "lime" | "default";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType>({
  confirm: async () => false,
});

export function ConfirmModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (val: boolean) => void;
  } | null>(null);

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleClose = (choice: boolean) => {
    if (modalState) {
      modalState.resolve(choice);
      setModalState(null);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {modalState?.isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
            animation: "fadeIn 0.15s ease",
          }}
          onClick={() => handleClose(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: "420px",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon badge */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                margin: "0 auto 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  modalState.options.variant === "danger"
                    ? "var(--danger-bg)"
                    : modalState.options.variant === "lime"
                    ? "var(--lime-subtle)"
                    : "rgba(255, 255, 255, 0.08)",
                color:
                  modalState.options.variant === "danger"
                    ? "var(--danger)"
                    : modalState.options.variant === "lime"
                    ? "var(--lime-primary)"
                    : "#fff",
                border: `1px solid ${
                  modalState.options.variant === "danger"
                    ? "rgba(239, 68, 68, 0.3)"
                    : modalState.options.variant === "lime"
                    ? "rgba(132, 204, 22, 0.3)"
                    : "var(--border)"
                }`,
              }}
            >
              {modalState.options.variant === "danger" ? (
                <AlertTriangle size={26} />
              ) : modalState.options.variant === "lime" ? (
                <HelpCircle size={26} />
              ) : (
                <Info size={26} />
              )}
            </div>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.6rem" }}>
              {modalState.options.title || "Confirm Action"}
            </h3>

            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "1.75rem", lineHeight: 1.5 }}>
              {modalState.options.message}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="btn btn-outline"
                style={{ flex: 1, padding: "0.65rem 1rem" }}
              >
                {modalState.options.cancelText || "No, Cancel"}
              </button>

              <button
                type="button"
                onClick={() => handleClose(true)}
                className={`btn ${
                  modalState.options.variant === "danger" ? "btn-danger" : "btn-lime"
                }`}
                style={{ flex: 1, padding: "0.65rem 1rem" }}
              >
                {modalState.options.confirmText || "Yes, Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
