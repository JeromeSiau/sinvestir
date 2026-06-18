"use client";

import { ChevronLeft, Lightbulb } from "lucide-react";
import { type ComponentType, type ReactNode, useEffect, useRef, useState } from "react";

import { CryptoSimulator } from "../components/CryptoSimulator";
import {
  ComparatorsIcon,
  DashboardIcon,
  GiftIcon,
  LogoutIcon,
  SavedIcon,
  SettingsIcon,
  SimulatorsIcon,
  SuggestionIcon,
} from "../components/icons/sidebar-icons";
import { cx } from "../lib/classnames";

type SidebarIconComponent = ComponentType<{ className?: string }>;

type NavItem = {
  icon: SidebarIconComponent;
  label: string;
};

function SidebarIcon({ Icon, small = false }: { Icon: SidebarIconComponent; small?: boolean }) {
  return (
    <span className={cx("sidebar-icon", small && "sidebar-icon-sm")}>
      <Icon />
    </span>
  );
}

function SidebarLabel({
  children,
  collapsed,
  visible = true,
}: {
  children: ReactNode;
  collapsed?: boolean;
  visible?: boolean;
}) {
  return (
    <span
      className={cx(
        "sidebar-label",
        !visible && "sidebar-label-hidden",
        collapsed && "sidebar-label-collapsed",
      )}
    >
      {children}
    </span>
  );
}

function HeaderBrand() {
  return (
    <a
      aria-label="Retour aux simulateurs S'investir"
      className="flex h-10 min-w-0 max-w-[250px] items-center text-white"
      href="https://simulateurs.sinvestir.fr/"
    >
      <img
        alt="S'investir Simulateurs"
        className="h-10 w-auto max-w-[min(56vw,205px)]"
        src="/simulators-logo.svg"
      />
    </a>
  );
}

function AccountSummary({
  collapsed = false,
  labelsVisible = true,
}: {
  collapsed?: boolean;
  labelsVisible?: boolean;
}) {
  return (
    <div className={cx("flex items-center gap-3 rounded-xl px-6", collapsed && "justify-center px-0")}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-medium text-white">
        S
      </div>
      <div
        className={cx(
          "min-w-0 overflow-hidden transition-[opacity,transform] duration-100 ease-out",
          collapsed ? "max-w-0" : "max-w-40",
          labelsVisible ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
        )}
      >
        <p className="truncate text-sm font-normal text-white">demo@sinvestir.fr</p>
        <p className="truncate text-xs font-light text-blue-light">demo@sinvestir.fr</p>
      </div>
    </div>
  );
}

