<script lang="ts">
  import type { IconAtom } from "../types";

  // Import commonly used icons
  // Users & People
  import Users from "@lucide/svelte/icons/users";
  import User from "@lucide/svelte/icons/user";
  import UserPlus from "@lucide/svelte/icons/user-plus";
  import UserMinus from "@lucide/svelte/icons/user-minus";
  import UserCheck from "@lucide/svelte/icons/user-check";
  import UserX from "@lucide/svelte/icons/user-x";

  // Trends & Analytics
  import TrendingUp from "@lucide/svelte/icons/trending-up";
  import TrendingDown from "@lucide/svelte/icons/trending-down";
  import Activity from "@lucide/svelte/icons/activity";
  import BarChart from "@lucide/svelte/icons/bar-chart-2";
  import BarChart3 from "@lucide/svelte/icons/bar-chart-3";
  import PieChart from "@lucide/svelte/icons/pie-chart";
  import LineChart from "@lucide/svelte/icons/line-chart";
  import Gauge from "@lucide/svelte/icons/gauge";

  // Money & Commerce
  import DollarSign from "@lucide/svelte/icons/dollar-sign";
  import CreditCard from "@lucide/svelte/icons/credit-card";
  import Wallet from "@lucide/svelte/icons/wallet";
  import ShoppingCart from "@lucide/svelte/icons/shopping-cart";
  import ShoppingBag from "@lucide/svelte/icons/shopping-bag";
  import Package from "@lucide/svelte/icons/package";
  import Receipt from "@lucide/svelte/icons/receipt";
  import Banknote from "@lucide/svelte/icons/banknote";

  // Navigation & UI
  import Settings from "@lucide/svelte/icons/settings";
  import Bell from "@lucide/svelte/icons/bell";
  import BellRing from "@lucide/svelte/icons/bell-ring";
  import Search from "@lucide/svelte/icons/search";
  import Menu from "@lucide/svelte/icons/menu";
  import Home from "@lucide/svelte/icons/home";
  import LayoutDashboard from "@lucide/svelte/icons/layout-dashboard";
  import LayoutGrid from "@lucide/svelte/icons/layout-grid";
  import LayoutList from "@lucide/svelte/icons/layout-list";
  import SlidersHorizontal from "@lucide/svelte/icons/sliders-horizontal";

  // Actions
  import Plus from "@lucide/svelte/icons/plus";
  import Minus from "@lucide/svelte/icons/minus";
  import X from "@lucide/svelte/icons/x";
  import Check from "@lucide/svelte/icons/check";
  import CheckCircle from "@lucide/svelte/icons/check-circle";
  import XCircle from "@lucide/svelte/icons/x-circle";
  import Edit from "@lucide/svelte/icons/pencil";
  import Trash from "@lucide/svelte/icons/trash-2";
  import Copy from "@lucide/svelte/icons/copy";
  import Save from "@lucide/svelte/icons/save";
  import RefreshCw from "@lucide/svelte/icons/refresh-cw";
  import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
  import Filter from "@lucide/svelte/icons/filter";
  import SortAsc from "@lucide/svelte/icons/arrow-up-narrow-wide";
  import SortDesc from "@lucide/svelte/icons/arrow-down-wide-narrow";

  // Arrows & Chevrons
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import ArrowDown from "@lucide/svelte/icons/arrow-down";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import ExternalLink from "@lucide/svelte/icons/external-link";

  // Communication
  import Mail from "@lucide/svelte/icons/mail";
  import MailOpen from "@lucide/svelte/icons/mail-open";
  import Send from "@lucide/svelte/icons/send";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import MessageSquare from "@lucide/svelte/icons/message-square";
  import Phone from "@lucide/svelte/icons/phone";
  import PhoneCall from "@lucide/svelte/icons/phone-call";
  import AtSign from "@lucide/svelte/icons/at-sign";

  // Files & Folders
  import File from "@lucide/svelte/icons/file";
  import FileText from "@lucide/svelte/icons/file-text";
  import FileImage from "@lucide/svelte/icons/file-image";
  import Folder from "@lucide/svelte/icons/folder";
  import FolderOpen from "@lucide/svelte/icons/folder-open";
  import Archive from "@lucide/svelte/icons/archive";
  import Clipboard from "@lucide/svelte/icons/clipboard";
  import ClipboardCheck from "@lucide/svelte/icons/clipboard-check";
  import Download from "@lucide/svelte/icons/download";
  import Upload from "@lucide/svelte/icons/upload";

  // Time & Date
  import Calendar from "@lucide/svelte/icons/calendar";
  import CalendarDays from "@lucide/svelte/icons/calendar-days";
  import Clock from "@lucide/svelte/icons/clock";
  import Timer from "@lucide/svelte/icons/timer";
  import History from "@lucide/svelte/icons/history";

  // Status & Alerts
  import AlertCircle from "@lucide/svelte/icons/alert-circle";
  import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
  import Info from "@lucide/svelte/icons/info";
  import HelpCircle from "@lucide/svelte/icons/help-circle";
  import CheckCircle2 from "@lucide/svelte/icons/check-circle-2";
  import XOctagon from "@lucide/svelte/icons/x-octagon";
  import Ban from "@lucide/svelte/icons/ban";
  import CircleDot from "@lucide/svelte/icons/circle-dot";
  import Loader from "@lucide/svelte/icons/loader-2";

  // Security
  import Eye from "@lucide/svelte/icons/eye";
  import EyeOff from "@lucide/svelte/icons/eye-off";
  import Lock from "@lucide/svelte/icons/lock";
  import Unlock from "@lucide/svelte/icons/unlock";
  import Shield from "@lucide/svelte/icons/shield";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import Key from "@lucide/svelte/icons/key";

  // Social & Favorites
  import Star from "@lucide/svelte/icons/star";
  import Heart from "@lucide/svelte/icons/heart";
  import ThumbsUp from "@lucide/svelte/icons/thumbs-up";
  import ThumbsDown from "@lucide/svelte/icons/thumbs-down";
  import Share from "@lucide/svelte/icons/share";
  import Share2 from "@lucide/svelte/icons/share-2";
  import Bookmark from "@lucide/svelte/icons/bookmark";
  import Flag from "@lucide/svelte/icons/flag";

  // Media
  import Image from "@lucide/svelte/icons/image";
  import Camera from "@lucide/svelte/icons/camera";
  import Video from "@lucide/svelte/icons/video";
  import Play from "@lucide/svelte/icons/play";
  import Pause from "@lucide/svelte/icons/pause";
  import Volume2 from "@lucide/svelte/icons/volume-2";
  import VolumeX from "@lucide/svelte/icons/volume-x";

  // Layout & View
  import Maximize from "@lucide/svelte/icons/maximize";
  import Minimize from "@lucide/svelte/icons/minimize";
  import MoreHorizontal from "@lucide/svelte/icons/more-horizontal";
  import MoreVertical from "@lucide/svelte/icons/more-vertical";
  import Grid from "@lucide/svelte/icons/grid-3x3";
  import List from "@lucide/svelte/icons/list";
  import Columns from "@lucide/svelte/icons/columns";
  import Rows from "@lucide/svelte/icons/rows-3";

  // Business
  import Briefcase from "@lucide/svelte/icons/briefcase";
  import Building from "@lucide/svelte/icons/building";
  import Building2 from "@lucide/svelte/icons/building-2";
  import MapPin from "@lucide/svelte/icons/map-pin";
  import Globe from "@lucide/svelte/icons/globe";
  import Zap from "@lucide/svelte/icons/zap";
  import Award from "@lucide/svelte/icons/award";
  import Trophy from "@lucide/svelte/icons/trophy";
  import Target from "@lucide/svelte/icons/target";
  import Percent from "@lucide/svelte/icons/percent";
  import Tag from "@lucide/svelte/icons/tag";
  import Tags from "@lucide/svelte/icons/tags";

  // Misc
  import Link from "@lucide/svelte/icons/link";
  import Unlink from "@lucide/svelte/icons/unlink";
  import Paperclip from "@lucide/svelte/icons/paperclip";
  import Hash from "@lucide/svelte/icons/hash";
  import QrCode from "@lucide/svelte/icons/qr-code";
  import Printer from "@lucide/svelte/icons/printer";
  import Wifi from "@lucide/svelte/icons/wifi";
  import WifiOff from "@lucide/svelte/icons/wifi-off";
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import LogIn from "@lucide/svelte/icons/log-in";
  import LogOut from "@lucide/svelte/icons/log-out";
  import Power from "@lucide/svelte/icons/power";

  // Icon mapping
  const icons: Record<string, any> = {
    // Users & People
    users: Users,
    user: User,
    "user-plus": UserPlus,
    "user-minus": UserMinus,
    "user-check": UserCheck,
    "user-x": UserX,

    // Trends & Analytics
    "trending-up": TrendingUp,
    "trending-down": TrendingDown,
    activity: Activity,
    "bar-chart": BarChart,
    "bar-chart-2": BarChart,
    "bar-chart-3": BarChart3,
    "pie-chart": PieChart,
    "line-chart": LineChart,
    gauge: Gauge,

    // Money & Commerce
    "dollar-sign": DollarSign,
    dollar: DollarSign,
    "credit-card": CreditCard,
    wallet: Wallet,
    cart: ShoppingCart,
    "shopping-cart": ShoppingCart,
    "shopping-bag": ShoppingBag,
    package: Package,
    receipt: Receipt,
    banknote: Banknote,
    money: Banknote,

    // Navigation & UI
    settings: Settings,
    cog: Settings,
    bell: Bell,
    "bell-ring": BellRing,
    notification: Bell,
    search: Search,
    menu: Menu,
    hamburger: Menu,
    home: Home,
    dashboard: LayoutDashboard,
    "layout-dashboard": LayoutDashboard,
    "layout-grid": LayoutGrid,
    "layout-list": LayoutList,
    sliders: SlidersHorizontal,
    "sliders-horizontal": SlidersHorizontal,

    // Actions
    plus: Plus,
    add: Plus,
    minus: Minus,
    x: X,
    close: X,
    check: Check,
    "check-circle": CheckCircle,
    "x-circle": XCircle,
    edit: Edit,
    pencil: Edit,
    trash: Trash,
    delete: Trash,
    copy: Copy,
    duplicate: Copy,
    save: Save,
    refresh: RefreshCw,
    "refresh-cw": RefreshCw,
    undo: RotateCcw,
    "rotate-ccw": RotateCcw,
    filter: Filter,
    "sort-asc": SortAsc,
    "sort-desc": SortDesc,

    // Arrows & Chevrons
    "chevron-right": ChevronRight,
    "chevron-left": ChevronLeft,
    "chevron-down": ChevronDown,
    "chevron-up": ChevronUp,
    "arrow-up": ArrowUp,
    "arrow-down": ArrowDown,
    "arrow-left": ArrowLeft,
    "arrow-right": ArrowRight,
    "arrow-up-right": ArrowUpRight,
    "external-link": ExternalLink,

    // Communication
    mail: Mail,
    email: Mail,
    "mail-open": MailOpen,
    send: Send,
    "message-circle": MessageCircle,
    "message-square": MessageSquare,
    chat: MessageCircle,
    comment: MessageSquare,
    phone: Phone,
    "phone-call": PhoneCall,
    "at-sign": AtSign,
    at: AtSign,

    // Files & Folders
    file: File,
    "file-text": FileText,
    document: FileText,
    "file-image": FileImage,
    folder: Folder,
    "folder-open": FolderOpen,
    archive: Archive,
    clipboard: Clipboard,
    "clipboard-check": ClipboardCheck,
    download: Download,
    upload: Upload,

    // Time & Date
    calendar: Calendar,
    "calendar-days": CalendarDays,
    clock: Clock,
    time: Clock,
    timer: Timer,
    history: History,

    // Status & Alerts
    "alert-circle": AlertCircle,
    alert: AlertCircle,
    "alert-triangle": AlertTriangle,
    warning: AlertTriangle,
    info: Info,
    "help-circle": HelpCircle,
    help: HelpCircle,
    "check-circle-2": CheckCircle2,
    success: CheckCircle2,
    "x-octagon": XOctagon,
    error: XOctagon,
    ban: Ban,
    "circle-dot": CircleDot,
    loading: Loader,
    loader: Loader,
    spinner: Loader,

    // Security
    eye: Eye,
    "eye-off": EyeOff,
    lock: Lock,
    unlock: Unlock,
    shield: Shield,
    "shield-check": ShieldCheck,
    key: Key,
    password: Key,

    // Social & Favorites
    star: Star,
    favorite: Star,
    heart: Heart,
    like: Heart,
    "thumbs-up": ThumbsUp,
    "thumbs-down": ThumbsDown,
    share: Share,
    "share-2": Share2,
    bookmark: Bookmark,
    flag: Flag,

    // Media
    image: Image,
    photo: Image,
    picture: Image,
    camera: Camera,
    video: Video,
    play: Play,
    pause: Pause,
    volume: Volume2,
    "volume-2": Volume2,
    "volume-x": VolumeX,
    mute: VolumeX,

    // Layout & View
    maximize: Maximize,
    minimize: Minimize,
    "more-horizontal": MoreHorizontal,
    "more-vertical": MoreVertical,
    dots: MoreHorizontal,
    grid: Grid,
    list: List,
    columns: Columns,
    rows: Rows,

    // Business
    briefcase: Briefcase,
    work: Briefcase,
    building: Building,
    "building-2": Building2,
    office: Building2,
    "map-pin": MapPin,
    location: MapPin,
    globe: Globe,
    world: Globe,
    zap: Zap,
    lightning: Zap,
    award: Award,
    trophy: Trophy,
    target: Target,
    goal: Target,
    percent: Percent,
    tag: Tag,
    tags: Tags,
    label: Tag,

    // Misc
    link: Link,
    unlink: Unlink,
    paperclip: Paperclip,
    attachment: Paperclip,
    hash: Hash,
    hashtag: Hash,
    "qr-code": QrCode,
    qr: QrCode,
    printer: Printer,
    print: Printer,
    wifi: Wifi,
    "wifi-off": WifiOff,
    moon: Moon,
    dark: Moon,
    sun: Sun,
    light: Sun,
    "log-in": LogIn,
    login: LogIn,
    "log-out": LogOut,
    logout: LogOut,
    power: Power,
  };

  // Size mapping
  const sizes: Record<string, string> = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  let {
    name,
    size = "md",
    color,
    class: className = "",
  }: IconAtom = $props();

  let IconComponent = $derived(icons[name]);
  let sizeClass = $derived(sizes[size] || sizes.md);
</script>

{#if IconComponent}
  <IconComponent
    class="{sizeClass} {className}"
    style={color ? `color: ${color}` : undefined}
  />
{:else}
  <span class="text-red-500" title="Unknown icon: {name}">?</span>
{/if}
