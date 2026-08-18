import {
  BellRing,
  CalendarDays,
  CheckCheck,
  ClipboardList,
  Database,
  FileText,
  Filter,
  GitBranch,
  Inbox,
  LineChart,
  Mail,
  Megaphone,
  MessageSquare,
  MousePointerClick,
  Receipt,
  Repeat,
  Search,
  ThumbsUp,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  siAirtable,
  siFacebook,
  siGmail,
  siGoogleanalytics,
  siHubspot,
  siInstagram,
  siMailchimp,
  siMake,
  siNotion,
  siQuickbooks,
  siSemrush,
  siStripe,
  siWordpress,
  siZapier,
} from "simple-icons";

/**
 * Schematic diagrams for the automation section — one constellation per service.
 *
 * Everything here is data: positions, node kinds and edge routing. The component
 * resolves it to pixels against whatever size the canvas happens to be, so a
 * layout can be retuned by editing numbers in this file alone.
 *
 * Coordinates are percentages of the canvas box, 0-100 on both axes, with the
 * hub fixed at (50, 50). Keep satellites inside roughly 12-88 so tiles don't
 * clip at the edges once their own width is accounted for.
 */

export type NodeKind = "tile" | "glyph";

export type DiagramNode = {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  label: string;
  /** `tile` only — simple-icons 24x24 path + brand hex (no leading #). */
  path?: string;
  hex?: string;
  /**
   * `tile` only. `white` = brand-coloured glyph on a white tile, for near-black
   * or otherwise light marks. `brand` = white glyph on a brand-coloured tile.
   */
  treatment?: "white" | "brand";
  /** `glyph` only — outlined lucide mark in a bordered square. */
  icon?: LucideIcon;
};

/**
 * Orthogonal routing between two points, circuit-diagram style:
 * - `HV` horizontal first, then vertical
 * - `VH` vertical first, then horizontal
 * - `ZH` horizontal to the midpoint, across, then horizontal again
 * - `ZV` vertical to the midpoint, across, then vertical again
 */
export type EdgeRoute = "HV" | "VH" | "ZH" | "ZV";

export type DiagramEdge = {
  from: string;
  to: string;
  route: EdgeRoute;
  /** Marks the edge as carrying the ambient travelling pulse. */
  live?: boolean;
};