const navItems: NavItem[] = [
  { label: "Tableau de bord", icon: DashboardIcon },
  { label: "Les simulateurs", icon: SimulatorsIcon },
  { label: "Les comparateurs", icon: ComparatorsIcon },
  { label: "Mes simulations", icon: SavedIcon },
  { label: "Formation offerte", icon: GiftIcon },
];

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarLabelsVisible, setSidebarLabelsVisible] = useState(true);
  const sidebarTimer = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("sidebar") === "collapsed") {
      setSidebarLabelsVisible(false);
      setSidebarCollapsed(true);
    }
  }, []);

  function toggleSidebar() {
    if (sidebarTimer.current !== null) {
      window.clearTimeout(sidebarTimer.current);
    }

    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      sidebarTimer.current = window.setTimeout(() => {
        setSidebarLabelsVisible(true);
        sidebarTimer.current = null;
      }, 140);
      return;
    }

    setSidebarLabelsVisible(false);
    sidebarTimer.current = window.setTimeout(() => {
      setSidebarCollapsed(true);
      sidebarTimer.current = null;
    }, 100);
  }

  return (
    <main className="relative min-h-dvh overflow-x-clip overflow-y-hidden bg-[linear-gradient(126.82deg,_#000519_28.59%,_#000000_100%)] text-white">
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[min(78vw,920px)] w-[71%] bg-[radial-gradient(ellipse_at_top_right,rgba(0,73,198,.42)_0%,rgba(0,73,198,.20)_34%,rgba(0,73,198,.06)_54%,transparent_74%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_44%_38%,rgba(16,152,247,.07),transparent_30%)]" />

      <aside
        className={cx(
          "sidebar-width-transition relative hidden p-6 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
          sidebarCollapsed ? "lg:w-[104px]" : "lg:w-[300px]",
        )}
      >
        <button
          aria-label={sidebarCollapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
          className="absolute right-0 top-1/2 z-10 flex h-16 w-6 -translate-y-1/2 items-center justify-center rounded-r-2xl bg-white/5 transition-colors duration-150 hover:bg-white/10"
          type="button"
          onClick={toggleSidebar}
        >
          <ChevronLeft
            className={cx(
              "relative -left-0.5 h-5 w-5 text-white/70 transition-transform duration-150 ease-out",
              sidebarCollapsed ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
        <div className="sidebar-panel-background relative flex grow flex-col gap-y-10 overflow-y-auto rounded-2xl border border-white/10 px-0 py-6">
          <AccountSummary collapsed={sidebarCollapsed} labelsVisible={sidebarLabelsVisible} />

          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col justify-between gap-y-7">
              <li>
                <ul className="space-y-3">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <a
                        className={cx(
                          "sidebar-muted-link group flex h-11 items-center overflow-hidden whitespace-nowrap border-l-2 border-transparent py-3 text-sm font-normal transition-[background-color,color,gap,padding] duration-150 ease-out",
                          sidebarCollapsed ? "justify-center gap-x-0 px-0" : "gap-x-3 px-6",
                        )}
                        href="#simulateur"
                      >
                        <SidebarIcon Icon={item.icon} />
                        <SidebarLabel collapsed={sidebarCollapsed} visible={sidebarLabelsVisible}>
                          {item.label}
                        </SidebarLabel>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <ul className="space-y-3">
                  <li>
                    <a
                      className={cx(
                        "group mx-auto flex items-center justify-center py-3 text-sm font-light text-white transition-[color,gap,width,padding] duration-150 ease-out hover:text-blue-sky",
                        sidebarCollapsed ? "h-11 w-11 gap-x-0 px-0" : "w-full gap-x-2 px-6",
                      )}
                      href="#"
                    >
                      <SidebarIcon Icon={SettingsIcon} small />
                      <SidebarLabel collapsed={sidebarCollapsed} visible={sidebarLabelsVisible}>
                        Gérer mon compte
                      </SidebarLabel>
                    </a>
                  </li>
                  <li className="!mt-0">
                    <a
                      className={cx(
                        "group mx-auto flex items-center justify-center py-3 text-sm font-light text-white transition-[color,gap,width,padding] duration-150 ease-out hover:text-blue-sky",
                        sidebarCollapsed ? "h-11 w-11 gap-x-0 px-0" : "w-full gap-x-2 px-6",
                      )}
                      href="#"
                    >
                      <SidebarIcon Icon={SuggestionIcon} small />
                      <SidebarLabel collapsed={sidebarCollapsed} visible={sidebarLabelsVisible}>
                        Faire une suggestion
                      </SidebarLabel>
                    </a>
                  </li>
                  <li className={cx("flex justify-center", sidebarCollapsed ? "px-0" : "px-6")}>
                    <a
                      className={cx(
                        "inline-flex items-center justify-center rounded-full border border-transparent bg-gradient-to-r from-[#0049C6] to-[#04265F] py-3 text-sm font-light text-white transition-[border-color,gap,width,padding] duration-150 ease-out hover:border-violet-blue hover:bg-none",
                        sidebarCollapsed ? "h-11 w-11 gap-x-0 px-0" : "w-full gap-x-2 px-6",
                      )}
                      href="#"
                    >
                      <SidebarIcon Icon={LogoutIcon} />
                      <SidebarLabel collapsed={sidebarCollapsed} visible={sidebarLabelsVisible}>
                        Déconnexion
                      </SidebarLabel>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <div
        className={cx(
          "relative z-10 mx-auto max-w-[1800px] transition-[padding] duration-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          sidebarCollapsed ? "lg:pl-[104px]" : "lg:pl-[300px]",
        )}
      >
        <header className="relative right-0 top-0 z-40 flex h-20 shrink-0 flex-row-reverse items-center gap-x-6 bg-white/5 pl-6 pr-0 shadow-sm sm:right-6 sm:top-6 sm:mr-6 sm:flex-row sm:border-b sm:border-white/10 sm:bg-transparent lg:pl-8">
          <div className="flex w-full items-center justify-between">
            <HeaderBrand />
            <a
              className="ml-auto max-w-[96px] shrink-0 truncate text-[10px] font-light text-white transition hover:text-white/70 sm:max-w-none sm:text-sm"
              href="https://sinvestir.fr/?utm_source=simulateurs"
            >
              Découvrir S'investir
            </a>
          </div>
        </header>

        <div className="px-4 pb-10 pt-0 sm:px-6 sm:py-10 lg:px-8">
          <div className="space-y-16">
            <section
              className="mx-auto mt-10 w-full max-w-[calc(100vw-2rem)] space-y-3 px-2 text-center sm:max-w-5xl sm:space-y-4"
              aria-labelledby="page-title"
            >
              <h1
                id="page-title"
                className="flex items-center justify-center gap-x-4 font-display text-xl font-normal tracking-normal text-white sm:text-3xl sm:font-medium"
              >
                <span className="hidden h-px w-12 bg-blue-sky md:block" />
                <span>SIMULATEUR CRYPTO</span>
                <span className="hidden h-px w-12 bg-blue-sky md:block" />
              </h1>
              <h2 className="mx-auto max-w-[calc(100vw-2rem)] text-balance text-sm font-light text-blue-sky sm:max-w-4xl sm:text-lg lg:max-w-[80%]">
                Backtestez un investissement crypto en DCA, visualisez deux graphiques et consultez le calendrier des achats.
              </h2>
              <p className="mx-auto max-w-[calc(100vw-2rem)] text-balance text-xs font-light leading-relaxed text-white sm:max-w-3xl sm:text-sm">
                Cette simulation reproduit la logique du simulateur crypto S'investir dans l'interface de la suite
                simulateurs: formulaire sous-ligné, résultats en cartes, onglets Graphiques / Calendrier et composant
                prêt à intégrer.
              </p>
              <div className="mx-auto flex max-w-[calc(100vw-2rem)] items-center justify-center gap-x-4 rounded-2xl border border-blue-sky/10 bg-blue-sky/5 p-4 text-xs font-light leading-relaxed text-blue-light backdrop-blur sm:max-w-3xl sm:text-sm">
                <Lightbulb className="h-4 w-4 shrink-0 text-blue-sky" />
                Les performances passées ne préjugent pas des performances futures. Simulation pédagogique, sans conseil
                en investissement.
              </div>
            </section>

            <section id="simulateur" className="mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-6xl">
              <CryptoSimulator />
            </section>
          </div>

          <footer className="mt-16 border-t border-white/10 py-8 text-center text-xs font-light leading-relaxed text-white/35">
            Les résultats sont des simulations rétrospectives à vocation pédagogique. Ils ne constituent ni un conseil en
            investissement, ni une garantie de performance.
          </footer>
        </div>
      </div>
    </main>
  );
}
