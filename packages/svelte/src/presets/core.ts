/**
 * Core preset - minimal components for basic UI
 * ~80KB - for power users who want minimal bundle
 */
import type { Preset } from '@daui/core';

// Atoms
import Avatar from '../atoms/Avatar.svelte';
import Badge from '../atoms/Badge.svelte';
import Button from '../atoms/Button.svelte';
import Checkbox from '../atoms/Checkbox.svelte';
import Divider from '../atoms/Divider.svelte';
import Separator from '../atoms/Separator.svelte';
import Icon from '../atoms/Icon.svelte';
import IconButton from '../atoms/IconButton.svelte';
import Image from '../atoms/Image.svelte';
import Input from '../atoms/Input.svelte';
import Link from '../atoms/Link.svelte';
import NumberInput from '../atoms/NumberInput.svelte';
import Popover from '../atoms/Popover.svelte';
import Progress from '../atoms/Progress.svelte';
import RadioGroup from '../atoms/RadioGroup.svelte';
import SearchInput from '../atoms/SearchInput.svelte';
import Select from '../atoms/Select.svelte';
import Skeleton from '../atoms/Skeleton.svelte';
import Slider from '../atoms/Slider.svelte';
import Spinner from '../atoms/Spinner.svelte';
import Switch from '../atoms/Switch.svelte';
import Text from '../atoms/Text.svelte';
import TextArea from '../atoms/TextArea.svelte';
import Toast from '../atoms/Toast.svelte';
import Tooltip from '../atoms/Tooltip.svelte';
import Upload from '../atoms/Upload.svelte';
import AudioPlayer from '../atoms/AudioPlayer.svelte';
import DatePicker from '../atoms/DatePicker.svelte';
import PinInput from '../atoms/PinInput.svelte';
import Toggle from '../atoms/Toggle.svelte';
import Kbd from '../atoms/Kbd.svelte';
import Meter from '../atoms/Meter.svelte';
import TimeField from '../atoms/TimeField.svelte';
import DateRangeField from '../atoms/DateRangeField.svelte';

// Molecules
import Accordion from '../molecules/Accordion.svelte';
import AlertPanel from '../molecules/AlertPanel.svelte';
import Breadcrumbs from '../molecules/Breadcrumbs.svelte';
import Container from '../molecules/Container.svelte';
import DropdownMenu from '../molecules/DropdownMenu.svelte';
import Form from '../molecules/Form.svelte';
import Grid from '../molecules/Grid.svelte';
import Hero from '../molecules/Hero.svelte';
import List from '../molecules/List.svelte';
import PageHeader from '../molecules/PageHeader.svelte';
import Pagination from '../molecules/Pagination.svelte';
import Showcase from '../molecules/Showcase.svelte';
import Stack from '../molecules/Stack.svelte';
import Tabs from '../molecules/Tabs.svelte';
import ToggleGroup from '../molecules/ToggleGroup.svelte';
import RatingGroup from '../molecules/RatingGroup.svelte';
import HoverCard from '../molecules/HoverCard.svelte';
import DateRangePicker from '../molecules/DateRangePicker.svelte';
import Toolbar from '../molecules/Toolbar.svelte';

// Organisms
import AlertDialog from '../organisms/AlertDialog.svelte';
import Card from '../organisms/Card.svelte';
import Header from '../organisms/Header.svelte';
import Modal from '../organisms/Modal.svelte';
import Sidebar from '../organisms/Sidebar.svelte';
import SlideModal from '../organisms/SlideModal.svelte';

export const core: Preset = {
  atoms: {
    avatar: Avatar,
    badge: Badge,
    button: Button,
    checkbox: Checkbox,
    divider: Divider,
    separator: Separator,
    icon: Icon,
    'icon-button': IconButton,
    image: Image,
    input: Input,
    link: Link,
    'number-input': NumberInput,
    popover: Popover,
    progress: Progress,
    'radio-group': RadioGroup,
    'search-input': SearchInput,
    select: Select,
    skeleton: Skeleton,
    slider: Slider,
    spinner: Spinner,
    switch: Switch,
    text: Text,
    textarea: TextArea,
    toast: Toast,
    tooltip: Tooltip,
    upload: Upload,
    'audio-player': AudioPlayer,
    date: DatePicker,
    'pin-input': PinInput,
    toggle: Toggle,
    kbd: Kbd,
    meter: Meter,
    'time-field': TimeField,
    'date-range-field': DateRangeField,
  },
  molecules: {
    accordion: Accordion,
    'alert-panel': AlertPanel,
    breadcrumbs: Breadcrumbs,
    container: Container,
    'dropdown-menu': DropdownMenu,
    form: Form,
    grid: Grid,
    hero: Hero,
    list: List,
    'page-header': PageHeader,
    pagination: Pagination,
    showcase: Showcase,
    stack: Stack,
    tabs: Tabs,
    'toggle-group': ToggleGroup,
    'rating-group': RatingGroup,
    'hover-card': HoverCard,
    'date-range-picker': DateRangePicker,
    toolbar: Toolbar,
  },
  organisms: {
    'alert-dialog': AlertDialog,
    card: Card,
    header: Header,
    modal: Modal,
    sidebar: Sidebar,
    'slide-modal': SlideModal,
  },
};
