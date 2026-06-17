export interface HeaderNavItem {
  label: string;
  href: string;
  /** Extra utility classes appended to the link (e.g. for "Log in"). */
  extraClassName?: string;
}

export const headerNavItems: HeaderNavItem[] = [
  { label: "Pricing", href: "./pricing-01.html" },
  { label: "About", href: "./about-01.html" },
  { label: "Docs", href: "#" },
  { label: "Log in", href: "#", extraClassName: "azdn" },
];
