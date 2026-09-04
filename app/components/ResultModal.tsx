"use client";

import { useRef, useState, type ReactElement } from "react";
import type { CalculoResponse } from "../lib/types";
import Footer from "./Footer";

interface ResultModalProps {
  resultado: CalculoResponse;
  onClose: () => void;
}

export default function ResultModal({
  resultado,
  onClose,
}: ResultModalProps): ReactElement {
  const captureRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownload(): Promise<void> {
    if (!captureRef.current) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      // Import dinámico: html2canvas solo se necesita del lado del cliente.
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `cuanto-compro-${resultado.personas}-personas.png`;
      link.click();
    } catch {
      setDownloadError(
        "No se pudo generar la imagen. Instalá la dependencia html2canvas y reintentá."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="cc-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resultado-modal-heading"
    >
      <div className="cc-modal__backdrop" onClick={onClose} />

      <div className="cc-modal__panel">
        <button
          type="button"
          className="cc-modal__close"
          onClick={onClose}
          aria-label="Cerrar resultado"
        >
          ✕
        </button>

        {/* Todo lo de acá adentro es lo que se captura como PNG */}
        <div ref={captureRef} className="cc-modal__capture">
          <section className="cc-modal__hero">
            <span className="cc-modal__hero-badge">✓ Resultado</span>
            <h2 id="resultado-modal-heading">
              Tu compra para {resultado.personas} personas
            </h2>
            <p>Esto es lo que necesitás según lo que elegiste.</p>
          </section>

          <section className="cc-modal__resumen">
            <h3>Resumen de la compra</h3>
            <ul>
              {resultado.resumen.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>
                    {item.cantidad} {item.unidad}
                  </strong>
                </li>
              ))}
            </ul>

            {resultado.consejo && (
              <p className="cc-modal__consejo">💡 {resultado.consejo}</p>
            )}
          </section>

          <Footer />
        </div>

        <div className="cc-modal__actions">
          <button
            type="button"
            className="cc-btn cc-btn--primary"
            onClick={() => void handleDownload()}
            disabled={downloading}
          >
            {downloading ? "Generando PNG…" : "Descargar Foto"}
          </button>
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onClose}>
            Volver a editar
          </button>
        </div>

        {downloadError && (
          <p className="cc-error" role="alert">
            {downloadError}
          </p>
        )}
      </div>
    </div>
  );
}