export type Diagram = {
  /** Matches the `short` of the service it belongs to. */
  id: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

const tile = (
  id: string,
  icon: { path: string; hex: string; title: string },
  x: number,
  y: number,
  treatment: "white" | "brand" = "brand",
): DiagramNode => ({
  id,
  kind: "tile",
  x,
  y,
  label: icon.title,
  path: icon.path,
  hex: icon.hex,
  treatment,
});

const glyph = (
  id: string,
  icon: LucideIcon,
  label: string,
  x: number,
  y: number,
): DiagramNode => ({ id, kind: "glyph", x, y, label, icon });

/** Every satellite wires back to the hub unless an edge says otherwise. */
const spoke = (from: string, route: EdgeRoute, live = false): DiagramEdge => ({
  from,
  to: "hub",
  route,
  live,
});

export const diagrams: Diagram[] = [
  {
    // CRM — the record systems a client's contacts actually live in.
    id: "CRM",
    nodes: [
      tile("hubspot", siHubspot, 18, 22),
      tile("airtable", siAirtable, 82, 20),
      // Notion's mark is near-black, so it needs a light tile to stay visible.
      tile("notion", siNotion, 84, 62, "white"),
      glyph("contacts", Users, "Contacts", 16, 62),
      glyph("inbox", Inbox, "Shared inbox", 50, 13),
      glyph("records", Database, "Records", 50, 87),
    ],
    edges: [
      spoke("hubspot", "HV", true),
      spoke("airtable", "HV"),
      spoke("notion", "HV"),
      spoke("contacts", "HV"),
      spoke("inbox", "VH"),
      spoke("records", "VH", true),
      { from: "hubspot", to: "contacts", route: "VH" },
      { from: "airtable", to: "notion", route: "VH" },
    ],
  },
  {
    // Lead qualification — a funnel: capture, converse, filter, hand off.
    id: "Lead Bot",
    nodes: [
      glyph("form", ClipboardList, "Capture form", 16, 18),
      glyph("chat", MessageSquare, "Chat thread", 15, 50),
      glyph("filter", Filter, "Scoring rules", 16, 82),
      tile("zapier", siZapier, 84, 28, "white"),
      tile("make", siMake, 84, 70),
      glyph("qualified", UserCheck, "Qualified lead", 50, 88),
    ],
    edges: [
      spoke("form", "HV", true),
      spoke("chat", "HV"),
      spoke("filter", "HV"),
      spoke("zapier", "HV"),
      spoke("make", "HV"),
      spoke("qualified", "VH", true),
      { from: "form", to: "chat", route: "VH" },
      { from: "chat", to: "filter", route: "VH" },
    ],
  },
  {
    // SEO — where rankings are measured and where the content lands.
    id: "SEO Bot",
    nodes: [
      tile("wordpress", siWordpress, 20, 26),
      tile("analytics", siGoogleanalytics, 80, 24),
      tile("semrush", siSemrush, 82, 66),
      glyph("search", Search, "Keyword watch", 18, 66),
      glyph("rankings", LineChart, "Rankings", 50, 13),
      glyph("content", FileText, "Content brief", 50, 87),
    ],
    edges: [
      spoke("wordpress", "HV"),
      spoke("analytics", "HV", true),
      spoke("semrush", "HV"),
      spoke("search", "HV"),
      spoke("rankings", "VH", true),
      spoke("content", "VH"),
      { from: "analytics", to: "semrush", route: "VH" },
      { from: "search", to: "wordpress", route: "VH" },
    ],
  },
  {
    // Social — a scheduling loop feeding two destinations.
    id: "Social",
    nodes: [
      tile("instagram", siInstagram, 20, 20),
      tile("facebook", siFacebook, 80, 20),
      glyph("calendar", CalendarDays, "Content calendar", 16, 56),
      glyph("campaign", Megaphone, "Campaign", 84, 58),
      glyph("recycle", Repeat, "Evergreen loop", 50, 88),
      glyph("engage", ThumbsUp, "Engagement", 50, 13),
    ],
    edges: [
      spoke("instagram", "HV"),
      spoke("facebook", "HV"),
      spoke("calendar", "HV", true),
      spoke("campaign", "HV"),
      spoke("recycle", "VH"),
      spoke("engage", "VH", true),
      { from: "calendar", to: "instagram", route: "VH" },
      { from: "campaign", to: "facebook", route: "VH" },
    ],
  },
  {
    // Email — a branching sequence between two senders.
    id: "Email",
    nodes: [
      tile("mailchimp", siMailchimp, 20, 24, "white"),
      tile("gmail", siGmail, 80, 26),
      glyph("compose", Mail, "Sequence", 50, 13),
      glyph("branch", GitBranch, "Behaviour branch", 18, 62),
      glyph("clicks", MousePointerClick, "Click tracking", 82, 64),
      glyph("segment", Users, "Segments", 50, 87),
    ],
    edges: [
      spoke("mailchimp", "HV", true),
      spoke("gmail", "HV"),
      spoke("compose", "VH"),
      spoke("branch", "HV"),
      spoke("clicks", "HV"),
      spoke("segment", "VH", true),
      { from: "branch", to: "mailchimp", route: "VH" },
      { from: "clicks", to: "gmail", route: "VH" },
    ],
  },
  {
    // Billing — issue, chase, reconcile.
    id: "Billing",
    nodes: [
      tile("stripe", siStripe, 20, 24),
      tile("quickbooks", siQuickbooks, 80, 24),
      glyph("invoice", Receipt, "Invoice", 50, 13),
      glyph("reconciled", CheckCheck, "Reconciled", 18, 64),
      glyph("reminder", BellRing, "Dunning reminder", 82, 64),
      glyph("payout", Wallet, "Payout", 50, 87),
    ],
    edges: [
      spoke("stripe", "HV", true),
      spoke("quickbooks", "HV"),
      spoke("invoice", "VH"),
      spoke("reconciled", "HV"),
      spoke("reminder", "HV"),
      spoke("payout", "VH", true),
      { from: "invoice", to: "stripe", route: "ZV" },
      { from: "reminder", to: "quickbooks", route: "VH" },
    ],
  },
];

/** Hub position, shared by every diagram. */
export const HUB = { x: 50, y: 50 } as const;

export const diagramById = new Map(diagrams.map((d) => [d.id, d]));
