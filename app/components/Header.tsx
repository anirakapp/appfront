import type { ReactElement } from "react";

interface HeaderProps {
  ciudad: string;
}
export default function Header({ ciudad }: HeaderProps): ReactElement {
  return (
    <header className="cc-header">
      <div className="cc-header__brand">
        <span className="cc-header__logo" aria-hidden="true">
          <img
            src="/assets/hero/canasta.jpg"
            alt=""
            className="cc-header__logo-img"
          />
        </span>

        <span className="cc-header__title">
          ¿Cuánto
          <br />
          Compro?
        </span>
      </div>

      <nav
        className="cc-header__nav"
        aria-label="Navegación principal"
      >
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#menus">Menús</a>
        <a href="#negocios">Ofertas cerca</a>
      </nav>
     <button
  type="button"
  className="cc-header__ciudad"
>
  <img
    src="/assets/hero/ubicacion.jpg"
    alt=""
    aria-hidden="true"
    className="cc-header__ubicacion"
  />

  <span>{ciudad}</span>

  <span aria-hidden="true">▾</span>
</button>
    </header>
  );
}
