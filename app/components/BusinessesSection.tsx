"use client";

import { useEffect, useState, type ReactElement } from "react";
import BusinessCard from "./BusinessCard";
import { getNegocios } from "../lib/api";
import type { Negocio } from "../lib/types";

interface BusinessesSectionProps {
  ciudad: string;
}


export default function BusinessesSection({
  ciudad,
}: BusinessesSectionProps): ReactElement {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function cargar(lat?: number, lng?: number): void {
      getNegocios(ciudad, lat, lng)
        .then((data) => {
          if (!cancelled) {
            setNegocios(data);
            setUsingFallback(false);
          }
        })
        .catch(() => {
          if (!cancelled) setUsingFallback(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    setLoading(true);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(
  (pos) => cargar(pos.coords.latitude, pos.coords.longitude),
  () => cargar(),
  { timeout: 15000, maximumAge: 60000, enableHighAccuracy: false }
);
    } else {
      cargar();
    }

    return () => {
      cancelled = true;
    };
  }, [ciudad]);

  return (
    <section className="cc-negocios" id="negocios" aria-labelledby="negocios-heading">
      <div className="cc-negocios__header">
        <h2 id="negocios-heading">¿Dónde comprar cerca?</h2>
        <a href="#negocios">Ver más comercios</a>
      </div>

      {usingFallback && (
        <p className="cc-negocios__notice">
          Mostrando datos de ejemplo: no se pudo conectar con el backend en{" "}
          {process.env.NEXT_PUBLIC_API_URL ?? "https://appback-six.vercel.app"}.
        </p>
      )}

      {loading ? (
        <p className="cc-negocios__loading">Buscando comercios cerca tuyo…</p>
      ) : (
        <div className="cc-negocios__scroller">
          {negocios.map((negocio) => (
            <BusinessCard key={negocio.id} negocio={negocio} />
          ))}
        </div>
      )}
    </section>
  );
}
