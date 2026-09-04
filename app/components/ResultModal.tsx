"use client";

import { useRef, useState, type ReactElement } from "react";
import type { CalculoResponse } from "../lib/types";

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
  const [sharing, setSharing] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  /**
   * Genera la imagen a partir solamente del contenido
   * que está dentro de captureRef.
   */
  async function generateImage(): Promise<Blob | null> {
    const element = captureRef.current;

    if (!element) return null;

    try {
      const { default: html2canvas } = await import("html2canvas");

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      return await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });
    } catch (error) {
      console.error("Error generando imagen:", error);
      return null;
    }
  }

  /**
   * Descargar la captura como PNG.
   */
  async function handleDownload(): Promise<void> {
    setDownloading(true);
    setDownloadError(null);

    try {
      const blob = await generateImage();

      if (!blob) {
        throw new Error("No se pudo generar la imagen");
      }

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `cuanto-compro-${resultado.personas}-personas.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      setDownloadError(
        "No se pudo generar la imagen. Intentá nuevamente."
      );
    } finally {
      setDownloading(false);
    }
  }

  /**
   * Compartir por WhatsApp.
   *
   * En celulares compatibles usamos Web Share API para
   * compartir directamente la imagen.
   *
   * Si el navegador no permite compartir archivos,
   * abrimos WhatsApp con el mensaje preparado.
   */
  async function handleWhatsApp(): Promise<void> {
    setSharing(true);
    setDownloadError(null);

    try {
      const blob = await generateImage();

      if (!blob) {
        throw new Error("No se pudo generar la imagen");
      }

      const file = new File(
        [blob],
        `cuanto-compro-${resultado.personas}-personas.png`,
        {
          type: "image/png",
        }
      );

      const message =
        "Gracias por usar cuantosomos.app 🛒❤️";

      /**
       * Si el navegador permite compartir archivos,
       * compartimos directamente la captura.
       */
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          text: message,
          files: [file],
        });

        return;
      }

      /**
       * Fallback para navegadores que no permiten
       * compartir archivos directamente.
       */
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, "_blank");
    } catch (error) {
      /**
       * Si el usuario cancela el menú de compartir,
       * no mostramos error.
       */
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Error compartiendo:", error);

      setDownloadError(
        "No se pudo compartir la imagen. Podés descargarla y enviarla por WhatsApp."
      );
    } finally {
      setSharing(false);
    }
  }

  return (
    <div
      className="cc-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resultado-modal-heading"
    >
      <div
        className="cc-modal__backdrop"
        onClick={onClose}
      />

      <div className="cc-modal__panel">

        {/* Cerrar */}
        <button
          type="button"
          className="cc-modal__close"
          onClick={onClose}
          aria-label="Cerrar resultado"
        >
          ✕
        </button>

        {/* ==================================================
            TODO LO QUE ESTÁ ACÁ ADENTRO SE CAPTURA.
            
            IMPORTANTE:
            NO ponemos Footer acá.
            ================================================== */}
        <div
          ref={captureRef}
          className="cc-modal__capture"
        >
          <section className="cc-modal__hero">
            <span className="cc-modal__hero-badge">
              ✓ Resultado
            </span>

            <h2 id="resultado-modal-heading">
              Tu compra para {resultado.personas} personas
            </h2>

            <p>
              Esto es lo que necesitás según lo que elegiste.
            </p>
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
              <p className="cc-modal__consejo">
                💡 {resultado.consejo}
              </p>
            )}

            {/* ESTE ES EL FINAL DE LA CAPTURA */}
            <div className="cc-modal__share-footer">
              <p>
                Gracias por usar <strong>cuantosomos.app</strong> ❤️
              </p>
            </div>
          </section>
        </div>

        {/* ==================================================
            ESTO NO SE CAPTURA
            ================================================== */}
        <div className="cc-modal__actions">

          <button
            type="button"
            className="cc-btn cc-btn--primary"
            onClick={() => void handleDownload()}
            disabled={downloading || sharing}
          >
            {downloading
              ? "Generando imagen…"
              : "📸 Descargar Foto"}
          </button>

          <button
            type="button"
            className="cc-btn cc-btn--whatsapp"
            onClick={() => void handleWhatsApp()}
            disabled={downloading || sharing}
          >
            {sharing
              ? "Preparando…"
              : "💬 Compartir por WhatsApp"}
          </button>

          <button
            type="button"
            className="cc-btn cc-btn--ghost"
            onClick={onClose}
          >
            Volver a editar
          </button>

        </div>

        {downloadError && (
          <p
            className="cc-error"
            role="alert"
          >
            {downloadError}
          </p>
        )}

      </div>
    </div>
  );
}
